function Card({ title, description, children, actions, className = '' }) {
  return (
    <div className={['rounded-lg border border-border bg-card p-4 shadow-sm', className].join(' ').trim()}>
      {(title || description) && (
        <div className="mb-3 space-y-1">
          {title && <h2 className="text-lg font-semibold leading-tight">{title}</h2>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      <div className="space-y-3 text-sm text-foreground">{children}</div>
      {actions && <div className="mt-4 flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export { Card }
