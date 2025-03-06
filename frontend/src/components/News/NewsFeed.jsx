import { motion } from 'framer-motion';
import NewsData from  "../../NewsData";

import { Bell, Calendar, Info } from 'lucide-react';

const NewsFeed = () => {
    // Function to get the icon based on the type of news
    const getIcon = (type) => {
        switch (type) {
            case 'donation':
                return <Bell className="text-green-500" />;
            case 'event':
                return <Calendar className="text-blue-500" />;
            case 'urgent':
                return <Info className="text-red-500" />;
            default:
                return <Bell className="text-gray-500" />;
        }
    };

    return (
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Recent Announcements</h2>
            <div className="space-y-4">
                {/* Map through the NewsData array and display the news */}
                {NewsData.map((news, index) => (
                    <motion.div
                        key={news.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-4 p-4 rounded-lg bg-gray-700 bg-opacity-50"
                    >
                        <div className="flex-shrink-0">
                            {getIcon(news.type)}
                        </div>
                        <div>
                            <h3 className="font-medium">{news.title}</h3>
                            <p className="text-sm text-gray-300 mt-1">{news.content}</p>
                            <span className="text-xs text-gray-400 mt-2 block">
                                {new Date(news.date_posted).toLocaleDateString()}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default NewsFeed;
