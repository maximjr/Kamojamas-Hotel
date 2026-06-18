import React from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const ProtectedRoute = ({ children }: { children: React.JSX.Element }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    // Redirect to login but save the attempted url
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

export const AdminRoute = ({ children }: { children: React.JSX.Element }) => {
  const { user, userData, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  const isAdmin = userData?.role === "ADMIN" || userData?.role === "SUPER_ADMIN";

  if (!user || !userData || !isAdmin) {
    // Redirect to homepage or dashboard if not admin
    return <Navigate to="/" replace />;
  }

  return children;
};
