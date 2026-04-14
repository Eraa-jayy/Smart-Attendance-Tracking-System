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
        videoRef.current.srcObject = stream;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100">
      {/* HEADER */}
      <div className="flex justify-between items-center px-8 py-4 bg-white/60 backdrop-blur-md border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-indigo-800 ">
          Smart Attendance Tracking System
        </h1>

        <div className="flex gap-4 items-center text-sm">
          {/* <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-600">
            ● {status}
          </span> */}

          <Link to="/Signin">
            <button className="px-4 py-2 rounded-full bg-indigo-800 text-white hover:bg-indigo-600 transition">
              Dashboard
            </button>
          </Link>
        </div>
      </div>

      {/* MAIN DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-6">
        {/* CAMERA */}
        <div className="md:col-span-3 bg-white/60 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-xl p-5">
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-[420px] object-cover"
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
            className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-800 to-violet-600 text-white font-semibold hover:scale-[1.02] transition"
          >
            Recognize Face
          </button>
        </div>

        {/* INFO PANEL */}
        <div className="md:col-span-2 flex flex-col gap-4">
          {/* STUDENT */}
          <div className="bg-white/60 backdrop-blur-xl border border-slate-200 rounded-3xl p-5 shadow-xl">
            <h2 className="text-xl font-extrabold text-indigo-800 mb-4">
              Student Information
            </h2>
            <div className="space-y-2">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-s text-black mb-2 font-bold">
                  Registration Number
                </p>

                <div
                  className={`w-full px-3 py-2 rounded-lg border shadow-sm ${
                    recognizedName === "USN will appear here"
                      ? "text-xs text-gray-400"
                      : "text-indigo-700 font-semibold"
                  } bg-white border-indigo-200`}
                >
                  {recognizedName}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-s text-black mb-2 font-bold">Student Name</p>

                <div
                  className={`w-full px-3 py-2 rounded-lg border shadow-sm ${
                    recognizedStudentName === "Name will appear here"
                      ? "text-xs text-gray-400"
                      : "text-indigo-700 font-semibold"
                  } bg-white border-indigo-200`}
                >
                  {recognizedStudentName}
                </div>
              </div>
            </div>
          </div>

          {/* ATTENDANCE */}
          {/* <div className="bg-white/60 backdrop-blur-xl border border-slate-200 rounded-3xl p-5 shadow-xl">
            <h2 className="text-xl font-extrabold text-indigo-800 mb-4">
              Attendance
            </h2>
            <p className="text-sm text-gray-600">Current Period</p>
            <p className="font-bold text-indigo-600 mb-3">{period}</p>

            {attendanceMessage && (
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-gray-700 text-sm">
                {attendanceMessage}
              </div>
            )}
          </div> */}

          {/* STATUS */}
          <div className="bg-white/60 backdrop-blur-xl border border-slate-200 rounded-3xl p-5 shadow-xl">
            <h2 className="text-xl font-extrabold text-indigo-800 mb-4">
              About
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              The Smart Attendance Tracking System is currently operating in
              real-time mode, utilizing AI-powered face recognition to identify
              students and record attendance securely. The system automatically
              validates class periods and ensures accurate attendance logging
              with minimal manual intervention.
            </p>
          </div>
        </div>
      </div>
      <footer className="w-full mt-10 py-4 bg-white/60 backdrop-blur-md border-t border-slate-200 text-center text-sm text-gray-600">
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
