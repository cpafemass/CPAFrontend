interface StepTitleProps {
  title: string;
  subtitle: string;
}

export function StepTitle({ title, subtitle }: StepTitleProps) {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-3xl font-black text-slate-950 sm:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-slate-600">{subtitle}</p>
    </div>
  );
}
