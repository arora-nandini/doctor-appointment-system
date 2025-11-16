import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { store } from "./app/store";

import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";

function PrivateRoute({ children, roles }) {
  const user = useSelector((s) => s.auth.user);
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" />;
  return children;
}

export default function AppWrapper() {
  // wrap PrivateRoute in a small component that consumes store via Provider below
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/patient" element={
            <PrivateRoute roles={["patient"]}>
              <PatientDashboard />
            </PrivateRoute>
          } />

          <Route path="/doctor" element={
            <PrivateRoute roles={["doctor"]}>
              <DoctorDashboard />
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
