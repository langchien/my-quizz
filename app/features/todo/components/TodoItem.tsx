import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Check, Loader2, Pencil, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { useDeleteTodo, useToggleTodo, useUpdateTodo } from '../hooks/useTodos'
import type { Todo } from '../types'

interface TodoItemProps {
  todo: Todo
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)

  const toggleMutation = useToggleTodo()
  const deleteMutation = useDeleteTodo()
  const updateMutation = useUpdateTodo()

  const isLoading = toggleMutation.isPending || deleteMutation.isPending || updateMutation.isPending

  const handleToggle = () => {
    toggleMutation.mutate({ id: todo.id, completed: !todo.completed })
  }

  const handleDelete = () => {
    deleteMutation.mutate(todo.id)
  }

  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle !== todo.title) {
      updateMutation.mutate({ id: todo.id, title: editTitle.trim() })
    }
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditTitle(todo.title)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveEdit()
    if (e.key === 'Escape') handleCancelEdit()
  }

  return (
    <Card
      className={cn(
        'group flex-row items-center gap-3 p-4',
        'hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5',
        'transition-all duration-300 ease-out',
        'animate-in fade-in-0 slide-in-from-left-2',
        todo.completed && 'opacity-60',
        deleteMutation.isPending && 'scale-95 opacity-50',
      )}
    >
      {/* Checkbox */}
      <div className='shrink-0'>
        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleToggle}
          disabled={isLoading}
          className={cn(
            'h-5 w-5 rounded-full border-2 transition-all duration-200',
            todo.completed ? 'bg-primary border-primary' : 'hover:border-primary/50',
          )}
        />
      </div>

      {/* Content */}
      <div className='flex-1 min-w-0'>
        {isEditing ? (
          <Input
            type='text'
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <p
            className={cn(
              'text-sm font-medium truncate transition-all duration-200',
              todo.completed && 'line-through text-muted-foreground',
            )}
          >
            {todo.title}
          </p>
        )}
      </div>

      {/* Actions */}
      <div
        className={cn(
          'flex items-center gap-1 opacity-0 group-hover:opacity-100',
          'transition-opacity duration-200',
          isEditing && 'opacity-100',
        )}
      >
        {isEditing ? (
          <>
            <Button
              variant='ghost'
              size='icon'
              onClick={handleSaveEdit}
              className='h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-500/10'
            >
              <Check className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={handleCancelEdit}
              className='h-8 w-8 text-muted-foreground hover:text-foreground'
            >
              <X className='h-4 w-4' />
            </Button>
          </>
        ) : (
          <>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
              className='h-8 w-8 text-muted-foreground hover:text-primary'
            >
              {updateMutation.isPending ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Pencil className='h-4 w-4' />
              )}
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={handleDelete}
              disabled={isLoading}
              className='h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10'
            >
              {deleteMutation.isPending ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Trash2 className='h-4 w-4' />
              )}
            </Button>
          </>
        )}
      </div>
    </Card>
  )
}
