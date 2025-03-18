import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Edit2, XCircle } from "lucide-react";
import api from "../../api";

const MembersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  
  // Define status choices directly based on the UserStatus model in backend
  const statusOptions = ["active", "inactive", "temporary leave"];

  
  // Fetch members data
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await api.getVolunteerProfiles();
      const profiles = response.data.map((profile) => ({
        id: profile.user.id,
        name: profile.user.username,
        email: profile.user.email,
        role: profile.user.roles[0],
        status: profile.status,
        profileId: profile.id // This is the actual profile ID needed for updates
      }));
      
      setMembers(profiles);
      setFilteredMembers(profiles);
    } catch (err) {
      console.error("Error fetching members:", err);
      setError("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = members.filter(
      (member) =>
        member.name.toLowerCase().includes(term) ||
        member.email.toLowerCase().includes(term) ||
        member.role.toLowerCase().includes(term)
    );

    setFilteredMembers(filtered);
  };

  // Update user status
  const handleStatusUpdate = async (profileId, newStatus) => {
    try {
      console.log(`Updating status for profile ${profileId} to ${newStatus}`);
      
      // Make PATCH request to update the member's status
      await api.updateVolunteerStatus(profileId, newStatus);
      console.log("Status updated successfully in the backend");
      
      // Update local state to reflect the change
      const updatedMembers = members.map((member) =>
        member.profileId === profileId
          ? { ...member, status: newStatus }
          : member
      );

      setMembers(updatedMembers);

      // Also update the filtered members to maintain consistency in the UI
      setFilteredMembers(
        updatedMembers.filter(
          (member) =>
            member.name.toLowerCase().includes(searchTerm) ||
            member.email.toLowerCase().includes(searchTerm) ||
            member.role.toLowerCase().includes(searchTerm)
        )
      );

      // Close the dropdown after successful update
      setEditingUserId(null);
    } catch (err) {
      console.error("Error updating member status:", err);
      alert(
        `Failed to update member status: ${err.message || "Unknown error"}`
      );
      // We don't close editing mode on error so the user can try again
    }
  };

  // Delete a member
  const handleDelete = async (userId) => {
    if (!userId) {
      alert("Cannot delete: User ID is undefined");
      return;
    }

    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await api.delete(`/api/users/${userId}/`);
        console.log(`Successfully deleted user with ID: ${userId}`);

        // Update local state to remove the deleted member
        const updatedMembers = members.filter((member) => member.id !== userId);
        setMembers(updatedMembers);
        setFilteredMembers(
          updatedMembers.filter(
            (member) =>
              member.name.toLowerCase().includes(searchTerm) ||
              member.email.toLowerCase().includes(searchTerm) ||
              member.role.toLowerCase().includes(searchTerm)
          )
        );
      } catch (err) {
        console.error("Error deleting member:", err);
        alert("Failed to delete member. Please try again.");
      }
    }
  };

  // Get status color based on current status
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-800 text-green-100";
      case "inactive":
        return "bg-red-800 text-red-100";
      case "temporary leave":
        return "bg-amber-800 text-amber-100";
      default:
        return "bg-gray-800 text-gray-100";
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-700">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            className="bg-gray-700 border border-gray-600 text-white block w-full pl-10 pr-3 py-2 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Search members..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-2 text-gray-400">Loading members...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-750"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {member.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {member.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300 capitalize">
                        {member.role}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUserId === member.id ? (
                        // Edit mode dropdown
                        <select
                          className="bg-gray-700 text-white text-sm rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={member.status}
                          onChange={(e) =>
                            handleStatusUpdate(member.profileId, e.target.value)
                          }
                          // Removed the onBlur handler to prevent prematurely exiting edit mode
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      ) : (
                        // Display mode
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            member.status
                          )}`}
                        >
                          {member.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="text-indigo-400 hover:text-indigo-300 mr-2"
                          onClick={() => setEditingUserId(member.id)}
                        >
                          <Edit2 className="h-5 w-5" />
                          <span className="sr-only">Edit</span>
                        </button>
                        <button
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDelete(member.id)}
                        >
                          <XCircle className="h-5 w-5" />
                          <span className="sr-only">Delete</span>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    No members found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MembersTable;
