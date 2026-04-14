import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import AdminSidebar from "./components/SideBar"; // ✅ Correct path
import { Link } from "react-router-dom";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 flex flex-col lg:flex-row">
      {/* ✅ REUSABLE SIDEBAR */}
      <AdminSidebar mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} />

      {/* ✅ MAIN CONTENT - CENTERED + MOBILE RESPONSIVE */}
      <main className="flex-1 lg:ml-0 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 min-h-screen">
        {/* HEADER */}
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-indigo-900 mb-2">
            Add Students
          </h1>
        </div>

        {/* FORM & CAMERA CONTAINER */}
        <div className="bg-white/80 backdrop-blur-xl border border-indigo-200/50 rounded-3xl shadow-xl p-6 lg:p-8 max-w-4xl mx-auto w-full">
          {/* INPUT GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <input
              name="name"
              placeholder="Full Name"
              value={student.name}
              onChange={handleChange}
              className="w-full p-4 border border-indigo-200/50 rounded-xl bg-white/60 backdrop-blur-xl focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
            />
            <input
              name="usn"
              placeholder="Registration Number"
              value={student.usn}
              onChange={handleChange}
              className="w-full p-4 border border-indigo-200/50 rounded-xl bg-white/60 backdrop-blur-xl focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
            />
            <input
              name="age"
              placeholder="Age"
              value={student.age}
              onChange={handleChange}
              className="w-full p-4 border border-indigo-200/50 rounded-xl bg-white/60 backdrop-blur-xl focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
            />
            <input
              name="course"
              placeholder="Class / Course"
              value={student.course}
              onChange={handleChange}
              className="w-full p-4 border border-indigo-200/50 rounded-xl bg-white/60 backdrop-blur-xl focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
            />
            <input
              name="phone"
              placeholder="Mobile Number"
              value={student.phone}
              onChange={handleChange}
              className="w-full p-4 border border-indigo-200/50 rounded-xl bg-white/60 backdrop-blur-xl focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
            />
          </div>

          {/* CAMERA + ENROLL SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Camera */}
            <div className="rounded-3xl overflow-hidden border border-indigo-200/30 shadow-lg">
              <video
                ref={videoRef}
                autoPlay
                className="w-full h-64 sm:h-72 object-cover"
              />
              <canvas ref={canvasRef} className="hidden" width="640" height="480" />
            </div>

            {/* Instructions + Enroll Button */}
            <div className="flex flex-col justify-center items-center text-center gap-3 lg:gap-6">
              <h2 className="text-xl font-bold text-indigo-800">
                Position Face Properly
              </h2>
              <p className="text-sm text-gray-600 max-w-xs">
                Align your face within the frame for clear capture.
              </p>
              <button
                onClick={captureAndSend}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-800 to-violet-600 text-white font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 w-full"
              >
                Enroll Face
              </button>
            </div>
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
    </div>
  );
};

export default Addstudent;