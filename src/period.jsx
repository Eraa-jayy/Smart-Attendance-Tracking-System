import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "./components/SideBar"; // ✅ Correct path
import { Coffee, Terminal, Network, Cpu, Layers, Filter, Calendar } from "lucide-react";

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
    { name: "Java", icon: <Coffee className="w-5 h-5 text-orange-500" />, time: "9:00 AM", cap: 40 },
    { name: "Python", icon: <Terminal className="w-5 h-5 text-blue-500" />, time: "10:00 AM", cap: 45 },
    { name: "Network", icon: <Network className="w-5 h-5 text-emerald-500" />, time: "11:30 AM", cap: 35 },
    { name: "AI/ML", icon: <Cpu className="w-5 h-5 text-violet-600" />, time: "12:30 PM", cap: 30 },
    { name: "React", icon: <Layers className="w-5 h-5 text-cyan-500" />, time: "6:30 PM", cap: 50 },
  ];

  const filteredData = filter
    ? attendanceData.filter((log) => log.period === filter)
    : attendanceData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 flex flex-col md:flex-row">
      {/* ✅ REUSABLE SIDEBAR */}
      <AdminSidebar mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} />

      {/* ✅ MAIN CONTENT */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 lg:py-8 min-h-screen flex flex-col gap-6">
        
        {/* HEADER */}
        <div className="flex flex-col gap-1 border-b border-indigo-100 pb-4">
          <h1 className="text-2xl sm:text-3xl font-black text-indigo-950 tracking-tight">
            Schedule Analysis
          </h1>
          <p className="text-xs text-slate-500 font-semibold tracking-wide uppercase">
            Period-Wise Biometric Capacity & Timetables
          </p>
        </div>

        {/* PERIOD CARDS WITH DYNAMIC CAPACITY GAUGES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 max-w-5xl w-full">
          {periods.map((period, index) => {
            const count = attendanceData.filter((log) => log.period === period.name).length;
            const percent = Math.min(100, Math.round((count / period.cap) * 100));
            return (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-xl border border-indigo-100/50 shadow-md rounded-2xl p-4 flex flex-col gap-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-300"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner">
                      {period.icon}
                    </div>
                    <div>
                      <h2 className="font-extrabold text-indigo-950 text-sm leading-tight">{period.name}</h2>
                      <p className="text-[10px] text-slate-450 font-bold">{period.time}</p>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-indigo-900">{count}</h3>
                </div>

                {/* Progress Gauges */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[9px] font-bold text-slate-400">
                    <span>Capacity Gauge</span>
                    <span className="text-indigo-600 font-extrabold">{percent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-violet-600 h-1.5 rounded-full transition-all duration-500" 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* TOP FILTER BAR */}
        <div className="max-w-4xl w-full mb-1">
          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-xl p-4 rounded-2xl border border-indigo-100/50 shadow-sm max-w-sm">
            <span className="text-slate-400 flex items-center justify-center">
              <Filter className="w-4 h-4" />
            </span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="">Filter: All Classes</option>
              {periods.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name} Lecture
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* RECORDS GRID TABLE */}
        <div className="max-w-4xl w-full bg-white/85 backdrop-blur-xl border border-indigo-100/50 rounded-3xl shadow-xl p-6 flex flex-col gap-4">
          <h2 className="text-lg font-extrabold text-indigo-950 tracking-tight">
            Schedule Records Log
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left border-collapse text-xs min-w-[600px]">
              <thead>
                <tr className="bg-indigo-50/60 border-b border-indigo-100/40">
                  <th className="p-4 font-extrabold text-indigo-900">Student Name</th>
                  <th className="p-4 font-extrabold text-indigo-900">Registration ID</th>
                  <th className="p-4 font-extrabold text-indigo-900">Lecture Period</th>
                  <th className="p-4 font-extrabold text-indigo-900">Time Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center p-8 text-slate-400 font-semibold">
                      Retrieving database records...
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((log, index) => (
                    <tr
                      key={index}
                      className="hover:bg-indigo-50/30 transition-all duration-150"
                    >
                      <td className="p-4 font-bold text-slate-800">{log.name}</td>
                      <td className="p-4 font-mono font-semibold text-indigo-650">{log.usn}</td>
                      <td className="p-4">
                        <span className="bg-indigo-50 text-indigo-750 px-2.5 py-0.5 rounded-md font-bold text-[10px]">
                          {log.period}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-500">
                        {new Date(log.recognizedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-8 text-slate-400 font-semibold">
                      No matching records locked.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-8 pt-6 border-t border-slate-200/50 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between px-2 gap-2">
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

export default Period;