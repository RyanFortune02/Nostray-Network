import { motion } from "framer-motion";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const donationData = [
    {
        name: 'Aug',
        goal: 4000,
        collected: 2400,
    },
    {
        name: 'Sep',
        goal: 3000,
        collected: 1398,
    },
    {
        name: 'Oct',
        goal: 2000,
        collected: 5800,
    },
    {
        name: 'Nov',
        goal: 2780,
        collected: 3908,
    },
    {
        name: 'Dec',
        goal: 1890,
        collected: 4800,
    },
    {
        name: 'Jan',
        goal: 2390,
        collected: 3800,
    },
    {
        name: 'Feb',
        goal: 3490,
        collected: 4300,
    },
    {
        name: 'Mar',
        goal: 3490,
        collected: 4300,
    },
];

const DonationsChart = () => {
    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <h2 className='text-lg font-medium mb-4 text-gray-100'>Donations Overview</h2>

            <div className='h-80'>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={donationData}
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
                        <Bar dataKey="collected" fill="#8884d8"  />
                        <Bar dataKey="goal" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    )
}

export default DonationsChart;
