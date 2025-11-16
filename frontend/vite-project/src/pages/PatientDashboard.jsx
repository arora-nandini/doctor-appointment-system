import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DoctorList from "../components/DoctorList";
import BookAppointment from "../components/BookAppointment";
import AppointmentsList from "../components/AppointmentsList";
import QueuePosition from "../components/QueuePosition";
import { logout } from "../features/auth/authSlice";

export default function PatientDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  return (
    <div className="min-h-screen bg-[#F0FDF4] p-6">

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="
          flex justify-between items-center p-4 rounded-xl shadow 
          border border-emerald-100 
          bg-linear-to-br from-emerald-300/40 to-emerald-600/40 
          backdrop-blur-lg
        ">
          <div>
            <h2 className="text-2xl font-semibold text-[#064E3B]">
              Welcome, {user?.name}
            </h2>
            <p className="text-emerald-900/80 text-sm">
              Book appointments & view your queue position
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow p-6">
            {!selectedDoctor && (
              <>
                <h3 className="text-xl font-semibold mb-4 text-emerald-800">
                  Available Doctors
                </h3>
                <DoctorList onSelect={setSelectedDoctor} />
              </>
            )}

            {selectedDoctor && (
              <>
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="mb-4 text-emerald-700 hover:underline"
                >
                  ← Back to list
                </button>

                <div className="bg-white">
                  <BookAppointment
                    doctor={selectedDoctor}
                    onBooked={() => setSelectedDoctor(null)}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">

          {/* Appointments */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-3 text-emerald-800">
              My Appointments
            </h3>
            <AppointmentsList
              forDoctor={false}
              onSelectAppointment={(a) => alert(`Appointment ID: ${a._id}`)}
            />
          </div>

          {/* Queue Position */}
          <div className="bg-white rounded-xl shadow p-6">
            <QueuePosition />
          </div>

        </div>
      </div>
    </div>
  );
}

