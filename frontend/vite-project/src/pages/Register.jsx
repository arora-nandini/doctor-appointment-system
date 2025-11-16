import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const dispatch = useDispatch();
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    specialization: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(register(form)).unwrap();
      nav("/login");
    } catch (err) {
      alert(err?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0FDF4] p-6">

      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg border border-[#D1FADF]">

        <h2 className="text-3xl font-semibold text-[#065F46] text-center mb-2">
          Create Account
        </h2>

        <p className="text-[#6B7280] text-center mb-8 text-sm">
          Join our appointment system
        </p>

        <form onSubmit={submit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="text-[#374151] text-sm">Full Name</label>
            <input
              className="w-full mt-1 px-4 py-2 border border-[#A7F3D0] rounded-lg 
                         focus:ring-2 focus:ring-emerald-400 outline-none bg-white"
              placeholder="Enter name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-[#374151] text-sm">Email</label>
            <input
              className="w-full mt-1 px-4 py-2 border border-[#A7F3D0] rounded-lg 
                         focus:ring-2 focus:ring-emerald-400 outline-none bg-white"
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
                         focus:ring-2 focus:ring-emerald-400 outline-none bg-white"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-[#374151] text-sm">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full mt-1 px-4 py-2 border border-[#A7F3D0] rounded-lg 
                         focus:ring-2 focus:ring-emerald-400 outline-none bg-white"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          {/* Specialization (only for doctors) */}
          {form.role === "doctor" && (
            <div>
              <label className="text-[#374151] text-sm">Specialization</label>
              <input
                className="w-full mt-1 px-4 py-2 border border-[#A7F3D0] rounded-lg 
                           focus:ring-2 focus:ring-emerald-400 outline-none bg-white"
                placeholder="e.g. Dermatologist"
                value={form.specialization}
                onChange={(e) =>
                  setForm({ ...form, specialization: e.target.value })
                }
              />
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white 
                       font-medium rounded-lg transition shadow-md"
          >
            Register
          </button>
        </form>

        {/* Link */}
        <p className="text-center text-[#4B5563] mt-6 text-sm">
          Already have an account?
          <Link to="/login" className="text-emerald-600 ml-1 font-semibold hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}
