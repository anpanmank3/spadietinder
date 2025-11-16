export function Header() {
  return (
    <header className="border-b-4 border-primary bg-card/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-3 py-3 flex items-center justify-center">
        <div className="flex flex-col items-center gap-0.5">
          <div className="relative">
            <div className="absolute -inset-2 bg-secondary/20 rounded-2xl blur-lg" />
            <h1 className="relative text-3xl sm:text-4xl font-black text-primary game-title">SPADIE</h1>
          </div>
          <div className="px-3 py-0.5 bg-secondary rounded-full">
            <p className="text-[10px] sm:text-xs font-bold text-secondary-foreground tracking-wider">POKER LEAGUE</p>
          </div>
        </div>
      </div>
      <div className="absolute top-2 left-2 text-xl opacity-30">♠</div>
      <div className="absolute top-2 right-2 text-xl opacity-30">♥</div>
    </header>
  )
}
