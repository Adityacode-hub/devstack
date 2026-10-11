import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import api from "@/services/api";

function AskQuestion() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");

    if (!formData.title.trim()) {
      setErrorMessage("Please enter a question title.");
      return;
    }

    if (!formData.description.trim()) {
      setErrorMessage("Please describe your question.");
      return;
    }

    setIsLoading(true);

    try {
      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean);

      const response = await api.post("/questions", {
        title: formData.title.trim(),
        description: formData.description.trim(),
        tags,
      });

      console.log(
        "Question created:",
        response.data
      );

      const questionId =
        response.data.question?._id;

      if (questionId) {
        navigate(`/questions/${questionId}`);
      } else {
        navigate("/questions");
      }
    } catch (error) {
      console.error(
        "Failed to create question:",
        error
      );

      if (error.response?.status === 401) {
        setErrorMessage(
          "You must be logged in to ask a question."
        );
      } else {
        setErrorMessage(
          error.response?.data?.message ||
            "Failed to create question."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* Header */}
      <header className="border-b border-white/10 bg-white/[0.02]">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-5">

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => navigate("/questions")}
            className="text-zinc-400 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div>
            <h1 className="text-2xl font-bold">
              Ask a Question
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Share your problem with the developer community.
            </p>
          </div>

        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-6 py-10">

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 sm:p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-7"
          >

            {/* Error */}
            {errorMessage && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {errorMessage}
              </div>
            )}

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-zinc-200"
              >
                Question title
              </label>

              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. How does Express middleware work?"
                maxLength={200}
                required
                className="h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10"
              />

              <p className="mt-2 text-xs text-zinc-600">
                {formData.title.length}/200 characters
              </p>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-zinc-200"
              >
                Describe your problem
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Explain your problem clearly. Include relevant code, errors, and what you have already tried."
                rows={10}
                required
                className="w-full resize-y rounded-xl border border-white/10 bg-black/30 px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10"
              />

              <p className="mt-2 text-xs text-zinc-600">
                Provide enough context so other developers can understand your problem.
              </p>
            </div>

            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="mb-2 block text-sm font-medium text-zinc-200"
              >
                Tags
              </label>

              <input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="react, nodejs, mongodb"
                className="h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10"
              />

              <p className="mt-2 text-xs text-zinc-600">
                Separate multiple tags with commas.
              </p>
            </div>

            {/* Submit */}
            <div className="flex justify-end border-t border-white/10 pt-6">

              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 gap-2 rounded-xl bg-indigo-600 px-6 font-semibold hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Publish Question
                  </>
                )}
              </Button>

            </div>

          </form>

        </div>

      </main>
    </div>
  );
}

export default AskQuestion;