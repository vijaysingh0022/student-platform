import React, { useState, useEffect } from 'react';
import {
  X,
  History,
  TrendingUp,
  Trash2,
  Eye,
  Calendar,
  Award,
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { getMockInterviewHistory, deleteMockInterview } from '../../services/api';

export default function InterviewHistoryModal({
  isOpen,
  onClose,
  onSelectInterview
}) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await getMockInterviewHistory();
      if (res.data?.success) {
        setHistory(res.data.interviews || []);
      }
    } catch (err) {
      console.error('Failed to load interview history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this interview record?')) return;
    setDeletingId(id);
    try {
      await deleteMockInterview(id);
      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Failed to delete interview:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  // Calculate score trend
  const completedInterviews = history
    .filter((h) => h.status === 'completed' && h.overallScore)
    .reverse();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div
        className="relative w-full max-w-3xl my-8 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Interview History & Telemetry</h3>
              <p className="text-xs text-slate-500">
                Track your scoring trajectory, past evaluations, and diagnostic replay.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trend summary banner if history >= 2 */}
        {completedInterviews.length >= 2 && (
          <div className="px-6 py-3.5 bg-gradient-to-r from-indigo-50 via-blue-50/50 to-white border-b border-indigo-100/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-950">Performance Trajectory:</span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                {completedInterviews.map((item, idx) => (
                  <React.Fragment key={item._id}>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-indigo-200/80 font-mono">
                      {item.overallScore}
                    </span>
                    {idx < completedInterviews.length - 1 && (
                      <span className="text-slate-400">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              +14% Monthly Velocity
            </span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto"></div>
              <p className="text-xs text-slate-500 font-medium">Retrieving verified interview records...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="py-16 text-center space-y-3 max-w-sm mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">No Mock Interviews Completed Yet</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Complete your first mock interview to unlock interview intelligence, scoring history, and skill telemetry.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => {
                const dateStr = item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  : 'Recent';

                return (
                  <div
                    key={item._id}
                    onClick={() => {
                      onSelectInterview(item);
                      onClose();
                    }}
                    className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all cursor-pointer flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-indigo-100 text-slate-700 group-hover:text-indigo-700 flex flex-col items-center justify-center shrink-0 transition-colors">
                        <span className="text-xs font-bold">{item.overallScore || 0}</span>
                        <span className="text-[9px] uppercase font-semibold text-slate-400">PTS</span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 capitalize truncate">
                            {item.interviewType?.replace('-', ' ')} Interview
                          </h4>
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {item.difficulty || 'Intermediate'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{item.targetRole || 'Software Engineer'}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {dateStr}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => handleDelete(item._id, e)}
                        disabled={deletingId === item._id}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                        View Report
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Privacy-first: audio is not permanently stored.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
