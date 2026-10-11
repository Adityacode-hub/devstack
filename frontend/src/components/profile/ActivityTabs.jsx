import {
  Activity,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";

function ActivityTabs({
  questions = [],
  answers = [],
}) {
  const [activeTab, setActiveTab] = useState("questions");

  const tabs = [
    {
      id: "questions",
      label: "Questions",
      icon: HelpCircle,
    },
    {
      id: "answers",
      label: "Answers",
      icon: MessageSquare,
    },
    {
      id: "activity",
      label: "Activity",
      icon: Activity,
    },
  ];

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">

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
            </button>
          );
        })}
      </div>

      <div className="pt-6">

        {activeTab === "questions" && (
          <ActivityList
            items={questions}
            empty="No questions asked yet."
            type="question"
          />
        )}

        {activeTab === "answers" && (
          <ActivityList
            items={answers}
            empty="No answers posted yet."
            type="answer"
          />
        )}

        {activeTab === "activity" && (
          <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
            <Activity
              size={24}
              className="mx-auto text-slate-600"
            />

            <p className="mt-3 text-sm text-slate-500">
              Recent activity will appear here.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}

function ActivityList({
  items,
  empty,
  type,
}) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
        <p className="text-sm text-slate-500">
          {empty}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item._id}
          className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"
        >
          <p className="font-medium text-white">
            {type === "question"
              ? item.title
              : item.content}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {new Date(item.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ActivityTabs;