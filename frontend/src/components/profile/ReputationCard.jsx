import {
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

function ReputationCard({ reputation = 0 }) {
  const nextMilestone =
    Math.ceil((reputation + 1) / 1000) * 1000;

  const previousMilestone =
    Math.floor(reputation / 1000) * 1000;

  const progress =
    nextMilestone === previousMilestone
      ? 100
      : Math.min(
          100,
          ((reputation - previousMilestone) /
            (nextMilestone - previousMilestone)) *
            100
        );

  return (
    <section className="relative overflow-hidden rounded-3xl border border-violet-400/10 bg-gradient-to-br from-violet-500/10 via-white/[0.04] to-blue-500/10 p-6">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-violet-400">
            <Sparkles size={17} />

            <span className="text-xs font-semibold uppercase tracking-wider">
              Reputation
            </span>
          </div>

          <p className="mt-4 text-4xl font-bold tracking-tight text-white">
            {reputation}
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Community reputation
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
          <ShieldCheck size={20} />
        </div>
      </div>

      <div className="relative mt-7">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Progress
          </span>

          <span className="text-slate-400">
            {nextMilestone}
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="relative mt-5 flex items-center gap-2 text-xs text-slate-500">
        <ArrowUpRight size={14} />

        <span>
          Next milestone: {nextMilestone} reputation
        </span>
      </div>
    </section>
  );
}

export default ReputationCard;