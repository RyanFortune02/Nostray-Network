import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import api from "../api";

// Component to restrict access based on user roles
function RoleBasedRoute({ children, allowedRoles = [] }) {
  const [hasRequiredRole, setHasRequiredRole] = useState(null);
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    // Get user roles from API
    const fetchUserRoles = async () => {
      try {
        const response = await api.get("/api/user/roles/");
        const roles = response.data.roles || [];
        
        setUserRoles(roles);

        // Check if user has any of the required roles
        if (allowedRoles.length === 0) {
          // No specific roles required, just authentication
          setHasRequiredRole(true);
        } else {
          // Check if user has any of the required roles
          const hasRole = roles.some((role) => allowedRoles.includes(role));
          setHasRequiredRole(hasRole);
        }
      } catch (error) {
        console.error("Error fetching user roles:", error);
        setHasRequiredRole(false);
      }
    };

    fetchUserRoles();
  }, [allowedRoles]);

  // If still checking
  if (hasRequiredRole === null) {
    return <div>Loading role-based access...</div>;
  }

  // If the user is authenticated but doesn't have the required role
  if (hasRequiredRole === false) {
    return <Navigate to="/dashboard/overview" />;
  }

  // If the user has the required role, render the protected route with children
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export default RoleBasedRoute;
