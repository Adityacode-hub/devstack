import {
  CheckCircle2,
  MessageSquare,
  Sparkles,
} from "lucide-react";

function ProfileStats({ stats = {} }) {
  const items = [
    {
      label: "Reputation",
      value: stats.reputation ?? 0,
      icon: Sparkles,
    },
    {
      label: "Questions",
      value: stats.questions ?? 0,
      icon: MessageSquare,
    },
    {
      label: "Answers",
      value: stats.answers ?? 0,
      icon: MessageSquare,
    },
    {
      label: "Accepted",
      value: stats.accepted ?? 0,
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-400/20 hover:bg-white/[0.06]"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <Icon size={19} />
              </div>

              <span className="text-xs text-slate-600">
                DevStack
              </span>
            </div>

            <p className="mt-5 text-2xl font-bold text-white">
              {item.value}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              {item.label}
            </p>
          </div>
        );
      })}
    </section>
  );
}

export default ProfileStats;