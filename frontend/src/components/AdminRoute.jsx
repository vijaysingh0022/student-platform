import React from "react";
import { Navigate } from "react-router-dom";
import { ADMIN_SESSION_KEY } from "../pages/AdminLogin.jsx";

const AdminRoute = ({ children }) => {
  const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
  if (session !== "authenticated") {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
};

export default AdminRoute;
