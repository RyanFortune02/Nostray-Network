import React, { useState, useEffect } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageForm from '../components/MessageForm';
import MessageBoard from '../components/MessageBoard';
import Header from '../components/common/Header';
import api from '../api';

/*
    The MessagesPage component is responsible for displaying and managing messages.
    It includes a message board where users can view, send, and delete messages.
    The component uses a modal to display MessageForm for sending new messages.
    It fetches messages from the API on mount and updates the state accordingly.
*/
const MessagesPage = () => {
    const [showModal, setShowModal] = useState(false); // Controls the visibility of the modal
    const [messages, setMessages] = useState([]); // State to store messages
    const [isLoading, setIsLoading] = useState(true); // Loading state for messages
    const [error, setError] = useState(null); // Error state for messages

    // Run once when the component mounts, triggering the fetchMessages function
    useEffect(() => {
        fetchMessages();
    }, []);

    // Function to fetch messages from the API
    // It sets the loading state, fetches messages, and handles errors
    const fetchMessages = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/api/notes/");
            if (response.status === 200) {
                setMessages(response.data);
            }
        } catch (err) {
            setError("Failed to load messages");
            console.error("Error fetching messages:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to delete a message by ID
    // It sends a delete request to the API and refreshes the message list
    const deleteMessage = async (id) => {
        api
            .delete(`/api/notes/${id}/`)
            .then((res) => {
                if (res.status === 204);
                else alert("Error Deleting Message");
                fetchMessages(); // Refresh messages after deletion
            })
            .catch((error) => {
                if (error.response?.status === 401) alert("You need to authenticate");
                else alert(error);
            });
    };

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Messages" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="flex justify-between items-center mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <h2 className="text-xl font-semibold text-gray-100">
                        Message Board
                    </h2>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                    >
                        {/* Icon and text for the button */}
                        <MessageSquarePlus size={20} className="mr-2" />
                        Send New Message
                    </button>
                </motion.div>

                {/* Message board component */}
                <MessageBoard
                    messages={messages}
                    onDelete={deleteMessage}
                    isLoading={isLoading}
                    error={error}
                />

                {/* Modal for sending new message */}
                <AnimatePresence>
                    {showModal && (
                        <div className="fixed inset-0 z-50 overflow-hidden">
                            <div className="absolute inset-0 bg-gray-900 bg-opacity-75" />
                            <div className="absolute inset-0 flex items-center justify-center p-4">
                                <motion.div
                                    className="relative bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-lg"
                                    initial={{ opacity: 0, y: -50, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 50, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* MessageForm component for sending new messages */}
                                    <MessageForm
                                        onClose={() => setShowModal(false)}
                                        onMessageSent={fetchMessages}
                                    />
                                </motion.div>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default MessagesPage;
