import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

// login thunk
export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const res = await API.post("/auth/login", credentials);
    // res.data has token, user, doctor
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: "Login failed" });
  }
});

export const register = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const res = await API.post("/auth/register", payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: "Register failed" });
  }
});

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  doctor: JSON.parse(localStorage.getItem("doctor")) || null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.doctor = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("doctor");
      localStorage.removeItem("token");
    },
    setDoctor(state, action) {
      state.doctor = action.payload;
      localStorage.setItem("doctor", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(login.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.token = a.payload.token;
        s.doctor = a.payload.doctor || null;
        localStorage.setItem("user", JSON.stringify(a.payload.user));
        localStorage.setItem("token", a.payload.token);
        if (a.payload.doctor) localStorage.setItem("doctor", JSON.stringify(a.payload.doctor));
      })
      .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message || a.error.message; })

      .addCase(register.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(register.fulfilled, (s) => { s.loading = false; })
      .addCase(register.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message || a.error.message; });
  },
});

export const { logout, setDoctor } = authSlice.actions;
export default authSlice.reducer;
