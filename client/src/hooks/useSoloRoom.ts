import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { playSound } from '@/lib/sounds'
import { soloService } from '@/services/soloService'
import type { AnswerOption, Question, Quiz } from '@/types/quiz'
import type { SoloAnswer, SoloProgress, SoloResult } from '@/types/room'

export type SoloPhase = 'intro' | 'playing' | 'feedback' | 'redemption' | 'review' | 'finished'

interface FlashcardItem {
  question: Question
  selectedOptionId: string
  isCorrect: boolean
  pointsEarned: number
}

/**
 * Custom hook quản lý toàn bộ state machine cho Solo game.
 *
 * Flow: intro → playing ↔ feedback → redemption → review / finished
 */
export function useSoloRoom(quiz: Quiz | null, userId?: string) {
  const [phase, setPhase] = useState<SoloPhase>('intro')
  const [progress, setProgress] = useState<SoloProgress | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [lastResult, setLastResult] = useState<{ isCorrect: boolean; points: number } | null>(null)
  const [soloResult, setSoloResult] = useState<SoloResult | null>(null)

  // Redemption state
  const [redemptionQuestions, setRedemptionQuestions] = useState<SoloAnswer[]>([])
  const [redemptionIndex, setRedemptionIndex] = useState(0)
  const [redemptionAnswers, setRedemptionAnswers] = useState<SoloAnswer[]>([])
  const [hasAnsweredRedemption, setHasAnsweredRedemption] = useState(false)
  const [redemptionResult, setRedemptionResult] = useState<{
    isCorrect: boolean
    points: number
  } | null>(null)

  // Flashcard review state
  const [flashcardIndex, setFlashcardIndex] = useState(0)

  // Timer ref for question countdown
  const questionStartRef = useRef<number>(0)

  // Check for existing progress on mount
  const hasExistingProgress = useMemo(() => {
    if (!quiz) return false
    const existing = soloService.resumeSolo(quiz.id)
    return existing !== null && existing.currentQuestionIndex < quiz.questions.length
  }, [quiz])

  // ─── Start / Resume ────────────────────────────

  const handleStart = useCallback(
    (resume = false) => {
      if (!quiz) return

      let p: SoloProgress
      if (resume) {
        const existing = soloService.resumeSolo(quiz.id)
        if (!existing) return
        soloService.unpauseSolo(quiz.id)
        p = { ...existing, isPaused: false }
      } else {
        p = soloService.startSolo(quiz.id)
      }

      setProgress(p)
      setPhase('playing')
      setHasAnswered(false)
      setLastResult(null)
      questionStartRef.current = Date.now()
      playSound('start')
    },
    [quiz],
  )

  // ─── Timer countdown (local, no Firestore) ─────

  useEffect(() => {
    if (phase !== 'playing' || !quiz || !progress || hasAnswered) return

    const question = quiz.questions[progress.currentQuestionIndex]
    if (!question) return

    const timeLimitMs = question.timeLimit * 1000
    questionStartRef.current = questionStartRef.current || Date.now()

    const interval = setInterval(() => {
      const elapsed = Date.now() - questionStartRef.current
      const remaining = Math.max(0, Math.ceil((timeLimitMs - elapsed) / 1000))
      setTimeLeft(remaining)

      if (remaining <= 0) {
        clearInterval(interval)
        // Auto-submit wrong answer when time runs out
        handleTimeUp()
      }
    }, 200)

    return () => clearInterval(interval)
  }, [phase, progress?.currentQuestionIndex, hasAnswered, quiz])

  // ─── Handle time up (auto-submit wrong) ────────

  const handleTimeUp = useCallback(() => {
    if (!quiz || !progress) return
    const question = quiz.questions[progress.currentQuestionIndex]
    if (!question || hasAnswered) return

    setHasAnswered(true)
    playSound('incorrect')

    const timeLimitMs = question.timeLimit * 1000

    const { progress: updatedProgress } = soloService.submitSoloAnswer(
      quiz.id,
      question.id,
      '', // no selection
      false,
      timeLimitMs, // max time
      timeLimitMs,
    )

    setLastResult({ isCorrect: false, points: 0 })
    setProgress(updatedProgress)
    setPhase('feedback')
  }, [quiz, progress, hasAnswered])

  // ─── Submit answer ─────────────────────────────

  const handleAnswer = useCallback(
    (option: AnswerOption) => {
      if (hasAnswered || !quiz || !progress) return

      const question = quiz.questions[progress.currentQuestionIndex]
      if (!question) return

      setHasAnswered(true)

      const timeLimitMs = question.timeLimit * 1000
      const responseTimeMs = Date.now() - questionStartRef.current

      if (option.isCorrect) playSound('correct')
      else playSound('incorrect')

      const { progress: updatedProgress, pointsEarned } = soloService.submitSoloAnswer(
        quiz.id,
        question.id,
        option.id,
        option.isCorrect,
        responseTimeMs,
        timeLimitMs,
      )

      setLastResult({ isCorrect: option.isCorrect, points: pointsEarned })
      setProgress(updatedProgress)
      setPhase('feedback')
    },
    [hasAnswered, quiz, progress],
  )

  // ─── Next question (after feedback) ────────────

  const handleNextQuestion = useCallback(() => {
    if (!quiz || !progress) return

    if (progress.currentQuestionIndex >= quiz.questions.length) {
      // All questions done → check for redemption
      const wrongAnswers = soloService.getRedemptionQuestions(progress)
      if (wrongAnswers.length > 0) {
        setRedemptionQuestions(wrongAnswers)
        setRedemptionIndex(0)
        setHasAnsweredRedemption(false)
        setRedemptionResult(null)
        setPhase('redemption')
      } else {
        // No wrong answers → go straight to finish
        finishSolo()
      }
    } else {
      // Continue to next question
      setHasAnswered(false)
      setLastResult(null)
      questionStartRef.current = Date.now()
      setPhase('playing')
    }
  }, [quiz, progress])

  // ─── Pause ─────────────────────────────────────

  const handlePause = useCallback(() => {
    if (!quiz) return
    soloService.pauseSolo(quiz.id)
    setPhase('intro')
  }, [quiz])

  // ─── Redemption answer ─────────────────────────

  const handleRedemptionAnswer = useCallback(
    (option: AnswerOption) => {
      if (hasAnsweredRedemption || !quiz) return

      const wrongAnswer = redemptionQuestions[redemptionIndex]
      if (!wrongAnswer) return

      setHasAnsweredRedemption(true)

      // Find the question from quiz
      const question = quiz.questions.find((q) => q.id === wrongAnswer.questionId)
      if (!question) return

      const timeLimitMs = question.timeLimit * 1000
      const responseTimeMs = Date.now() - questionStartRef.current

      if (option.isCorrect) playSound('correct')
      else playSound('incorrect')

      const { pointsEarned, answer } = soloService.submitRedemptionAnswer(
        quiz.id,
        wrongAnswer.questionId,
        option.id,
        option.isCorrect,
        responseTimeMs,
        timeLimitMs,
      )

      setRedemptionResult({ isCorrect: option.isCorrect, points: pointsEarned })
      setRedemptionAnswers((prev) => [...prev, answer])
    },
    [hasAnsweredRedemption, quiz, redemptionQuestions, redemptionIndex],
  )

  const handleNextRedemption = useCallback(() => {
    const nextIdx = redemptionIndex + 1
    if (nextIdx >= redemptionQuestions.length) {
      // All redemption done → finish
      finishSolo()
    } else {
      setRedemptionIndex(nextIdx)
      setHasAnsweredRedemption(false)
      setRedemptionResult(null)
      questionStartRef.current = Date.now()
    }
  }, [redemptionIndex, redemptionQuestions.length])

  // Start redemption question timer
  useEffect(() => {
    if (phase === 'redemption' && !hasAnsweredRedemption) {
      questionStartRef.current = Date.now()
    }
  }, [phase, redemptionIndex, hasAnsweredRedemption])

  // ─── Finish Solo ───────────────────────────────

  const finishSolo = useCallback(async () => {
    if (!quiz || !progress) return

    try {
      const result = await soloService.completeSolo(
        quiz.id,
        quiz.title,
        quiz.questions.length,
        userId,
        redemptionAnswers.length > 0 ? redemptionAnswers : undefined,
      )
      setSoloResult(result)
      setPhase('finished')
      playSound('correct')
    } catch (err) {
      console.error('Error completing solo:', err)
      // Still transition to finished even if Firestore fails
      setPhase('finished')
    }
  }, [quiz, progress, userId, redemptionAnswers])

  // ─── Flashcard Review ──────────────────────────

  const allFlashcards: FlashcardItem[] = useMemo(() => {
    if (!quiz || !soloResult) return []
    return soloResult.answers.map((answer) => {
      const question = quiz.questions.find((q) => q.id === answer.questionId)
      return {
        question: question!,
        selectedOptionId: answer.selectedOptionId,
        isCorrect: answer.isCorrect,
        pointsEarned: answer.pointsEarned,
      }
    }).filter((item) => item.question !== undefined)
  }, [quiz, soloResult])

  const handleShowReview = useCallback(() => {
    setFlashcardIndex(0)
    setPhase('review')
  }, [])

  const handleFlashcardNext = useCallback(() => {
    setFlashcardIndex((prev) => Math.min(prev + 1, allFlashcards.length - 1))
  }, [allFlashcards.length])

  const handleFlashcardPrev = useCallback(() => {
    setFlashcardIndex((prev) => Math.max(prev - 1, 0))
  }, [])

  const handleBackToResult = useCallback(() => {
    setPhase('finished')
  }, [])

  // ─── Restart ───────────────────────────────────

  const handleRestart = useCallback(() => {
    if (!quiz) return
    soloService.clearProgress(quiz.id)
    setSoloResult(null)
    setRedemptionAnswers([])
    setRedemptionQuestions([])
    handleStart(false)
  }, [quiz, handleStart])

  // ─── Derived state ─────────────────────────────

  const currentQuestion = useMemo(() => {
    if (!quiz || !progress) return null
    return quiz.questions[progress.currentQuestionIndex] || null
  }, [quiz, progress])

  const currentRedemptionQuestion = useMemo(() => {
    if (!quiz || redemptionQuestions.length === 0) return null
    const wrongAnswer = redemptionQuestions[redemptionIndex]
    if (!wrongAnswer) return null
    return quiz.questions.find((q) => q.id === wrongAnswer.questionId) || null
  }, [quiz, redemptionQuestions, redemptionIndex])

  return {
    // Phase
    phase,
    isIntro: phase === 'intro',
    isPlaying: phase === 'playing',
    isFeedback: phase === 'feedback',
    isRedemption: phase === 'redemption',
    isReview: phase === 'review',
    isFinished: phase === 'finished',

    // Progress
    progress,
    hasExistingProgress,
    currentQuestion,
    timeLeft,
    hasAnswered,
    lastResult,

    // Redemption
    redemptionQuestions,
    currentRedemptionQuestion,
    redemptionIndex,
    hasAnsweredRedemption,
    redemptionResult,

    // Result
    soloResult,

    // Flashcard
    allFlashcards,
    flashcardIndex,

    // Actions
    handleStart,
    handleAnswer,
    handleNextQuestion,
    handlePause,
    handleRedemptionAnswer,
    handleNextRedemption,
    handleShowReview,
    handleFlashcardNext,
    handleFlashcardPrev,
    handleBackToResult,
    handleRestart,
  }
}
