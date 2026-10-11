import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

import {
  ArrowLeft,
  CheckCircle2,
  MessageSquare,
  Send,
  ThumbsDown,
  ThumbsUp,
  User,
} from "lucide-react";

import {
  getQuestionById,
  upvoteQuestion,
  downvoteQuestion,
} from "@/services/questionService";

import {
  createAnswer,
  getAnswers,
  upvoteAnswer,
  downvoteAnswer,
  acceptAnswer,
} from "@/services/answerService";

function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();

  // --------------------------------
  // Question state
  // --------------------------------

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // --------------------------------
  // Answer state
  // --------------------------------

  const [answers, setAnswers] = useState([]);
  const [answersLoading, setAnswersLoading] = useState(true);
  const [answersError, setAnswersError] = useState("");

  // --------------------------------
  // Answer form state
  // --------------------------------

  const [answerContent, setAnswerContent] = useState("");
  const [answerSubmitting, setAnswerSubmitting] = useState(false);
  const [answerSubmitError, setAnswerSubmitError] = useState("");

  // --------------------------------
  // Fetch question
  // --------------------------------

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getQuestionById(id);

      console.log("QUESTION DETAIL DATA:", data);

      setQuestion(data.question);
    } catch (error) {
      console.error("Failed to fetch question:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to load question."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // Fetch answers
  // --------------------------------

  const fetchAnswers = async () => {
    try {
      setAnswersLoading(true);
      setAnswersError("");

      const data = await getAnswers(id);

      setAnswers(data.answers || []);
    } catch (error) {
      console.error("Failed to fetch answers:", error);

      setAnswersError(
        error.response?.data?.message ||
          "Failed to load answers."
      );
    } finally {
      setAnswersLoading(false);
    }
  };

  // --------------------------------
  // Question voting
  // --------------------------------

  const handleQuestionVote = async (type) => {
    try {
      setErrorMessage("");

      if (type === "upvote") {
        await upvoteQuestion(id);
      } else {
        await downvoteQuestion(id);
      }

      await fetchQuestion();
    } catch (error) {
      console.error("Failed to vote on question:", error);

      if (error.response?.status === 401) {
        setErrorMessage(
          "You must be logged in to vote."
        );
      } else {
        setErrorMessage(
          error.response?.data?.message ||
            "Failed to vote on question."
        );
      }
    }
  };

  // --------------------------------
  // Submit answer
  // --------------------------------

  const handleSubmitAnswer = async (event) => {
    event.preventDefault();

    setAnswerSubmitError("");

    const trimmedAnswer = answerContent.trim();

    if (!trimmedAnswer) {
      setAnswerSubmitError(
        "Please write an answer before submitting."
      );
      return;
    }

    try {
      setAnswerSubmitting(true);

      await createAnswer(id, trimmedAnswer);

      setAnswerContent("");

      await fetchAnswers();
    } catch (error) {
      console.error(
        "Failed to submit answer:",
        error
      );

      if (error.response?.status === 401) {
        setAnswerSubmitError(
          "You must be logged in to post an answer."
        );
      } else {
        setAnswerSubmitError(
          error.response?.data?.message ||
            "Failed to submit answer. Please try again."
        );
      }
    } finally {
      setAnswerSubmitting(false);
    }
  };

  // --------------------------------
  // Answer voting
  // --------------------------------

  const handleAnswerVote = async (answerId, type) => {
    try {
      setAnswersError("");

      if (type === "upvote") {
        await upvoteAnswer(answerId);
      } else {
        await downvoteAnswer(answerId);
      }

      await fetchAnswers();
    } catch (error) {
      console.error(
        "Failed to vote on answer:",
        error
      );

      if (error.response?.status === 401) {
        setAnswersError(
          "You must be logged in to vote."
        );
      } else {
        setAnswersError(
          error.response?.data?.message ||
            "Failed to vote on answer."
        );
      }
    }
  };

  // --------------------------------
  // Accept answer
  // --------------------------------

  const handleAcceptAnswer = async (answerId) => {
    try {
      setAnswersError("");

      await acceptAnswer(answerId);

      await fetchQuestion();
      await fetchAnswers();
    } catch (error) {
      console.error(
        "Failed to accept answer:",
        error
      );

      if (error.response?.status === 401) {
        setAnswersError(
          "You must be logged in to accept an answer."
        );
      } else {
        setAnswersError(
          error.response?.data?.message ||
            "Failed to accept answer."
        );
      }
    }
  };

  // --------------------------------
  // Initial data loading
  // --------------------------------

  useEffect(() => {
    if (!id) {
      return;
    }

    fetchQuestion();
    fetchAnswers();
  }, [id]);

  // --------------------------------
  // Loading state
  // --------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] px-6 py-12 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-24 rounded bg-white/10" />

            <div className="h-10 w-3/4 rounded bg-white/10" />

            <div className="h-32 rounded-2xl bg-white/5" />

            <div className="h-20 rounded-2xl bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------
  // Question error
  // --------------------------------

  if (errorMessage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-white">
        <div className="w-full max-w-lg rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <h1 className="text-xl font-semibold">
            Unable to load question
          </h1>

          <p className="mt-3 text-sm text-zinc-400">
            {errorMessage}
          </p>

          <button
            type="button"
            onClick={() => navigate("/questions")}
            className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Back to Questions
          </button>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <p className="text-zinc-400">
          Question not found.
        </p>
      </div>
    );
  }

  const isQuestionAuthor =
    user?.id &&
    question?.author?._id &&
    String(user.id) === String(question.author._id);

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* Background glow */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-200px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[140px]" />
      </div>

      {/* Main content */}

      <main className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">

        {/* Back */}

        <Link
          to="/questions"
          className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />

          Back to Questions
        </Link>

        {/* ============================== */}
        {/* Question */}
        {/* ============================== */}

        <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/20 sm:p-6 md:p-8">

          {/* Question header */}

          <div className="border-b border-white/10 pb-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

              <div className="min-w-0 flex-1">

                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {question.title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-500">

                  <span>
                    Asked by{" "}
                    <span className="text-zinc-300">
                      {question.author?.name ||
                        "Unknown user"}
                    </span>
                  </span>

                  <span>
                    @
                    {question.author?.username ||
                      "unknown"}
                  </span>

                  <span>
                    {question.views || 0} views
                  </span>

                </div>

              </div>

              <Link
                to="/questions/ask"
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Ask Question
              </Link>

            </div>
          </div>

          {/* Question body */}

          <div className="py-8">

            <div className="flex flex-col gap-6 md:flex-row">

              {/* Question vote area */}

              <div className="flex shrink-0 flex-row items-center gap-3 md:flex-col">

                <button
                  type="button"
                  onClick={() =>
                    handleQuestionVote("upvote")
                  }
                  aria-label="Upvote question"
                  className="rounded-xl border border-white/10 p-3 text-zinc-400 transition hover:border-indigo-500/40 hover:text-indigo-400"
                >
                  <ThumbsUp size={20} />
                </button>

                <span className="min-w-[30px] text-center text-lg font-semibold">
                  {(question.upvotes?.length || 0) -
                    (question.downvotes?.length || 0)}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    handleQuestionVote("downvote")
                  }
                  aria-label="Downvote question"
                  className="rounded-xl border border-white/10 p-3 text-zinc-400 transition hover:border-red-500/40 hover:text-red-400"
                >
                  <ThumbsDown size={20} />
                </button>

              </div>

              {/* Description */}

              <div className="min-w-0 flex-1">

                <p className="whitespace-pre-wrap text-[15px] leading-8 text-zinc-300">
                  {question.description}
                </p>

                {/* Tags */}

                {question.tags?.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-2">

                    {question.tags.map(
                      (tag, index) => (
                        <span
                          key={`${tag}-${index}`}
                          className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300"
                        >
                          {tag}
                        </span>
                      )
                    )}

                  </div>
                )}

                {/* Author */}

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-indigo-500/10 text-indigo-400">

                      {question.author?.profilePic ? (
                        <img
                          src={question.author.profilePic}
                          alt={
                            question.author.name ||
                            "User"
                          }
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <User size={18} />
                      )}

                    </div>

                    <div>

                      <p className="text-sm font-medium text-white">
                        {question.author?.name ||
                          "Unknown user"}
                      </p>

                      <p className="text-xs text-zinc-500">
                        @
                        {question.author?.username ||
                          "unknown"}
                      </p>

                    </div>

                  </div>

                  <div className="text-right text-xs text-zinc-500">

                    <p>
                      {(question.upvotes?.length || 0) -
                        (question.downvotes?.length || 0)}{" "}
                      votes
                    </p>

                    <p className="mt-1">
                      {question.views || 0} views
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </article>

        {/* ============================== */}
        {/* Your Answer */}
        {/* ============================== */}

        <section className="mt-10">

          <div className="mb-4 flex items-center gap-3">

            <MessageSquare
              size={20}
              className="text-indigo-400"
            />

            <h2 className="text-xl font-semibold">
              Your Answer
            </h2>

          </div>

          <form
            onSubmit={handleSubmitAnswer}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6"
          >

            {answerSubmitError && (
              <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {answerSubmitError}
              </div>
            )}

            <textarea
              value={answerContent}
              onChange={(event) =>
                setAnswerContent(event.target.value)
              }
              placeholder="Write a helpful answer..."
              rows={8}
              disabled={answerSubmitting}
              className="w-full resize-y rounded-xl border border-white/10 bg-black/30 px-4 py-4 text-sm leading-7 text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-xs text-zinc-500">
                Be clear, helpful, and constructive.
              </p>

              <button
                type="submit"
                disabled={
                  answerSubmitting ||
                  !answerContent.trim()
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={16} />

                {answerSubmitting
                  ? "Posting..."
                  : "Post Answer"}
              </button>

            </div>

          </form>

        </section>

        {/* ============================== */}
        {/* Answers */}
        {/* ============================== */}

        <section className="mt-10">

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-xl font-semibold">
              {answers.length}{" "}
              {answers.length === 1
                ? "Answer"
                : "Answers"}
            </h2>

          </div>

          {/* Answers loading */}

          {answersLoading && (
            <div className="space-y-4">

              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="h-4 w-3/4 rounded bg-white/10" />

                  <div className="mt-4 h-4 w-full rounded bg-white/10" />

                  <div className="mt-2 h-4 w-2/3 rounded bg-white/10" />
                </div>
              ))}

            </div>
          )}

          {/* Answers error */}

          {!answersLoading &&
            answersError && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">

                <p className="text-sm text-red-300">
                  {answersError}
                </p>

                <button
                  type="button"
                  onClick={fetchAnswers}
                  className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200"
                >
                  Try Again
                </button>

              </div>
            )}

          {/* No answers */}

          {!answersLoading &&
            !answersError &&
            answers.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">

                <MessageSquare
                  size={32}
                  className="mx-auto text-zinc-600"
                />

                <h3 className="mt-4 text-lg font-semibold">
                  No answers yet
                </h3>

                <p className="mt-2 text-sm text-zinc-500">
                  Be the first developer to answer
                  this question.
                </p>

              </div>
            )}

          {/* Answer list */}

          {!answersLoading &&
            !answersError &&
            answers.length > 0 && (
              <div className="space-y-4">

                {answers.map((answer) => (
                  <article
                    key={answer._id}
                    className={`rounded-2xl border p-6 transition ${
                      answer.isAccepted
                        ? "border-emerald-500/30 bg-emerald-500/[0.04]"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
                  >

                    {/* Accepted badge */}

                    {answer.isAccepted && (
                      <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">

                        <CheckCircle2 size={15} />

                        Accepted Answer

                      </div>
                    )}

                    <div className="flex flex-col gap-5 sm:flex-row">

                      {/* Answer voting */}

                      <div className="flex shrink-0 flex-row items-center gap-3 sm:flex-col">

                        <button
                          type="button"
                          onClick={() =>
                            handleAnswerVote(
                              answer._id,
                              "upvote"
                            )
                          }
                          aria-label="Upvote answer"
                          className="rounded-lg border border-white/10 p-2 text-zinc-500 transition hover:border-indigo-500/40 hover:text-indigo-400"
                        >
                          <ThumbsUp size={17} />
                        </button>

                        <span className="min-w-[24px] text-center text-sm font-semibold text-zinc-300">
                          {(answer.upvotes?.length || 0) -
                            (answer.downvotes?.length || 0)}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleAnswerVote(
                              answer._id,
                              "downvote"
                            )
                          }
                          aria-label="Downvote answer"
                          className="rounded-lg border border-white/10 p-2 text-zinc-500 transition hover:border-red-500/40 hover:text-red-400"
                        >
                          <ThumbsDown size={17} />
                        </button>

                        {/* Accept Answer */}

                        {isQuestionAuthor &&
                          !answer.isAccepted && (
                            <button
                              type="button"
                              onClick={() =>
                                handleAcceptAnswer(
                                  answer._id
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20"
                            >
                              <CheckCircle2 size={15} />

                              Accept
                            </button>
                          )}

                      </div>

                      {/* Answer content */}

                      <div className="min-w-0 flex-1">

                        <p className="whitespace-pre-wrap text-[15px] leading-8 text-zinc-300">
                          {answer.content}
                        </p>

                        {/* Answer author */}

                        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-indigo-500/10 text-indigo-400">

                              {answer.author?.profilePic ? (
                                <img
                                  src={
                                    answer.author.profilePic
                                  }
                                  alt={
                                    answer.author.name ||
                                    "User"
                                  }
                                  className="h-9 w-9 rounded-full object-cover"
                                />
                              ) : (
                                <User size={16} />
                              )}

                            </div>

                            <div>

                              <p className="text-sm font-medium text-white">
                                {answer.author?.name ||
                                  "Unknown user"}
                              </p>

                              <p className="text-xs text-zinc-500">
                                @
                                {answer.author?.username ||
                                  "unknown"}
                              </p>

                            </div>

                          </div>

                          <div className="text-right text-xs text-zinc-500">

                            <p>
                              {(answer.upvotes?.length || 0) -
                                (answer.downvotes?.length || 0)}{" "}
                              votes
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                  </article>
                ))}

              </div>
            )}

        </section>

      </main>

    </div>
  );
}

export default QuestionDetail;