import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../features/doctors/doctorsSlice";

export default function DoctorList({ onSelect }) {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.doctors);

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  if (loading)
    return (
      <div className="text-slate-600 text-sm animate-pulse">
        Loading doctors...
      </div>
    );

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-slate-800">Doctors</h3>

      <div className="space-y-4">
        {list.map((d) => (
          <div
            key={d._id}
            className="p-4 rounded-xl bg-white shadow border border-slate-200 flex items-center justify-between hover:shadow-md transition"
          >
            {/* Doctor Info */}
            <div>
              <div className="text-lg font-semibold text-slate-800">
                {d.user?.name}
              </div>
              <div className="text-slate-600 text-sm">
                {d.specialization}
              </div>
            </div>

            {/* Select Button */}
            <button
              onClick={() => onSelect(d)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg shadow transition"
            >
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
