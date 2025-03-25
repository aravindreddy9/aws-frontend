import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserRoleFromToken } from "../Utils/AuthUtils";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const [role, setRole] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const userRole = getUserRoleFromToken();
    setRole(userRole);
    setChecking(false);
  }, []);

  if (checking) return <div>Loading...</div>;

  if (!role) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/unauthorized" replace />;

  return children;
};

export default ProtectedRoute;
