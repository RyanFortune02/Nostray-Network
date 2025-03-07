import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import api from "../api";

// Component to restrict access based on user roles
function RoleBasedRoute({ children, allowedRoles = [] }) {
  const [hasRequiredRole, setHasRequiredRole] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Get user roles from API
    const fetchUserRoles = async () => {
      try {
        const response = await api.get("/api/user/roles/");

        if (!response || !response.data) {
          console.error("Invalid response from roles API");
          setHasRequiredRole(false);
          return;
        }

        const roles = response.data.roles || [];
        console.log(`User roles: ${JSON.stringify(roles)}`);

        setUserRoles(roles);

        // Check if the allowedRoles array is empty (no restriction)
        if (allowedRoles.length === 0) {
          // No specific roles required, just authentication
          setHasRequiredRole(true);
        } else {
          // Check if user has any of the required roles
          // If roles array is empty, automatically deny access
          if (roles.length === 0) {
            console.log("User has no roles, access denied");
            setHasRequiredRole(false);
            return;
          }

          const hasRole = roles.some((role) => allowedRoles.includes(role));
          console.log(
            `Required roles: ${JSON.stringify(
              allowedRoles
            )}, has access: ${hasRole}`
          );
          setHasRequiredRole(hasRole);
        }
      } catch (error) {
        console.error("Error fetching user roles:", error);
        setHasRequiredRole(false);
      }
    };

    fetchUserRoles();
  }, [allowedRoles]);

  /**\
   * The effect will run when: hasRequiredRole changes from null to true/false or
   * between true/false redirecting changes between true/false allowedRoles reference changes
   * If a user doesn't have required role, show alert and then redirect
   */
  useEffect(() => {
    if (hasRequiredRole === false && !redirecting) {
      setRedirecting(true);

      // Show an alert to the user
      alert(
        `Access denied: You don't have permission to view this page. Allowed roles: ${allowedRoles.join(
          ", "
        )}`
      );
    }
  }, [hasRequiredRole, redirecting, allowedRoles]);

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
