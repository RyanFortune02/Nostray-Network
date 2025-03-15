import React from 'react';
import { motion } from 'framer-motion';
import { PawPrint, Clock, User, AlertTriangle, PhoneCall } from 'lucide-react';

const AnimalCard = ({ animal }) => {
    const { name, type, status, needs_review, caregiver, date_added } = animal; 

    // Function to get the status color based on the animal's status
    const getStatusColor = (status) => {
        switch (status) {
            case 'healthy':
                return 'bg-green-500';
            case 'sick':
                return 'bg-yellow-500';
            case 'adopted':
                return 'bg-red-500';
        }
    };

    // Format the date to a more readable format
    const formattedDate = new Date(date_added).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

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
                        <PawPrint className="text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold">{name}</h3>
                </div>
                <motion.span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(status)}`}
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
                <p className="text-sm">
                    <strong className="text-gray-300">Type:</strong> {type}
                </p>

                <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-400" />
                    <p className="text-sm text-gray-300">Added on {formattedDate}</p>
                </div>

                {caregiver && (
                    <div className="flex items-center">
                        <User className="h-4 w-4 mr-1 text-gray-400" />
                        <p className="text-sm">
                            <strong className="text-gray-300">Caregiver:</strong> {caregiver.username || caregiver}
                        </p>
                    </div>
                )}

                <div className="flex items-center justify-between mt-4">
                    {needs_review && (
                        <div className="flex items-center text-yellow-400">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            <p className="text-sm font-medium">Needs review</p>
                        </div>
                    )}

                    {needs_review && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                            onClick={() => alert(`Meeting called about ${name}`)}
                        >
                            <PhoneCall className="h-3.5 w-3.5 mr-1.5" />
                            Call meeting
                        </motion.button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

export default AnimalCard;
