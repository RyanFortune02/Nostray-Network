import React from "react";
import { motion } from "framer-motion";
import { SquareUserRound, Mail, Calendar } from "lucide-react";

function ProfileCard({ volunteerProfile }) {
  const { user, bio, hobbies, town, status } = volunteerProfile;

  // Display the user's join date by month and year
  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Check if the user has a date_joined property and format it
  const joinDate = user?.date_joined ? formatJoinDate(user.date_joined) : null;

  return (
    <motion.div
      className="bg-gray-800 text-white rounded-lg shadow-lg p-4 sm:p-6 w-full mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="bg-gray-700 p-2 rounded-full mb-2 sm:mb-0 sm:mr-3 self-start sm:self-auto">
            <SquareUserRound className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">{user.username}</h3>
            {user.email && (
              <p className="text-xs sm:text-sm flex items-center gap-2 text-gray-300">
                <Mail size={14} className="text-blue-400" />
                {user.email}
              </p>
            )}
            {joinDate && (
              <p className="text-xs sm:text-sm flex items-center gap-2 text-gray-300 mt-1">
                <Calendar size={14} className="text-green-400" />
                Joined {joinDate}
              </p>
            )}
          </div>
        </div>
        <motion.span
          className={`text-xs sm:text-sm font-medium px-3 py-1 rounded-full self-start sm:self-auto mt-2 sm:mt-0 ${
            status === "active" ? "bg-green-500" : "bg-gray-500"
          }`}
          whileHover={{ scale: 1.1 }}
        >
          {status}
        </motion.span>
      </div>
      <motion.div
        className="space-y-2 sm:space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {bio && <p className="text-xs sm:text-sm">{bio}</p>}
        {hobbies && (
          <p className="text-xs sm:text-sm">
            <strong className="text-gray-300">Hobbies:</strong> {hobbies}
          </p>
        )}
        {town && (
          <p className="text-xs sm:text-sm">
            <strong className="text-gray-300">Town:</strong> {town}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

export default ProfileCard;
