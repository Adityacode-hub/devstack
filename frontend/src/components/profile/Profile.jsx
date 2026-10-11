import { useEffect, useState } from "react";
import {
  AlertCircle,
  Loader2,
  UserRound,
} from "lucide-react";

import {
  getMyProfile,
  updateMyProfile,
} from "../services/profileService";

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

  const [stats, setStats] = useState({
    questions: 0,
    answers: 0,
    accepted: 0,
  });

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  // Load profile when page opens
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyProfile();

      setProfile(data.profile);

      // Load real statistics from backend
      setStats({
        questions: data.stats?.questions ?? 0,
        answers: data.stats?.answers ?? 0,
        accepted: data.stats?.accepted ?? 0,
      });

      // No profile exists yet
      if (!data.profile) {
        setError("Profile not created");
      }
    } catch (error) {
      console.error("PROFILE LOAD ERROR:", error);

      const message =
        error.response?.data?.message ||
        "Failed to load profile.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Create profile
  const handleCreateProfile = async () => {
    try {
      setCreating(true);
      setError("");

      const profileData = {
        website: "",
        country: "",
        languages: [],
        portfolio: "",
        workExperience: [],
        social: {
          github: "",
          twitter: "",
          youtube: "",
        },
      };

      const data = await updateMyProfile(profileData);

      setProfile(data.profile);

      // Reload everything from backend
      await loadProfile();
    } catch (error) {
      console.error("CREATE PROFILE ERROR:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create profile.";

      setError(message);
    } finally {
      setCreating(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-8 text-white">
        <div className="mx-auto max-w-7xl">
          <ProfileSkeleton />
        </div>
      </main>
    );
  }

  // Profile does not exist
  if (!profile && error === "Profile not created") {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 px-6 text-white">
        <div className="w-full max-w-xl text-center">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04]">
            <UserRound
              size={32}
              className="text-violet-400"
            />
          </div>

          <h1 className="mt-8 text-3xl font-bold">
            Profile not created
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-400">
            Create your developer profile to showcase your
            skills, experience, portfolio, and community
            activity.
          </p>

          <button
            type="button"
            onClick={handleCreateProfile}
            disabled={creating}
            className="
              mt-8
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-violet-500
              to-blue-500
              px-7
              py-3
              text-sm
              font-semibold
              text-white
              shadow-lg
              shadow-violet-500/20
              transition
              hover:-translate-y-0.5
              hover:shadow-violet-500/30
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {creating ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Creating Profile...
              </>
            ) : (
              "Create Profile"
            )}
          </button>
        </div>
      </main>
    );
  }

  // Other error
  if (error && !profile) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 px-6 text-white">
        <div className="max-w-md text-center">

          <AlertCircle
            size={40}
            className="mx-auto text-red-400"
          />

          <h1 className="mt-5 text-xl font-semibold">
            Something went wrong
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={loadProfile}
            className="
              mt-6
              rounded-xl
              border
              border-white/10
              bg-white/[0.05]
              px-5
              py-2.5
              text-sm
              text-white
              transition
              hover:bg-white/[0.1]
            "
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // Profile exists
  const user = profile?.user;

  // Combine user reputation with dynamic activity stats
  const profileStats = {
    reputation: user?.reputation ?? 0,
    questions: stats.questions,
    answers: stats.answers,
    accepted: stats.accepted,
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        <ProfileHero
          profile={profile}
          stats={profileStats}
          onEdit={() => {
            console.log("Edit profile clicked");
          }}
        />

        <ProfileStats stats={profileStats} />

        <div className="grid gap-6 lg:grid-cols-3">

          <div className="space-y-6 lg:col-span-2">

            <AboutCard
              profile={profile}
            />

            <TechStack
              languages={profile?.languages || []}
            />

            <ExperienceTimeline
              experiences={
                profile?.workExperience || []
              }
            />

            <ActivityTabs
              questions={[]}
              answers={[]}
            />

          </div>

          <aside className="space-y-6">

            <ReputationCard
              reputation={user?.reputation ?? 0}
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