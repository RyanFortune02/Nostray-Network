import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import api from "../../api";

const VolunteersChart = () => {
	const [volunteersData, setVolunteersData] = useState([]);
	const [loading, setLoading] = useState(true);

	// Fetch volunteer data from the API
	useEffect(() => {
		const fetchVolunteerData = async () => {
			try {
				const response = await api.getVolunteerProfiles();
				// Process volunteer data to count by month
				const volunteersByMonth = processVolunteerData(response.data);
				setVolunteersData(volunteersByMonth);
			} catch (error) {
				console.error("Failed to fetch volunteer data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchVolunteerData(); 
	}, []);

	
	// Function to process volunteer data and count volunteers by month
	const processVolunteerData = (data) => {
		const now = new Date(); // Get the current date
		const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		
		// Hold the count of volunteers for each month
		const monthCounts = {};
		for (let i = 7; i >= 0; i--) {
			const monthIndex = (now.getMonth() - i + 12) % 12; // Calculate the month index
			// Get the month name and initialize the count to 0
			const monthName = monthNames[monthIndex];
			monthCounts[monthName] = 0;
		}
		
		// Iterate over the data to only count volunteers
		data.forEach((profile) => {
			const isVolunteer = profile?.user?.roles?.includes('volunteer') || false;
			if (!isVolunteer) {
				return;
			}
			// Check when the date user joined as a volunteer
			if (profile.user && profile.user.date_joined) {
				const joinDate = new Date(profile.user.date_joined);
				const monthName = monthNames[joinDate.getMonth()];
				
				// Calculate the difference in current month and the month they joined
				const monthsDiff = 
					(now.getFullYear() - joinDate.getFullYear()) * 12 + 
					(now.getMonth() - joinDate.getMonth());
				
				// Will only display volunteers who joined in the last 8 months
				if (monthsDiff <= 7 && monthsDiff >= 0) {
					monthCounts[monthName] = (monthCounts[monthName] || 0) + 1;
				}
			}
		});
		
		// Convert to array format data for the chart
		return Object.keys(monthCounts).map(month => ({
			name: month,
			volunteers: monthCounts[month]
		}));
	};

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<h2 className='text-lg font-medium mb-4 text-gray-100'>Volunteers Overview</h2>

			<div className='h-80'>
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<LineChart data={volunteersData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
						<XAxis dataKey={"name"} stroke='#9ca3af' />
						<YAxis 
							stroke='#9ca3af'
							tickCount={6}  
							domain={[0, dataMax => Math.ceil(dataMax / 5) * 5]} 
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Line
							type='monotone'
							dataKey='volunteers'
							stroke='#EC4899'
							strokeWidth={3}
							dot={{ fill: "#EC4899", strokeWidth: 2, r: 6 }}
							activeDot={{ r: 8, strokeWidth: 2 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default VolunteersChart;