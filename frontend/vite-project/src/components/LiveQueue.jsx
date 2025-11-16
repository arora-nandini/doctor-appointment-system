import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQueueForDoctor,
  setDoctorQueue,
  updateQueueStatus,
} from "../features/queue/queueSlice";
import API from "../api/axios";

export default function LiveQueue({ doctorId }) {
  const dispatch = useDispatch();
  const { doctorQueue } = useSelector((s) => s.queue);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!doctorId) return;
    dispatch(fetchQueueForDoctor());

    const s = io("http://localhost:5000");
    socketRef.current = s;

    s.emit("joinDoctorRoom", doctorId);

    s.on("queueUpdated", async () => {
      try {
        const res = await API.get("/queue/doctor");
        dispatch(setDoctorQueue(res.data));
      } catch (err) {
        console.error("Failed to refresh queue", err);
      }
    });

    return () => {
      s.disconnect();
    };
  }, [doctorId, dispatch]);

  const changeStatus = async (queueItemId, status) => {
    try {
      await dispatch(updateQueueStatus({ queueItemId, status })).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const statusColor = {
    "waiting": "bg-gray-100 text-gray-700",
    "in-progress": "bg-yellow-200 text-yellow-900",
    "served": "bg-green-200 text-green-900",
    "skipped": "bg-red-200 text-red-900"
  };

  return (
    <div>

      <h3 className="text-xl font-semibold mb-4 text-slate-800">Live Queue</h3>

      {doctorQueue.length === 0 && (
        <div className="text-slate-600 text-sm">No patients in queue</div>
      )}

      <div className="space-y-4">
        {doctorQueue.map((q) => (
          <div
            key={q._id}
            className={`p-5 rounded-lg shadow border border-slate-200 bg-white transition`}
          >
            {/* Patient Name */}
            <div className="text-lg font-semibold text-slate-800">
              {q.appointment?.patient?.name || "Unknown Patient"}
            </div>

            {/* Position */}
            <div className="text-slate-600 text-sm mt-1">
              Position: <span className="font-medium">{q.position}</span>
            </div>

            {/* Status Badge */}
            <div className="mt-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold 
                ${statusColor[q.status]}`}
              >
                {q.status.toUpperCase()}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4 flex-wrap">
              <button
                onClick={() => changeStatus(q._id, "in-progress")}
                className="px-3 py-1.5 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-sm shadow transition"
              >
                Start
              </button>

              <button
                onClick={() => changeStatus(q._id, "served")}
                className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm shadow transition"
              >
                Mark Served
              </button>

              <button
                onClick={() => changeStatus(q._id, "skipped")}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm shadow transition"
              >
                Skip
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
