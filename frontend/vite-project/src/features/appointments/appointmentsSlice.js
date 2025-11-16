import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

// patient books appointment -> backend also creates queue item
export const bookAppointment = createAsyncThunk("appointments/book", async (payload, { rejectWithValue }) => {
  try {
    const res = await API.post("/appointments", payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: "Booking failed" });
  }
});

export const fetchAppointmentsForUser = createAsyncThunk("appointments/fetchUser", async (_, { rejectWithValue }) => {
  try {
    const res = await API.get("/appointments/user");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: "Failed to load user appointments" });
  }
});

export const fetchAppointmentsForDoctor = createAsyncThunk("appointments/fetchDoctor", async (_, { rejectWithValue }) => {
  try {
    const res = await API.get("/appointments/doctor");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: "Failed to load doctor appointments" });
  }
});

export const updateAppointmentStatus = createAsyncThunk("appointments/updateStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const res = await API.patch(`/appointments/${id}/status`, { status });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: "Update failed" });
  }
});

const slice = createSlice({
  name: "appointments",
  initialState: { userList: [], doctorList: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(bookAppointment.pending, (s) => { s.loading = true; s.error = null; });
    b.addCase(bookAppointment.fulfilled, (s, a) => { s.loading = false; s.userList.push(a.payload); });
    b.addCase(bookAppointment.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message || a.error.message; });

    b.addCase(fetchAppointmentsForUser.fulfilled, (s, a) => { s.userList = a.payload; });
    b.addCase(fetchAppointmentsForDoctor.fulfilled, (s, a) => { s.doctorList = a.payload; });

    b.addCase(updateAppointmentStatus.fulfilled, (s, a) => {
      // update entries in both lists if present
      s.userList = s.userList.map((it) => (it._id === a.payload._id ? a.payload : it));
      s.doctorList = s.doctorList.map((it) => (it._id === a.payload._id ? a.payload : it));
    });
  },
});

export default slice.reducer;
