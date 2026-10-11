import { UserRound } from "lucide-react";

function AboutCard({ profile }) {
  const user = profile?.user;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
          <UserRound size={19} />
        </div>

        <div>
          <h2 className="font-semibold text-white">
            About
          </h2>

          <p className="text-xs text-slate-500">
            Developer introduction
          </p>
        </div>
      </div>

      <p className="mt-6 text-sm leading-7 text-slate-300">
        {user?.bio ||
          "This developer has not added a bio yet."}
      </p>
    </section>
  );
}

export default AboutCard;