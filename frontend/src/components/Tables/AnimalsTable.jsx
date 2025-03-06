import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

/* Sample data for the animals */
const animalsData = [
    { id: 1, name: "Max", type: "Dog", status: "Healthy", caregivers_id: 2, date_added: "2025-01-15" },
    { id: 2, name: "Luna", type: "Cat", status: "Under Treatment", caregivers_id: 2, date_added: "2025-02-20" },
    { id: 3, name: "Rocky", type: "Snake", status: "Healthy", caregivers_id: 4, date_added: "2025-03-01" },
    { id: 4, name: "Bella", type: "Bird", status: "Critical", caregivers_id: 3, date_added: "2024-04-05" },
    { id: 5, name: "Charlie", type: "Rabbit", status: "Healthy", caregivers_id: 2, date_added: "2024-05-01" },
];

const AnimalsTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredAnimals, setFilteredAnimals] = useState(animalsData);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        // Filter the animals based on the search term
        const filtered = animalsData.filter(
            (animal) => animal.name.toLowerCase().includes(term) || animal.type.toLowerCase().includes(term) // Search by name or type
        );
        setFilteredAnimals(filtered);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Healthy": return "bg-green-800 text-green-100";
            case "Under Treatment": return "bg-yellow-800 text-yellow-100";
            case "Critical": return "bg-red-800 text-red-100";
            default: return "bg-gray-800 text-gray-100";
        }
    };

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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Caregiver ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date Added</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {filteredAnimals.map((animal) => (
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
                                    <div className="text-sm text-gray-300">{animal.type}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(animal.status)}`}>
                                        {animal.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{animal.caregivers_id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{animal.date_added}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    <button className="text-indigo-400 hover:text-indigo-300 mr-2">Edit</button>
                                    <button className="text-red-400 hover:text-red-300">Delete</button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default AnimalsTable;
