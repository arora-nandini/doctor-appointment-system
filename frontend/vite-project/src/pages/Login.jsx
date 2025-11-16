import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(login(form)).unwrap();
      if (res.user.role === "doctor") nav("/doctor");
      else nav("/patient");
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0FDF4] p-6">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-[#D1FADF]">

        <h2 className="text-3xl font-semibold text-[#065F46] text-center mb-2">
          Welcome Back
        </h2>

        <p className="text-[#6B7280] text-center mb-8 text-sm">
          Login to continue
        </p>

        <form onSubmit={submit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-[#374151] text-sm">Email</label>
            <input
              type="email"
              className="w-full mt-1 px-4 py-2 border border-[#A7F3D0] rounded-lg 
                         focus:ring-2 focus:ring-emerald-400 outline-none bg-white text-[#374151]"
              placeholder="Enter email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-[#374151] text-sm">Password</label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-2 border border-[#A7F3D0] rounded-lg 
                         focus:ring-2 focus:ring-emerald-400 outline-none bg-white text-[#374151]"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white 
                       font-medium rounded-lg transition shadow-md"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="text-red-600 text-sm mt-3 text-center">{error}</div>
        )}

        {/* Link */}
        <p className="text-center text-[#4B5563] mt-6 text-sm">
          No account?
          <Link to="/register" className="text-emerald-600 ml-1 font-semibold hover:underline">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}
