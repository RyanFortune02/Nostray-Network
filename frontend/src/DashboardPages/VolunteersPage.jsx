import React, { useState } from 'react'
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/common/Header";
import AnimalForm from "../components/AnimalForm";

const VolunteersPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false); // State to control the visibility of the form modal

  // Function to handle form submission success
  const handleFormSuccess = () => {
      setIsFormOpen(false); // Close the form after successful submission
      console.log("Animal added successfully!");
  };

  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title='Volunteers Management' />

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Volunteer Dashboard</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-md"
          >
            <Plus size={18} />
            Report Animal
          </motion.button>
        </div>

        <AnimatePresence>
          {isFormOpen && (
            <div className="fixed inset-0 z-50 overflow-hidden">
              <div className="absolute inset-0 bg-gray-900 bg-opacity-75" />
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <motion.div
                  className="relative w-full max-w-lg"
                  initial={{ opacity: 0, y: -50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* AnimalForm component for reporting new animals */}
                  <AnimalForm
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    onSuccess={handleFormSuccess}
                  />
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default VolunteersPage;
