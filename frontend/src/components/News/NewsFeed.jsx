import { motion } from 'framer-motion';
import { Bell, Calendar, Info, FileText, Megaphone } from 'lucide-react';

const NewsFeed = ({ customNews = [], isLoading, error }) => {

    // Function to get the icon based on the type of news
    const getIcon = (type) => {
        switch (type) {
            case 'news':
                return <Bell className="text-green-500" />;
            case 'event':
                return <Calendar className="text-blue-500" />;
            case 'announcement':
                return <Megaphone className="text-yellow-500" />;
            case 'blog':
                return <FileText className="text-purple-500" />;
            case 'urgent':
                return <Info className="text-red-500" />;
            default:
                return <Bell className="text-gray-500" />;
        }
    };

    return (
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Recent Announcements</h2>

            {isLoading ? (
                <div className="text-center py-8 text-gray-400">Loading news...</div>
            ) : error ? (
                <div className="text-center py-8 text-red-400">{error}</div>
            ) : customNews.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No announcements available</div>
            ) : (
                <div className="space-y-4">
                    {/* Map through news and display each item */}
                    {customNews.map((news, index) => (
                        <motion.div
                            key={news.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start space-x-4 p-4 rounded-lg bg-gray-700 bg-opacity-50"
                        >
                            <div className="flex-shrink-0">
                                {getIcon(news.type)}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium">{news.title}</h3>
                                <p className="text-sm text-gray-300 mt-1">{news.content}</p>
                                <div className="flex justify-between text-xs text-gray-400 mt-2">
                                    <span>
                                        {new Date(news.date_posted).toLocaleDateString()}
                                    </span>
                                    {news.author && (
                                        <span>Posted by: {news.author}</span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NewsFeed;
