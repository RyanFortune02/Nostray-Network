import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from "framer-motion";

const newAnimalsData = [
    { name: "Aug", newAnimals: 8 },
    { name: "Sep", newAnimals: 9 },
    { name: "Oct", newAnimals: 6 },
    { name: "Nov", newAnimals: 4 },
    { name: "Dec", newAnimals: 7 },
    { name: "Jan", newAnimals: 2 },
    { name: "Feb", newAnimals: 5 },
    { name: "Mar", newAnimals: 6 },

];

const AnimalsChart = () => {
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
                        data={newAnimalsData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="newAnimals" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};
export default AnimalsChart;