import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQueuePositionForPatient } from "../features/queue/queueSlice";

export default function QueuePosition() {
  const [appointmentId, setAppointmentId] = useState("");
  const dispatch = useDispatch();
  const { checkingPosition } = useSelector((s) => s.queue);

  const check = async () => {
    if (!appointmentId) return alert("Enter an appointment ID");
    try {
      await dispatch(getQueuePositionForPatient(appointmentId)).unwrap();
    } catch (err) {
      alert(err?.message || "Failed to fetch queue position");
    }
  };

  return (
    <div className="space-y-4">

      {/* Title */}
      <h4 className="text-lg font-semibold text-slate-800">
        Check My Queue Position
      </h4>

      {/* Form */}
      <div className="flex gap-2">
        <input
          placeholder="Enter appointment ID"
          value={appointmentId}
          onChange={(e) => setAppointmentId(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white shadow-sm
                     outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
        />

        <button
          onClick={check}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow 
                     text-sm font-medium transition"
        >
          Check
        </button>
      </div>

      {/* Results */}
      {checkingPosition && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg shadow-sm space-y-2">

          <div className="text-slate-700">
            <span className="font-semibold">Position:</span> {checkingPosition.position}
          </div>

          <div className="text-slate-700">
            <span className="font-semibold">Status:</span> {checkingPosition.status}
          </div>

          <div className="text-slate-700">
            <span className="font-semibold">Doctor:</span>{" "}
            {checkingPosition.doctor?.user?.name ||
              checkingPosition.doctor?.name ||
              "Unknown"}
          </div>

          <div className="text-slate-700">
            <span className="font-semibold">Appointment:</span>{" "}
            {checkingPosition.appointment?.date} {" "}
            {checkingPosition.appointment?.time}
          </div>
        </div>
      )}

    </div>
  );
}
