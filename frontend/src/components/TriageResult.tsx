'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Stethoscope, 
  PhoneCall, 
  RefreshCcw,
  AlertCircle,
  ChevronRight,
  Activity,
  Shield,
  MapPin,
  Brain,
  TrendingUp
} from 'lucide-react';
import { TriageResponse } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface TriageResultProps {
  result: TriageResponse;
  onReset: () => void;
}

const URGENCY_CONFIG = {
  'self-care': {
    color: 'bg-emerald-500',
    gradient: 'from-emerald-500 to-teal-600',
    icon: CheckCircle2,
    label: 'Self-Care at Home',
    textColor: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    ringColor: 'ring-emerald-500/20',
    glowColor: 'shadow-emerald-200'
  },
  'clinic': {
    color: 'bg-amber-500',
    gradient: 'from-amber-500 to-orange-500',
    icon: Stethoscope,
    label: 'Consult a Doctor',
    textColor: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    ringColor: 'ring-amber-500/20',
    glowColor: 'shadow-amber-200'
  },
  'er': {
    color: 'bg-orange-500',
    gradient: 'from-orange-500 to-red-500',
    icon: AlertTriangle,
    label: 'Go to Urgent Care / ER',
    textColor: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    ringColor: 'ring-orange-500/20',
    glowColor: 'shadow-orange-200'
  },
  'emergency': {
    color: 'bg-red-600',
    gradient: 'from-red-600 to-rose-700',
    icon: PhoneCall,
    label: 'EMERGENCY — CALL 911',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    ringColor: 'ring-red-500/30',
    glowColor: 'shadow-red-200'
  }
};

const LIKELIHOOD_STYLE = {
  High: 'bg-red-100 text-red-700 border-red-200',
  Moderate: 'bg-amber-100 text-amber-700 border-amber-200',
  Low: 'bg-slate-100 text-slate-600 border-slate-200'
};

