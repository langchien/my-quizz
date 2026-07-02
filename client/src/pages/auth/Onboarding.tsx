import { AvatarPicker } from '@/components/AvatarPicker'
import { PageTransition } from '@/components/PageTransition'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { InputGroup, InputGroupInput } from '@/components/ui/input-group'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TOTAL_STEPS, useOnboarding } from '@/hooks/useOnboarding'
import { cn } from '@/lib/utils'
import type { Grade, UseCase, UserRole } from '@/types/user'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Briefcase,
  Check,
  GraduationCap,
  School,
  Shield,
  Sparkles,
  User,
} from 'lucide-react'

// ─── Dữ liệu cho các bước ─────────────────────────────────

const USE_CASE_OPTIONS: {
  value: UseCase
  label: string
  icon: React.ReactNode
  description: string
}[] = [
  {
    value: 'k12',
    label: 'Trường học K-12',
    icon: <School />,
    description: 'Dành cho học sinh phổ thông',
  },
  {
    value: 'business',
    label: 'Doanh nghiệp',
    icon: <Briefcase />,
    description: 'Đào tạo nội bộ công ty',
  },
  {
    value: 'university',
    label: 'Đại học',
    icon: <GraduationCap />,
    description: 'Dành cho sinh viên đại học',
  },
  {
    value: 'tutoring',
    label: 'Gia sư / Tự học',
    icon: <BookOpen />,
    description: 'Luyện tập cá nhân',
  },
]

const ROLE_OPTIONS: {
  value: UserRole
  label: string
  icon: React.ReactNode
  description: string
}[] = [
  {
    value: 'student',
    label: 'Học sinh / Sinh viên',
    icon: <User />,
    description: 'Tham gia quiz và tự luyện',
  },
  {
    value: 'teacher',
    label: 'Giáo viên',
    icon: <GraduationCap />,
    description: 'Tạo quiz và tổ chức thi',
  },
  { value: 'admin', label: 'Quản trị viên', icon: <Shield />, description: 'Quản lý hệ thống' },
]

const GRADE_OPTIONS: { value: Grade; label: string }[] = [
  { value: '1', label: 'Lớp 1' },
  { value: '2', label: 'Lớp 2' },
  { value: '3', label: 'Lớp 3' },
  { value: '4', label: 'Lớp 4' },
  { value: '5', label: 'Lớp 5' },
  { value: '6', label: 'Lớp 6' },
  { value: '7', label: 'Lớp 7' },
  { value: '8', label: 'Lớp 8' },
  { value: '9', label: 'Lớp 9' },
  { value: '10', label: 'Lớp 10' },
  { value: '11', label: 'Lớp 11' },
  { value: '12', label: 'Lớp 12' },
  { value: 'university', label: 'Đại học' },
  { value: 'other', label: 'Khác' },
]

// ─── Animation variants ────────────────────────────────────

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
}

// ─── Component ─────────────────────────────────────────────

