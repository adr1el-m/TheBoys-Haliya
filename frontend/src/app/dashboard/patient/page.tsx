"use client";

import { useAuth } from "@/contexts/AuthContext";
import { API_URL, getHealthSummary, HealthSummary } from "@/lib/api";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Ban,
  Brain,
  Building2,
  Calendar,
  Clock,
  Eye,
  HeartPulse,
  Loader2,
  LogOut,
  Plus,
  RefreshCw,
  Stethoscope,
  X,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

function PatientDashboardContent() {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [viewAppt, setViewAppt] = useState<any | null>(null);
  const [cancelAppt, setCancelAppt] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "confirmed" | "cancelled"
  >("all");
  const [healthSummary, setHealthSummary] = useState<HealthSummary | null>(
    null,
  );

  // Booking Form State
  const [selectedFacility, setSelectedFacility] = useState("");
  const [apptDate, setApptDate] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [triageScore, setTriageScore] = useState<number | null>(null);
  const [triageExplanation, setTriageExplanation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("book") === "true") {
      setShowBooking(true);
      const s = searchParams.get("symptoms");
      const sc = searchParams.get("score");
      const ex = searchParams.get("explanation");
      if (s) setSymptoms(s);
      if (sc) setTriageScore(parseInt(sc));
      if (ex) setTriageExplanation(ex);
    }
  }, [searchParams]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [apptRes, facRes] = await Promise.all([
        fetch(`${API_URL}/appointments/my-appointments`, {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
        fetch(`${API_URL}/appointments/facilities`, {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
      ]);
      if (apptRes.status === 401 || facRes.status === 401) {
        logout();
        return;
      }
      const appts = await apptRes.json();
      const facs = await facRes.json();
      setAppointments(Array.isArray(appts) ? appts : []);
      setFacilities(Array.isArray(facs) ? facs : []);
      // Fetch AI health summary
      const sessionToken = localStorage.getItem("haliya_session_token");
      if (sessionToken) {
        try {
          const hs = await getHealthSummary(sessionToken);
          setHealthSummary(hs);
        } catch {}
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/appointments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          facility_id: selectedFacility,
          appointment_date: apptDate,
          symptoms_summary: symptoms,
          triage_score: triageScore || 5,
          triage_explanation: triageExplanation,
        }),
      });
      if (res.ok) {
        setShowBooking(false);
        setSelectedFacility("");
        setApptDate("");
        setSymptoms("");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelAppt) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${API_URL}/appointments/${cancelAppt.id}/status?status=cancelled`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${user?.token}` },
        },
      );
      if (res.ok) {
        setCancelAppt(null);
        setCancelReason("");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = appointments.filter(
    (a) => activeTab === "all" || a.status === activeTab,
  );
  const pending = appointments.filter((a) => a.status === "pending").length;
  const confirmed = appointments.filter((a) => a.status === "confirmed").length;

  if (loading && appointments.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <RefreshCw className="animate-spin text-teal-600" size={40} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 p-8 hidden lg:flex flex-col gap-8">
        <div className="flex items-center gap-2">
          <div className="bg-teal-600 p-2 rounded-xl text-white">
            <HeartPulse size={20} />
          </div>
          <span className="text-xl font-black tracking-tighter">HALIYA</span>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-50 rounded-2xl p-5 space-y-3 border border-slate-100">
          <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center font-black text-lg">
            {user?.name?.[0]?.toUpperCase() || "P"}
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm">{user?.name}</p>
            <p className="text-[11px] text-slate-400 font-medium">
              Patient Account
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
            <div className="text-center">
              <p className="text-lg font-black text-teal-600">
                {appointments.length}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                Total
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg font-black text-amber-500">{pending}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                Pending
              </p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          <Link
            href="/dashboard/patient"
            className="flex items-center gap-3 p-4 bg-teal-50 text-teal-700 rounded-2xl font-bold"
          >
            <Calendar size={20} />
            Appointments
          </Link>
          <Link
            href="/triage"
            className="flex items-center gap-3 p-4 text-slate-500 hover:bg-slate-50 rounded-2xl font-bold transition-all"
          >
            <Stethoscope size={20} />
            Symptom Checker
          </Link>
          <Link
            href="/history"
            className="flex items-center gap-3 p-4 text-slate-500 hover:bg-slate-50 rounded-2xl font-bold transition-all"
          >
            <Clock size={20} />
            My History
          </Link>
        </nav>
        <button
          onClick={logout}
          className="flex items-center gap-3 p-4 text-red-500 hover:bg-red-50 rounded-2xl font-bold transition-all"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Hello, {user?.name}
            </h1>
            <p className="text-slate-500 font-medium">
              Manage your healthcare journey and appointments.
            </p>
          </div>
          <button
            onClick={() => setShowBooking(true)}
            className="flex items-center gap-2 px-6 py-4 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 transition-all shadow-xl shadow-teal-100"
          >
            <Plus size={20} />
            Book New Appointment
          </button>
        </header>

        {/* AI Health Summary */}
        {healthSummary && healthSummary.report_count > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-100 mb-8 flex flex-col sm:flex-row items-start gap-5"
          >
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shrink-0">
              <Brain size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-indigo-400">
                  AI Health Intelligence
                </p>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${healthSummary.trend === "improving" ? "bg-emerald-100 text-emerald-700" : healthSummary.trend === "worsening" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"}`}
                >
                  {healthSummary.trend === "improving"
                    ? "↑ Improving"
                    : healthSummary.trend === "worsening"
                      ? "↓ Worsening"
                      : "→ Stable"}
                </span>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${healthSummary.risk_level === "high" ? "bg-red-100 text-red-700" : healthSummary.risk_level === "moderate" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}
                >
                  {healthSummary.risk_level} risk
                </span>
              </div>
              <p className="text-indigo-900 font-semibold leading-relaxed text-sm">
                {healthSummary.summary}
              </p>
              <p className="text-indigo-400 text-[11px] font-medium mt-2">
                Based on {healthSummary.report_count} assessment
                {healthSummary.report_count !== 1 ? "s" : ""}
                {healthSummary.top_symptom
                  ? ` • Top concern: ${healthSummary.top_symptom}`
                  : ""}
              </p>
            </div>
          </motion.div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Total
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {appointments.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">
              Pending
            </p>
            <p className="text-2xl font-black text-amber-600 mt-1">{pending}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
              Confirmed
            </p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {confirmed}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Facilities
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {facilities.length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-200/50 p-1 rounded-2xl w-fit mb-6 border border-slate-200">
          {(["all", "pending", "confirmed", "cancelled"] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === tab ? "bg-white text-teal-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                {tab}
              </button>
            ),
          )}
        </div>

        {/* Appointments Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <Calendar size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500 font-medium">
              No {activeTab === "all" ? "" : activeTab} appointments found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((appt) => (
              <motion.div
                key={appt.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <Building2 size={22} />
                  </div>
                  <div className="flex items-center gap-2">
                    {appt.triage_score && (
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-black ${appt.triage_score >= 8 ? "bg-red-100 text-red-700" : appt.triage_score >= 5 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}
                      >
                        {appt.triage_score}/10
                      </span>
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${getStatusStyle(appt.status)}`}
                    >
                      {appt.status}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {appt.facility_name}
                  </h3>
                  {appt.symptoms_summary && (
                    <p className="text-slate-500 text-sm font-medium mt-1 line-clamp-2">
                      {appt.symptoms_summary}
                    </p>
                  )}
                </div>
                <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 font-bold text-slate-600">
                    <Calendar size={14} className="text-teal-500" />
                    {appt.appointment_date
                      ? new Date(appt.appointment_date).toLocaleDateString(
                          "en-PH",
                          { month: "short", day: "numeric", year: "numeric" },
                        )
                      : "Date pending"}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewAppt(appt)}
                      className="p-2 bg-slate-50 text-slate-500 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition-all"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    {appt.status === "pending" && (
                      <button
                        onClick={() => setCancelAppt(appt)}
                        className="p-2 bg-slate-50 text-slate-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                        title="Cancel"
                      >
                        <Ban size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* === VIEW APPOINTMENT MODAL === */}
      <AnimatePresence>
        {viewAppt && (
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
            onClick={() => setViewAppt(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-900">
                  Appointment Details
                </h3>
                <button
                  onClick={() => setViewAppt(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
                  <Building2 className="text-blue-600" size={24} />
                  <div>
                    <p className="font-bold text-slate-800">
                      {viewAppt.facility_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Healthcare Facility
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Date
                    </p>
                    <p className="text-sm font-bold text-slate-800 mt-1">
                      {viewAppt.appointment_date
                        ? new Date(
                            viewAppt.appointment_date,
                          ).toLocaleDateString("en-PH", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })
                        : "Pending"}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Time
                    </p>
                    <p className="text-sm font-bold text-slate-800 mt-1">
                      {viewAppt.appointment_date
                        ? new Date(
                            viewAppt.appointment_date,
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--:--"}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Status
                  </p>
                  <p
                    className={`text-sm font-bold mt-1 capitalize ${viewAppt.status === "confirmed" ? "text-emerald-600" : viewAppt.status === "cancelled" ? "text-red-600" : "text-amber-600"}`}
                  >
                    {viewAppt.status}
                  </p>
                </div>
                {viewAppt.symptoms_summary && (
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Symptoms
                    </p>
                    <p className="text-sm text-slate-700 mt-1 font-medium">
                      {viewAppt.symptoms_summary}
                    </p>
                  </div>
                )}
                {viewAppt.triage_score && (
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      AI Risk Score
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="h-2 flex-1 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${viewAppt.triage_score >= 8 ? "bg-red-500" : viewAppt.triage_score >= 5 ? "bg-amber-500" : "bg-emerald-500"}`}
                          style={{ width: `${viewAppt.triage_score * 10}%` }}
                        />
                      </div>
                      <span className="text-sm font-black text-slate-800">
                        {viewAppt.triage_score}/10
                      </span>
                    </div>
                  </div>
                )}
                {viewAppt.triage_explanation && (
                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <p className="text-[10px] font-black uppercase tracking-wider text-indigo-400">
                      AI Clinical Assessment
                    </p>
                    <p className="text-sm text-indigo-800 mt-1 font-medium leading-relaxed">
                      {viewAppt.triage_explanation}
                    </p>
                  </div>
                )}
              </div>
              {viewAppt.status === "pending" && (
                <button
                  onClick={() => {
                    setViewAppt(null);
                    setCancelAppt(viewAppt);
                  }}
                  className="w-full py-3 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all"
                >
                  Cancel This Appointment
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* === CANCEL MODAL === */}
      <AnimatePresence>
        {cancelAppt && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    Cancel Appointment
                  </h3>
                  <p className="text-sm text-slate-500">
                    {cancelAppt.facility_name}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Why are you cancelling?
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-400 outline-none font-medium text-sm"
                >
                  <option value="">Select a reason</option>
                  <option value="schedule_conflict">Schedule conflict</option>
                  <option value="feeling_better">Feeling better</option>
                  <option value="found_another">Found another facility</option>
                  <option value="financial">Financial reasons</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setCancelAppt(null);
                    setCancelReason("");
                  }}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Go Back
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all disabled:bg-red-300 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>Confirm Cancel</>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* === BOOKING MODAL === */}
      <AnimatePresence>
        {showBooking && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[2rem] p-10 w-full max-w-lg shadow-2xl space-y-8"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-900">
                  Book Appointment
                </h3>
                <button
                  onClick={() => setShowBooking(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleBook} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Select Facility
                  </label>
                  <select
                    required
                    value={selectedFacility}
                    onChange={(e) => setSelectedFacility(e.target.value)}
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none font-medium"
                  >
                    <option value="">Choose a hospital or clinic</option>
                    {facilities.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.location})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Date &amp; Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={apptDate}
                    onChange={(e) => setApptDate(e.target.value)}
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Brief Symptoms
                  </label>
                  <textarea
                    required
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Why are you visiting?"
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none font-medium h-24 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-teal-600 text-white rounded-2xl text-lg font-bold hover:bg-teal-700 transition-all shadow-xl shadow-teal-100 flex items-center justify-center gap-2 group disabled:bg-teal-400"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      Confirm Booking <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

function getStatusStyle(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-50 text-yellow-600";
    case "confirmed":
      return "bg-green-50 text-green-600";
    case "cancelled":
      return "bg-red-50 text-red-600";
    default:
      return "bg-slate-50 text-slate-600";
  }
}

export default function PatientDashboard() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="animate-spin text-teal-600" size={40} />
        </div>
      }
    >
      <PatientDashboardContent />
    </Suspense>
  );
}
