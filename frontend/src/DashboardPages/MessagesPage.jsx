import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquarePlus } from "lucide-react";
import api from "../api";
import Header from "../components/common/Header";
import MessageBoard from "../components/MessageBoard";
import MessageForm from "../components/MessageForm";

function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    // Fetch messages and user roles when component mounts
    fetchMessages();
    fetchUserRoles();
  }, []);

  // Function to fetch user roles from the API
  const fetchUserRoles = async () => {
    try {
      const response = await api.get("/api/user/roles/");
      if (response.status === 200) {
        setUserRoles(response.data.roles || []);
      }
    } catch (err) {
      console.error("Error fetching user roles:", err);
    }
  };

  // Function to fetch messages from the API
  // It sets the loading state, fetches messages, and handles errors
  const fetchMessages = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get("/api/notes/");
      if (response.status === 200) {
        setMessages(response.data);
      }
    } catch (err) {
      // Handle different error types
      if (err.response?.status === 403) {
        setError("You don't have permission to view messages");
      } else if (err.response?.status === 401) {
        setError("Authentication required: Please log in again");
      } else {
        setError("Failed to load messages. Please try again later.");
      }
      console.error("Error fetching messages:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to delete a message by ID
  // It sends a delete request to the API and refreshes the message list
  const deleteMessage = async (id) => {
    return api.delete(`/api/notes/${id}/`).then((res) => {
      if (res.status === 204) {
        // Successfully deleted
        fetchMessages(); // Refresh messages after deletion
        return true;
      } else {
        throw new Error("Error deleting message");
      }
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
          <h2 className="text-xl font-semibold text-gray-100">Message Board</h2>
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
          userRoles={userRoles}
        />

        {/* Modal for sending new message */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-[1000] overflow-hidden">
              <div className="absolute inset-0 bg-gray-900 bg-opacity-75" />
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <motion.div
                  className="relative z-[1001]"
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
}

export default MessagesPage;
