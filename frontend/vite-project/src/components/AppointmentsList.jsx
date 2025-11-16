import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAppointmentsForUser,
  fetchAppointmentsForDoctor,
} from "../features/appointments/appointmentsSlice";

export default function AppointmentsList({ forDoctor = false, onSelectAppointment }) {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.appointments);

  useEffect(() => {
    if (forDoctor) dispatch(fetchAppointmentsForDoctor());
    else dispatch(fetchAppointmentsForUser());
  }, [forDoctor, dispatch]);

  const list = forDoctor ? state.doctorList : state.userList;

  const statusColors = {
    booked: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    "no-show": "bg-yellow-100 text-yellow-800",
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-slate-800">Appointments</h3>

      {list.length === 0 && (
        <div className="text-slate-600 text-sm">No appointments</div>
      )}

      <div className="space-y-4">
        {list.map((a) => (
          <div
            key={a._id}
            className="p-4 rounded-xl bg-white shadow border border-slate-200 hover:shadow-md transition"
          >
            {/* Name */}
            <div className="text-lg font-semibold text-slate-800">
              {forDoctor
                ? a.patient?.name
                : a.doctor?.name || a.doctor?.user?.name}
            </div>

            {/* Date & Time */}
            <div className="text-slate-600 text-sm mt-1">
              {new Date(a.date).toLocaleDateString()} @ {a.time}
            </div>

            {/* Status Badge */}
            <div className="mt-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  statusColors[a.status] || "bg-gray-100 text-gray-800"
                }`}
              >
                {a.status.toUpperCase()}
              </span>
            </div>

            {/* Optional Button */}
            {onSelectAppointment && (
              <div className="mt-4">
                <button
                  onClick={() => onSelectAppointment(a)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg shadow transition"
                >
                  Check Position
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
