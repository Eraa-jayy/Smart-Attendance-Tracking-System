import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaFileAlt,
  FaUser,
  FaClock,
  FaTimes,
  FaBars,
  FaSignOutAlt,
} from "react-icons/fa";

const AdminSidebar = ({ mobileMenu, setMobileMenu }) => {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", label: "Home", icon: <FaHome /> },
    { path: "/Addstudent", label: "Add Students", icon: <FaUser /> },
    { path: "/Enrolled", label: "Enrolled", icon: <FaFileAlt /> },
    { path: "/Period", label: "Period Wise", icon: <FaClock /> },
  ];

  const isActive = (path) => {
    return location.pathname.toLowerCase() === path.toLowerCase();
  };

  return (
    <>
      {/* ✅ MOBILE TOP BAR */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white/80 backdrop-blur-md border-b border-indigo-100 shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
            S
          </div>
          <h1 className="font-extrabold text-indigo-900 tracking-wide text-md">
            Smart Attendance
          </h1>
        </div>

        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="text-indigo-700 p-2 hover:bg-indigo-50 rounded-lg transition-colors text-2xl focus:outline-none"
        >
          {mobileMenu ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* ✅ OVERLAY (ONLY MOBILE) */}
      {mobileMenu && (
        <div
          onClick={() => setMobileMenu(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm md:hidden z-40 transition-opacity duration-300"
        />
      )}

      {/* ✅ PERMANENT FIXED SIDEBAR */}
      <div
        className={`
          fixed md:sticky z-50 top-0 left-0 h-screen w-72 md:w-64 flex-shrink-0
          bg-white border-r border-slate-100 p-5 flex flex-col gap-6 shadow-xl
          transform transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)
          ${mobileMenu ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:shadow-none
        `}
      >
        {/* HEADER BRANDING */}
        <div className="flex items-center gap-3 px-2 py-1 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-100">
            S
          </div>
          <div>
            <h2 className="text-slate-800 text-sm font-extrabold tracking-tight leading-tight">
              Smart Attendance
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-md">
              Admin Panel
            </span>
          </div>
        </div>

        {/* PROFILE CARD */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold uppercase shadow-inner">
            AD
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">System Admin</p>
            <p className="text-[10px] text-slate-500 font-medium truncate w-36">
              admin@attendance.com
            </p>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 block">
            Navigation Menu
          </span>
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenu(false)}
                className="w-full"
              >
                <button
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl w-full text-sm font-semibold
                    transition-all duration-200 group text-left
                    ${
                      active
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-100 border-r-4 border-indigo-700 translate-x-0.5 scale-[1.01]"
                        : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50 border border-transparent hover:translate-x-1"
                    }
                  `}
                >
                  <span
                    className={`
                      text-lg transition-transform duration-200 group-hover:scale-110
                      ${active ? "text-white" : "text-slate-400 group-hover:text-indigo-500"}
                    `}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              </Link>
            );
          })}
        </div>

        {/* ✅ LOGOUT BUTTON */}
        <div className="flex-shrink-0 pt-4 border-t border-slate-100">
          <Link to="/signin" onClick={() => setMobileMenu(false)} className="w-full block">
            <button className="w-full py-3 px-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all duration-200 shadow-sm">
              <FaSignOutAlt className="text-sm transition-transform duration-200 group-hover:-translate-x-0.5" />
              Sign Out
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;