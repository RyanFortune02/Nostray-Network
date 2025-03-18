import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle } from "lucide-react";
import Header from '../components/common/Header';
import VolunteersChart from '../components/Dashboard/VolunteersChart';
import DonationsChart from '../components/Dashboard/DonationsChart';
import AnimalsChart from '../components/Dashboard/AnimalsChart';
import ExpensesTracker from '../components/ExpensesTracker';
import NewsForm from '../components/News/NewsForm';

const AnalyticsPage = () => {
  const [showNewsModal, setShowNewsModal] = useState(false);

  // Function to dispatch the event after news creation
  const notifyNewsCreation = async () => {
    console.log("Dispatching newsCreated event");
    const event = new CustomEvent("newsCreated");
    window.dispatchEvent(event);
  };

  return (
    <div className="flex-1 overflow-auto relative z-0 bg-gray-900">
      <Header title="Analytics Dashboard" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 gap-8 mb-8">
        {/* Container for both buttons */}
        <div className="mb-6 flex flex-wrap justify-center gap-4">
          <div className="flex-grow min-w-[200px]">
            <ExpensesTracker />
          </div>
          
          <button
            onClick={() => setShowNewsModal(true)}
            className="min-w-[140px] flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <PlusCircle size={18} />
            <span>Create News</span>
          </button>
        </div>

        <div className="mb-12">
          <DonationsChart />
        </div>
        
        {/* News Form Modal */}
        <NewsForm
          isOpen={showNewsModal}
          onClose={() => setShowNewsModal(false)}
          onSuccess={notifyNewsCreation}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <VolunteersChart />
          <AnimalsChart />
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;
