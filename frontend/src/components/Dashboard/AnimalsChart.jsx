import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import api from "../../api";

const AnimalsChart = () => {
    const [animalsData, setAnimalsData] = useState([]); //Animal data to be displayed in the chart
    const [loading, setLoading] = useState(true);

    // Fetch animal data from the API
    useEffect(() => {
        const fetchAnimalData = async () => {
            try {
                const response = await api.getAnimals();
                // Filter animals to only include those that don't need review
                const filteredAnimals = response.data.filter(animal => animal.needs_review === false);
                // Process animal data to count by month
                const animalsByMonth = processAnimalData(filteredAnimals);
                setAnimalsData(animalsByMonth);
            } catch (error) {
                console.error("Failed to fetch animal data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimalData();
    }, []);

    // Function to process animal data and count animals by month
    const processAnimalData = (data) => {
        const now = new Date(); // Get the current date
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        // Hold the count of new animals for each month
        const monthCounts = {};
        for (let i = 7; i >= 0; i--) {
            const monthIndex = (now.getMonth() - i + 12) % 12; // Calculate the month index
            // Get the month name and initialize the count to 0
            const monthName = monthNames[monthIndex];
            monthCounts[monthName] = 0;
        }
        
        // Iterate over the data to count animals added in each month
        data.forEach((animal) => {
            if (animal.date_added) {
                const addedDate = new Date(animal.date_added);
                const monthName = monthNames[addedDate.getMonth()];
                
                // Calculate the difference in months between now and when the animal was added
                const monthsDiff = 
                    (now.getFullYear() - addedDate.getFullYear()) * 12 + 
                    (now.getMonth() - addedDate.getMonth());
                
                // Only count animals added in the last 8 months
                if (monthsDiff <= 7 && monthsDiff >= 0) {
                    monthCounts[monthName] = (monthCounts[monthName] || 0) + 1;
                }
            }
        });
        
        // Convert to array format for the chart
        return Object.keys(monthCounts).map(month => ({
            name: month,
            newAnimals: monthCounts[month]
        }));
    };

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <h2 className='text-lg font-medium mb-4 text-gray-100'>New Animals Overview</h2>

            <div className='h-80'>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={animalsData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                        <XAxis dataKey="name" stroke="#e5e7eb" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: "rgba(31, 41, 55, 0.8)",
                                borderColor: "#4B5563",
                            }}
                            itemStyle={{ color: "#E5E7EB" }}
                        />
                        <Legend />
                        <Bar dataKey="newAnimals" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};
export default AnimalsChart;