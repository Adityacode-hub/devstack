import {
  Activity,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  MessageSquare,
  ThumbsUp,
  Eye,
} from "lucide-react";
import { useState } from "react";

function ActivityTabs({
  questions = [],
  answers = [],
}) {
  const [activeTab, setActiveTab] = useState("questions");

  const acceptedAnswers = answers.filter((a) => a.isAccepted);

  // Combined chronological feed for the Activity tab
  const activityFeed = [
    ...questions.map((q) => ({ ...q, _type: "question" })),
    ...answers.map((a) => ({ ...a, _type: "answer" })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const tabs = [
    {
      id: "questions",
      label: "Questions",
      icon: HelpCircle,
      count: questions.length,
    },
    {
      id: "answers",
      label: "Answers",
      icon: MessageSquare,
      count: answers.length,
    },
    {
      id: "accepted",
      label: "Accepted",
      icon: CheckCircle2,
      count: acceptedAnswers.length,
    },
    {
      id: "activity",
      label: "Activity",
      icon: Activity,
      count: activityFeed.length,
    },
  ];

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">

      {/* Tab bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-white/10 text-white"
                  : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-300"
              }`}
            >
              <Icon size={16} />
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-white/[0.06] text-slate-500"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="pt-6">

        {activeTab === "questions" && (
          <QuestionList
            items={questions}
            empty="No questions asked yet."
          />
        )}

        {activeTab === "answers" && (
          <AnswerList
            items={answers}
            empty="No answers posted yet."
          />
        )}

        {activeTab === "accepted" && (
          <AnswerList
            items={acceptedAnswers}
            empty="No accepted answers yet."
          />
        )}

        {activeTab === "activity" && (
          <ActivityFeed
            items={activityFeed}
            empty="No activity yet."
          />
        )}

      </div>
    </section>
  );
}

/* Question card */
function QuestionList({ items, empty }) {
  if (!items.length) {
    return <EmptyState message={empty} icon={HelpCircle} />;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item._id}
          className="group rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/20 hover:bg-white/[0.04]"
        >
          {/* Title */}
          <p className="font-medium text-white leading-snug">
            {item.title}
          </p>

          {/* Tags */}
          {item.tags?.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg border border-indigo-400/20 bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Meta row */}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <ThumbsUp size={11} />
              {(item.upvotes?.length ?? 0) - (item.downvotes?.length ?? 0)} votes
            </span>

            <span className="flex items-center gap-1">
              <Eye size={11} />
              {item.views ?? 0} views
            </span>

            <span className="ml-auto">
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* Answer card */
function AnswerList({ items, empty }) {
  if (!items.length) {
    return <EmptyState message={empty} icon={MessageSquare} />;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item._id}
          className="group rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/20 hover:bg-white/[0.04]"
        >
          {/* Parent question title */}
          {item.question?.title && (
            <div className="mb-2.5 flex items-center gap-1.5 text-xs text-slate-500">
              <HelpCircle size={11} className="shrink-0" />
              <span className="line-clamp-1">{item.question.title}</span>
              <ChevronRight size={11} className="shrink-0" />
            </div>
          )}

          {/* Answer content */}
          <p className="line-clamp-3 text-sm leading-relaxed text-slate-300">
            {item.content}
          </p>

          {/* Meta row */}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            {item.isAccepted && (
              <span className="flex items-center gap-1 font-medium text-emerald-400">
                <CheckCircle2 size={11} />
                Accepted
              </span>
            )}

            <span className="flex items-center gap-1">
              <ThumbsUp size={11} />
              {(item.upvotes?.length ?? 0) - (item.downvotes?.length ?? 0)} votes
            </span>

            <span className="ml-auto">
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* Combined chronological activity feed */
function ActivityFeed({ items, empty }) {
  if (!items.length) {
    return <EmptyState message={empty} icon={Activity} />;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isQuestion = item._type === "question";

        return (
          <div
            key={`${item._type}-${item._id}`}
            className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/20 hover:bg-white/[0.04]"
          >
            {/* Type indicator */}
            <div
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                isQuestion
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "bg-emerald-500/10 text-emerald-400"
              }`}
            >
              {isQuestion
                ? <HelpCircle size={13} />
                : <MessageSquare size={13} />}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-600">
                {isQuestion ? "Asked a question" : "Posted an answer"}
              </p>

              <p className="mt-0.5 line-clamp-2 text-sm font-medium text-white">
                {isQuestion ? item.title : item.content}
              </p>

              {/* For answers: show parent question */}
              {!isQuestion && item.question?.title && (
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <HelpCircle size={10} />
                  {item.question.title}
                </p>
              )}
            </div>

            <span className="shrink-0 text-xs text-slate-600">
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* Shared empty state */
function EmptyState({ message, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
      <Icon size={22} className="mx-auto text-slate-700" />
      <p className="mt-3 text-sm text-slate-500">{message}</p>
    </div>
  );
}

export default ActivityTabs;
