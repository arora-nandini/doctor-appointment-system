import React from "react";
import { useDispatch, useSelector } from "react-redux";
import LiveQueue from "../components/LiveQueue";
import AppointmentsList from "../components/AppointmentsList";
import { logout } from "../features/auth/authSlice";

export default function DoctorDashboard() {
  const dispatch = useDispatch();
  const { user, doctor } = useSelector((s) => s.auth);
  const doctorId = doctor?._id || doctor?.id || user?.id;

  return (
    <div className="min-h-screen bg-[#F0FDF4] p-6">

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div
          className="
            flex justify-between items-center p-4 rounded-xl shadow 
            border border-emerald-100 
            bg-linear-to-br from-emerald-300/40 to-emerald-600/40 
            backdrop-blur-lg
          "
        >
          <div>
            <h2 className="text-2xl font-semibold text-[#064E3B]">
              Dr. {user?.name}
            </h2>
            <p className="text-emerald-900/80 text-sm">
              {doctor?.specialization || "Doctor Dashboard"}
            </p>
          </div>

          <button
            onClick={() => dispatch(logout())}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT — Live Queue */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4 text-emerald-800">
              Live Queue
            </h3>
            <LiveQueue doctorId={doctorId} />
          </div>
        </div>

        {/* RIGHT — Appointments */}
        <div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4 text-emerald-800">
              Appointments
            </h3>
            <AppointmentsList forDoctor={true} />
          </div>
        </div>

      </div>
    </div>
  );
}
