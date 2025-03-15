import { UserPlus, UsersIcon, PlusCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../api";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import MembersTable from "../components/Tables/MembersTable";
import NewsForm from "../components/News/NewsForm";

const HRPage = () => {
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [teamStats, setTeamStats] = useState({
    teamMembers: 0,
    newVolunteers: 0,
  });

  useEffect(() => {
    const fetchTeamStats = async () => {
      try {
        const response = await api.get("/api/volunteer-profiles/");
        const activeVolunteers = response.data.filter(
          (profile) => profile.status === "active"
        ).length;
        // only showing volunteers right now
        setTeamStats({
          teamMembers: response.data.length,
          newVolunteers: activeVolunteers,
        });
      } catch (err) {
        console.error("Error fetching team stats:", err);
      }
    };

    fetchTeamStats();
  }, []);

  // Function to dispatch the event after news creation
  const notifyNewsCreation = async () => {
    console.log("Dispatching newsCreated event");
    const event = new CustomEvent("newsCreated");
    window.dispatchEvent(event);
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Human Resources" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Members"
            icon={UsersIcon}
            value={teamStats.teamMembers.toLocaleString()}
            color="#6366F1"
          />
          <StatCard
            name="Active Volunteers"
            icon={UserPlus}
            value={teamStats.newVolunteers}
            color="#10B981"
          />
        </motion.div>

        <div className="flex justify-between items-center my-6">
          <h2 className="text-2xl font-bold">News Management</h2>
          <p className="text-gray-500">
            Create and manage news updates for the team.
          </p>
          <button
            onClick={() => setShowNewsModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            <PlusCircle size={18} />
            <span>Create News</span>
          </button>
        </div>

        {/* News Form Modal */}
        <NewsForm
          isOpen={showNewsModal}
          onClose={() => setShowNewsModal(false)}
          onSuccess={notifyNewsCreation}
        />
        {/* Members Table */}
        <MembersTable />
      </main>
    </div>
  );
};

export default HRPage;
