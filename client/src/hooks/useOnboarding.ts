import { useAuth } from '@/hooks/useAuth'
import { userService } from '@/services/userService'
import type { CreateUserProfileDto, Grade, UseCase, UserRole } from '@/types/user'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

/** Tổng số bước trong Onboarding Wizard */
export const TOTAL_STEPS = 4

/** State cho form data tích lũy qua các bước */
export interface OnboardingFormData {
  firstName: string
  lastName: string
  useCase: UseCase | ''
  role: UserRole | ''
  grade: Grade | ''
  age: string // string để dễ xử lý input, convert sang number khi submit
  avatarUrl: string
}

const INITIAL_FORM_DATA: OnboardingFormData = {
  firstName: '',
  lastName: '',
  useCase: '',
  role: '',
  grade: '',
  age: '',
  avatarUrl: '🦊', // default avatar
}

/**
 * Hook quản lý state và logic cho Onboarding Wizard.
 */
export function useOnboarding() {
  const navigate = useNavigate()
  const { user, refreshProfile } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<OnboardingFormData>(INITIAL_FORM_DATA)
  const [isSubmitting, setIsSubmitting] = useState(false)

  /** Cập nhật 1 field trong formData */
  const updateField = useCallback(
    <K extends keyof OnboardingFormData>(key: K, value: OnboardingFormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  /** Kiểm tra bước hiện tại có valid để chuyển tiếp không */
  const isStepValid = useCallback((): boolean => {
    switch (step) {
      case 1:
        return formData.firstName.trim().length >= 1 && formData.lastName.trim().length >= 1
      case 2:
        return formData.useCase !== ''
      case 3:
        return formData.role !== ''
      case 4:
        return formData.avatarUrl !== ''
      default:
        return false
    }
  }, [step, formData])

  /** Chuyển sang bước tiếp theo */
  const nextStep = useCallback(() => {
    if (step < TOTAL_STEPS && isStepValid()) {
      setStep((s) => s + 1)
    }
  }, [step, isStepValid])

  /** Quay lại bước trước */
  const prevStep = useCallback(() => {
    if (step > 1) {
      setStep((s) => s - 1)
    }
  }, [step])

  /** Submit onboarding data và redirect tới dashboard */
  const submitOnboarding = useCallback(async () => {
    if (!user) {
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
      navigate('/login')
      return
    }

    if (!isStepValid()) return

    setIsSubmitting(true)
    try {
      const dto: CreateUserProfileDto = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        useCase: formData.useCase as UseCase,
        role: formData.role as UserRole,
        grade: formData.grade ? (formData.grade as Grade) : undefined,
        age: formData.age ? parseInt(formData.age, 10) : undefined,
        avatarUrl: formData.avatarUrl,
      }

      await userService.createUserProfile(user.uid, dto)
      await refreshProfile()

      toast.success('Chào mừng bạn đến với My-Quizz! 🎉')
      navigate('/dashboard')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Có lỗi xảy ra. Vui lòng thử lại.'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }, [user, formData, isStepValid, navigate, refreshProfile])

  return {
    step,
    totalSteps: TOTAL_STEPS,
    formData,
    updateField,
    isStepValid,
    nextStep,
    prevStep,
    submitOnboarding,
    isSubmitting,
  }
}
