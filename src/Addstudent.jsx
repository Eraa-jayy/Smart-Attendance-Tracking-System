import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import AdminSidebar from "./components/SideBar"; // ✅ Correct path
import { Link } from "react-router-dom";
import { User, Hash, GraduationCap, Phone, Info, Award } from "lucide-react";

const Addstudent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [student, setStudent] = useState({
    name: "",
    usn: "",
    age: "",
    course: "",
    phone: "",
  });
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera access denied or failed:", err);
        alert("Camera access denied. Please check permissions.");
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const captureAndSend = async () => {
    if (!student.name || !student.usn || !student.age || !student.course || !student.phone) {
      alert("Please fill all fields");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, 640, 480);

    const image = canvas.toDataURL("image/jpeg");

    try {
      await fetch("http://localhost:5000/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usn: student.usn, image }),
      });

      await fetch("http://localhost:5001/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });

      alert("Student enrolled successfully!");
      setStudent({ name: "", usn: "", age: "", course: "", phone: "" });
    } catch (err) {
      alert("Enrollment failed");
    }
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
            Add New Students
          </h1>
          <p className="text-xs text-slate-500 font-semibold tracking-wide uppercase">
            Biometric Registration & Database Enrollment
          </p>
        </div>

        {/* FORM & CAMERA CONTAINER */}
        <div className="bg-white/85 backdrop-blur-xl border border-indigo-100/50 rounded-3xl shadow-xl p-6 lg:p-8 max-w-4xl mx-auto w-full flex flex-col gap-8">
          
          {/* INPUT FORM GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* FULL NAME */}
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-200">
                <User className="w-4 h-4" />
              </span>
              <input
                name="name"
                placeholder="Full Name"
                value={student.name}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl bg-white/90 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 outline-none text-xs font-semibold placeholder:text-slate-400"
              />
            </div>

            {/* USN */}
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-200">
                <Hash className="w-4 h-4" />
              </span>
              <input
                name="usn"
                placeholder="Registration Number"
                value={student.usn}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl bg-white/90 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 outline-none text-xs font-semibold placeholder:text-slate-400"
              />
            </div>

            {/* AGE */}
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-200">
                <Info className="w-4 h-4" />
              </span>
              <input
                name="age"
                placeholder="Age"
                value={student.age}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl bg-white/90 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 outline-none text-xs font-semibold placeholder:text-slate-400"
              />
            </div>

            {/* COURSE */}
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-200">
                <GraduationCap className="w-4 h-4" />
              </span>
              <input
                name="course"
                placeholder="Class / Course"
                value={student.course}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl bg-white/90 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 outline-none text-xs font-semibold placeholder:text-slate-400"
              />
            </div>

            {/* PHONE */}
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-200">
                <Phone className="w-4 h-4" />
              </span>
              <input
                name="phone"
                placeholder="Mobile Number"
                value={student.phone}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl bg-white/90 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 outline-none text-xs font-semibold placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* CAMERA + ENROLL SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-t border-slate-100 pt-8">
            
            {/* Camera Preview with Biometric Oval Grid (7 cols) */}
            <div className="lg:col-span-7 relative bg-slate-950 rounded-2xl overflow-hidden shadow-2xl p-2 border-2 border-slate-800">
              <div className="relative w-full h-[320px] rounded-xl overflow-hidden bg-slate-900">
                <video
                  ref={videoRef}
                  autoPlay
                  className="w-full h-full object-cover transform -scale-x-100"
                />
                <canvas ref={canvasRef} className="hidden" width="640" height="480" />

                {/* BIOMETRIC ALIGNMENT GUIDE OVERLAYS */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-44 h-56 border-2 border-indigo-400/40 rounded-full biometric-radar flex items-center justify-center border-dashed">
                    <div className="w-36 h-48 border border-indigo-300/35 rounded-full flex items-center justify-center">
                      <div className="text-[10px] font-extrabold text-indigo-300 uppercase tracking-widest text-center">
                        Align Face<br/>In Grid
                      </div>
                    </div>
                  </div>
                </div>

                {/* CORNER BRACKETS */}
                <div className="absolute top-4 left-4 w-6 h-6 tech-corner-tl opacity-75 pointer-events-none" />
                <div className="absolute top-4 right-4 w-6 h-6 tech-corner-tr opacity-75 pointer-events-none" />
                <div className="absolute bottom-4 left-4 w-6 h-6 tech-corner-bl opacity-75 pointer-events-none" />
                <div className="absolute bottom-4 right-4 w-6 h-6 tech-corner-br opacity-75 pointer-events-none" />
              </div>
            </div>

            {/* Instructions + Enroll Button (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-center gap-5 text-left bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-150 flex items-center justify-center text-indigo-600 flex-shrink-0 font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Step 1: Fill Credentials</h3>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">Ensure name, registration number, course, age, and phone entries are fully documented.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-150 flex items-center justify-center text-indigo-600 flex-shrink-0 font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Step 2: Center Face</h3>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">Make sure your head is directly inside the oval dashboard marker inside a well-lit classroom room.</p>
                </div>
              </div>

              <button
                onClick={captureAndSend}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-650 text-white font-extrabold text-xs shadow-lg shadow-indigo-150 hover:shadow-indigo-250 hover:scale-[1.01] active:scale-[0.99] transition-all duration-250 cursor-pointer mt-2"
              >
                Enroll Biometric Profile
              </button>
            </div>

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

export default Addstudent;