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
    const [totalFunds, setTotalFunds] = useState(0);
    const [fundsError, setFundsError] = useState(false);
    const [animalsData, setAnimalsData] = useState({
        totalAnimals: 0,
        newAnimalsAdded: 0,
        loading: true,
        error: false
    });

    // Fetch news when the component mounts and listen for news creation events
    useEffect(() => {
        fetchNews();
        fetchFunds();
        fetchAnimalsData();

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

    // Function to fetch animal data from API
    const fetchAnimalsData = async () => {
        // Set loading state to true and error state to false
        setAnimalsData(prevState => ({
            ...prevState,
            loading: true,
            error: false
        }));
        
        try {
            const response = await api.getAnimals();
            
            // Display all animals that don't need review (approved animals)
            const approvedAnimals = response.data.filter(animal => animal.needs_review === false);
            
            // Calculate number of new animals added in the last 30 days
            const now = new Date();
            const LastThirtyDays = new Date(now);
            LastThirtyDays.setDate(now.getDate() - 30);
            
            // Filter animals added in the last 30 days
            const newAnimals = approvedAnimals.filter(animal => {
                const addedDate = new Date(animal.date_added);
                return addedDate >= LastThirtyDays;
            });

            // Update the state with the new data
            setAnimalsData({
                totalAnimals: approvedAnimals.length,
                newAnimalsAdded: newAnimals.length,
                loading: false,
                error: false
            });
        } catch (err) {
            console.error('Error fetching animals data:', err);
            setAnimalsData(prevState => ({
                ...prevState,
                loading: false,
                error: true
            }));
        }
    };

    // Function to fetch funds from API
    const fetchFunds = async () => {
        try {
            const response = await api.getFunds();
            setTotalFunds(response.data.available_funds);
            setFundsError(false);
        } catch (err) {
            console.error('Error fetching funds:', err);
            setFundsError(true);
        }
    };

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

    const formatFundsDisplay = () => {
        if (fundsError) {
            return 'Error loading';
        }
        return `$${totalFunds.toLocaleString()}`;
    };

    const formatAnimalStats = (stat, isNewAnimals = false) => {
        if (animalsData.loading) {
            return 'Loading...';
        }
        if (animalsData.error) {
            return 'Error loading';
        }
        return isNewAnimals ? `+${stat}` : stat.toLocaleString();
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
                    <StatCard 
                        name="Animals at Safari Park" 
                        icon={Dog} 
                        value={formatAnimalStats(animalsData.totalAnimals)} 
                        color='#f59e0b' 
                    />
                    <StatCard 
                        name="New animals added (30 days)" 
                        icon={Goal} 
                        value={formatAnimalStats(animalsData.newAnimalsAdded, true)} 
                        color='#EC4899' 
                    />
                    <StatCard 
                        name="Total Donations" 
                        icon={HandCoins} 
                        value={formatFundsDisplay()} 
                        color='#10B981' 
                    />
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
