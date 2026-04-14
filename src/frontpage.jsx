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
      <div className="flex justify-between items-center px-4 sm:px-8 py-4 bg-white/60 backdrop-blur-md border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-indigo-800 text-left-align flex-1">
          Smart Attendance Tracking System
        </h1>

        <div className="flex gap-4 items-center text-sm">
          <Link to="/Signin">
            <button className="px-4 py-2 rounded-full bg-indigo-800 text-white hover:bg-indigo-600 transition-colors">
              Dashboard
            </button>
          </Link>
        </div>
      </div>

      {/* MAIN DASHBOARD */}
      <div className="flex-1 p-4 sm:p-6">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* CAMERA */}
          <div
            className="lg:col-span-3 bg-white/80 backdrop-blur-xl border border-indigo-200/50 rounded-3xl shadow-xl p-8"
            style={{ height: "480px" }}
          >
            {" "}
            {/* or whatever height you want */}
            <div className="w-full h-[360px] rounded-3xl overflow-hidden border border-indigo-200/50 shadow-lg">
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
            </div>
            <button
              onClick={handleRecognize}
              className="mt-3 w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-800 to-violet-600 text-white font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200"
            >
              Recognize Face
            </button>
          </div>

          {/* INFO PANEL */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* STUDENT INFO */}
            <div className="bg-white/80 backdrop-blur-xl border border-indigo-200/50 rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-extrabold text-indigo-800 mb-4">
                Student Information
              </h2>
              <div className="space-y-4">
                {/* USN */}
                <div className="bg-slate-50/80 rounded-xl p-4">
                  <p className="text-sm text-gray-700 mb-2 font-semibold">
                    Registration Number
                  </p>
                  <div
                    className={`w-full px-4 py-3 rounded-xl border shadow-sm bg-white border-indigo-200/50 ${
                      recognizedName === "USN will appear here"
                        ? "text-sm text-gray-400"
                        : "text-indigo-700 font-semibold"
                    }`}
                  >
                    {recognizedName}
                  </div>
                </div>

                {/* NAME */}
                <div className="bg-slate-50/80 rounded-xl p-4">
                  <p className="text-sm text-gray-700 mb-2 font-semibold">
                    Student Name
                  </p>
                  <div
                    className={`w-full px-4 py-3 rounded-xl border shadow-sm bg-white border-indigo-200/50 ${
                      recognizedStudentName === "Name will appear here"
                        ? "text-sm text-gray-400"
                        : "text-indigo-700 font-semibold"
                    }`}
                  >
                    {recognizedStudentName}
                  </div>
                </div>
              </div>
            </div>

            {/* ATTENDANCE */}
            <div className="bg-white/80 backdrop-blur-xl border border-indigo-200/50 rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-extrabold text-indigo-800 mb-4">
                Attendance
              </h2>
              <p className="text-sm text-gray-600 mb-1">Current Period</p>
              <p className="font-bold text-indigo-600 text-lg">{period}</p>

              {attendanceMessage && (
                <div className="mt-4 p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 text-gray-700 text-sm">
                  {attendanceMessage}
                </div>
              )}
            </div>

            {/* ABOUT / STATUS */}
            <div className="bg-white/80 backdrop-blur-xl border border-indigo-200/50 rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-extrabold text-indigo-800 mb-4">
                About
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                The Smart Attendance Tracking System is currently operating in
                real‑time mode, utilizing AI‑powered face recognition to
                identify students and record attendance securely. The system
                automatically validates class periods and ensures accurate
                attendance logging with minimal manual intervention.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="w-full py-4 bg-white/60 backdrop-blur-md border-t border-slate-200 text-center text-sm text-gray-600 mt-auto">
        <p>© 2026 Smart Attendance Tracking System. All rights reserved.</p>
        <p className="mt-1">
          Contact:{" "}
          <a
            href="mailto:erandajayawardhane25@gmail.com"
            className="text-indigo-600 font-medium hover:underline"
          >
            erandajayawardhane25@gmail.com
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Front;
