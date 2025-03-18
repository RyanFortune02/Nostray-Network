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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-2 sm:p-3 md:p-4 z-50">
      <motion.div
        className="bg-gray-800 rounded-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg shadow-xl border border-gray-700 my-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        {/* Modal header */}
        <div className="flex justify-between items-center bg-gray-900 border-b border-gray-700 p-3 sm:p-4">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white flex items-center">
            <PawPrint className="mr-2 text-indigo-400" size={16}/>
            New Stray Animal Report
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-indigo-300 transition-colors"
          >
            <X size={18} className="sm:size-20" />
          </button>
        </div>

        {/* Alert Message */}
        <div className="bg-yellow-900/30 border-b border-yellow-700/50 p-2 sm:p-3 flex items-center">
          <AlertTriangle className="h-4 sm:h-5 w-4 sm:w-5 text-yellow-500 mr-2" />
          <p className="text-yellow-200 text-xs sm:text-sm">
            This animal needs your review
          </p>
        </div>

        {/* Animal Details */}
        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto max-h-[60vh] md:max-h-[65vh] lg:max-h-[70vh]">
          {error && (
            <div className="bg-red-900/40 border border-red-800 text-red-200 p-2 sm:p-3 rounded-lg text-xs sm:text-sm">
              {error}
            </div>
          )}

          {/* Animal Name */}
          <div>
            <h3 className="text-sm sm:text-base md:text-lg font-medium text-indigo-300">Name:</h3>
            <p className="mt-1 text-white text-sm sm:text-base">{animal.name}</p>
          </div>

          {/* Animal Type */}
          <div>
            <h3 className="text-sm sm:text-base md:text-lg font-medium text-indigo-300">Type:</h3>
            <div className="mt-1 grid grid-cols-2 gap-1 sm:gap-2">
              {animal.type && Object.entries(animal.type).map(([key, value]) => (
                <div key={key} className="bg-gray-700/50 p-1.5 sm:p-2 rounded-md">
                  <span className="text-gray-400 text-xs sm:text-sm">{key}:</span>
                  <p className="text-white text-xs sm:text-sm truncate">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Animal Status */}
          <div>
            <h3 className="text-sm sm:text-base md:text-lg font-medium text-indigo-300">Status:</h3>
            <div className="mt-1">
              <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium 
                ${animal.status === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {animal.status}
              </span>
            </div>
          </div>
          
          {/* Additional details if any */}
          {animal.details && (
            <div>
              <h3 className="text-sm sm:text-base md:text-lg font-medium text-indigo-300">Additional Details:</h3>
              <p className="mt-1 text-white text-sm sm:text-base">{animal.details}</p>
            </div>
          )}
        </div>
        
        {/* Decision Buttons */}
        <div className="border-t border-gray-700 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleReject}
              disabled={isLoading}
              className="w-full sm:w-1/2 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 text-xs sm:text-sm"
            >
              {isLoading ? 'Processing...' : 'Reject Report'}
            </button>
            <button
              onClick={handleAccept}
              disabled={isLoading}
              className="w-full sm:w-1/2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 text-xs sm:text-sm"
            >
              {isLoading ? 'Processing...' : 'Accept Report'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default MeetingForm;
