import { Hash } from "lucide-react";

function Tags() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <p className="text-sm font-medium text-violet-400">
            Explore
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Tags
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Explore questions by technology and topic.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <div className="flex flex-col items-center justify-center py-16 text-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10">
              <Hash
                size={28}
                className="text-violet-400"
              />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              Tags are coming together
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              This page will show all available technology
              tags and the questions associated with them.
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Tags;