export default function Onboarding() {
  const {
    step,
    formData,
    updateField,
    isStepValid,
    nextStep,
    prevStep,
    submitOnboarding,
    isSubmitting,
  } = useOnboarding()

  const progressPercent = (step / TOTAL_STEPS) * 100

  const stepTitles = ['Bạn tên gì?', 'Mục đích sử dụng', 'Vai trò của bạn', 'Hoàn thiện hồ sơ']

  const stepDescriptions = [
    'Hãy cho chúng tôi biết tên của bạn',
    'Bạn sử dụng My-Quizz cho mục đích gì?',
    'Bạn là ai trong hệ thống?',
    'Chọn avatar và thông tin bổ sung',
  ]

  return (
    <PageTransition>
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-red-600 via-rose-500 to-orange-500 p-4'>
        {/* Decorative orbs */}
        <div className='bg-orb orb-1' />
        <div className='bg-orb orb-2' />
        <div className='bg-orb orb-3' />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className='relative z-10 w-full max-w-lg'
        >
          <Card
            variant='glass'
            className='relative overflow-hidden rounded-3xl border-white/20 bg-white/10 text-white backdrop-blur-xl'
          >
            {/* Decorative blurs */}
            <div className='absolute -top-10 -left-10 size-40 rounded-full bg-white/10 blur-2xl' />
            <div className='absolute -right-10 -bottom-10 size-40 rounded-full bg-white/10 blur-2xl' />

            <div className='relative z-10 p-8'>
              {/* Progress */}
              <div className='mb-8'>
                <div className='mb-3 flex items-center justify-between text-sm text-white/70'>
                  <span>
                    Bước {step} / {TOTAL_STEPS}
                  </span>
                  <span className='flex items-center gap-1'>
                    <Sparkles className='size-3' />
                    Thiết lập tài khoản
                  </span>
                </div>
                <Progress
                  value={progressPercent}
                  className='h-2 bg-white/10 [&>div]:bg-white/80 [&>div]:transition-all [&>div]:duration-500'
                />
              </div>

              {/* Step title */}
              <AnimatePresence mode='wait'>
                <motion.div
                  key={`title-${step}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className='mb-6 text-center'
                >
                  <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>
                    {stepTitles[step - 1]}
                  </h1>
                  <p className='mt-2 text-sm text-white/70'>{stepDescriptions[step - 1]}</p>
                </motion.div>
              </AnimatePresence>

              {/* Step content */}
              <CardContent className='min-h-[260px] p-0'>
                <AnimatePresence mode='wait' custom={1}>
                  <motion.div
                    key={step}
                    custom={1}
                    variants={stepVariants}
                    initial='enter'
                    animate='center'
                    exit='exit'
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    {step === 1 && <Step1Name formData={formData} updateField={updateField} />}
                    {step === 2 && <Step2UseCase formData={formData} updateField={updateField} />}
                    {step === 3 && <Step3Role formData={formData} updateField={updateField} />}
                    {step === 4 && <Step4Profile formData={formData} updateField={updateField} />}
                  </motion.div>
                </AnimatePresence>
              </CardContent>

              {/* Navigation buttons */}
              <div className='mt-8 flex items-center justify-between gap-4'>
                <Button
                  type='button'
                  variant='ghost'
                  onClick={prevStep}
                  disabled={step === 1}
                  className={cn(
                    'gap-2 text-white/80 hover:bg-white/10 hover:text-white',
                    step === 1 && 'invisible',
                  )}
                >
                  <ArrowLeft data-icon='inline-start' />
                  Quay lại
                </Button>

                {step < TOTAL_STEPS ? (
                  <Button
                    type='button'
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className='gap-2 bg-white/20 px-8 py-2.5 font-semibold text-white backdrop-blur-md transition-all hover:bg-white/30 disabled:opacity-40'
                  >
                    Tiếp theo
                    <ArrowRight data-icon='inline-end' />
                  </Button>
                ) : (
                  <Button
                    type='button'
                    onClick={submitOnboarding}
                    disabled={!isStepValid() || isSubmitting}
                    className='gap-2 bg-white px-8 py-2.5 font-semibold text-rose-600 transition-all hover:bg-white/90 disabled:opacity-40'
                  >
                    {isSubmitting ? (
                      'Đang lưu...'
                    ) : (
                      <>
                        <Check data-icon='inline-start' />
                        Hoàn thành
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  )
}

// ─── Step Components ───────────────────────────────────────

interface StepProps {
  formData: ReturnType<typeof useOnboarding>['formData']
  updateField: ReturnType<typeof useOnboarding>['updateField']
}

function Step1Name({ formData, updateField }: StepProps) {
  return (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-col gap-1.5'>
        <label className='text-sm font-medium text-white/90'>Họ</label>
        <InputGroup>
          <InputGroupInput
            type='text'
            placeholder='Nguyễn'
            value={formData.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            className='h-auto rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all placeholder:text-white/50 focus-visible:border-white/20 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-0 focus-visible:outline-none'
          />
        </InputGroup>
      </div>
      <div className='flex flex-col gap-1.5'>
        <label className='text-sm font-medium text-white/90'>Tên</label>
        <InputGroup>
          <InputGroupInput
            type='text'
            placeholder='Văn A'
            value={formData.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            className='h-auto rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all placeholder:text-white/50 focus-visible:border-white/20 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-0 focus-visible:outline-none'
          />
        </InputGroup>
      </div>
    </div>
  )
}

function Step2UseCase({ formData, updateField }: StepProps) {
  return (
    <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
      {USE_CASE_OPTIONS.map((option) => {
        const isSelected = formData.useCase === option.value
        return (
          <motion.button
            key={option.value}
            type='button'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => updateField('useCase', option.value)}
            className={cn(
              'flex flex-col items-center gap-2 rounded-2xl p-5 text-center transition-all',
              isSelected
                ? 'bg-white/25 shadow-lg ring-2 ring-white'
                : 'bg-white/5 hover:bg-white/15',
            )}
          >
            <span className='text-2xl'>{option.icon}</span>
            <span className='font-semibold'>{option.label}</span>
            <span className='text-xs text-white/60'>{option.description}</span>
          </motion.button>
        )
      })}
    </div>
  )
}

function Step3Role({ formData, updateField }: StepProps) {
  return (
    <div className='flex flex-col gap-3'>
      {ROLE_OPTIONS.map((option) => {
        const isSelected = formData.role === option.value
        return (
          <motion.button
            key={option.value}
            type='button'
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => updateField('role', option.value)}
            className={cn(
              'flex items-center gap-4 rounded-2xl p-5 text-left transition-all',
              isSelected
                ? 'bg-white/25 shadow-lg ring-2 ring-white'
                : 'bg-white/5 hover:bg-white/15',
            )}
          >
            <span className='flex size-12 items-center justify-center rounded-xl bg-white/10 text-xl'>
              {option.icon}
            </span>
            <div>
              <p className='font-semibold'>{option.label}</p>
              <p className='text-sm text-white/60'>{option.description}</p>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}

function Step4Profile({ formData, updateField }: StepProps) {
  return (
    <div className='flex flex-col gap-5'>
      {/* Preview avatar lớn */}
      <div className='flex justify-center'>
        <motion.div
          key={formData.avatarUrl}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className='flex size-20 items-center justify-center rounded-2xl bg-white/15 text-5xl shadow-lg ring-2 ring-white/30'
        >
          {formData.avatarUrl}
        </motion.div>
      </div>

      {/* Avatar picker */}
      <div>
        <label className='mb-2 block text-sm font-medium text-white/90'>Chọn avatar của bạn</label>
        <AvatarPicker
          value={formData.avatarUrl}
          onChange={(emoji) => updateField('avatarUrl', emoji)}
          columns={6}
        />
      </div>

      {/* Grade + Age (optional row) */}
      <div className='grid grid-cols-2 gap-4'>
        <div className='flex flex-col gap-1.5'>
          <label className='text-sm font-medium text-white/90'>Lớp / Cấp học</label>
          <Select
            value={formData.grade || undefined}
            onValueChange={(val) => updateField('grade', val as Grade)}
          >
            <SelectTrigger className='h-auto rounded-xl border-white/10 bg-white/5 px-4 py-3 text-white [&>svg]:text-white/60'>
              <SelectValue placeholder='Chọn...' />
            </SelectTrigger>
            <SelectContent>
              {GRADE_OPTIONS.map((g) => (
                <SelectItem key={g.value} value={g.value}>
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex flex-col gap-1.5'>
          <label className='text-sm font-medium text-white/90'>
            Tuổi <span className='text-white/50'>(tùy chọn)</span>
          </label>
          <InputGroup>
            <InputGroupInput
              type='number'
              min={5}
              max={100}
              placeholder='VD: 16'
              value={formData.age}
              onChange={(e) => updateField('age', e.target.value)}
              className='h-auto rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all placeholder:text-white/50 focus-visible:border-white/20 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-0 focus-visible:outline-none'
            />
          </InputGroup>
        </div>
      </div>
    </div>
  )
}
