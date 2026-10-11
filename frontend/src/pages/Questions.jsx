import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  MessageSquare,
  Eye,
  ThumbsUp,
  Plus,
  Hash,
  AlertCircle,
} from "lucide-react";

import { getQuestions } from "@/services/questionService";
import { Button } from "@/components/ui/button";

function Questions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTag = searchParams.get("tag") || "";

  const [questions, setQuestions] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const params = { page: 1, limit: 10 };
      if (activeTag) params.search = activeTag;

      const data = await getQuestions(params);

      setQuestions(data.questions || []);
      setPagination(data.pagination || null);
    } catch (error) {
      console.error("Failed to fetch questions:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to load questions."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [activeTag]);

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* Header */}
      <header className="border-b border-white/10 bg-white/[0.02]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-2xl font-bold">
              Questions
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Explore questions from the developer community.
            </p>

            {/* Active tag filter indicator */}
            {activeTag && (
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-400/20 bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-300">
                  <Hash className="h-3 w-3" />
                  {activeTag}
                </span>
                <button
                  type="button"
                  onClick={() => setSearchParams({})}
                  className="text-xs text-zinc-500 transition hover:text-zinc-300"
                >
                  Clear filter ✕
                </button>
              </div>
            )}
          </div>

          <Link to="/questions/ask">
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-500">
              <Plus className="h-4 w-4" />
              Ask Question
            </Button>
          </Link>

        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Loading */}
        {isLoading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex items-center gap-3 text-zinc-400">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-600 border-t-indigo-500" />
              Loading questions...
            </div>
          </div>
        )}

        {/* Error */}
        {!isLoading && errorMessage && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
            <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-400" />

            <p className="text-sm text-red-300">
              {errorMessage}
            </p>

            <Button
              onClick={fetchQuestions}
              className="mt-4 bg-red-600 hover:bg-red-500"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Empty */}
        {!isLoading &&
          !errorMessage &&
          questions.length === 0 && (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] text-center">

              {activeTag ? (
                <>
                  <Hash className="mb-4 h-10 w-10 text-zinc-600" />

                  <h2 className="text-xl font-semibold">
                    No questions tagged &ldquo;{activeTag}&rdquo;
                  </h2>

                  <p className="mt-2 text-sm text-zinc-500">
                    No one has asked a question with this tag yet.
                  </p>

                  <button
                    type="button"
                    onClick={() => setSearchParams({})}
                    className="mt-5 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-zinc-400 transition hover:border-white/20 hover:text-white"
                  >
                    Clear filter
                  </button>
                </>
              ) : (
                <>
                  <MessageSquare className="mb-4 h-10 w-10 text-zinc-600" />

                  <h2 className="text-xl font-semibold">
                    No questions yet
                  </h2>

                  <p className="mt-2 text-sm text-zinc-500">
                    Be the first developer to ask a question.
                  </p>
                </>
              )}

            </div>
          )}

        {/* Questions */}
        {!isLoading &&
          !errorMessage &&
          questions.length > 0 && (
            <div className="space-y-4">

              {questions.map((question) => {

                const voteCount =
                  (question.upvotes?.length || 0) -
                  (question.downvotes?.length || 0);

                return (
                  <article
                    key={question._id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-indigo-500/30 hover:bg-white/[0.045]"
                  >

                    <div className="flex gap-6">

                      {/* Stats */}
                      <div className="hidden w-24 shrink-0 space-y-3 text-center sm:block">

                        <div className="flex items-center justify-center gap-1 text-sm text-zinc-400">
                          <ThumbsUp className="h-4 w-4" />
                          {voteCount}
                        </div>

                        <div className="flex items-center justify-center gap-1 text-sm text-zinc-500">
                          <Eye className="h-4 w-4" />
                          {question.views || 0}
                        </div>

                      </div>

                      {/* Question */}
                      <div className="min-w-0 flex-1">

                        <Link
                          to={`/questions/${question._id}`}
                          className="text-lg font-semibold text-white transition hover:text-indigo-400"
                        >
                          {question.title}
                        </Link>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-500">
                          {question.description}
                        </p>

                        {/* Tags */}
                        <div className="mt-4 flex flex-wrap gap-2">

                          {question.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md border border-indigo-400/10 bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-300"
                            >
                              {tag}
                            </span>
                          ))}

                        </div>

                        {/* Author */}
                        <div className="mt-5 flex items-center justify-between gap-4">

                          <div className="flex items-center gap-2 text-sm text-zinc-500">

                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/10 text-xs font-semibold text-indigo-300">
                              {question.author?.name
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}
                            </div>

                            <span>
                              {question.author?.name ||
                                "Unknown user"}
                            </span>

                            {question.author?.username && (
                              <span className="text-zinc-700">
                                @{question.author.username}
                              </span>
                            )}

                          </div>

                          <div className="flex items-center gap-1 text-xs text-zinc-600">
                            <MessageSquare className="h-3.5 w-3.5" />
                            Discussion
                          </div>

                        </div>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>
          )}

        {/* Pagination Info */}
        {!isLoading &&
          !errorMessage &&
          pagination && (
            <div className="mt-6 text-center text-sm text-zinc-600">
              Showing page {pagination.currentPage} of{" "}
              {pagination.totalPages}
            </div>
          )}

      </main>
    </div>
  );
}

export default Questions;