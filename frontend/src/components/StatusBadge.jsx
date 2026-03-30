import clsx from 'clsx';

const toneMap = {
  resolved: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  waiting_human: 'bg-amber-100 text-amber-700 ring-amber-200',
  new: 'bg-slate-100 text-slate-700 ring-slate-200',
  published: 'bg-sky-100 text-sky-700 ring-sky-200',
  draft: 'bg-slate-100 text-slate-700 ring-slate-200',
  billing: 'bg-rose-100 text-rose-700 ring-rose-200',
  tech: 'bg-indigo-100 text-indigo-700 ring-indigo-200',
  shipping: 'bg-cyan-100 text-cyan-700 ring-cyan-200',
  other: 'bg-slate-100 text-slate-700 ring-slate-200',
  admin: 'bg-violet-100 text-violet-700 ring-violet-200',
  agent: 'bg-amber-100 text-amber-700 ring-amber-200',
  user: 'bg-slate-100 text-slate-700 ring-slate-200',
};

function formatLabel(value, label) {
  if (label) return label;
  if (!value) return 'Unknown';

  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default function StatusBadge({ value, label, className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset',
        toneMap[value] || 'bg-slate-100 text-slate-700 ring-slate-200',
        className
      )}
    >
      {formatLabel(value, label)}
    </span>
  );
}
