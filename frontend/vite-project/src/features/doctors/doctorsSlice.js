import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

export const fetchDoctors = createAsyncThunk("doctors/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await API.get("/doctors");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: "Failed to load doctors" });
  }
});

const doctorsSlice = createSlice({
  name: "doctors",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchDoctors.pending, (s) => { s.loading = true; s.error = null; });
    b.addCase(fetchDoctors.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; });
    b.addCase(fetchDoctors.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message || a.error.message; });
  },
});

export default doctorsSlice.reducer;
