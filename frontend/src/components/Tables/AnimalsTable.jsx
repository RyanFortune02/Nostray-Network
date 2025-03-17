import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import api from "../../api";

const AnimalsTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [animals, setAnimals] = useState([]); // Hold all animals fetched from the API
    const [filteredAnimals, setFilteredAnimals] = useState([]); //Hold the reviewed animals to be displayed in the table
    const [loading, setLoading] = useState(true); // Loading state for the API call
    const [error, setError] = useState(null); // Error state for API call
    const [editingAnimalId, setEditingAnimalId] = useState(null); // Track which animal is being edited


    // Fetch animals from API
    const fetchAnimals = async () => {
        try {
            setLoading(true);
            // Fetch animals data from the backend
            const response = await api.get('/api/animals/');
            // Filter animals to include only those that have been reviewed
            const reviewedAnimals = response.data.filter(animal => animal.needs_review === false);
            setAnimals(reviewedAnimals);
            setFilteredAnimals(reviewedAnimals);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching animals:', err);
            setError('Failed to load animals. Please try again later.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnimals(); // Fetch animals when the component mounts
    }, []);

      // Display the taxonomic type of the animal
      const getAnimalType = (typeObj) => {
        return typeObj.species;
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        // Filter the animals based on the search term
        const filtered = animals.filter(
            (animal) => 
                animal.name.toLowerCase().includes(term) || 
                (animal.type.species && animal.type.species.toLowerCase().includes(term))
        );
        setFilteredAnimals(filtered);
    };

    // Update animal status
    const handleStatusUpdate = async (animalId, newStatus) => {
        try {
            await api.patch(`/api/animals/${animalId}/`, { status: newStatus });
            // After successful update, fetch fresh data from the server
            await fetchAnimals();
            setEditingAnimalId(null); // Close the dropdown
        } catch (err) {
            console.error('Error updating animal status:', err);
            alert('Failed to update animal status. Please try again.');
        }
    };

    // Delete animal
    const handleDelete = async (animalId) => {
        if (window.confirm('Are you sure you want to delete this animal record?')) {
            try {
                await api.delete(`/api/animals/${animalId}/`);
                // After successful deletion, fetch fresh data from the server
                await fetchAnimals();
            } catch (err) {
                console.error('Error deleting animal:', err);
                alert('Failed to delete animal. Please try again.');
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "healthy": return "bg-green-800 text-green-100";
            case "sick": return "bg-yellow-800 text-red-100";
            case "adopted": return "bg-red-800 text-yellow-100";
            default: return "bg-gray-800 text-gray-100";
        }
    };

    // Available status options
    const statusOptions = ["healthy", "sick", "adopted"];

    // If no animals are found after filtering, display a message
    if (animals.length === 0) {
        return (
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 flex justify-center items-center h-64">
                <div className="text-gray-300">No new animals found. Animals are under review.</div>
            </div>
        );
    }

    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-100">Animals</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search animals..."
                        className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date Added</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {filteredAnimals.length > 0 ? (
                            filteredAnimals.map((animal) => (
                                <motion.tr
                                    key={animal.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-100">{animal.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-300">{getAnimalType(animal.type)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {editingAnimalId === animal.id ? (
                                            <select
                                                className="bg-gray-700 text-white text-sm rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={animal.status}
                                                onChange={(e) => handleStatusUpdate(animal.id, e.target.value)}
                                                onBlur={() => setEditingAnimalId(null)}
                                            >
                                                {statusOptions.map(status => (
                                                    <option key={status} value={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(animal.status)}`}>
                                                {animal.status}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {new Date(animal.date_added).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        <button 
                                            className="text-indigo-400 hover:text-indigo-300 mr-2"
                                            onClick={() => setEditingAnimalId(animal.id)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="text-red-400 hover:text-red-300"
                                            onClick={() => handleDelete(animal.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </motion.tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                                    No animals found. {searchTerm && "Try a different search term."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default AnimalsTable;
