import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hash, Search } from "lucide-react";

import { getTags } from "@/services/questionService";

function Tags() {
  const navigate = useNavigate();

  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await getTags();
      setTags(data.tags || []);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to load tags."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleTagClick = (tagName) => {
    navigate(`/questions?tag=${encodeURIComponent(tagName)}`);
  };

  // Client-side filter against the search box
  const visibleTags = searchQuery.trim()
    ? tags.filter((t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tags;

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-violet-400">
            Explore
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Tags
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Explore questions by technology and topic.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-sm">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter tags..."
            className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-violet-400/40 focus:bg-white/[0.06]"
          />
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex items-center gap-3 text-slate-400">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-violet-500" />
              Loading tags...
            </div>
          </div>
        )}

        {/* Error */}
        {!isLoading && errorMessage && (
          <div className="rounded-2xl border border-red-400/10 bg-red-500/5 p-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10">
              <Hash size={22} className="text-red-400" />
            </div>

            <p className="text-sm text-red-400">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={fetchTags}
              className="mt-5 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty — no tags in DB at all */}
        {!isLoading && !errorMessage && tags.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10">
                <Hash size={28} className="text-violet-400" />
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                No tags yet
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Tags are created when questions are posted.
                Ask the first question to get started.
              </p>
            </div>
          </div>
        )}

        {/* Empty — search filtered everything out */}
        {!isLoading && !errorMessage && tags.length > 0 && visibleTags.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
            <Hash size={22} className="mx-auto text-slate-700" />
            <p className="mt-3 text-sm text-slate-500">
              No tags match &ldquo;{searchQuery}&rdquo;.
            </p>
          </div>
        )}

        {/* Tags grid */}
        {!isLoading && !errorMessage && visibleTags.length > 0 && (
          <>
            <p className="mb-4 text-xs text-slate-600">
              {visibleTags.length} tag{visibleTags.length !== 1 ? "s" : ""}
            </p>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {visibleTags.map((tag) => (
                <button
                  key={tag.name}
                  type="button"
                  onClick={() => handleTagClick(tag.name)}
                  className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:-translate-y-0.5 hover:border-violet-400/30 hover:bg-white/[0.06]"
                >
                  {/* Tag name */}
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-violet-400/20 bg-violet-500/10 px-2.5 py-1 text-sm font-medium text-violet-300">
                    <Hash size={12} />
                    {tag.name}
                  </span>

                  {/* Question count */}
                  <p className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-300">
                      {tag.count}
                    </span>{" "}
                    {tag.count === 1 ? "question" : "questions"}
                  </p>
                </button>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Tags;