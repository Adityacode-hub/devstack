import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Code2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Rocket,
  Sparkles,
  User,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import api from "@/services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  };

  // Handle registration
  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const response = await api.post(
        "/auth/register",
        formData
      );

      console.log(
        "Registration successful:",
        response.data
      );

      // Save authentication data
      localStorage.setItem(
        "devstack_token",
        response.data.token
      );

      localStorage.setItem(
        "devstack_user",
        JSON.stringify(response.data.user)
      );

      setSuccessMessage(
        "Account created successfully!"
      );

      // Clear form
      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
      });

      // Redirect to home
      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (error) {
      console.error(
        "Registration failed:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[140px]" />

      <div className="pointer-events-none absolute -bottom-40 right-[-100px] h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[140px]" />

      {/* Dot Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative z-10 mx-auto min-h-screen max-w-7xl px-5 py-5 sm:px-8">
        {/* Navbar */}
        <header className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-white/[0.035] px-5 py-3 backdrop-blur-xl">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10">
              <Code2 className="h-5 w-5 text-indigo-400" />
            </div>

            <span className="text-lg font-bold tracking-tight">
              DevStack
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <Link
              to="/"
              className="transition-colors hover:text-white"
            >
              Questions
            </Link>

            <Link
              to="/tags"
              className="transition-colors hover:text-white"
            >
              Tags
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-full border border-white/10 bg-white/[0.06] px-5 py-2 text-sm font-medium text-white"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="hidden rounded-full bg-white px-5 py-2 text-sm font-semibold text-black sm:block"
            >
              Sign up
            </Link>
          </div>
        </header>

        {/* Main */}
        <main className="mx-auto grid max-w-6xl items-center gap-12 py-12 lg:grid-cols-[1fr_470px] lg:py-16">
          {/* Left Section */}
          <section className="hidden lg:block">
            {/* Badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/5 px-4 py-2 text-sm text-slate-300">
              <Sparkles className="h-4 w-4 text-indigo-400" />

              <span>
                Join · Contribute · Grow
              </span>

              <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
            </div>

            {/* Heading */}
            <h1 className="max-w-xl text-6xl font-bold leading-[1.02] tracking-[-0.045em]">
              Build your
              <br />

              <span className="bg-gradient-to-r from-white via-indigo-300 to-blue-500 bg-clip-text text-transparent">
                developer journey.
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-lg leading-8 text-slate-400">
              Create your DevStack account and become
              part of a community where developers
              learn, contribute, and solve problems
              together.
            </p>

            {/* Features */}
            <div className="mt-12 grid max-w-xl grid-cols-2 gap-7">
              <Feature
                icon={Code2}
                title="Ask Questions"
                description="Get help from the developer community."
              />

              <Feature
                icon={Users}
                title="Share Solutions"
                description="Help others with your experience."
              />

              <Feature
                icon={Rocket}
                title="Grow Skills"
                description="Learn by solving real problems."
              />

              <Feature
                icon={Sparkles}
                title="Build Reputation"
                description="Earn reputation through contributions."
              />
            </div>

            {/* Trust Points */}
            <div className="mt-12 flex flex-wrap gap-6 text-sm text-slate-500">
              <TrustPoint text="Free to join" />
              <TrustPoint text="Developer focused" />
              <TrustPoint text="Community driven" />
            </div>
          </section>

          {/* Register Card */}
          <section className="relative">
            {/* Glow */}
            <div className="absolute -inset-1 rounded-[30px] bg-gradient-to-r from-indigo-500/20 via-purple-500/10 to-blue-500/20 blur-2xl" />

            <div className="relative rounded-[28px] border border-white/10 bg-[#0a0a0d]/95 p-7 shadow-2xl backdrop-blur-2xl sm:p-9">
              {/* Header */}
              <div className="mb-7">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10">
                  <User className="h-5 w-5 text-indigo-400" />
                </div>

                <h2 className="text-3xl font-bold tracking-tight">
                  Create your{" "}
                  <span className="bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent">
                    account
                  </span>
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Join the DevStack developer community.
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {errorMessage}
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                  {successMessage}
                </div>
              )}

              {/* Registration Form */}
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Aditya Kumar"
                      autoComplete="name"
                      required
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-indigo-500/10"
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Username
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                      @
                    </span>

                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="aditya123"
                      autoComplete="username"
                      required
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-indigo-500/10"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-indigo-500/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      autoComplete="new-password"
                      required
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-indigo-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (previous) => !previous
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="group mt-2 h-12 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-sm font-semibold text-white shadow-[0_0_30px_rgba(99,102,241,0.2)] transition-all hover:from-indigo-400 hover:to-blue-400 hover:shadow-[0_0_35px_rgba(99,102,241,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading
                    ? "Creating account..."
                    : "Create account"}

                  {!isLoading && (
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  )}
                </Button>
              </form>

              {/* Security */}
              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />

                <span className="text-[10px] font-medium tracking-[0.2em] text-slate-600">
                  SECURE ACCOUNT
                </span>

                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

                <p className="text-xs leading-5 text-slate-500">
                  Your password will be securely hashed
                  before being stored in the database.
                </p>
              </div>

              {/* Login */}
              <p className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-indigo-400 transition hover:text-indigo-300"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

/* Feature Component */
function Feature({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="group flex gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] transition group-hover:border-indigo-400/30 group-hover:bg-indigo-500/10">
        <Icon className="h-5 w-5 text-indigo-400" />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

/* Trust Point Component */
function TrustPoint({ text }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />

      <span>{text}</span>
    </div>
  );
}

export default Register;