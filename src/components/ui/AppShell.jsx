function AppShell({ header, navigation, children }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          {header}
        </div>
      </header>
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-6">
        {navigation}
        <main className="rounded-lg border border-border bg-card shadow-sm">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

export { AppShell }
