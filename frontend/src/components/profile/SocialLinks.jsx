import {
  ExternalLink,
  Globe,
  Link2,
} from "lucide-react";

function SocialLinks({ profile }) {
  const social = profile?.social || {};

  const links = [
    {
      name: "GitHub",
      value: social.github,
      icon: Link2,
    },
    {
      name: "Twitter",
      value: social.twitter,
      icon: Link2,
    },
    {
      name: "YouTube",
      value: social.youtube,
      icon: Link2,
    },
    {
      name: "Portfolio",
      value: profile?.portfolio,
      icon: Globe,
    },
  ];

  const availableLinks = links.filter(
    (link) => link.value
  );

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
          <ExternalLink size={19} />
        </div>

        <div>
          <h2 className="font-semibold text-white">
            Connect
          </h2>

          <p className="text-xs text-slate-500">
            Find this developer online
          </p>
        </div>
      </div>

      {availableLinks.length > 0 ? (
        <div className="mt-6 space-y-2">
          {availableLinks.map((link) => {
            const Icon = link.icon;

            return (
              <a
                key={link.name}
                href={normalizeUrl(link.value)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                <span className="flex items-center gap-3">
                  <Icon size={17} />
                  {link.name}
                </span>

                <ExternalLink size={14} />
              </a>
            );
          })}
        </div>
      ) : (
        <p className="mt-6 text-sm text-slate-500">
          No social links added yet.
        </p>
      )}
    </section>
  );
}

function normalizeUrl(url) {
  if (
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }

  return `https://${url}`;
}

export default SocialLinks;