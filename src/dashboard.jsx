import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminSidebar from "./components/SideBar";

import {
  FaHome,
  FaFileAlt,
  FaUser,
  FaUserGraduate,
  FaClipboardList,
  FaUsers,
  FaClock,
  FaBars,
  FaTimes,
} from "react-icons/fa";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 flex flex-col lg:flex-row">
      {/* ✅ REUSABLE SIDEBAR */}
      <AdminSidebar mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} />

      {/* ✅ MAIN CONTENT - PERFECTLY CENTERED + MOBILE RESPONSIVE */}
      <main className="flex-1 lg:ml-0 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 min-h-screen">
        {/* HEADER - CENTERED */}
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-indigo-900 mb-2">
            Dashboard
          </h1>
        </div>

        {/* STATS - RESPONSIVE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 lg:mb-12 max-w-4xl mx-auto w-full">
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-indigo-200/50 shadow-lg flex flex-col sm:flex-row items-center justify-between">
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold text-gray-600 mb-2">Total Students</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-indigo-800">{totalStudents}</h2>
            </div>
            <FaUserGraduate className="text-indigo-600 text-4xl mt-4 sm:mt-0" />
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-indigo-200/50 shadow-lg flex flex-col sm:flex-row items-center justify-between">
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold text-gray-600 mb-2">Present Today</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-emerald-600">{presentToday.length}</h2>
            </div>
            <FaClipboardList className="text-emerald-600 text-4xl mt-4 sm:mt-0" />
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-indigo-200/50 shadow-lg flex flex-col sm:flex-row items-center justify-between">
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold text-gray-600 mb-2">Absent Today</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-red-600">{absentStudents}</h2>
            </div>
            <FaUsers className="text-red-600 text-4xl mt-4 sm:mt-0" />
          </div>
        </div>

        {/* CONTENT GRID - FULL WIDTH RESPONSIVE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full max-w-6xl mx-auto">
          {/* TABLE */}
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-indigo-200/50 shadow-xl">
            <h2 className="text-xl font-bold text-indigo-800 mb-6 text-center">Attendance Details</h2>
            
            <div className="mb-6">
              <select
                className="w-full p-3 border border-indigo-200/50 rounded-xl bg-white/60 backdrop-blur-xl focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                {courseList.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-indigo-50/50">
                    <th className="p-4 text-left font-semibold text-indigo-700">Student Name</th>
                    <th className="p-4 text-left font-semibold text-indigo-700">Reg No</th>
                    <th className="p-4 text-left font-semibold text-indigo-700">Class</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAttendance.map((s, i) => (
                    <tr key={i} className="border-t border-indigo-100 hover:bg-indigo-50/50 transition">
                      <td className="p-4 font-medium">{s.name}</td>
                      <td className="p-4 font-mono">{s.usn}</td>
                      <td className="p-4">{s.course}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FORM */}
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-indigo-200/50 shadow-xl">
            <h2 className="text-xl font-bold text-indigo-800 mb-6 text-center">Manual Attendance</h2>
            
            <div className="space-y-4">
              <input 
                name="manual_name" 
                placeholder="Full Name" 
                className="w-full p-4 border border-indigo-200/50 rounded-xl bg-white/60 backdrop-blur-xl focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
              />
              
              <input 
                name="manual_usn" 
                placeholder="Reg No" 
                className="w-full p-4 border border-indigo-200/50 rounded-xl bg-white/60 backdrop-blur-xl focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
              />
              
              <input 
                name="manual_course" 
                placeholder="Class" 
                className="w-full p-4 border border-indigo-200/50 rounded-xl bg-white/60 backdrop-blur-xl focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
              />
              
              <input 
                name="recognizedAt" 
                type="datetime-local"
                className="w-full p-4 border border-indigo-200/50 rounded-xl bg-white/60 backdrop-blur-xl focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
              />
              
              <button
                onClick={handleManualAttendance}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-800 to-violet-600 text-white font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200"
              >
                Mark Attendance
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER - CENTERED */}
        <div className="mt-12 pt-8 border-t border-indigo-200/50 text-center">
          <p className="text-sm text-gray-600 mb-2">© 2026 Smart Attendance Tracking System</p>
          <p className="text-sm">
            Contact: 
            <a
              href="mailto:erandajayawardhane25@gmail.com"
              className="text-indigo-600 font-semibold hover:text-indigo-800 hover:underline ml-1"
            >
              erandajayawardhane25@gmail.com
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;