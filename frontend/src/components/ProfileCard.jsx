import React from "react";
import { motion } from "framer-motion";
import { SquareUserRound, Mail } from "lucide-react";

function ProfileCard({ volunteerProfile }) {
  const { user, bio, hobbies, town, status } = volunteerProfile;

  return (
    <motion.div
      className="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-full mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="bg-gray-700 p-2 rounded-full mr-3">
            <SquareUserRound className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">{user.username}</h3>
            {user.email && (
              <p className="text-sm flex items-center gap-2 text-gray-300">
                <Mail size={14} className="text-blue-400" />
                {user.email}
              </p>
            )}
          </div>
        </div>
        <motion.span
          className={`text-sm font-medium px-3 py-1 rounded-full ${
            status === "active" ? "bg-green-500" : "bg-gray-500"
          }`}
          whileHover={{ scale: 1.1 }}
        >
          {status}
        </motion.span>
      </div>
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {bio && <p className="text-sm">{bio}</p>}
        {hobbies && (
          <p className="text-sm">
            <strong className="text-gray-300">Hobbies:</strong> {hobbies}
          </p>
        )}
        {town && (
          <p className="text-sm">
            <strong className="text-gray-300">Town:</strong> {town}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

export default ProfileCard;
