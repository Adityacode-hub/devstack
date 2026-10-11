import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ questions: 0, answers: 0, accepted: 0 });
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [profileExists, setProfileExists] = useState(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyProfile();

      // The API returns { profile: null } with 200 when no profile
      // has been created yet — not a 404. Check the value, not the
      // error message, so the "not created" state is always reachable.
      if (data.profile === null) {
        setProfileExists(false);
      } else {
        setProfileExists(true);
        setProfile(data.profile);
        setStats(data.stats ?? { questions: 0, answers: 0, accepted: 0 });
        setQuestions(data.questions ?? []);
        setAnswers(data.answers ?? []);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
      setError(
        err.response?.data?.message || "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  // API returns { profile: null } with 200 for users who haven't
  // created a profile yet — this check is always reachable.
  if (!loading && !error && !profileExists) {
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
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="w-full max-w-md rounded-2xl border border-red-400/10 bg-red-500/5 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-2xl">
            ⚠️
          </div>

          <h2 className="mt-5 text-lg font-semibold">
            Failed to load profile
          </h2>

          <p className="mt-2 text-sm text-red-400">
            {error}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={fetchProfile}
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Try Again
            </button>

            <button
              type="button"
              onClick={() => navigate("/questions")}
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-400 transition hover:border-white/20 hover:text-white"
            >
              Back to Questions
            </button>
          </div>
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