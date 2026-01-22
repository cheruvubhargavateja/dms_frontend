function AppShell({ header, navigation, children }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl lg:max-w-[1400px] items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          {header}
        </div>
      </header>
      <div className="mx-auto flex max-w-6xl lg:max-w-[1400px] flex-col gap-4 px-4 py-4 sm:gap-6 sm:px-6 sm:py-6">
        {navigation}
        <main className="rounded-lg border border-border bg-card shadow-lg">
          <div className="p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

export { AppShell }
