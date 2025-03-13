import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dog, Goal, HandCoins } from 'lucide-react';
{/* Components */ }
import Header from '../components/common/Header';
import StatCard from '../components/common/StatCard';
import NewsFeed from '../components/News/NewsFeed';

import api from '../api';

const OverviewPage = () => {
    // State to manage news data, loading state, and error state
    const [news, setNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch news when the component mounts and listen for news creation events
    useEffect(() => {
        fetchNews();

        // this function will be called when the custom event 'newsCreated' is dispatched
        const refreshNewsOnCreation = () => {
            console.log('News refresh triggered by newsCreated event');
            fetchNews(); // Re-fetch news to update the list
        };

        // Listen for the custom event dispatched from HRPage
        window.addEventListener('newsCreated', refreshNewsOnCreation);

        return () => {
            // Clean up the event listener when component unmounts
            window.removeEventListener('newsCreated', refreshNewsOnCreation);
        };
    }, []);

    // Function to fetch news from API
    const fetchNews = async () => {
        setIsLoading(true);
        try {
            // Send GET request to fetch news data
            const response = await api.get('/api/news/');
            setNews(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching news:', err);
            setError('Failed to load news. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Overview" />
            {/* Main content*/}
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* STATS CARDS */}
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    {/* Initialize the StatCard component for displaying name, icon, value and color of the card */}
                    <StatCard name="Animals at Safari Park" icon={Dog} value='2,500' color='#f59e0b' />
                    <StatCard name="New animals added" icon={Goal} value='+200' color='#EC4899' />
                    <StatCard name="Total Fund Raised" icon={HandCoins} value='2,500' color='#10B981' />
                </motion.div>

                {/* News Management Section */}
                <div className="mb-6 mt-10 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-200">Recent Announcements</h2>
                </div>

                {/* News Feed Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <NewsFeed
                        customNews={news}
                        isLoading={isLoading}
                        error={error}
                    />
                </motion.div>
            </main>
        </div>
    );
};

export default OverviewPage;
