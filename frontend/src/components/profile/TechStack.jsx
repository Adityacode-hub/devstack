import { Code2 } from "lucide-react";

function TechStack({ languages = [] }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
          <Code2 size={19} />
        </div>

        <div>
          <h2 className="font-semibold text-white">
            Tech Stack
          </h2>

          <p className="text-xs text-slate-500">
            Technologies and languages
          </p>
        </div>
      </div>

      {languages.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {languages.map((language) => (
            <span
              key={language}
              className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white"
            >
              {language}
            </span>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-6 text-center">
          <p className="text-sm text-slate-500">
            No technologies added yet.
          </p>
        </div>
      )}
    </section>
  );
}

export default TechStack;