import {
  BriefcaseBusiness,
  CalendarDays,
} from "lucide-react";

function ExperienceTimeline({ experiences = [] }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
          <BriefcaseBusiness size={19} />
        </div>

        <div>
          <h2 className="font-semibold text-white">
            Experience
          </h2>

          <p className="text-xs text-slate-500">
            Professional journey
          </p>
        </div>
      </div>

      {experiences.length > 0 ? (
        <div className="mt-7 space-y-7">
          {experiences.map((experience, index) => (
            <div
              key={`${experience.role}-${index}`}
              className="relative pl-7"
            >
              {index !== experiences.length - 1 && (
                <div className="absolute left-[5px] top-5 h-full w-px bg-white/10" />
              )}

              <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-emerald-400 ring-4 ring-emerald-400/10" />

              <h3 className="font-semibold text-white">
                {experience.role}
              </h3>

              <p className="mt-1 text-sm text-violet-400">
                {experience.company || "Independent"}
              </p>

              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <CalendarDays size={14} />

                <span>
                  {formatDate(experience.from)} —{" "}
                  {experience.current
                    ? "Present"
                    : formatDate(experience.to)}
                </span>
              </div>

              {experience.details && (
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {experience.details}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-6 text-center">
          <p className="text-sm text-slate-500">
            No work experience added yet.
          </p>
        </div>
      )}
    </section>
  );
}

function formatDate(value) {
  if (!value) return "Present";

  return new Date(value).toLocaleDateString(
    "en-US",
    {
      month: "short",
      year: "numeric",
    }
  );
}

export default ExperienceTimeline;