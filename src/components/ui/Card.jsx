function Card({ title, description, children, actions, className = '' }) {
  return (
    <div className={['rounded-lg border border-border bg-card p-4 sm:p-6 shadow-lg', className].join(' ').trim()}>
      {(title || description) && (
        <div className="mb-3 sm:mb-4 space-y-1">
          {title && <h2 className="text-base sm:text-lg font-semibold leading-tight">{title}</h2>}
          {description && <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-foreground">{children}</div>
      {actions && <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export { Card }
