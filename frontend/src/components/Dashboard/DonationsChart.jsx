import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from "react";
import api from "../../api";

const DonationsChart = () => {
    const [donationData, setDonationData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch donation and expense data from the API
    useEffect(() => {
        const fetchDonationData = async () => {
            try {
                // Get donations and expenses for the last 8 months
                const donations = await api.get('/api/donations/', { params: { months: 8 } });
                const expenses = await api.get('/api/expenses/', { params: { months: 8 } });
                
                // Process donation and expense data by month
                const processedData = processFinancialData(donations.data, expenses.data);
                setDonationData(processedData);
            } catch (error) {
                console.error("Failed to fetch donation data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDonationData();
    }, []);

    // Process donation and expense data by month
    const processFinancialData = (donationsData, expensesData) => {
        const now = new Date(); // Get current date
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        // Initialize monthly data object
        const monthlyData = {};
        for (let i = 7; i >= 0; i--) {
            const monthIndex = (now.getMonth() - i + 12) % 12; // Calculate month index
            const monthName = monthNames[monthIndex];
            monthlyData[monthName] = { name: monthName, donations: 0, expenses: 0 };
        }
        
        // Iterate over donations to process by month
        donationsData.forEach(donation => {
            if (donation.timestamp) {
                const date = new Date(donation.timestamp);
                const monthName = monthNames[date.getMonth()];
                
                // Only include data from last 8 months
                const monthsDiff = 
                    (now.getFullYear() - date.getFullYear()) * 12 + 
                    (now.getMonth() - date.getMonth());
                    
                if (monthsDiff <= 7 && monthsDiff >= 0 && monthlyData[monthName]) {
                    monthlyData[monthName].donations += donation.usd_amount;
                }
            }
        });
        
        // Process expenses
        expensesData.forEach(expense => {
            if (expense.timestamp) {
                const date = new Date(expense.timestamp);
                const monthName = monthNames[date.getMonth()];
                
                // Only include data from last 8 months
                const monthsDiff = 
                    (now.getFullYear() - date.getFullYear()) * 12 + 
                    (now.getMonth() - date.getMonth());
                    
                if (monthsDiff <= 7 && monthsDiff >= 0 && monthlyData[monthName]) {
                    monthlyData[monthName].expenses += expense.usd_amount;
                }
            }
        });
        
        // Convert to array format for chart
        return Object.values(monthlyData);
    };

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <h2 className='text-lg font-medium mb-4 text-gray-100'>Financial Overview</h2>

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
                        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                        <XAxis dataKey="name" stroke="#e5e7eb" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: "rgba(31, 41, 55, 0.8)",
                                borderColor: "#4B5563",
                            }}
                            itemStyle={{ color: "#E5E7EB" }}
                            formatter={(value, name) => [`$${value}`, name.charAt(0).toUpperCase() + name.slice(1)]}
                            labelFormatter={(label) => `Month: ${label}`}
                        />
                        <Legend 
                            wrapperStyle={{ color: "#e5e7eb" }}
                            formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                        />
                        <Bar 
                            dataKey="expenses" 
                            name="Expenses" 
                            fill="#ef4444" 
                            radius={[4, 4, 0, 0]} 
                        />
                        <Bar 
                            dataKey="donations" 
                            name="Donations" 
                            fill="#10b981" 
                            radius={[4, 4, 0, 0]} 
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default DonationsChart;
