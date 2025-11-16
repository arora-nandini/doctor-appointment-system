import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

export const fetchQueueForDoctor = createAsyncThunk("queue/fetchDoctor", async (_, { rejectWithValue }) => {
  try {
    const res = await API.get("/queue/doctor");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: "Failed to load queue" });
  }
});

export const updateQueueStatus = createAsyncThunk("queue/updateStatus", async ({ queueItemId, status }, { rejectWithValue }) => {
  try {
    const res = await API.patch(`/queue/${queueItemId}`, { status });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: "Failed to update queue item" });
  }
});

export const getQueuePositionForPatient = createAsyncThunk("queue/getPosition", async (appointmentId, { rejectWithValue }) => {
  try {
    const res = await API.get(`/queue/patient/queue/${appointmentId}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: "Failed to get position" });
  }
});

const slice = createSlice({
  name: "queue",
  initialState: { doctorQueue: [], checkingPosition: null, loading: false, error: null },
  reducers: {
    setDoctorQueue(state, action) {
      state.doctorQueue = action.payload;
    },
    clearQueue(state) {
      state.doctorQueue = [];
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchQueueForDoctor.fulfilled, (s, a) => { s.doctorQueue = a.payload; s.loading = false; });
    b.addCase(fetchQueueForDoctor.pending, (s) => { s.loading = true; s.error = null; });
    b.addCase(fetchQueueForDoctor.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message || a.error.message; });

    b.addCase(updateQueueStatus.fulfilled, (s, a) => {
      // a is the updated queueItem
      s.doctorQueue = s.doctorQueue.map((q) => (q._id === a.payload._id ? a.payload : q));
    });

    b.addCase(getQueuePositionForPatient.fulfilled, (s, a) => {
      s.checkingPosition = a.payload;
    });
  },
});

export const { setDoctorQueue, clearQueue } = slice.actions;
export default slice.reducer;
