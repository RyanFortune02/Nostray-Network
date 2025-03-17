import React, { useState, useEffect } from 'react';
import AnimalCard from '../components/AnimalCard';
import Header from '../components/common/Header';
import MeetingForm from '../components/MeetingForm';
import { motion } from 'framer-motion';
import api from '../api';

const BoardMembersPage = () => {
  const [animals, setAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMeetingFormOpen, setIsMeetingFormOpen] = useState(false); // State to control the visibility of the meeting form modal
  const [selectedAnimal, setSelectedAnimal] = useState(null); // State to hold the selected animal for the meeting form

  // Function to fetch animals (used after modal actions)
  const fetchAnimals = async () => {
    try {
      setIsLoading(true);
      // Fetch animals that need review from the backend
      const response = await api.get('/api/animals/?needs_review=true');
      // Additional filter to ensure only animals needing review are shown after acceptance/rejection
      const filteredAnimals = response.data.filter(animal => animal.needs_review === true);
      setAnimals(filteredAnimals); // Update state with the fetched animals
    } catch (err) {
      console.error('Error fetching animals:', err);
      setError('Failed to load animals. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // UseEffect to fetch animals when the component mounts
  useEffect(() => {
    fetchAnimals(); 
  }, []);

  // Calls the meeting form modal when an animal is selected for review
  const handleCallMeeting = (animal) => {
    setSelectedAnimal(animal);
    setIsMeetingFormOpen(true);
  };

  // Handle closing the meeting form modal
  const handleCloseMeetingForm = () => {
    setIsMeetingFormOpen(false);
    setSelectedAnimal(null);
    fetchAnimals(); // Refetch animals to update the list after acceptance/rejection
  };

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

          {isLoading ? (
            <div className="text-center py-10">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent"></div>
              <p className="mt-2 text-gray-400">Loading animals...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-400">
              {error}
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {/* Render AnimalCard components for each animal */}
              {animals.map(animal => (
                <AnimalCard 
                  key={animal.id} 
                  animal={animal} 
                  onCallMeeting={handleCallMeeting}
                />
              ))}
            </div>
          )}

          {!isLoading && !error && animals.length === 0 && (
            <div className='text-center text-gray-400 py-10'>
              No animals in the registry
            </div>
          )}
          
          {/* Meeting Form Modal */}
          <MeetingForm 
            isOpen={isMeetingFormOpen}
            onClose={handleCloseMeetingForm}
            animal={selectedAnimal}
          />
        </div>
      </motion.main>
    </div>
  );
}

export default BoardMembersPage;
