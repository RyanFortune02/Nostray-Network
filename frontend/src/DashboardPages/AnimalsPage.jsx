import React, { useState, useEffect } from 'react'
import { PawPrint, ActivitySquare, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import api from "../api";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import AnimalsTable from "../components/Tables/AnimalsTable";

const AnimalsPage = () => {
    // State to hold animal statistics
    const [animalStats, setAnimalStats] = useState({
        totalAnimals: 0,
        sick: 0,
        adopted: 0
    });

    useEffect(() => {
        const fetchAnimalStats = async () => {
            try {
                const response = await api.get('/api/animals/');
                // Filter animals to include only those that have been reviewed
                const reviewedAnimals = response.data.filter(animal => animal.needs_review === false);
                
                // Calculate statistics based on reviewed animals only
                const totalAnimals = reviewedAnimals.length;
                const sickAnimals = reviewedAnimals.filter(animal => animal.status === 'sick').length;
                const adoptedAnimals = reviewedAnimals.filter(animal => animal.status === 'adopted').length;
                
                // Update state with the calculated statistics
                setAnimalStats({
                    totalAnimals,
                    sick: sickAnimals,
                    adopted: adoptedAnimals
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching animal statistics:', error);
                setLoading(false);
            }
        };

        fetchAnimalStats(); // Fetch animal statistics when the component mounts
    }, []);

    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Animals Management' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard
                        name='Total Animals'
                        icon={PawPrint}
                        value={animalStats.totalAnimals}
                        color='#6366F1'
                    />
                    <StatCard 
                        name='Sick Animals' 
                        icon={ActivitySquare} 
                        value={animalStats.sick} 
                        color='#EF4444'
                    />
                    <StatCard 
                        name='Adopted' 
                        icon={CheckCircle} 
                        value={animalStats.adopted} 
                        color='#10B981'
                    />
                </motion.div>

                <AnimalsTable />
            </main>
        </div>
    );
};

export default AnimalsPage;
