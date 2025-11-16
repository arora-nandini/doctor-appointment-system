import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { bookAppointment } from "../features/appointments/appointmentsSlice";

export default function BookAppointment({ doctor, onBooked }) {
  const dispatch = useDispatch();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const book = async () => {
    if (!date || !time) return alert("Pick date and time");
    try {
      await dispatch(
        bookAppointment({ doctor: doctor._id, date, time })
      ).unwrap();
      alert("Booked appointment");
      if (onBooked) onBooked();
    } catch (err) {
      alert(err?.message || "Booking failed");
    }
  };

  return (
    <div className="p-5 rounded-xl bg-white shadow border border-slate-200 space-y-4">

      {/* Title */}
      <h4 className="text-xl font-semibold text-slate-800">
        Book Appointment with {doctor.user?.name}
      </h4>

      {/* Form Inputs */}
      <div className="flex flex-col gap-3">
        <div>
          <label className="text-sm text-slate-700">Select Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 
                       bg-white shadow-sm outline-none focus:ring-2 
                       focus:ring-indigo-400 text-sm"
          />
        </div>

        <div>
          <label className="text-sm text-slate-700">Select Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 
                       bg-white shadow-sm outline-none focus:ring-2 
                       focus:ring-indigo-400 text-sm"
          />
        </div>
      </div>

      {/* Button */}
      <button
        onClick={book}
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white 
                   rounded-lg shadow-md text-sm font-semibold transition"
      >
        Book Appointment
      </button>
    </div>
  );
}
