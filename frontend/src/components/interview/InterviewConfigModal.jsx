import React, { useState } from 'react';
import {
  X,
  Sliders,
  Briefcase,
  Building2,
  UserCheck,
  Flame,
  Clock,
  Sparkles,
  Zap,
  ShieldAlert,
  BrainCircuit,
  ArrowRight
} from 'lucide-react';

const TARGET_ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
  'Software Intern'
];

const COMPANY_STYLES = [
  { id: 'startup', label: 'Fast-Paced Startup', desc: 'Focuses on practical velocity, broad tech stack, & ownership.' },
  { id: 'product', label: 'Product Company', desc: 'Balances deep system architecture, clean design, & reliability.' },
  { id: 'service', label: 'Global Tech Services', desc: 'Standardized CS fundamentals, client communication, & frameworks.' },
  { id: 'faang', label: 'Tier-1 / FAANG-Style', desc: 'Rigorous algorithmic depth, edge cases, & scalable systems.' }
];

const PERSONALITIES = [
  { id: 'professional', name: 'Dr. Sarah Vance', role: 'Professional & Direct', desc: 'Objective, calm, evaluates structured thinking.' },
  { id: 'friendly', name: 'Alex Rivera', role: 'Encouraging & Collaborative', desc: 'Guides with conversational hints, reduces anxiety.' },
  { id: 'strict', name: 'Marcus Chen', role: 'Strict & Inquisitive', desc: 'Probes every vague claim, rigorously checks edge cases.' },
  { id: 'technical', name: 'Priya Sharma', role: 'Deep Architecture & Systems', desc: 'Zeroes in on low-level internals, OS & memory tradeoffs.' },
  { id: 'faang', name: 'Devon Ward', role: 'FAANG Bar Raiser', desc: 'Demands optimal space-time bounds and clean abstraction.' },
  { id: 'hr', name: 'Elena Rostova', role: 'HR & Behavioral Specialist', desc: 'Focuses on STAR framework, team conflict, & cultural alignment.' }
];

export default function InterviewConfigModal({
  isOpen,
  onClose,
  initialType = 'technical',
  onStartInterview
}) {
  const [interviewType, setInterviewType] = useState(initialType);
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [companyStyle, setCompanyStyle] = useState('product');
  const [personality, setPersonality] = useState('professional');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [pressureLevel, setPressureLevel] = useState('medium');
  const [useProfile, setUseProfile] = useState(true);
  const [language, setLanguage] = useState('python');

  if (!isOpen) return null;

  const handleLaunch = () => {
    onStartInterview({
      interviewType,
      targetRole,
      companyStyle,
      personality,
      difficulty,
      durationMinutes: Number(durationMinutes),
      pressureLevel,
      useProfile,
      language
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div 
        className="relative w-full max-w-3xl my-8 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Advanced Interview Simulator Config</h3>
              <p className="text-xs text-slate-500">Fine-tune the interview persona, company simulation, and adaptive rules.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          
          {/* LearnX Profile Adaptive Sync Banner */}
          <div className={`p-4 rounded-xl border transition-all ${
            useProfile 
              ? 'bg-gradient-to-r from-indigo-50/80 via-blue-50/50 to-slate-50 border-indigo-200/80' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  useProfile ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-200 text-slate-500'
                }`}>
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    Use My LearnX Skill Intelligence
                    {useProfile && (
                      <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                        Active Telemetry
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Dynamically queries your Skill Graph, weak concepts (e.g. OS Deadlocks), quiz accuracy, and coding attempts to tailor real probing questions.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={useProfile}
                  onChange={(e) => setUseProfile(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>

          {/* Target Role & Language */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                Target Engineering Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {TARGET_ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-slate-400" />
                Preferred Code Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="python">Python 3 (Recommended)</option>
                <option value="javascript">JavaScript (Node / ES6)</option>
                <option value="java">Java 17 (Standard)</option>
                <option value="cpp">C++ (STL / GCC)</option>
              </select>
            </div>
          </div>

          {/* Company Style Simulation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Company Style Simulation
              </label>
              <span className="text-[11px] text-slate-400 italic">Simulated stylistic rubrics; not affiliated with any company</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {COMPANY_STYLES.map((c) => {
                const isSelected = companyStyle === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setCompanyStyle(c.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${isSelected ? 'text-indigo-950' : 'text-slate-800'}`}>
                        {c.label}
                      </span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-600"></span>}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {c.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interviewer Personality */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              Interviewer Personality & Evaluation Rigor
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {PERSONALITIES.map((p) => {
                const isSelected = personality === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setPersonality(p.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-slate-900">{p.name}</h5>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>}
                    </div>
                    <p className="text-[11px] font-medium text-indigo-600 mt-0.5">{p.role}</p>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                      {p.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Difficulty, Duration, Pressure Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            {/* Difficulty */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Base Difficulty
              </label>
              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`flex-1 py-1.5 text-xs font-semibold capitalize rounded-lg transition-all ${
                      difficulty === lvl
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Target Duration
              </label>
              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                {[15, 30, 45].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDurationMinutes(mins)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      durationMinutes === mins
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Pressure Mode */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Interview Pressure
              </label>
              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                {['low', 'medium', 'high'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setPressureLevel(lvl)}
                    className={`flex-1 py-1.5 text-xs font-semibold capitalize rounded-lg transition-all ${
                      pressureLevel === lvl
                        ? lvl === 'high'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {pressureLevel === 'high' && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                <span className="font-semibold">Realistic Pressure Active:</span> Strict time countdown per question, deeper counter-factual follow-up probing, and reduced hints.
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleLaunch}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all"
          >
            Launch Interview Simulator
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
