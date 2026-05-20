import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminSidebar from "./components/SideBar"; // ✅ Correct path

import { Search, UserCheck, UserX, X, BookOpen, Calendar, GraduationCap, Phone, Info } from "lucide-react";

const Enrolled = () => {
  const [students, setStudents] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, aRes] = await Promise.all([
          axios.get("http://localhost:5001/api/students"),
          axios.get("http://localhost:5001/api/attendance"),
        ]);
        setStudents(sRes.data);
        setAttendanceLogs(aRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const getStatus = (usn) => {
    return attendanceLogs.some((log) => {
      const date = new Date(log.recognizedAt).toISOString().split("T")[0];
      return log.usn === usn && date === today;
    })
      ? "Present"
      : "Absent";
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    if (!value) {
      setFiltered([]);
      return;
    }

    const results = students.filter(
      (s) =>
        s.name?.toLowerCase().includes(value) ||
        s.usn?.toLowerCase().includes(value)
    );

    setFiltered(results);
  };

  const selectStudent = (s) => {
    setSelected(s);
    setSearch("");
    setFiltered([]);
  };

  const closeDetails = () => {
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 flex flex-col md:flex-row">
      {/* ✅ REUSABLE SIDEBAR */}
      <AdminSidebar mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} />

      {/* ✅ MAIN CONTENT */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 lg:py-8 min-h-screen flex flex-col gap-6">
        
        {/* HEADER */}
        <div className="flex flex-col gap-1 border-b border-indigo-100 pb-4">
          <h1 className="text-2xl sm:text-3xl font-black text-indigo-950 tracking-tight">
            Enrolled Directory
          </h1>
          <p className="text-xs text-slate-500 font-semibold tracking-wide uppercase">
            Database Records & Attendance Tracking
          </p>
        </div>

        {/* TOP BAR - SEARCH */}
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/70 backdrop-blur-xl p-5 rounded-3xl border border-indigo-100/50 shadow-md">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Search Database</p>
              <h2 className="text-sm font-extrabold text-indigo-900 mt-0.5">Quick Lookup & Profiles</h2>
            </div>

            <div className="relative w-full sm:w-80 group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-indigo-650 transition-colors duration-200">
                <Search className="w-4 h-4" />
              </span>
              <input
                value={search}
                onChange={handleSearch}
                placeholder="Name or Registration Number..."
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl bg-white/95 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 outline-none text-xs font-semibold placeholder:text-slate-450"
              />
              
              {filtered.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl mt-1.5 z-10 max-h-60 overflow-auto border border-indigo-100/80 divide-y divide-slate-100">
                  {filtered.map((s) => (
                    <div
                      key={s._id}
                      onClick={() => selectStudent(s)}
                      className="p-3.5 hover:bg-indigo-50/40 cursor-pointer text-xs transition-colors duration-150 flex items-center justify-between"
                    >
                      <span className="font-bold text-slate-800">{s.name}</span>
                      <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">
                        {s.usn}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white/85 backdrop-blur-xl border border-indigo-100/50 rounded-3xl shadow-xl p-6 max-w-4xl mx-auto w-full flex flex-col gap-4">
          <h2 className="text-lg font-extrabold text-indigo-950 tracking-tight">
            Registered Student Roster
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left border-collapse text-xs min-w-[600px]">
              <thead>
                <tr className="bg-indigo-50/60 border-b border-indigo-100/40">
                  <th className="p-4 font-extrabold text-indigo-900">Student Name</th>
                  <th className="p-4 font-extrabold text-indigo-900">Registration ID</th>
                  <th className="p-4 font-extrabold text-indigo-900">Age</th>
                  <th className="p-4 font-extrabold text-indigo-900">Class / Subject</th>
                  <th className="p-4 font-extrabold text-indigo-900">Mobile Phone</th>
                  <th className="p-4 font-extrabold text-indigo-900">Daily Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => {
                  const isPresent = getStatus(s.usn) === "Present";
                  return (
                    <tr
                      key={s._id}
                      className="hover:bg-indigo-50/30 cursor-pointer transition-all duration-150"
                      onClick={() => selectStudent(s)}
                    >
                      <td className="p-4 font-bold text-slate-800">{s.name}</td>
                      <td className="p-4 font-mono font-semibold text-indigo-600">{s.usn}</td>
                      <td className="p-4 font-semibold text-slate-500">{s.age}</td>
                      <td className="p-4">
                        <span className="bg-indigo-50 text-indigo-750 px-2 py-0.5 rounded-md font-bold text-[10px]">
                          {s.course}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-500">{s.phone}</td>
                      <td className="p-4">
                        <span
                          className={`
                            inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold shadow-sm border
                            ${isPresent 
                              ? "bg-emerald-50/90 border-emerald-200 text-emerald-800" 
                              : "bg-rose-50/90 border-rose-200 text-rose-800"
                            }
                          `}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isPresent ? "bg-emerald-600 animate-pulse" : "bg-rose-600"
                          }`} />
                          {isPresent ? "Present" : "Absent"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-12 pt-6 border-t border-slate-200/50 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between px-2 gap-2">
          <p>© 2026 Smart Attendance Tracking System. All rights reserved.</p>
          <p className="font-semibold">
            Support: 
            <a
              href="mailto:erandajayawardhane25@gmail.com"
              className="text-indigo-600 hover:underline ml-1 font-bold"
            >
              erandajayawardhane25@gmail.com
            </a>
          </p>
        </footer>
      </main>

      {/* MODAL - STUDENT DETAILS BACKDROP BLURRED */}
      {selected && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-xl max-w-sm w-full rounded-3xl border border-indigo-150 shadow-2xl p-6 relative overflow-hidden animate-modal-enter glass-panel">
            <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-50/70 rounded-full blur-xl -z-10 pointer-events-none" />
            
            {/* CLOSE CIRCLE BUTTON */}
            <button 
              onClick={closeDetails}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-6 mt-2 flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-indigo-100 border border-indigo-150 rounded-2xl flex items-center justify-center text-indigo-600">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-indigo-950 tracking-tight">
                  Student Record
                </h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Biometric Identity Profiles</p>
              </div>
            </div>

            {/* DETAILS STACK */}
            <div className="space-y-3.5">
              {/* NAME */}
              <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-3.5 flex flex-col gap-0.5">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Student Name</span>
                <span className="text-xs font-extrabold text-slate-800">{selected.name}</span>
              </div>

              {/* REG ID */}
              <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-3.5 flex flex-col gap-0.5">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Registration Number</span>
                <span className="text-xs font-mono font-bold text-indigo-650">{selected.usn}</span>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                {/* AGE */}
                <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-3.5 flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Age</span>
                  <span className="text-xs font-extrabold text-slate-800">{selected.age} yrs</span>
                </div>

                {/* CLASS */}
                <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-3.5 flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Class / Room</span>
                  <span className="text-xs font-extrabold text-indigo-750">{selected.course}</span>
                </div>
              </div>

              {/* PHONE */}
              <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-3.5 flex flex-col gap-0.5">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Mobile Number</span>
                <span className="text-xs font-mono font-bold text-slate-800">{selected.phone}</span>
              </div>
            </div>

            <button
              onClick={closeDetails}
              className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-650 text-white font-extrabold text-xs shadow-lg shadow-indigo-150 hover:shadow-indigo-250 hover:scale-[1.01] active:scale-[0.99] transition-all duration-250 cursor-pointer"
            >
              Acknowledge Entry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enrolled;