import { useState } from "react";
import api from "../api";

/*
 * MessageForm component
 * This component renders the form for sending messages to different departments.
 * It includes a multi-select dropdown for department selection, subject and message fields.
 * It handles form state, validation, and submission.
 * Props:
 * - onClose: Function to close the form/modal.
 * - onMessageSent: Function to call after a message is successfully sent.
 */

function MessageForm({ onClose, onMessageSent }) {
  const [to, setTo] = useState([]); // State for selected departments
  const [subject, setSubject] = useState(""); // State for message subject
  const [message, setMessage] = useState(""); // State for message content
  const [error, setError] = useState(""); // Error message state
  const [isSubmitting, setIsSubmitting] = useState(false); // Boolean flag for Form submission state

  // Array of department options available for selection
  // Value is the internal identifier used in the API request
  // Label is what will be displayed in the UI
  const departmentOptions = [
    { value: "ceo", label: "CEO" },
    { value: "hr", label: "HR Staff" },
    { value: "board", label: "Board Members / Head Caregivers / Caregivers" },
    { value: "volunteers", label: "Volunteers" },
  ];

  // This function is used to toggle the selection of departments
  const handleDepartmentChange = (value) => {
    // Check if the department is already selected
    if (to.includes(value)) {
      setTo(to.filter((dept) => dept !== value)); // Remove the department from the 'to' state
    } else {
      setTo([...to, value]); // Add the new department to the 'to' state
    }
  };

  /*
    This function is called when the form is submitted.
    * Validates the form fields.
    * If validation passes, it sends a POST request to the API with the form data.
    * On success, it clears the form and calls onMessageSent callback.
    * On error, it sets the error message state.
    * Finally, it resets the isSubmitting state.
    */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Avoid the need to reload the page when submitting the form

    // Check if any department is selected
    if (to.length === 0) {
      setError("Please select at least one department");
      return;
    }

    // Validate that subject is not empty
    if (!subject.trim()) {
      setError("Subject cannot be empty");
      return;
    }

    // Validate that message content is not empty
    if (!message.trim()) {
      setError("Message cannot be empty");
      return;
    }

    setIsSubmitting(true); // Set submitting state to true
    setError(""); // Clear any previous error messages

    try {
      // Send POST request to the API with the form data
      const response = await api.post("/api/notes/", {
        title: subject, // Use subject as the title
        content: message, // Use message as the content
        boards: to, // Use the selected departments as boards (matches backend naming)
      });

      // Check if the response status is 201 (Created)
      if (response.status === 201) {
        // Reset form fields
        setTo([]);
        setSubject("");
        setMessage("");

        // This is a callback function to notify the parent component that a message has been sent
        if (onMessageSent) {
          onMessageSent();
        }

        onClose(); // Close the form/modal
      }
    } catch (error) {
      // Improved error handling for permission issues
      if (error.response?.status === 403) {
        setError(
          "Permission denied: You don't have permission to post to one or more selected departments"
        );
      } else if (error.response?.status === 401) {
        setError("Authentication required: Please log in again");
      } else {
        setError(
          error.response?.data?.message ||
            error.response?.data?.detail ||
            "An error occurred while sending your message"
        );
      }
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-xs sm:max-w-sm md:max-w-lg">
      <div className="bg-blue-600 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        {/* Header for the form */}
        <h2 className="text-lg sm:text-xl font-semibold text-white">Send New Message</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
        {error && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-50 border border-red-200 text-red-700 text-sm sm:text-base rounded-md">
            {error}
          </div>
        )}

        {/* Department selection */}
        <div className="space-y-1 sm:space-y-2">
          <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 sm:mb-2">To:</label>
          <div className="space-y-1 sm:space-y-2">
            {departmentOptions.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={option.value}
                  value={option.value}
                  checked={to.includes(option.value)} // Check if the department is selected
                  onChange={() => handleDepartmentChange(option.value)} // Toggle department selection
                  className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor={option.value}
                  className="ml-2 block text-gray-700 text-xs sm:text-sm"
                >
                  {option.label} {/* Display the label of the department */}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Subject and message fields */}
        <div className="space-y-1 sm:space-y-2">
          <label
            htmlFor="subject"
            className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 sm:mb-2"
          >
            Subject:
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black text-sm sm:text-base"
            placeholder="Enter message subject"
          />
        </div>

        <div className="space-y-1 sm:space-y-2">
          <label
            htmlFor="message"
            className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 sm:mb-2"
          >
            Message:
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black text-sm sm:text-base"
            placeholder="Enter your message here"
          />
        </div>

        {/* Submit and cancel buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:space-x-3 pt-1 sm:pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md text-gray-700 text-sm sm:text-base bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 text-sm sm:text-base"
          >
            {/* Change button text based on submission state */}
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MessageForm;
