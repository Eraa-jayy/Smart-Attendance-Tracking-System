import React, { useState } from "react";
import { Camera, ShieldCheck, Clock, Users } from "lucide-react";
import toast from "react-hot-toast";

const Signin = () => {
  const [authMode, setAuthMode] = useState("login");

  const toastStyle = {
    style: {
      background: "rgba(255,255,255,0.85)",
      color: "#1e1b4b",
      border: "1px solid #c7d2fe",
      backdropFilter: "blur(12px)",
    },
  };

  // 🔵 SIGNUP
  const handleSignup = async () => {
    const username = document.querySelector("#signup-username").value;
    const email = document.querySelector("#signup-email").value;
    const password = document.querySelector("#signup-password").value;
    const retypePassword = document.querySelector("#signup-retype").value;

    if (!username || !email || !password || !retypePassword) {
      return toast.error("Please fill all fields!", toastStyle);
    }

    if (password !== retypePassword) {
      return toast.error("Passwords do not match!", {
        ...toastStyle,
        iconTheme: { primary: "#ef4444", secondary: "#fff" },
      });
    }

    try {
      const response = await fetch("http://localhost:5001/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("SignUp successful!", {
          ...toastStyle,
          iconTheme: { primary: "#4f46e5", secondary: "#fff" },
        });
        setAuthMode("login");
      } else {
        toast.error(data.message || "SignUp failed!", toastStyle);
      }
    } catch (err) {
      toast.error("Server error. Try again later.", toastStyle);
    }
  };

  // 🔵 SIGNIN
  const handleSignin = async () => {
    const emailOrUsername = document.querySelector("#signin-email").value;
    const password = document.querySelector("#signin-password").value;

    if (!emailOrUsername || !password) {
      return toast.error("Please fill all fields!", toastStyle);
    }

    try {
      const response = await fetch("http://localhost:5001/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailOrUsername,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Welcome back! LogIn successful 🎉", {
          ...toastStyle,
          iconTheme: { primary: "#4f46e5", secondary: "#fff" },
        });

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } else {
        toast.error(data.message || "Invalid credentials!", toastStyle);
      }
    } catch (err) {
      toast.error("SignIn failed. Please try again.", toastStyle);
    }
  };

  const benefits = [
    {
      icon: <Camera className="w-6 h-6 text-white" />,
      title: "Face Recognition AI",
      desc: "Automatically identifies students using computer vision.",
    },
    {
      icon: <Clock className="w-6 h-6 text-white" />,
      title: "Real-Time Tracking",
      desc: "Attendance is recorded instantly based on class periods.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      title: "Secure System",
      desc: "Encrypted and validated attendance records.",
    },
    {
      icon: <Users className="w-6 h-6 text-white" />,
      title: "Admin Control",
      desc: "Full dashboard access for monitoring students.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100">
      {/* NAVBAR - CENTERED */}
      <div className="flex justify-center px-4 py-4 bg-white/60 backdrop-blur-md border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-indigo-800 text-center">
          Smart Attendance Tracking System
        </h1>
      </div>

      {/* MAIN CONTENT - CENTERED */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-5xl bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
          {/* GRID ROWS ON LARGE, COLS ON SMALL */}
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* LEFT - INFO + BENEFITS */}
            <div className="p-8 sm:p-10 bg-gradient-to-br from-indigo-800 to-violet-700 text-white">
              <h1 className="text-xl sm:text-2xl font-extrabold mb-4">
                Welcome to Smart Attendance Tracking System!
              </h1>

              <p className="text-indigo-100 text-sm mb-6">
                AI‑powered attendance system with face recognition and real‑time tracking.
              </p>

              <div className="grid gap-4">
                {benefits.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-3 bg-white/10 border border-white/20 rounded-2xl p-4"
                  >
                    <div className="p-2 bg-white/10 rounded-xl">{item.icon}</div>
                    <div>
                      <p className="font-semibold text-sm">{item.title}</p>
                      <p className="text-xs text-indigo-100">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT - FORM */}
            <div className="p-8 sm:p-10 flex flex-col justify-center">
              <h2 className="text-2xl font-extrabold text-indigo-800 mb-4 text-center">
                {authMode === "login"
                  ? "Administrator LogIn"
                  : "Administrator SignUp"}
              </h2>

              {/* LOGIN / SIGNUP TABS */}
             <div className="flex gap-3 mb-4 mt-2">
  <button
    onClick={() => setAuthMode("login")}
    className={`
      flex-1 py-3 rounded-xl font-semibold
      transition-colors duration-150
      ${authMode === "login"
        ? "bg-indigo-800 text-white"
        : "bg-slate-100 text-gray-600 hover:bg-slate-200"
      }
    `}
  >
    LogIn
  </button>
  <button
    onClick={() => setAuthMode("signup")}
    className={`
      flex-1 py-3 rounded-xl font-semibold
      transition-colors duration-150
      ${authMode === "signup"
        ? "bg-indigo-800 text-white"
        : "bg-slate-100 text-gray-600 hover:bg-slate-200"
      }
    `}
  >
    SignUp
  </button>
</div>

              {/* LOGIN FORM */}
              {authMode === "login" ? (
                <>
                  <input
                    id="signin-email"
                    placeholder="Email / Username"
                    className="w-full mb-4 px-4 py-3 rounded-xl border border-slate-200 bg-white/90 focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                  />
                  <input
                    id="signin-password"
                    type="password"
                    placeholder="Password"
                    className="w-full mb-6 px-4 py-3 rounded-xl border border-slate-200 bg-white/90 focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                  />
                  <button
                    onClick={handleSignin}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-800 to-violet-600 text-white font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  <input
                    id="signup-username"
                    placeholder="Username"
                    className="w-full mb-3 px-4 py-3 rounded-xl border border-slate-200 bg-white/90 focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                  />
                  <input
                    id="signup-email"
                    placeholder="Email"
                    className="w-full mb-3 px-4 py-3 rounded-xl border border-slate-200 bg-white/90 focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                  />
                  <input
                    id="signup-password"
                    type="password"
                    placeholder="Password"
                    className="w-full mb-3 px-4 py-3 rounded-xl border border-slate-200 bg-white/90 focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                  />
                  <input
                    id="signup-retype"
                    type="password"
                    placeholder="Retype Password"
                    className="w-full mb-6 px-4 py-3 rounded-xl border border-slate-200 bg-white/90 focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                  />
                  <button
                    onClick={handleSignup}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-800 to-violet-600 text-white font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER - CENTERED */}
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

export default Signin;