import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import api from '../api';

function AnimalForm({ isOpen, onClose, onSuccess }) {
    // Define the taxonomic ranks in the order they should be selected
    const TAXONOMIC_RANKS = [
        'domain',
        'kingdom',
        'phylum',
        'class_field',
        'order',
        'family',
        'genus',
        'species'
    ];
    // Define the choices for animal status
    const ANIMAL_STATUS_CHOICES = [
        { value: 'healthy', label: 'Healthy' },
        { value: 'sick', label: 'Sick' },
    ];

    // Form state to manage input values
    const [formData, setFormData] = useState({
        name: '',
        type: {}, // Object to hold taxonomic selections
        status: 'healthy', // Default status
        needs_review: true, // Default to true for new animals
    });

    // State to manage taxonomic choices for each rank
    const [taxonomicChoices, setTaxonomicChoices] = useState({
        domain: [],
        kingdom: [],
        phylum: [],
        class_field: [],
        order: [],
        family: [],
        genus: [],
        species : [],
    });

    const [error, setError] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);

    // When modal opens, fetch initial domain choices
    useEffect(() => {
        if (isOpen) {
            fetchTaxonomicChoices('domain', {}); // Fetch choices for the first rank
        }
    }, [isOpen]);

    // Fetch taxonomic choices for a given rank based on parent selections
    const fetchTaxonomicChoices = async (rank, parentSelections) => {
        try {
            // Construct the API request with the current rank and parent selections
            const params = { rank, ...parentSelections };
            const response = await api.get('/api/choices/taxonomic/', { params });

            // Update the taxonomic choices state for the current rank
            setTaxonomicChoices(prev => ({
                ...prev,
                [rank]: response.data.choices || []
            }));
        } catch (err) {
            console.error(`Error fetching ${rank} choices:`, err);
        }
    };

    // Handle taxonomic changes using the defined order in TAXONOMIC_RANKS
    const handleTaxonomicChange = (rank, value) => {
        // Checks the current rank's index in the TAXONOMIC_RANKS array
        const rankIndex = TAXONOMIC_RANKS.indexOf(rank);

        // Update the formData with the selected value for the current rank
        const newType = { ...formData.type, [rank]: value };

        // Clear all subsequent ranks and their choices
        // This ensures that if a user selects a new value, all lower ranks are reset
        const newChoices = { ...taxonomicChoices };
        for (let i = rankIndex + 1; i < TAXONOMIC_RANKS.length; i++) {
            newType[TAXONOMIC_RANKS[i]] = undefined;
            newChoices[TAXONOMIC_RANKS[i]] = []; // Reset choices for subsequent ranks
        }
        setFormData(prev => ({ ...prev, type: newType })); // Update formData with the new type selections
        setTaxonomicChoices(newChoices);  

        // if curent rank has a value and it's not the last rank, fetch choices for the next rank
        if (value && rankIndex < TAXONOMIC_RANKS.length - 1) {
            const nextRank = TAXONOMIC_RANKS[rankIndex + 1];
            if (nextRank !== 'species') {
                // Gather parent selections for all previous ranks (including current)
                const parentSelections = {};
                for (let i = 0; i <= rankIndex; i++) {
                    const currentRank = TAXONOMIC_RANKS[i];
                    // Only add to parentSelections if the current rank has a value
                    if (newType[currentRank]) {
                        parentSelections[currentRank] = newType[currentRank];
                    }
                }
                fetchTaxonomicChoices(nextRank, parentSelections); // Fetch choices for the next rank based on current selections
            }
        }
    };

    // Handle input changes for other form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
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
            await api.post('/api/animals/', formData); // Send POST request to create animal
            onSuccess && onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create animal');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-2 sm:p-3 md:p-4 z-50 overflow-y-auto">
            <motion.div
                className="bg-gray-800 rounded-lg w-full max-w-xs sm:max-w-sm md:max-w-md shadow-xl overflow-hidden border border-gray-700 my-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
            >
                <div className="flex justify-between items-center bg-gray-900 border-b border-gray-700 p-3 sm:p-4">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white-100">Report new Animal</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-indigo-300 transition-colors"
                        aria-label="Close form"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-grow">
                    <form onSubmit={handleSubmit} className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                        {error && (
                            <div className="bg-red-900/40 border border-red-800 text-red-200 p-2 sm:p-3 rounded-lg text-sm sm:text-base">
                                {error}
                            </div>
                        )}

                        {/* Name Input */}
                        <div className="space-y-1 sm:space-y-2">
                            <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-indigo-400">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full p-2 sm:p-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                            />
                        </div>

                        {/* Taxonomic Rank Dropdowns */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {/* Dynamically create dropdowns for each taxonomic rank */}
                            {TAXONOMIC_RANKS.map((rank) => (
                                <div key={rank} className="space-y-1 sm:space-y-2">
                                    <label htmlFor={rank} className="block text-xs sm:text-sm font-medium text-indigo-400">
                                        {rank.charAt(0).toUpperCase() + rank.slice(1).replace('_', ' ')}
                                    </label>
                                    {rank === 'species' ? (
                                        <input
                                            type="text"
                                            id={rank}
                                            name={rank}
                                            value={formData.type[rank] || ''}
                                            onChange={(e) => handleTaxonomicChange(rank, e.target.value)}
                                            required
                                            className="w-full p-2 sm:p-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                                            placeholder="Enter species name"
                                        />
                                    ) : (
                                        <select
                                            id={rank}
                                            name={rank}
                                            value={formData.type[rank] || ''}
                                            onChange={(e) => handleTaxonomicChange(rank, e.target.value)}
                                            required
                                            disabled={taxonomicChoices[rank].length === 0}
                                            className="w-full p-2 sm:p-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 text-sm sm:text-base"
                                        >
                                            <option value="">Select {rank}</option>
                                            {taxonomicChoices[rank].map((choice) => (
                                                <option key={choice} value={choice}>
                                                    {choice}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Status Dropdown */}
                        <div className="space-y-1 sm:space-y-2">
                            <label htmlFor="status" className="block text-xs sm:text-sm font-medium text-indigo-400">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                                className="w-full p-2 sm:p-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                            >
                                {ANIMAL_STATUS_CHOICES.map((status) => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </form>
                </div>

                {/* Buttons */}
                <div className="border-t border-gray-700 p-3 sm:p-4 sticky bottom-0 bg-gray-800 z-10">
                    <div className="flex justify-evenly pt-1 sm:pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors shadow-md text-sm sm:text-base"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 shadow-md text-sm sm:text-base"
                        >
                            {isLoading ? 'Adding...' : 'Send Report'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default AnimalForm;
