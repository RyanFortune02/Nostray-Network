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

// Components
import Sidebar from "./components/common/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

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
        {/* Add redirect from empty path to root path with slash (due to weird issue with authenticatipn at empty root path)*/}
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
            <ProtectedRoute>
              <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
                <div className="fixed inset-0 z-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
                  <div className="absolute inset-0 backdrop-blur-sm" />
                </div>
                <Sidebar />
                <Routes>
                  <Route path="/overview" element={<OverviewPage />} />
                  <Route path="/animals" element={<AnimalsPage />} />
                  <Route path="/hr" element={<HRPage />} />
                </Routes>
              </div>
            </ProtectedRoute>
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
