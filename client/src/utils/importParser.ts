import type { AnswerOption, Question } from '@/types/quiz'

const generateId = () => Math.random().toString(36).substring(2, 9)

export interface ParsedQuiz {
  title?: string
  description?: string
  questions: Question[]
}

/**
 * Phân tích chuỗi JSON đầu vào thành danh sách câu hỏi và thông tin quiz chuẩn hóa.
 * Hỗ trợ cả cấu trúc Đầy đủ (Full) và Tối giản (Simplified - 3 dạng).
 */
export function parseQuizJson(jsonString: string): ParsedQuiz {
  let data: any

  try {
    data = JSON.parse(jsonString)
  } catch (err) {
    throw new Error('Định dạng JSON không hợp lệ. Vui lòng kiểm tra lại cú pháp.')
  }

  if (!data || (typeof data !== 'object' && !Array.isArray(data))) {
    throw new Error('Dữ liệu JSON phải là một Đối tượng (Object) hoặc một Mảng (Array).')
  }

  let title: string | undefined
  let description: string | undefined
  let rawQuestions: any[] = []

  // Bước 1: Nhận diện cấu trúc cấp cao (Đầy đủ vs. Tối giản)
  if (Array.isArray(data)) {
    // Định dạng tối giản (Mảng các câu hỏi trực tiếp)
    rawQuestions = data
  } else {
    // Định dạng đầy đủ (Có chứa thuộc tính questions)
    title = typeof data.title === 'string' ? data.title.trim() : undefined
    description = typeof data.description === 'string' ? data.description.trim() : undefined

    if (Array.isArray(data.questions)) {
      rawQuestions = data.questions
    } else if (data.questions) {
      throw new Error("Thuộc tính 'questions' trong JSON phải là một Mảng (Array).")
    } else {
      // Trường hợp người dùng dán 1 object câu hỏi duy nhất (bọc lại thành mảng)
      if (data.question || data.content) {
        rawQuestions = [data]
      } else {
        throw new Error(
          "Không tìm thấy danh sách câu hỏi. JSON cần có thuộc tính 'questions' hoặc là một Mảng câu hỏi.",
        )
      }
    }
  }

  if (rawQuestions.length === 0) {
    throw new Error('Danh sách câu hỏi trống.')
  }

  const parsedQuestions: Question[] = rawQuestions.map((q, idx) => {
    const questionNum = idx + 1
    const content = (q.content || q.question || '').trim()

    if (!content) {
      throw new Error(
        `Câu hỏi số ${questionNum} bị trống nội dung (thiếu trường 'question' hoặc 'content').`,
      )
    }

    const type = q.type === 'multiple_choice' ? 'multiple_choice' : 'multiple_choice' // Tương lai hỗ trợ thêm loại khác
    const timeLimit = typeof q.timeLimit === 'number' ? q.timeLimit : 20
    const points = typeof q.points === 'number' ? q.points : 1000

    let options: AnswerOption[] = []

    // Kiểm tra xem là options (định dạng đầy đủ) hay answers (định dạng tối giản)
    const rawOptions = q.options || q.answers

    if (!rawOptions) {
      throw new Error(
        `Câu hỏi ${questionNum} ("${content.substring(0, 30)}...") không có danh sách câu trả lời.`,
      )
    }

    if (Array.isArray(rawOptions)) {
      // Trường hợp 1: answers/options là mảng các Object (Đầy đủ)
      if (rawOptions.length > 0 && typeof rawOptions[0] === 'object' && rawOptions[0] !== null) {
        options = rawOptions.map((opt: any, optIdx: number) => {
          const optContent = (opt.content || '').trim()
          if (!optContent) {
            throw new Error(`Đáp án ${optIdx + 1} của Câu hỏi ${questionNum} bị trống nội dung.`)
          }
          return {
            id: generateId(),
            content: optContent,
            isCorrect: !!opt.isCorrect,
          }
        })
      }
      // Trường hợp 2: answers là mảng các chuỗi thô (Tối giản A hoặc B)
      else if (rawOptions.length > 0 && typeof rawOptions[0] === 'string') {
        const stringOptions = rawOptions as string[]

        if (stringOptions.length < 2) {
          throw new Error(`Câu hỏi ${questionNum} phải có ít nhất 2 đáp án.`)
        }

        // Dạng A: Sử dụng correctIndex
        if (typeof q.correctIndex === 'number') {
          const correctIdx = q.correctIndex
          if (correctIdx < 0 || correctIdx >= stringOptions.length) {
            throw new Error(
              `correctIndex (${correctIdx}) của Câu hỏi ${questionNum} vượt quá phạm vi số lượng đáp án.`,
            )
          }
          options = stringOptions.map((ans, optIdx) => ({
            id: generateId(),
            content: ans.trim(),
            isCorrect: optIdx === correctIdx,
          }))
        }
        // Dạng B: Sử dụng correctAnswer bằng chữ
        else if (typeof q.correctAnswer === 'string') {
          const correctAnswerText = q.correctAnswer.trim().toLowerCase()
          options = stringOptions.map((ans) => ({
            id: generateId(),
            content: ans.trim(),
            isCorrect: ans.trim().toLowerCase() === correctAnswerText,
          }))
        } else {
          throw new Error(
            `Câu hỏi ${questionNum} thiếu thông tin đáp án đúng (cần 'correctIndex' hoặc 'correctAnswer').`,
          )
        }
      } else {
        throw new Error(`Định dạng đáp án của Câu hỏi ${questionNum} không hợp lệ.`)
      }
    }
    // Trường hợp 3: answers là Object dạng nhãn A, B, C, D (Tối giản C)
    else if (typeof rawOptions === 'object' && rawOptions !== null) {
      const keys = Object.keys(rawOptions)
      if (keys.length < 2) {
        throw new Error(`Câu hỏi ${questionNum} phải có ít nhất 2 đáp án.`)
      }

      if (typeof q.correctAnswer !== 'string') {
        throw new Error(
          `Câu hỏi ${questionNum} thiếu đáp án đúng 'correctAnswer' (ví dụ: "A", "B", "C"...).`,
        )
      }

      const correctAnswerKey = q.correctAnswer.trim().toUpperCase()
      options = keys.map((key) => {
        const optContent = String(rawOptions[key]).trim()
        return {
          id: generateId(),
          content: optContent,
          isCorrect: key.trim().toUpperCase() === correctAnswerKey,
        }
      })
    } else {
      throw new Error(`Định dạng đáp án của Câu hỏi ${questionNum} phải là Mảng hoặc Đối tượng.`)
    }

    // Kiểm tra tính hợp lệ sau khi parse options
    const correctCount = options.filter((o) => o.isCorrect).length
    if (correctCount === 0) {
      throw new Error(
        `Câu hỏi ${questionNum} ("${content.substring(0, 30)}...") không có đáp án đúng nào được chọn.`,
      )
    }

    return {
      id: generateId(),
      content,
      type,
      options,
      timeLimit,
      points,
    }
  })

  return {
    title,
    description,
    questions: parsedQuestions,
  }
}
