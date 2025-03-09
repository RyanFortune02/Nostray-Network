import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageSquareX, Inbox } from 'lucide-react';
import Message from './Message';

/*
    * MessageBoard component displays messages grouped by department.
    * It includes tabs for each department and a delete button for each message.
    * 
    * Props:
    * - messages: Array of message objects.
    * - onDelete: Function to handle message deletion.
    * - isLoading: Boolean indicating if messages are loading.
    * - error: Error message to display if fetching messages fails.
*/
function MessageBoard({ messages, onDelete, isLoading, error }) {
    const [activeTab, setActiveTab] = useState('all'); // State to track the active tab for messages by department

    // Group messages by department for display
    // Each department has its own array of messages
    const departmentGroups = {
        all: messages,
        ceo: messages.filter(message => message.recipients && message.recipients.includes('ceo')),
        hr: messages.filter(message => message.recipients && message.recipients.includes('hr')),
        board: messages.filter(message => message.recipients && message.recipients.includes('board')),
        volunteers: messages.filter(message => message.recipients && message.recipients.includes('volunteers')),
    };

    // This function maps internal roles/department identifiers to display names for the tabs
    const formatDepartmentName = (dept) => {
        switch (dept) {
            case 'ceo': return 'CEO';
            case 'hr': return 'HR Staff';
            case 'board': return 'Board Members';
            case 'volunteers': return 'Volunteers';
            case 'all': return 'All Messages';
            default: return dept;
        }
    };

    // This function is called when the delete button is clicked
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            onDelete(id); // Call the onDelete function with the message ID
        }
    };

    // Update the count of messages for each department
    const getCounts = (dept) => {
        return departmentGroups[dept]?.length || 0;
    };

    return (
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
            {/* Department tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-700 pb-4">
                {Object.keys(departmentGroups).map((dept) => (
                    <button
                        key={dept}
                        onClick={() => setActiveTab(dept)}
                        className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${activeTab === dept
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            }`}
                    >
                        {/* Display icon based on department */}
                        {dept === 'all' ? (
                            <Inbox size={16} />
                        ) : (
                            <Users size={16} />
                        )}
                        <span>{formatDepartmentName(dept)}</span>
                        <span className="bg-gray-800 text-xs px-2 py-1 rounded-full">
                            {getCounts(dept)}
                        </span>
                    </button>
                ))}
            </div>

            {/* Message display area */}
            <div className="min-h-[300px]">
                {/* Display loading, error, or no messages state */}
                {isLoading ? (
                    <div className="text-center py-10">
                        <p className="text-gray-300">Loading messages...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-10">
                        <p className="text-red-400">{error}</p>
                    </div>
                ) : departmentGroups[activeTab]?.length === 0 ? (
                    <div className="text-center py-10">
                        <MessageSquareX className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-xl font-medium text-gray-200">No messages for {formatDepartmentName(activeTab)}</h3>
                        <p className="mt-1 text-gray-400">Switch tabs or send a new message.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Display messages using AnimatePresence for smooth transitions */}
                        <AnimatePresence>
                            {/* Map through messages of the active tab and display each message */}
                            {departmentGroups[activeTab]?.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Message message={message} onDelete={handleDelete} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MessageBoard;
