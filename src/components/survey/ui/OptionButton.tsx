import { cx } from '../../../utils/classnames'
import { IconBadge } from './IconBadge'

interface OptionButtonProps {
  icon: string
  selected: boolean
  title: string
  subtitle?: string
  onClick: () => void
}

export function OptionButton({
  icon,
  selected,
  title,
  subtitle,
  onClick,
}: OptionButtonProps) {
  return (
    <button
      className={cx(
        'flex w-full items-center gap-3 rounded-xl border bg-white/95 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-slate-900/10 sm:gap-4 sm:p-5',
        selected
          ? 'border-blue-700 bg-blue-50 ring-4 ring-blue-700/10'
          : 'border-slate-200',
      )}
      onClick={onClick}
      type="button"
    >
      <IconBadge tone={selected ? 'primary' : 'soft'}>{icon}</IconBadge>
      <span className="grid flex-1 gap-1">
        <strong className="text-base text-slate-950 sm:text-lg">{title}</strong>
        {subtitle ? <small className="font-medium text-slate-500">{subtitle}</small> : null}
      </span>
      <span
        className={cx(
          'grid h-8 w-8 place-items-center rounded-full text-sm font-black',
          selected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-transparent',
        )}
        aria-hidden="true"
      >
        OK
      </span>
    </button>
  )
}