export default function TriageResult({ result, onReset }: TriageResultProps) {
  const router = useRouter();
  const config = URGENCY_CONFIG[result.urgency_level] || URGENCY_CONFIG['self-care'];
  const Icon = config.icon;
  const confidence = result.confidence_level ?? 0.75;

  const handleBookClick = () => {
    const params = new URLSearchParams({
      symptoms: result.summary,
      score: result.urgency_score.toString(),
      explanation: result.explanation,
      book: 'true'
    });
    router.push(`/dashboard/patient?${params.toString()}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-3xl mx-auto space-y-6 pb-20"
    >
      {/* === URGENCY HEADER === */}
      <div className={`relative p-8 rounded-3xl border-2 ${config.bgColor} ${config.borderColor} shadow-lg ${config.glowColor} overflow-hidden`}>
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />

        <div className="relative flex flex-col items-center text-center gap-5">
          <div className={`p-4 bg-gradient-to-br ${config.gradient} rounded-2xl text-white shadow-xl ring-4 ${config.ringColor}`}>
            <Icon size={36} strokeWidth={2.5} />
          </div>
          
          <div className="space-y-1">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${config.textColor} opacity-70`}>
              AI Triage Classification
            </span>
            <h2 className={`text-3xl font-black ${config.textColor}`}>
              {result.classification || config.label}
            </h2>
          </div>

          {/* Severity Gauge */}
          <div className="w-full max-w-xs mx-auto mt-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span>Low Risk</span>
              <span>Critical</span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${result.urgency_score * 10}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full bg-gradient-to-r ${config.gradient} rounded-full`}
              />
            </div>
            <div className="text-center mt-2">
              <span className={`text-2xl font-black ${config.textColor}`}>{result.urgency_score}</span>
              <span className="text-sm font-bold text-slate-400">/10</span>
            </div>
          </div>

          <p className="text-slate-700 text-lg leading-relaxed max-w-lg font-semibold">
            {result.summary}
          </p>
        </div>
      </div>

      {/* === AI CONFIDENCE + FACILITY ROW === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* AI Confidence */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={16} className="text-indigo-500" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">AI Confidence</span>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-black text-slate-900">{Math.round(confidence * 100)}%</span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${confidence * 100}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-1">
            {confidence >= 0.8 ? 'High confidence — clear symptom pattern' : confidence >= 0.6 ? 'Moderate confidence — more info may refine' : 'Low confidence — please provide more detail'}
          </p>
        </div>

        {/* Recommended Facility */}
        {result.recommended_facility_type && (
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-teal-500" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">Recommended Facility</span>
            </div>
            <p className="text-lg font-bold text-slate-800 leading-snug">
              {result.recommended_facility_type}
            </p>
            <p className="text-[11px] text-slate-400 font-medium mt-2">
              Based on urgency level and Philippine DOH guidelines
            </p>
          </div>
        )}
      </div>

      {/* === CLINICAL REASONING === */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Activity className="text-teal-500" size={20} />
          Clinical Assessment
        </h3>
        <p className="text-slate-600 leading-relaxed font-medium">
          {result.explanation}
        </p>
      </div>

      {/* === DIFFERENTIAL DIAGNOSIS === */}
      {result.differential_diagnosis && result.differential_diagnosis.length > 0 && (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="text-indigo-500" size={20} />
            Differential Diagnosis
            <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider ml-auto">AI Analysis</span>
          </h3>
          <div className="space-y-4">
            {result.differential_diagnosis.map((dx, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className="flex gap-4 p-4 bg-slate-50/80 rounded-2xl border border-slate-100"
              >
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <span className="text-2xl font-black text-slate-300">#{i + 1}</span>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${LIKELIHOOD_STYLE[dx.likelihood]}`}>
                    {dx.likelihood}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-bold text-slate-800">{dx.condition}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed mt-1">{dx.reasoning}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* === RED FLAGS === */}
      {result.red_flags && result.red_flags.length > 0 && (
        <div className="bg-red-50 rounded-3xl p-6 border border-red-100 shadow-sm">
          <h3 className="text-sm font-black text-red-700 mb-4 flex items-center gap-2 uppercase tracking-wider">
            <Shield className="text-red-500" size={18} />
            Red Flags — Seek Immediate Help If You Experience
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.red_flags.map((flag, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 rounded-xl text-sm font-bold text-red-700"
              >
                <AlertCircle size={14} />
                {flag}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* === NEXT STEPS === */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <CheckCircle2 className="text-teal-500" size={20} />
          Recommended Next Steps
        </h3>
        <ul className="space-y-3">
          {(result.next_steps || []).map((action, i) => (
            <motion.li 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl"
            >
              <div className="mt-0.5 w-6 h-6 rounded-lg bg-teal-500 text-white flex items-center justify-center shrink-0 text-xs font-black">
                {i + 1}
              </div>
              <span className="text-slate-600 font-medium">{action}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* === LONGITUDINAL PATTERN ALERT === */}
      {result.pattern_detected && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-50 rounded-3xl p-8 border border-indigo-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <RefreshCcw size={20} />
            </div>
            <h3 className="text-lg font-bold text-indigo-900">Longitudinal Pattern Detected</h3>
          </div>
          <p className="text-indigo-700 font-medium leading-relaxed">
            {result.pattern_description || "Our AI detected a recurring pattern in your recent health reports. Persistent symptoms may indicate an underlying condition that requires specific medical attention."}
          </p>
          <div className="mt-4 p-4 bg-white/60 rounded-xl border border-indigo-100/50">
            <p className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.15em]">Intelligence System Action</p>
            <p className="text-indigo-800 text-sm font-bold mt-1">Urgency score has been automatically escalated based on symptom persistence analysis.</p>
          </div>
        </motion.div>
      )}

      {/* === DISCLAIMER === */}
      <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200">
        <p className="text-slate-500 text-xs font-medium text-center">
          <span className="font-bold">Disclaimer:</span> This is an AI-powered triage classification, not a medical diagnosis. 
          If you feel your condition is critical, seek professional medical help immediately regardless of this result.
        </p>
      </div>

      {/* === FOOTER ACTIONS === */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onReset}
          className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
        >
          <RefreshCcw size={18} />
          New Assessment
        </button>
        <button
          onClick={handleBookClick}
          className="flex-1 py-4 bg-teal-600 text-white font-bold rounded-2xl hover:bg-teal-700 transition-all shadow-xl shadow-teal-100 flex items-center justify-center gap-2 group"
        >
          Book Appointment
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
