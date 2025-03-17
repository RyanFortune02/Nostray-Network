import React, { useState, useEffect } from "react";
import Header from "../components/common/Header";
import ProfileCard from "../components/ProfileCard";
import { motion } from "framer-motion";
import api from "../api";

const ProfilePage = () => {
  const [userProfiles, setUserProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("staff"); // Display staff members by default

  const staffRoles = ["ceo", "hr", "board", "head caregiver", "caregiver"]; // Define staff roles
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/volunteer-profiles/");
        setUserProfiles(response.data);
      } catch (err) {
        console.error("Error fetching profiles:", err);
        setError("Failed to load profiles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  // Filter profiles based on the active tab
  const filteredProfiles = userProfiles.filter(profile => {
    if (!profile.user || !profile.user.roles || !profile.user.roles.length) return false;
    
    // Check if the active tab is staff
    if (activeTab === "staff") {
      // Show profiles with staff role
      return profile.user.roles.some(role => staffRoles.includes(role)); 
    } else {
      // Show profiles with volunteer role
      return profile.user.roles.every(role => role === "volunteer");
    }
  });

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-900">
      <Header title="Profile Page" />

      <motion.main
        className="p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">
            Staff and Volunteers Profiles
          </h2>

          {/* Active tabs */}
          <div className="flex mb-6 border-b border-gray-700">
            <button
              className={`px-4 py-2 font-medium text-sm focus:outline-none ${
                activeTab === "staff"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("staff")}
            >
              Staff Members
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm focus:outline-none ${
                activeTab === "volunteers"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("volunteers")}
            >
              Volunteers
            </button>
          </div>

          {loading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && <div className="text-red-500 text-center p-4">{error}</div>}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Show staff members or volunteers based on the active tab */}
              {filteredProfiles.length > 0 ? (
                filteredProfiles.map((profile) => (
                  <ProfileCard
                    key={profile.user.id}
                    volunteerProfile={profile}
                  />
                ))
              ) : (
                <p className="text-gray-400 col-span-2 text-center">
                  No {activeTab === "staff" ? "staff" : "volunteer"} profiles found.
                </p>
              )}
            </div>
          )}
        </div>
      </motion.main>
    </div>
  );
};

export default ProfilePage;
