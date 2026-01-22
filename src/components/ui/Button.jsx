import { Slot } from '@radix-ui/react-slot'

function Button({ variant = 'primary', size = 'md', className = '', asChild = false, ...props }) {
  const base =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50'

  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    ghost: 'bg-transparent text-foreground hover:bg-muted',
    outline: 'border border-border bg-card hover:bg-muted',
  }

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-5 text-base',
  }

  const classes = [base, variants[variant] ?? variants.primary, sizes[size] ?? sizes.md, className]
    .filter(Boolean)
    .join(' ')

  const Component = asChild ? Slot : 'button'
  return <Component className={classes} {...props} />
}

export { Button }
