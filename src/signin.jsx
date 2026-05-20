import React, { useState } from "react";
import { Camera, ShieldCheck, Clock, Users, Mail, Lock, User, UserPlus, LogIn } from "lucide-react";
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
              Portal Authentication
            </p>
          </div>
        </div>

        <Link to="/">
          <button className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm shadow-sm hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 cursor-pointer">
            Back to Scanner
          </button>
        </Link>
      </header>

      {/* MAIN CONTENT - CENTERED */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-5xl bg-white/80 backdrop-blur-xl border border-indigo-100 rounded-3xl shadow-2xl overflow-hidden glass-panel">
          {/* GRID ROWS ON LARGE, COLS ON SMALL */}
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* LEFT - INFO + BENEFITS (5 cols) */}
            <div className="lg:col-span-5 p-8 sm:p-10 bg-gradient-to-br from-indigo-800 to-violet-750 text-white flex flex-col justify-between gap-6 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              
              <div>
                <h1 className="text-2xl font-black mb-3 tracking-tight">
                  Welcome to S.A.T.S
                </h1>
                <p className="text-indigo-100 text-xs leading-relaxed font-medium">
                  AI-powered biometric schedule verification tracking. Seamless administration starts here.
                </p>
              </div>

              <div className="grid gap-3.5 my-auto">
                {benefits.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-3 bg-white/5 border border-white/10 rounded-2xl p-3.5 hover:bg-white/10 transition-colors duration-250"
                  >
                    <div className="p-2 bg-indigo-600/40 rounded-xl flex items-center justify-center h-10 w-10 flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-bold text-xs">{item.title}</p>
                      <p className="text-[10px] text-indigo-200/90 font-medium leading-normal mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[10px] text-indigo-300 font-semibold uppercase tracking-wider">
                Authorized access only
              </div>
            </div>

            {/* RIGHT - FORM (7 cols) */}
            <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center gap-6 bg-white/35">
              <div>
                <h2 className="text-2xl font-extrabold text-indigo-900 tracking-tight text-center">
                  {authMode === "login" ? "Administrator Login" : "Create Admin Account"}
                </h2>
                <p className="text-xs text-slate-500 text-center mt-1 font-medium">
                  Please authenticate to access the backend dashboard panels.
                </p>
              </div>

              {/* LOGIN / SIGNUP TABS */}
              <div className="flex bg-slate-100 p-1 rounded-2xl max-w-sm mx-auto w-full">
                <button
                  onClick={() => setAuthMode("login")}
                  className={`
                    flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5
                    ${authMode === "login"
                      ? "bg-white text-indigo-900 shadow-md shadow-slate-200/50"
                      : "text-slate-500 hover:text-slate-800"
                    }
                  `}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  LogIn
                </button>
                <button
                  onClick={() => setAuthMode("signup")}
                  className={`
                    flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5
                    ${authMode === "signup"
                      ? "bg-white text-indigo-900 shadow-md shadow-slate-200/50"
                      : "text-slate-500 hover:text-slate-800"
                    }
                  `}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  SignUp
                </button>
              </div>

              {/* DYNAMIC FORM CONTAINER */}
              <div className="space-y-4 animate-modal-enter">
                {authMode === "login" ? (
                  <>
                    {/* EMAIL INPUT */}
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-200">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        id="signin-email"
                        type="text"
                        placeholder="Email or Username"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white/95 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-sm font-semibold outline-none placeholder:text-slate-400 placeholder:font-medium"
                      />
                    </div>

                    {/* PASSWORD INPUT */}
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-200">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        id="signin-password"
                        type="password"
                        placeholder="Password"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white/95 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-sm font-semibold outline-none placeholder:text-slate-400 placeholder:font-medium"
                      />
                    </div>

                    <button
                      onClick={handleSignin}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-650 text-white font-bold text-sm shadow-xl shadow-indigo-100 hover:shadow-indigo-200 hover:scale-[1.01] active:scale-[0.99] transition-all duration-250 mt-2 cursor-pointer flex items-center justify-center gap-2"
                    >
                      Authenticate Access
                    </button>
                  </>
                ) : (
                  <>
                    {/* SIGNUP USERNAME */}
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-200">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        id="signup-username"
                        type="text"
                        placeholder="Username"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white/95 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-sm font-semibold outline-none placeholder:text-slate-400 placeholder:font-medium"
                      />
                    </div>

                    {/* SIGNUP EMAIL */}
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-200">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        id="signup-email"
                        type="email"
                        placeholder="Email Address"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white/95 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-sm font-semibold outline-none placeholder:text-slate-400 placeholder:font-medium"
                      />
                    </div>

                    {/* SIGNUP PASSWORD */}
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-200">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        id="signup-password"
                        type="password"
                        placeholder="Password"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white/95 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-sm font-semibold outline-none placeholder:text-slate-400 placeholder:font-medium"
                      />
                    </div>

                    {/* SIGNUP RETYPE PASSWORD */}
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-200">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        id="signup-retype"
                        type="password"
                        placeholder="Retype Password"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white/95 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-sm font-semibold outline-none placeholder:text-slate-400 placeholder:font-medium"
                      />
                    </div>

                    <button
                      onClick={handleSignup}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-650 text-white font-bold text-sm shadow-xl shadow-indigo-100 hover:shadow-indigo-200 hover:scale-[1.01] active:scale-[0.99] transition-all duration-250 mt-2 cursor-pointer"
                    >
                      Register New Administrator
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* FOOTER - CENTERED */}
      <footer className="w-full py-5 bg-white/60 backdrop-blur-md border-t border-slate-200 text-center text-xs text-slate-500 mt-auto">
        <p>© 2026 Smart Attendance Tracking System. All rights reserved.</p>
        <p className="mt-1 font-medium">
          Contact Support:{" "}
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

export default Signin;