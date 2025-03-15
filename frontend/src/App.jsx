import { StrictMode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import PublicPage from "./pages/PublicPage";
import "./index.css";

// Dashboard Pages
import OverviewPage from "./DashboardPages/OverviewPage";
import AnimalsPage from "./DashboardPages/AnimalsPage";
import HRPage from "./DashboardPages/HRPage";
import MessagesPage from "./DashboardPages/MessagesPage";
import AnalyticsPage from "./DashboardPages/AnalyticsPage";

// Components
import Sidebar from "./components/common/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import VolunteersPage from "./DashboardPages/VolunteersPage";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear(); //So there are no access tokens lingering around in local storage
  return <Register />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages Routes */}
        <Route path="" element={<PublicPage />} />
        <Route path="/" element={<PublicPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />

        {/* Dashboard Routes with Sidebar */}
        <Route
          path="/dashboard/*"
          element={
            <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
              <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
                <div className="absolute inset-0 backdrop-blur-sm" />
              </div>
              <Sidebar />
              <Routes>
                {/* Overview accessible to all authenticated users */}
                <Route
                  path="overview"
                  element={
                    <ProtectedRoute>
                      <OverviewPage />
                    </ProtectedRoute>
                  }
                />
                {/* Animals accessible to all authenticated users */}
                <Route
                  path="animals"
                  element={
                    <ProtectedRoute>
                      <AnimalsPage />
                    </ProtectedRoute>
                  }
                />
                {/* HR page restricted to HR and CEO roles */}
                <Route
                  path="hr"
                  element={
                    <RoleBasedRoute allowedRoles={["hr", "ceo"]}>
                      <HRPage />
                    </RoleBasedRoute>
                  }
                />
                {/* Volunteer page accessible to all authenticated users */}
                <Route
                  path="volunteers"
                  element={
                    <ProtectedRoute>
                      <VolunteersPage />
                    </ProtectedRoute>
                  }
                />
                {/* Messages accessible to all authenticated users */}
                <Route
                  path="messages"
                  element={
                    <ProtectedRoute>
                      <MessagesPage />
                    </ProtectedRoute>
                  }
                />
                {/* Analytics page restricted to CEO role only */}
                <Route
                  path="analytics"
                  element={
                    <RoleBasedRoute allowedRoles={["ceo"]}>
                      <AnalyticsPage />
                    </RoleBasedRoute>
                  }
                />
                {/* Other routes */}
                <Route
                  path="*"
                  element={
                    <ProtectedRoute>
                      <NotFound />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
