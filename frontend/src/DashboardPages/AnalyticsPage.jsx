import React from 'react'
import Header from '../components/common/Header';
import VolunteersChart from '../components/Dashboard/VolunteersChart';
import DonationsChart from '../components/Dashboard/DonationsChart';
import AnimalsChart from '../components/Dashboard/AnimalsChart';

const AnalyticsPage = () => {
    return (
        <div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
            <Header title='Analytics Dashboard' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8 gap-8 mb-8'>
                <div className="mb-8">
                    <DonationsChart />
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
                    <VolunteersChart />
                    <AnimalsChart />
                </div>
            </main>
        </div>
    )
}

export default AnalyticsPage;
