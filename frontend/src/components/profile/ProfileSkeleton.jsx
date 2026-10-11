function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
        <div className="h-44 bg-white/[0.04]" />

        <div className="space-y-5 p-8">
          <div className="h-24 w-24 rounded-3xl bg-white/10" />

          <div className="h-7 w-48 rounded-lg bg-white/10" />

          <div className="h-4 w-32 rounded bg-white/10" />

          <div className="h-4 max-w-xl rounded bg-white/10" />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-20 rounded-2xl bg-white/[0.05]"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-48 rounded-3xl bg-white/[0.04]" />
        <div className="h-48 rounded-3xl bg-white/[0.04]" />
        <div className="h-48 rounded-3xl bg-white/[0.04]" />
      </div>
    </div>
  );
}

export default ProfileSkeleton;