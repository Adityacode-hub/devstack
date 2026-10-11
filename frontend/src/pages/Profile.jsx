import { useEffect, useState } from "react";

import { getMyProfile } from "../services/profileService";

import ProfileHero from "../components/profile/ProfileHero";
import ProfileStats from "../components/profile/ProfileStats";
import AboutCard from "../components/profile/AboutCard";
import TechStack from "../components/profile/TechStack";
import ExperienceTimeline from "../components/profile/ExperienceTimeline";
import SocialLinks from "../components/profile/SocialLinks";
import ReputationCard from "../components/profile/ReputationCard";
import ActivityTabs from "../components/profile/ActivityTabs";
import ProfileSkeleton from "../components/profile/ProfileSkeleton";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ questions: 0, answers: 0, accepted: 0 });
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyProfile();

        setProfile(data.profile);
        setStats(data.stats ?? { questions: 0, answers: 0, accepted: 0 });
        setQuestions(data.questions ?? []);
        setAnswers(data.answers ?? []);
      } catch (error) {
        console.error(
          "Failed to load profile:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ProfileSkeleton />
        </div>
      </main>
    );
  }

  if (error === "Profile not found") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
            👤
          </div>

          <h1 className="mt-5 text-2xl font-bold">
            Profile not created
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Create your developer profile to showcase
            your skills, experience, and community
            activity.
          </p>

          <button
            type="button"
            className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            Create Profile
          </button>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
        <div className="rounded-2xl border border-red-400/10 bg-red-500/5 px-6 py-5 text-sm text-red-400">
          {error}
        </div>
      </main>
    );
  }

  const user = profile?.user;

  const profileStats = {
    reputation: user?.reputation ?? 0,
    questions: stats.questions,
    answers: stats.answers,
    accepted: stats.accepted,
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Hero */}
        <ProfileHero
          profile={profile}
          onEdit={() =>
            console.log("Edit profile clicked")
          }
        />

        {/* Stats */}
        <ProfileStats stats={profileStats} />

        {/* Main content */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Left / main */}
          <div className="space-y-6 lg:col-span-2">
            <AboutCard profile={profile} />

            <TechStack
              languages={
                profile?.languages || []
              }
            />

            <ExperienceTimeline
              experiences={
                profile?.workExperience || []
              }
            />

            <ActivityTabs
              questions={questions}
              answers={answers}
            />
          </div>

          {/* Right */}
          <aside className="space-y-6">
            <ReputationCard
              reputation={
                user?.reputation ?? 0
              }
            />

            <SocialLinks
              profile={profile}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Profile;