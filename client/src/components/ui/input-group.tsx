import * as React from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

function InputGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='input-group'
      className={cn(
        'group/input-group relative flex w-full items-center',
        // Tự động thêm padding cho InputGroupInput khi có addon tương ứng
        'has-[[data-align=inline-start]]:[&>input]:pl-10',
        'has-[[data-align=inline-end]]:[&>input]:pr-10',
        className,
      )}
      {...props}
    />
  )
}

function InputGroupInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return <Input data-slot='input-group-input' className={cn('peer w-full', className)} {...props} />
}

function InputGroupAddon({
  className,
  align = 'inline-start',
  ...props
}: React.ComponentProps<'div'> & { align?: 'inline-start' | 'inline-end' }) {
  return (
    <div
      data-slot='input-group-addon'
      data-align={align}
      className={cn(
        'pointer-events-auto absolute top-0 bottom-0 flex items-center justify-center text-muted-foreground transition-colors',
        align === 'inline-start' ? 'left-0 pl-3' : 'right-0 pr-3',
        className,
      )}
      {...props}
    />
  )
}

export { InputGroup, InputGroupAddon, InputGroupInput }
