import Header from '../components/common/Header';
import { motion } from 'framer-motion';
import StatCard from '../components/common/StatCard';
import { Dog, Goal, HandCoins } from 'lucide-react';
import NewsFeed from '../components/News/NewsFeed';

const OverviewPage = () => {
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

                {/* News Feed Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <NewsFeed />
                </motion.div>
            </main>
        </div>
    );
};

export default OverviewPage;
