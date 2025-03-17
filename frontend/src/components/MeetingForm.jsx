import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, PawPrint, AlertTriangle } from 'lucide-react';
import api from '../api';

function MeetingForm({ isOpen, onClose, animal }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // If animal gets accepted, update its status to needs_review: false
  const handleAccept = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Api.patch to partially update the animal's data to set needs_review to false
      await api.patch(`/api/animals/${animal.id}/`, {
        needs_review: false,
      });
      
      onClose(); // Close the form after the update succeeds
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process request');
    } finally {
      setIsLoading(false);
    }
  };

  // If animal gets rejected, delete the animal data completely
  const handleReject = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Api.delete to remove the animal's data from the database
      await api.delete(`/api/animals/${animal.id}/`);
      
      onClose(); // Close the form after the deletion succeeds
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete animal record');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !animal) return null; // Return null if modal is not open or no animal data is provided

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <motion.div
        className="bg-gray-800 rounded-lg w-full max-w-md shadow-xl border border-gray-700"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        {/* Modal header */}
        <div className="flex justify-between items-center bg-gray-900 border-b border-gray-700 p-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <PawPrint className="mr-2 text-indigo-400" />
            New Stray Animal Report
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-indigo-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Alert Message */}
        <div className="bg-yellow-900/30 border-b border-yellow-700/50 p-3 flex items-center">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
          <p className="text-yellow-200 text-sm">
            This animal needs your review
          </p>
        </div>

        {/* Animal Details */}
        <div className="p-4 space-y-4">
          {error && (
            <div className="bg-red-900/40 border border-red-800 text-red-200 p-3 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <h3 className="text-indigo-300 font-medium">Animal Details</h3>
            <div className="bg-gray-700/50 p-3 rounded-lg space-y-2">
              <p><span className="text-gray-400">Name:</span> <span className="text-white">{animal.name}</span></p>
              <p><span className="text-gray-400">Type:</span> <span className="text-white">{animal.type.species}</span></p>
              <p><span className="text-gray-400">Status:</span> <span className="text-white">{animal.status}</span></p>
            </div>
          </div>

          <div className="bg-gray-700/30 p-3 rounded-lg border border-gray-600">
            <p className="text-sm text-gray-300 text-center">
              A volunteer has reported finding this stray animal. 
              <br />
              Please decide whether to accept or reject this new animal.
            </p>
          </div>

          {/* Accept and Reject Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={handleReject}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Reject'}
            </button>
            <button
              onClick={handleAccept}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Accept
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default MeetingForm;
