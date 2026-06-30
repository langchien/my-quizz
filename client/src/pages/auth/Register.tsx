import { GoogleIcon } from '@/components/icons/GoogleIcon'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'
import { useRegisterForm } from '@/hooks/useRegisterForm'
import { motion } from 'framer-motion'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

export default function Register() {
  const { form, onSubmit, handleGoogleLogin } = useRegisterForm()
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form

  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-red-600 via-rose-500 to-orange-500 p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className='relative w-full max-w-md'
      >
        <Card
          variant='glass'
          className='relative overflow-hidden rounded-3xl border-white/20 bg-white/10 p-8 text-white'
        >
          {/* Decorative elements */}
          <div className='absolute -top-10 -left-10 size-40 rounded-full bg-white/10 blur-2xl' />
          <div className='absolute -right-10 -bottom-10 size-40 rounded-full bg-white/10 blur-2xl' />

          <div className='relative z-10'>
            <CardHeader className='mb-8 flex flex-col gap-2 p-0 text-center'>
              <CardTitle className='text-3xl leading-tight font-bold tracking-tight text-white'>
                Tạo tài khoản
              </CardTitle>
              <CardDescription className='text-sm text-white/70'>
                Tham gia My-Quizz ngay hôm nay
              </CardDescription>
            </CardHeader>

            <CardContent className='p-0'>
              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
                  <FormField
                    control={form.control}
                    name='displayName'
                    render={({ field }) => (
                      <FormItem className='flex flex-col gap-1.5'>
                        <FormLabel className='block cursor-pointer text-sm font-medium text-white/90'>
                          Tên hiển thị
                        </FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupInput
                              type='text'
                              placeholder='Nguyễn Văn A'
                              className='h-auto w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all placeholder:text-white/60 focus-visible:border-white/20 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-0 focus-visible:outline-none'
                              {...field}
                            />
                          </InputGroup>
                        </FormControl>
                        <FormMessage className='mt-1 text-red-200' />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem className='flex flex-col gap-1.5'>
                        <FormLabel className='block cursor-pointer text-sm font-medium text-white/90'>
                          Email
                        </FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupInput
                              type='email'
                              placeholder='ban@vidu.com'
                              className='h-auto w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all placeholder:text-white/60 focus-visible:border-white/20 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-0 focus-visible:outline-none'
                              {...field}
                            />
                          </InputGroup>
                        </FormControl>
                        <FormMessage className='mt-1 text-red-200' />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem className='flex flex-col gap-1.5'>
                        <FormLabel className='block cursor-pointer text-sm font-medium text-white/90'>
                          Mật khẩu
                        </FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupInput
                              type={showPassword ? 'text' : 'password'}
                              placeholder='••••••••'
                              className='h-auto w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all placeholder:text-white/60 focus-visible:border-white/20 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-0 focus-visible:outline-none'
                              {...field}
                            />
                            <InputGroupAddon align='inline-end'>
                              <Button
                                type='button'
                                variant='ghost'
                                size='icon'
                                onClick={() => setShowPassword(!showPassword)}
                                className='size-8 text-white/60 hover:bg-white/10 hover:text-white focus-visible:ring-0 focus-visible:ring-offset-0'
                              >
                                {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                              </Button>
                            </InputGroupAddon>
                          </InputGroup>
                        </FormControl>
                        <FormMessage className='mt-1 text-red-200' />
                      </FormItem>
                    )}
                  />

                  <Button
                    type='submit'
                    variant='auth-primary'
                    className='mt-2 w-full py-6 text-base'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
                  </Button>
                </form>
              </Form>

              <div className='my-6 flex items-center gap-4'>
                <Separator className='flex-1 bg-white/20' />
                <span className='text-sm text-white/60'>Hoặc</span>
                <Separator className='flex-1 bg-white/20' />
              </div>

              <Button
                type='button'
                variant='auth-google'
                className='w-full gap-2 py-6 text-base'
                onClick={handleGoogleLogin}
              >
                <GoogleIcon className='size-5' />
                Đăng ký bằng Google
              </Button>

              <div className='mt-8 text-center text-sm text-white/70'>
                Đã có tài khoản?{' '}
                <Link to='/login' className='font-semibold text-white hover:underline'>
                  Đăng nhập
                </Link>
              </div>
            </CardContent>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
