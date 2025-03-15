import React, { useState } from 'react';
import AnimalCard from '../components/AnimalCard';
import Header from '../components/common/Header';
import { motion } from 'framer-motion';

const BoardMembersPage = () => {

  // Sample data for animals with multiple attributes
  const [animals] = useState([
    {
      id: 1,
      name: "Max",
      type: "Dog",
      status: "healthy",
      needs_review: false,
      caregiver: "JohnDoe",
      date_added: "2024-06-15T10:30:00Z"
    },
    {
      id: 2,
      name: "Luna",
      type: "Cat",
      status: "sick",
      needs_review: true,
      caregiver: "JaneSmith",
      date_added: "2024-07-22T08:45:00Z"
    },
    {
      id: 3,
      name: "Charlie",
      type: "Rabbit",
      status: "adopted",
      needs_review: true,
      caregiver: "MikeBrown",
      date_added: "2024-08-05T14:20:00Z"
    },
  ]);

  return (
    <div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
      <Header title='Board Members Page' />

      <motion.main
        className='p-4'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className='w-full max-w-6xl mx-auto'>
          <div className='mb-6'>
            <h2 className='text-2xl font-bold text-white'>
              Review New Animal Board
            </h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {/* Render AnimalCard components for each animal */}
            {animals.map(animal => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>

          {animals.length === 0 && (
            <div className='text-center text-gray-400 py-10'>
              No animals in the registry
            </div>
            
          )}
        </div>
      </motion.main>
    </div>
  );
}

export default BoardMembersPage;
