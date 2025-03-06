import React from 'react'
import { PawPrint } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import AnimalsTable from "../components/Tables/AnimalsTable";

const animalStats = {
    totalAnimals: 15,
    underTreatment: 3,
};

const AnimalsPage = () => {
    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Animals Management' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
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
                        name='Under Treatment' 
                        icon={PawPrint} 
                        value={animalStats.underTreatment} 
                        color='#EF4444'
                    />
                </motion.div>

                <AnimalsTable />
            </main>
        </div>
    );
};

export default AnimalsPage;
