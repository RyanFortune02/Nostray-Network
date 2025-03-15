import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import api from '../../api';

/*
 * NewsForm component for creating news announcements
 * Displays as a modal popup with form fields for title, content, and type of news
 * 
 * Props:
 * - isOpen: Boolean to control modal visibility
 * - onClose: Function to close the modal
 * - onSuccess: Function to call after successful submission
 */
function NewsForm({ isOpen, onClose, onSuccess }) {
    // Form state to manage input values
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: '',
    });

    // Loading and error states
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Array of news types for selection in the form
    const newsTypes = [
        { value: 'news', label: 'News' },
        { value: 'event', label: 'Event' },
        { value: 'announcement', label: 'Announcement' },
        { value: 'blog', label: 'Blog Post' },
        { value: 'other', label: 'Other' }
    ];

    // Handle input changes and update form state
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Update formData state with the new value for the corresponding input field
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Send POST request to create news
            await api.post('/api/news/', formData);
            setFormData({ title: '', content: '', type: '' });
            
            if (onSuccess) {
                onSuccess(); // Trigger the event listener in HRPage to refresh the news feed
            }
            
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create news');
            console.error('Error submitting news:', err);
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    if (!isOpen) return null; // Return null if modal is not open to prevent rendering

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-2 sm:p-3 md:p-4 z-50 overflow-y-auto">
            <motion.div
                className="bg-gray-800 rounded-lg w-full max-w-xs sm:max-w-sm md:max-w-md shadow-xl overflow-hidden border border-gray-700 my-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
            >
                {/* Modal header */}
                <div className="flex justify-between items-center bg-gray-900 border-b border-gray-700 p-3 sm:p-4">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white-100">Create News Announcement</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-indigo-300 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto max-h-[70vh] md:max-h-[80vh]">
                    {error && (
                        <div className="bg-red-900/40 border border-red-800 text-red-200 p-2 sm:p-3 rounded-lg text-sm sm:text-base">
                            {error}
                        </div>
                    )}

                    {/* News Type Select */}
                    <div className="space-y-1 sm:space-y-2">
                        <label htmlFor="type" className="block text-xs sm:text-sm font-medium text-indigo-400">
                            News Type
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                            className="w-full p-2 sm:p-2.5 bg-gray-700 border border-gray-600 text-white 
                            rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                        >
                            <option value="">Select a type</option>
                            {/* Map through news types to create options */}
                            {newsTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Title Input */}
                    <div className="space-y-1 sm:space-y-2">
                        <label htmlFor="title" className="block text-xs sm:text-sm font-medium text-indigo-400">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full p-2 sm:p-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                            placeholder="News title"
                        />
                    </div>

                    {/* Content Input */}
                    <div className="space-y-1 sm:space-y-2">
                        <label htmlFor="content" className="block text-xs sm:text-sm font-medium text-indigo-400">
                            Content
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full p-2 sm:p-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                            placeholder="News content..."
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-1 sm:pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 shadow-md text-sm sm:text-base"
                        >
                            {isLoading ? 'Publishing...' : 'Publish News'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default NewsForm;
