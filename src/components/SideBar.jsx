import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaFileAlt,
  FaUser,
  FaClock,
  FaTimes,
  FaBars,
  FaDownload,
} from "react-icons/fa";

const AdminSidebar = ({ mobileMenu, setMobileMenu }) => {
  return (
    <>
      {/* ✅ MOBILE TOP BAR */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white/80 backdrop-blur-md border-b border-indigo-400/30">
        <h1 className="font-bold text-indigo-800 bg-white px-3 py-1 rounded-lg shadow-sm">
          Admin Panel
        </h1>

        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="text-indigo-700 text-2xl"
        >
          {mobileMenu ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* ✅ OVERLAY (ONLY MOBILE) */}
      {mobileMenu && (
        <div
          onClick={() => setMobileMenu(false)}
          className="fixed inset-0 bg-black/40 md:hidden z-40"
        />
      )}

      {/* ✅ PERMANENT FIXED SIDEBAR */}
      <div
        className={`
          fixed md:relative z-50 top-0 left-0 h-screen w-full md:w-64
          bg-gradient-to-b from-blue-100 via-indigo-50 to-white
          border-r border-indigo-400/30 p-5 flex flex-col gap-4 shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${mobileMenu ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:shadow-2xl
        `}
      >
        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-800 to-violet-700 px-4 py-3 rounded-xl shadow-md text-center flex-shrink-0">
          <h2 className="text-white text-xl font-extrabold">
            Admin Panel
          </h2>
        </div>

        {/* NAV - 4 SECTIONS */}
        <div className="flex flex-col gap-2 text-gray-700 flex-1 overflow-auto">
          <Link to="/dashboard">
            <button className="flex items-center gap-2 p-2 rounded-xl hover:bg-indigo-100 w-full transition border border-transparent hover:border-indigo-300">
              <FaHome className="text-indigo-600" />
              Home
            </button>
          </Link>

          <Link to="/Addstudent">
            <button className="flex items-center gap-2 p-2 rounded-xl hover:bg-indigo-100 w-full transition border border-transparent hover:border-indigo-300">
              <FaUser className="text-indigo-600" />
              Add Students
            </button>
          </Link>

          <Link to="/Enrolled">
            <button className="flex items-center gap-2 p-2 rounded-xl hover:bg-indigo-100 w-full transition border border-transparent hover:border-indigo-300">
              <FaFileAlt className="text-indigo-600" />
              Enrolled
            </button>
          </Link>

          <Link to="/Period">
            <button className="flex items-center gap-2 p-2 rounded-xl hover:bg-indigo-100 w-full transition border border-transparent hover:border-indigo-300">
              <FaClock className="text-indigo-600" />
              Period Wise
            </button>
          </Link>
        </div>

        {/* ✅ LOGOUT - BOTTOM (PERMANENTLY VISIBLE) */}
        <div className="flex-shrink-0 mt-4 pt-4 border-t border-indigo-200">
          <Link to="/signin">
            <button className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-800 to-violet-600 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition shadow-md border border-transparent hover:border-indigo-300">
              <FaDownload className="text-sm" />
              Logout
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;