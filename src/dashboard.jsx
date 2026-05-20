import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminSidebar from "./components/SideBar";

import {
  FaUserGraduate,
  FaClipboardList,
  FaUsers,
} from "react-icons/fa";
import { User, Hash, BookOpen, Calendar } from "lucide-react";

const Dashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [mobileMenu, setMobileMenu] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const presentToday = attendance.filter((s) => {
    const date = new Date(s.recognizedAt).toISOString().split("T")[0];
    return date === today;
  });

  const totalStudents = students.length;
  const absentStudents = totalStudents - presentToday.length;

  useEffect(() => {
    const fetchAttendance = async () => {
      const res = await axios.get("http://localhost:5001/api/attendance");
      setAttendance(res.data);
    };

    const fetchStudents = async () => {
      const res = await axios.get("http://localhost:5001/api/students");
      setStudents(res.data);
    };

    fetchAttendance();
    fetchStudents();
  }, []);

  const handleManualAttendance = async () => {
    const name = document.querySelector('input[name="manual_name"]').value;
    const usn = document.querySelector('input[name="manual_usn"]').value;
    const course = document.querySelector('input[name="manual_course"]').value;
    const recognizedAt = document.querySelector('input[name="recognizedAt"]').value;

    try {
      const res = await axios.post("http://localhost:5001/api/attendance", {
        name,
        usn,
        course,
        recognizedAt,
      });
      alert(res.data.message);
    } catch (err) {
      alert("Error marking attendance");
    }
  };

  const courseList = ["All", ...new Set(attendance.map((s) => s.course))];

  const filteredAttendance =
    selectedCourse === "All"
      ? attendance
      : attendance.filter((s) => s.course === selectedCourse);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentAttendance = filteredAttendance.slice(indexOfFirst, indexOfLast);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 flex flex-col md:flex-row">
      {/* ✅ REUSABLE SIDEBAR */}
      <AdminSidebar mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} />

      {/* ✅ MAIN CONTENT */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 lg:py-8 min-h-screen flex flex-col gap-8">
        
        {/* HEADER - LEFT ALIGNED & MODERN */}
        <div className="flex flex-col gap-1 border-b border-indigo-100 pb-4">
          <h1 className="text-2xl sm:text-3xl font-black text-indigo-950 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500 font-semibold tracking-wide uppercase">
            Biometric Analysis & System Controls
          </p>
        </div>

        {/* STATS - RESPONSIVE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl w-full">
          {/* TOTAL STUDENTS */}
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-indigo-100/50 shadow-md flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-300">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enrolled</p>
              <h2 className="text-3xl font-black text-indigo-900">{totalStudents}</h2>
            </div>
            <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
              <FaUserGraduate className="text-xl" />
            </div>
          </div>

          {/* PRESENT TODAY */}
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-indigo-100/50 shadow-md flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-300">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Present Today</p>
              <h2 className="text-3xl font-black text-emerald-600">{presentToday.length}</h2>
            </div>
            <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
              <FaClipboardList className="text-xl" />
            </div>
          </div>

          {/* ABSENT TODAY */}
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-indigo-100/50 shadow-md flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-rose-300">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Absent Today</p>
              <h2 className="text-3xl font-black text-rose-600">{absentStudents}</h2>
            </div>
            <div className="w-12 h-12 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center text-rose-600 shadow-inner">
              <FaUsers className="text-xl" />
            </div>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-5xl">
          
          {/* ATTENDANCE TABLE PANEL (7 cols) */}
          <div className="lg:col-span-7 bg-white/85 backdrop-blur-xl p-6 rounded-3xl border border-indigo-100/50 shadow-xl flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
              <h2 className="text-lg font-extrabold text-indigo-950 tracking-tight">
                Live Attendance Logs
              </h2>
              
              <div className="w-full sm:w-44">
                <select
                  className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  {courseList.map((c, i) => (
                    <option key={i} value={c}>{c === "All" ? "Filter: All Classes" : `Class: ${c}`}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-indigo-50/60 border-b border-indigo-100/40">
                    <th className="p-3.5 font-extrabold text-indigo-900">Student Name</th>
                    <th className="p-3.5 font-extrabold text-indigo-900">Registration ID</th>
                    <th className="p-3.5 font-extrabold text-indigo-900">Course / Class</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentAttendance.length > 0 ? (
                    currentAttendance.map((s, i) => (
                      <tr key={i} className="hover:bg-indigo-50/30 transition-all duration-150">
                        <td className="p-3.5 font-bold text-slate-800">{s.name}</td>
                        <td className="p-3.5 font-mono font-semibold text-indigo-600">{s.usn}</td>
                        <td className="p-3.5">
                          <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg font-bold text-[10px]">
                            {s.course}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center p-8 text-slate-400 font-semibold">
                        No attendance records logged.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* MANUAL ATTENDANCE FORM PANEL (5 cols) */}
          <div className="lg:col-span-5 bg-white/85 backdrop-blur-xl p-6 rounded-3xl border border-indigo-100/50 shadow-xl flex flex-col gap-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-extrabold text-indigo-950 tracking-tight">
                Manual Override
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">Log attendance records offline or by bypass.</p>
            </div>
            
            <div className="space-y-4">
              {/* FULL NAME */}
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-450 group-focus-within:text-indigo-650 transition-colors duration-200">
                  <User className="w-4 h-4" />
                </span>
                <input 
                  name="manual_name" 
                  placeholder="Student Full Name" 
                  className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl bg-white/90 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 outline-none text-xs font-semibold placeholder:text-slate-400"
                />
              </div>
              
              {/* REG NO */}
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-450 group-focus-within:text-indigo-650 transition-colors duration-200">
                  <Hash className="w-4 h-4" />
                </span>
                <input 
                  name="manual_usn" 
                  placeholder="Registration Number" 
                  className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl bg-white/90 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 outline-none text-xs font-semibold placeholder:text-slate-400"
                />
              </div>
              
              {/* CLASS */}
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-450 group-focus-within:text-indigo-650 transition-colors duration-200">
                  <BookOpen className="w-4 h-4" />
                </span>
                <input 
                  name="manual_course" 
                  placeholder="Subject / Class Code" 
                  className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl bg-white/90 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 outline-none text-xs font-semibold placeholder:text-slate-400"
                />
              </div>
              
              {/* DATE / TIME */}
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-450 group-focus-within:text-indigo-650 transition-colors duration-200">
                  <Calendar className="w-4 h-4" />
                </span>
                <input 
                  name="recognizedAt" 
                  type="datetime-local"
                  className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl bg-white/90 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 outline-none text-xs font-semibold text-slate-700 placeholder:text-slate-400"
                />
              </div>
              
              <button
                onClick={handleManualAttendance}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-650 text-white font-extrabold text-xs shadow-lg shadow-indigo-150 hover:shadow-indigo-250 hover:scale-[1.01] active:scale-[0.99] transition-all duration-250 cursor-pointer"
              >
                Log Manual Entry
              </button>
            </div>
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
    </div>
  );
};

export default Dashboard;