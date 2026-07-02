import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Check, Copy, Link2, Share2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

interface ShareButtonProps {
  /** Giá trị sẽ được copy vào clipboard */
  value: string
  /** Label hiển thị trên nút */
  label?: string
  /** Message hiển thị trong toast khi copy thành công */
  toastMessage?: string
  /** Icon type: 'copy' | 'share' | 'link' */
  icon?: 'copy' | 'share' | 'link'
  /** Variant cho shadcn Button */
  variant?: 'ghost' | 'outline' | 'default' | 'secondary'
  /** Size cho shadcn Button */
  size?: 'default' | 'sm' | 'lg' | 'icon'
  /** Extra className */
  className?: string
}

/**
 * Component tái sử dụng để copy text vào clipboard + hiển thị toast.
 * Hỗ trợ animation icon chuyển từ Copy → Check khi copy thành công.
 */
export function ShareButton({
  value,
  label,
  toastMessage = 'Đã sao chép!',
  icon = 'copy',
  variant = 'ghost',
  size = 'sm',
  className,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      toast.success(toastMessage)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Không thể sao chép')
    }
  }, [value, toastMessage])

  const IconComponent = copied ? Check : icon === 'share' ? Share2 : icon === 'link' ? Link2 : Copy

  return (
    <Button
      type='button'
      variant={variant}
      size={size}
      className={cn('gap-2 transition-all', copied && 'text-green-500', className)}
      onClick={handleCopy}
    >
      <IconComponent className='size-4' />
      {label && <span>{label}</span>}
    </Button>
  )
}
