import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "./components/SideBar"; // ✅ Correct path
import { FaJava, FaPython, FaNetworkWired, FaBrain, FaReact } from "react-icons/fa";

const Period = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/periodwise-attendance");
        const data = await response.json();
        setAttendanceData(data);
      } catch (error) {
        console.error("Error fetching period‑wise attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  const periods = [
    { name: "Java", icon: <FaJava className="text-3xl text-orange-500" />, time: "9:00 AM" },
    { name: "Python", icon: <FaPython className="text-3xl text-blue-500" />, time: "10:00 AM" },
    { name: "Network", icon: <FaNetworkWired className="text-3xl text-green-500" />, time: "11:30 AM" },
    { name: "AI/ML", icon: <FaBrain className="text-3xl text-purple-600" />, time: "12:30 PM" },
    { name: "React", icon: <FaReact className="text-3xl text-cyan-500" />, time: "6:30 PM" },
  ];

  const filteredData = filter
    ? attendanceData.filter((log) => log.period === filter)
    : attendanceData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 flex flex-col lg:flex-row">
      {/* ✅ REUSABLE SIDEBAR */}
      <AdminSidebar mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} />

      {/* ✅ MAIN CONTENT - CENTERED + MOBILE RESPONSIVE */}
      <main className="flex-1 lg:ml-0 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 min-h-screen">
        {/* HEADER */}
        <div className="text-center mb-8 lg:mb-12">
          {/* <p className="text-sm text-gray-600 mb-1">Pages / Period Wise</p> */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-indigo-900">
            Student Attendance Schedule
          </h1>
        </div>

        {/* PERIOD CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-8 max-w-4xl mx-auto w-full">
          {periods.map((period, index) => {
            const count = attendanceData.filter((log) => log.period === period.name).length;
            return (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-xl border border-indigo-200/50 shadow-lg rounded-3xl p-5 flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  {period.icon}
                  <div>
                    <h2 className="font-bold text-indigo-800">{period.name}</h2>
                    <p className="text-xs text-gray-600">{period.time}</p>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-indigo-800">{count}</h2>
              </div>
            );
          })}
        </div>

        {/* FILTER */}
        <div className="max-w-4xl mx-auto w-full mb-6 flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-3 rounded-xl border border-indigo-200/50 bg-white/60 backdrop-blur-xl focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
          >
            <option value="">All</option>
            {periods.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <div className="max-w-4xl mx-auto w-full bg-white/80 backdrop-blur-xl border border-indigo-200/50 rounded-3xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-indigo-800 mb-6 text-center">
            Attendance Records
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="bg-indigo-50/50 border-b border-indigo-100">
                  <th className="p-4 text-left font-semibold text-indigo-700">Name</th>
                  <th className="p-4 text-left font-semibold text-indigo-700">Reg No</th>
                  <th className="p-4 text-left font-semibold text-indigo-700">Class</th>
                  <th className="p-4 text-left font-semibold text-indigo-700">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center p-6 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((log, index) => (
                    <tr
                      key={index}
                      className="border-t border-indigo-100 hover:bg-indigo-50/50"
                    >
                      <td className="p-4 font-medium">{log.name}</td>
                      <td className="p-4 font-mono">{log.usn}</td>
                      <td className="p-4">{log.period}</td>
                      <td className="p-4 text-gray-700 text-xs">
                        {new Date(log.recognizedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-6 text-gray-500">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-12 pt-8 border-t border-indigo-200/50 text-center">
          <p className="text-sm text-gray-600 mb-2">© 2026 Smart Attendance System</p>
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
    </div>
  );
};

export default Period;