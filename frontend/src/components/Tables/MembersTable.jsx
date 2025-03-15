import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import api from "../../api";

const MembersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/volunteer-profiles/");
      const profiles = response.data.map((profile) => ({
        id: profile.user.id,
        name: profile.user.username,
        email: profile.user.email,
        role: profile.user.roles[0], // will get first role in array of roles for user
        status: profile.status,
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

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/api/users/${userId}/`);
        // Refresh the members list after successful deletion
        fetchMembers();
      } catch (err) {
        if (err.response?.status === 403) {
          setError("You don't have permission to delete users");
        } else {
          setError("Failed to delete user");
        }
        // Clear error after 5 seconds
        setTimeout(() => setError(null), 5000);
      }
    }
  };

  /* Function to handle the search */
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = members.filter(
      (member) =>
        member.name.toLowerCase().includes(term) ||
        member.email.toLowerCase().includes(term)
    );
    setFilteredMembers(filtered);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Users</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900 border border-red-700 text-white rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredMembers.map((member) => (
                <motion.tr
                  key={member.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {member.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {member.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {member.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.status === "active"
                          ? "bg-green-800 text-green-100"
                          : "bg-red-800 text-red-100"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button className="text-indigo-400 hover:text-indigo-300 mr-2">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default MembersTable;
