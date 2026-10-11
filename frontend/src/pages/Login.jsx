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
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      console.log("Login successful:", response.data);

      // Update AuthContext state and persist to localStorage
      login(response.data.token, response.data.user);

      setSuccessMessage("Login successful!");

      // Redirect to questions
      setTimeout(() => {
        navigate("/questions");
      }, 800);
    } catch (error) {
      console.error("Login failed:", error);

      const message =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-[-150px] h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[140px]" />

        <div className="absolute bottom-[-200px] right-[-150px] h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[140px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/20">
            <Code2 className="h-5 w-5 text-white" />
          </div>

          <span className="text-xl font-bold tracking-tight">
            DevStack
          </span>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-xl sm:flex">

          <Link
            to="/"
            className="rounded-full px-4 py-2 text-sm text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            Questions
          </Link>

          <Link
            to="/tags"
            className="rounded-full px-4 py-2 text-sm text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            Tags
          </Link>

          <Link
            to="/login"
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-full px-4 py-2 text-sm text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            Sign up
          </Link>

        </div>
      </nav>

      {/* Main */}
      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-100px)] w-full max-w-7xl items-center px-6 py-12 lg:px-8">

        <div className="grid w-full items-center gap-16 lg:grid-cols-2">

          {/* Left Content */}
          <section className="hidden lg:block">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
              <Sparkles className="h-4 w-4" />
              <span>Developer community</span>
            </div>

            <h1 className="max-w-xl text-5xl font-bold leading-tight tracking-tight xl:text-6xl">
              Welcome
              <span className="block bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Developer.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-zinc-400">
              Connect with developers, ask technical questions,
              share knowledge, and build your developer reputation.
            </p>

            {/* Features */}
            <div className="mt-10 space-y-5">

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                  <Rocket className="h-5 w-5 text-indigo-400" />
                </div>

                <div>
                  <p className="font-medium">
                    Learn faster
                  </p>

                  <p className="text-sm text-zinc-500">
                    Find practical solutions from developers.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                  <Users className="h-5 w-5 text-blue-400" />
                </div>

                <div>
                  <p className="font-medium">
                    Build your network
                  </p>

                  <p className="text-sm text-zinc-500">
                    Connect with developers and share knowledge.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                  <Check className="h-5 w-5 text-cyan-400" />
                </div>

                <div>
                  <p className="font-medium">
                    Grow your reputation
                  </p>

                  <p className="text-sm text-zinc-500">
                    Contribute useful answers and earn reputation.
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* Login Card */}
          <section className="mx-auto w-full max-w-md">

            <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-8">

              {/* Header */}
              <div className="mb-8">

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 ring-1 ring-indigo-400/20">
                  <LockKeyhole className="h-5 w-5 text-indigo-400" />
                </div>

                <h2 className="text-2xl font-semibold tracking-tight">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Sign in to continue to your DevStack account.
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

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-zinc-200"
                  >
                    Email address
                  </label>

                  <div className="relative">

                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      className="h-12 w-full rounded-xl border border-white/10 bg-black/30 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10"
                    />

                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-zinc-200"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs text-indigo-400 transition hover:text-indigo-300"
                    >
                      Forgot password?
                    </button>

                  </div>

                  <div className="relative">

                    <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

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
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="h-12 w-full rounded-xl border border-white/10 bg-black/30 pl-10 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (previous) => !previous
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-white"
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

                {/* Remember Me */}
                <div className="flex items-center justify-between">

                  <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-400">

                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-white/20 bg-black/30 accent-indigo-500"
                    />

                    Remember me

                  </label>

                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign in
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}

                </Button>

              </form>

              {/* Register */}
              <div className="mt-7 text-center text-sm text-zinc-500">

                Don't have an account?{" "}

                <Link
                  to="/register"
                  className="font-medium text-indigo-400 transition hover:text-indigo-300"
                >
                  Create account
                </Link>

              </div>

              {/* Security */}
              <div className="mt-6 flex items-center justify-center gap-2 border-t border-white/10 pt-5 text-xs text-zinc-600">
                <LockKeyhole className="h-3.5 w-3.5" />
                Secure authentication powered by JWT
              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default Login;