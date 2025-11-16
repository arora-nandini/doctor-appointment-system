import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import doctorsReducer from "../features/doctors/doctorsSlice";
import appointmentsReducer from "../features/appointments/appointmentsSlice";
import queueReducer from "../features/queue/queueSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    doctors: doctorsReducer,
    appointments: appointmentsReducer,
    queue: queueReducer,
  },
});
