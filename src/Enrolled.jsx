import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminSidebar from "./components/SideBar"; // ✅ Correct path

import {
  FaHome,
  FaFileAlt,
  FaUser,
  FaDownload,
  FaClock,
} from "react-icons/fa";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 flex flex-col lg:flex-row">
      {/* ✅ REUSABLE SIDEBAR */}
      <AdminSidebar mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} />

      {/* ✅ MAIN CONTENT - CENTERED + MOBILE RESPONSIVE */}
      <main className="flex-1 lg:ml-0 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 min-h-screen">
        {/* HEADER */}
        <div className="text-center mb-8 lg:mb-12">
          {/* <p className="text-sm text-gray-600 mb-1">Pages / Enrolled</p> */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-indigo-900">
            Enrolled Students
          </h1>
        </div>

        {/* TOP BAR - SEARCH */}
        <div className="max-w-4xl mx-auto w-full mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-sm  font-bold text-gray-800">View all enrolled students</p>
            </div>

            <div className="relative w-full sm:w-72">
              <input
                value={search}
                onChange={handleSearch}
                placeholder="Search student by Name or Registration No..."
                className="w-full p-4 rounded-xl border border-indigo-200/50 bg-white/60 backdrop-blur-xl focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
              />
              {filtered.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-xl mt-1 z-10 max-h-60 overflow-auto border border-indigo-200/50">
                  {filtered.map((s) => (
                    <div
                      key={s._id}
                      onClick={() => selectStudent(s)}
                      className="p-3 hover:bg-indigo-50 cursor-pointer text-sm border-b border-indigo-100 last:border-0"
                    >
                      <span className="font-medium text-indigo-800">{s.name}</span>{" "}
                      <span className="text-gray-600 ml-1">({s.usn})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white/80 backdrop-blur-xl border border-indigo-200/50 rounded-3xl shadow-xl p-6 max-w-4xl mx-auto w-full">
          <h2 className="text-xl font-bold text-indigo-800 mb-6 text-center">
            Enrolled Students List
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="bg-indigo-50/50 border-b border-indigo-100">
                  <th className="p-4 text-left font-semibold text-indigo-700">Name</th>
                  <th className="p-4 text-left font-semibold text-indigo-700">Reg No</th>
                  <th className="p-4 text-left font-semibold text-indigo-700">Age</th>
                  <th className="p-4 text-left font-semibold text-indigo-700">Class</th>
                  <th className="p-4 text-left font-semibold text-indigo-700">Phone</th>
                  <th className="p-4 text-left font-semibold text-indigo-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr
                    key={s._id}
                    className="border-t border-indigo-100 hover:bg-indigo-50/50 cursor-pointer"
                    onClick={() => selectStudent(s)}
                  >
                    <td className="p-4 font-medium">{s.name}</td>
                    <td className="p-4 font-mono">{s.usn}</td>
                    <td className="p-4">{s.age}</td>
                    <td className="p-4">{s.course}</td>
                    <td className="p-4">{s.phone}</td>
                    <td className="p-4">
                      <span
                        className={
                          getStatus(s.usn) === "Present"
                            ? "text-emerald-600 font-semibold"
                            : "text-red-500 font-semibold"
                        }
                      >
                        {getStatus(s.usn)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-12 pt-8 border-t border-indigo-200/50 text-center">
          <p className="text-sm text-gray-600 mb-2">© 2026 Smart Attendance Tracking System</p>
          <p className="text-sm">
            Contact:{" "}
            <a
              href="mailto:erandajayawardhane25@gmail.com"
              className="text-indigo-600 font-semibold hover:underline ml-1"
            >
              erandajayawardhane25@gmail.com
            </a>
          </p>
        </div>
      </main>

      {/* MODAL - STUDENT DETAILS */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-xl max-w-sm w-full rounded-3xl border border-indigo-200/50 shadow-xl p-6">
            <h2 className="text-xl font-bold text-indigo-800 mb-5 text-center">
              Student Details
            </h2>

            <div className="space-y-3 text-sm">
              <p>
                <span className="font-semibold text-gray-700">Name:</span>{" "}
                <span className="text-gray-900">{selected.name}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-700">USN:</span>{" "}
                <span className="text-gray-900">{selected.usn}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-700">Age:</span>{" "}
                <span className="text-gray-900">{selected.age}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-700">Course:</span>{" "}
                <span className="text-gray-900">{selected.course}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-700">Phone:</span>{" "}
                <span className="text-gray-900">{selected.phone}</span>
              </p>
            </div>

            <button
              onClick={closeDetails}
              className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-800 to-violet-600 text-white font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enrolled;