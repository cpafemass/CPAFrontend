import { cx } from "../../../utils/classnames";

interface IconBadgeProps {
  children: string;
  tone?: "primary" | "success" | "soft";
}

export function IconBadge({ children, tone = "primary" }: IconBadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-black tracking-wide",
        tone === "primary" &&
          "bg-blue-700 text-white shadow-sm shadow-blue-900/20",
        tone === "success" &&
          "bg-emerald-600 text-white shadow-sm shadow-emerald-900/20",
        tone === "soft" && "bg-slate-100 text-slate-600",
      )}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}
