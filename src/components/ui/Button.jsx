import { Slot } from '@radix-ui/react-slot'

function Button({ variant = 'primary', size = 'md', className = '', asChild = false, ...props }) {
  const base =
    'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95'

  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg',
    ghost: 'bg-transparent text-foreground hover:bg-muted hover:text-primary',
    outline: 'border-2 border-border bg-card hover:bg-muted hover:border-primary',
  }

  const sizes = {
    sm: 'h-9 px-3 sm:px-4 text-xs sm:text-sm min-h-[36px]',
    md: 'h-10 px-4 sm:px-5 text-sm sm:text-base min-h-[40px]',
    lg: 'h-12 px-5 sm:px-6 text-base sm:text-lg min-h-[48px]',
  }

  const classes = [base, variants[variant] ?? variants.primary, sizes[size] ?? sizes.md, className]
    .filter(Boolean)
    .join(' ')

  const Component = asChild ? Slot : 'button'
  return <Component className={classes} {...props} />
}

export { Button }
