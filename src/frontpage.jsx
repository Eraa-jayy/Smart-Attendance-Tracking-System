import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Front = () => {
  const [recognizedName, setRecognizedName] = useState("USN will appear here");
  const [recognizedStudentName, setRecognizedStudentName] = useState(
    "Name will appear here",
  );
  const [attendanceMessage, setAttendanceMessage] = useState("");
  const [period, setPeriod] = useState("No Period");
  const [status, setStatus] = useState("Idle");
  const [students, setStudents] = useState([]);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/students")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error(err);
      }
    };
    startCamera();
  }, []);

  function getCurrentPeriod() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();

    if (h >= 9 && h < 10) return "Java";
    if (h === 10 && m >= 10) return "Python";
    if (h === 11 && m >= 20) return "Networking";
    if (h === 12 && m >= 30) return "AI/ML";
    if (h === 18) return "React";
    return "No Period";
  }

  const handleRecognize = async () => {
    setStatus("Processing...");

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL("image/jpeg");

    try {
      const res = await axios.post("http://localhost:5000/recognize", {
        image,
      });
      const usn = res.data.usn;

      setRecognizedName(usn);

      const student = students.find((s) => s.usn === usn);
      setRecognizedStudentName(student ? student.name : "Not found");

      const currentPeriod = getCurrentPeriod();
      setPeriod(currentPeriod);

      if (currentPeriod === "No Period") {
        setAttendanceMessage("⚠ Outside class hours");
        setStatus("Blocked");
        return;
      }

      await axios.post("http://localhost:5001/api/periodwise-attendance", {
        usn,
        recognizedAt: new Date().toISOString(),
      });

      setAttendanceMessage("✅ Attendance marked successfully");
      setStatus("Success");
    } catch (err) {
      console.error(err);
      setStatus("Error");
      setAttendanceMessage("❌ Recognition failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 flex flex-col">
      {/* HEADER */}
      <header className="flex justify-between items-center px-6 sm:px-12 py-4 bg-white/70 backdrop-blur-md border-b border-slate-200 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-lg shadow-md">
            S
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-indigo-900 tracking-tight">
              Smart Attendance
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              Real-Time Face Scanner
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <Link to="/Signin">
            <button className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm shadow-md shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer">
              Admin Portal
            </button>
          </Link>
        </div>
      </header>

      {/* MAIN SCANNER BODY */}
      <div className="flex-1 p-4 sm:p-8 flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CAMERA FEED (LEFT) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div 
              className={`
                relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl p-3 border-2 transition-all duration-500
                ${status === "Processing..." ? "border-indigo-500 glow-indigo-soft" : ""}
                ${status === "Success" ? "border-emerald-500 glow-emerald-soft" : ""}
                ${status === "Blocked" ? "border-amber-500" : ""}
                ${status === "Error" ? "border-rose-500 glow-rose-soft" : ""}
                ${status === "Idle" ? "border-slate-800" : ""}
              `}
            >
              {/* Camera Video Wrapper */}
              <div className="relative w-full h-[400px] sm:h-[450px] rounded-2xl overflow-hidden bg-slate-950">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas
                  ref={canvasRef}
                  width="640"
                  height="480"
                  className="hidden"
                />

                {/* TECH SCANNER CORNER BRACKETS */}
                <div className="absolute top-6 left-6 w-8 h-8 tech-corner-tl opacity-80 tech-pulse pointer-events-none" />
                <div className="absolute top-6 right-6 w-8 h-8 tech-corner-tr opacity-80 tech-pulse pointer-events-none" />
                <div className="absolute bottom-6 left-6 w-8 h-8 tech-corner-bl opacity-80 tech-pulse pointer-events-none" />
                <div className="absolute bottom-6 right-6 w-8 h-8 tech-corner-br opacity-80 tech-pulse pointer-events-none" />

                {/* BIOMETRIC GUIDELINE BRACKET (CENTER RADAR) */}
                {status === "Idle" && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-52 h-52 border-2 border-indigo-500/25 border-dashed rounded-full biometric-radar flex items-center justify-center">
                      <div className="w-44 h-44 border border-indigo-400/30 rounded-full flex items-center justify-center">
                        <div className="w-3 text-center text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                          Align Face
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SCANNING RADIAL GLOWING LASER LINE */}
                {status === "Processing..." && (
                  <div className="absolute left-0 w-full h-1 bg-indigo-400/90 shadow-[0_0_12px_4px_rgba(99,102,241,0.8)] scanner-laser pointer-events-none" />
                )}

                {/* STATUS BADGE OVERLAY */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`
                    text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-md backdrop-blur-md border text-white
                    ${status === "Processing..." ? "bg-indigo-600/85 border-indigo-500 shimmer-bg" : ""}
                    ${status === "Success" ? "bg-emerald-600/85 border-emerald-500" : ""}
                    ${status === "Blocked" ? "bg-amber-600/85 border-amber-500" : ""}
                    ${status === "Error" ? "bg-rose-600/85 border-rose-500" : ""}
                    ${status === "Idle" ? "bg-slate-900/85 border-slate-700" : ""}
                  `}>
                    {status === "Processing..." ? "System Scanning..." : `Status: ${status}`}
                  </span>
                </div>
              </div>
            </div>

            {/* SCAN RECOGNITION TRIGGER BUTTON */}
            <button
              onClick={handleRecognize}
              disabled={status === "Processing..."}
              className={`
                w-full py-4 rounded-2xl font-bold text-base shadow-xl tracking-wide transition-all duration-300 transform active:scale-[0.99] cursor-pointer
                ${
                  status === "Processing..."
                    ? "bg-slate-300 text-slate-500 shadow-inner cursor-not-allowed border border-slate-200"
                    : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-indigo-200 hover:shadow-2xl hover:scale-[1.01]"
                }
              `}
            >
              {status === "Processing..." ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing Recognition...
                </span>
              ) : (
                "Trigger Face Recognition"
              )}
            </button>
          </div>

          {/* BIO DETAILS PANEL (RIGHT) */}
          <div className="lg:col-span-5 flex flex-col gap-6 w-full">
            
            {/* STUDENT DETAILS GLASS PANEL */}
            <div className="glass-panel rounded-3xl p-6 shadow-xl border border-indigo-100 flex flex-col gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/60 rounded-full blur-2xl -z-10 pointer-events-none" />
              
              <h2 className="text-lg font-extrabold text-indigo-900 border-b border-indigo-100/50 pb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
                Live Biometric Data
              </h2>

              <div className="space-y-4">
                {/* REGISTRATION ID */}
                <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col gap-1 transition-all duration-300 hover:bg-slate-100/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Registration No (USN)
                  </span>
                  <div className={`text-base font-extrabold transition-all duration-300 ${
                    recognizedName === "USN will appear here" ? "text-slate-400 font-medium" : "text-indigo-800"
                  }`}>
                    {recognizedName}
                  </div>
                </div>

                {/* NAME OF STUDENT */}
                <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col gap-1 transition-all duration-300 hover:bg-slate-100/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Student Name
                  </span>
                  <div className={`text-base font-extrabold transition-all duration-300 ${
                    recognizedStudentName === "Name will appear here" ? "text-slate-400 font-medium" : "text-indigo-800"
                  }`}>
                    {recognizedStudentName}
                  </div>
                </div>
              </div>
            </div>

            {/* ATTENDANCE AND SCHEDULE */}
            <div className="glass-panel rounded-3xl p-6 shadow-xl border border-indigo-100 flex flex-col gap-4">
              <h2 className="text-lg font-extrabold text-indigo-900 border-b border-indigo-100/50 pb-3">
                Attendance Log
              </h2>
              
              <div className="flex justify-between items-center bg-slate-50/70 border border-slate-100 p-4 rounded-2xl">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Current Period</p>
                  <p className="font-extrabold text-indigo-600 text-lg mt-0.5">{period}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                  {period !== "No Period" ? period.charAt(0) : "-"}
                </div>
              </div>

              {attendanceMessage && (
                <div className={`
                  p-4 rounded-2xl border text-sm font-semibold flex items-center gap-3 animate-modal-enter
                  ${status === "Success" ? "bg-emerald-50/85 border-emerald-200 text-emerald-800" : ""}
                  ${status === "Blocked" ? "bg-amber-50/85 border-amber-200 text-amber-800" : ""}
                  ${status === "Error" ? "bg-rose-50/85 border-rose-200 text-rose-800" : ""}
                `}>
                  <span className="text-lg">
                    {status === "Success" ? "✅" : ""}
                    {status === "Blocked" ? "⚠️" : ""}
                    {status === "Error" ? "❌" : ""}
                  </span>
                  <div>{attendanceMessage}</div>
                </div>
              )}
            </div>

            {/* SYSTEM INFORMATION CARD */}
            <div className="glass-panel rounded-3xl p-6 shadow-xl border border-indigo-100 flex flex-col gap-3">
              <h2 className="text-sm font-extrabold text-slate-500 uppercase tracking-widest">
                System Info
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                S.A.T.S leverages AI face matching templates securely processed at 15 FPS. Ensure you stand within light limits and orient directly to the frame.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="w-full py-5 bg-white/60 backdrop-blur-md border-t border-slate-200/50 text-center text-xs text-slate-500 mt-auto flex flex-col sm:flex-row justify-between px-8 gap-2">
        <p>© 2026 Smart Attendance Tracking System. All rights reserved.</p>
        <p>
          Need Support?{" "}
          <a
            href="mailto:erandajayawardhane25@gmail.com"
            className="text-indigo-600 font-bold hover:underline"
          >
            erandajayawardhane25@gmail.com
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Front;
