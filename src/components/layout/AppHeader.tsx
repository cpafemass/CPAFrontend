export function AppHeader() {
  return (
    <header className="px-4 pb-3 pt-5 sm:pb-4 sm:pt-8">
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-3 sm:gap-4">
        <img
          className="h-12 w-auto rounded-md object-contain sm:h-16"
          src="/logo_femass.svg"
          alt="FeMASS"
        />
        <div className="leading-tight">
          <strong className="block text-base font-black text-slate-950 sm:text-xl">FeMASS</strong>
          <span className="block max-w-52 text-[11px] font-medium leading-snug text-slate-500 sm:max-w-none sm:text-xs">Faculdade Municipal Miguel Ângelo da Silva Santos</span>
        </div>
      </div>
    </header>
  )
}
