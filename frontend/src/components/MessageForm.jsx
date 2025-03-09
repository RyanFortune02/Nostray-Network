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
        { value: "volunteers", label: "Volunteers" }
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
                recipients: to // Use the selected departments as recipients
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
            setError(
                // Set error message for the user to see if the request fails 
                error.response?.data?.message ||
                "An error occurred while sending your message"
            );
        } finally {
            setIsSubmitting(false); // Reset submitting state
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-lg w-full">
            <div className="bg-blue-600 px-6 py-4">
                {/* Header for the form */}
                <h2 className="text-xl font-semibold text-white">Send New Message</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                {/* Department selection */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">To:</label>
                    <div className="space-y-2">
                        {departmentOptions.map((option) => (
                            <div key={option.value} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={option.value}
                                    value={option.value}
                                    checked={to.includes(option.value)} // Check if the department is selected
                                    onChange={() => handleDepartmentChange(option.value)} // Toggle department selection
                                    className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <label htmlFor={option.value} className="ml-2 block text-gray-700">
                                    {option.label} {/* Display the label of the department */}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Subject and message fields */}
                <div className="mb-4">
                    <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                        Subject:
                    </label>
                    <input
                        type="text"
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="Enter message subject"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                        Message:
                    </label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="Enter your message here"
                    />
                </div>

                {/* Submit and cancel buttons */}
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {isSubmitting ? "Sending..." : "Send Message"} {/* Change button text based on submission state */}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default MessageForm;
