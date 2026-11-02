import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Clock, Zap, ArrowRight, RotateCcw } from "lucide-react";

export const TodayFocusEngine = ({ tasks, onToggleTask, onResetTasks }) => {
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = Math.round((completedCount / totalTasks) * 100);

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "Critical":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "High":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Focus":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col justify-between" id="today-engine">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 block">
                DAILY INTELLIGENCE ENGINE
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                ~ 55 min total
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-0.5">
              Today's Focus
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">
              {completedCount} / {totalTasks} Completed
            </span>
            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="divide-y divide-slate-100 pt-1">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`py-3.5 flex items-start justify-between gap-3 group transition-colors ${
                task.completed ? "opacity-75" : ""
              }`}
            >
              {/* Checkbox + Info */}
              <div className="flex items-start gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  className={`w-5 h-5 rounded-lg border transition-all flex items-center justify-center shrink-0 mt-0.5 ${
                    task.completed
                      ? "bg-emerald-500 border-emerald-500 text-white shadow-2xs"
                      : "border-slate-300 bg-white hover:border-indigo-500"
                  }`}
                  aria-label={`Mark task ${task.title} as ${task.completed ? "incomplete" : "complete"}`}
                >
                  {task.completed && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs sm:text-sm font-bold ${
                        task.completed ? "line-through text-slate-400" : "text-slate-900"
                      }`}
                    >
                      {task.title}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${getPriorityBadge(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>

                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <Clock className="w-3 h-3" />
                      {task.timeEstimate}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-snug">
                    <strong className="text-slate-700">Reason:</strong> {task.reason} •{" "}
                    <span className="text-emerald-600 font-semibold">
                      Expected lift: {task.expectedImprovement}
                    </span>
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <Link
                to={task.link}
                className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200/80 text-[11px] font-bold text-slate-700 shrink-0 transition-all flex items-center gap-1 shadow-2xs group-hover:border-indigo-300"
              >
                <span>Action</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Reset & Motivational Note */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Micro-habits compound into placement readiness.</span>
        </span>

        {completedCount > 0 && (
          <button
            type="button"
            onClick={onResetTasks}
            className="text-[11px] text-slate-400 hover:text-slate-700 font-semibold flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Today</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TodayFocusEngine;
