import React, { useState } from 'react'
import Header from '../components/common/Header';
import ProfileCard from '../components/ProfileCard';
import { motion } from 'framer-motion';

const ProfilePage = () => {
    // Sample data with multiple profiles
    const [userProfiles] = useState([
        {
            id: 1,
            user: { username: "JessicaP" },
            bio: "Animal lover and volunteer with 5+ years experience",
            hobbies: "Reading, Hiking, Photography",
            town: "Springfield",
            status: "Active",
        },
        {
            id: 2,
            user: { username: "MikeD" },
            bio: "Veterinary assistant and dog trainer",
            hobbies: "Running, Gaming",
            town: "Riverdale",
            status: "Active",
        },
        {
            id: 3,
            user: { username: "SarahT" },
            bio: "Cat shelter coordinator and foster parent for kittens",
            hobbies: "Crafting, Cooking, Gardening",
            town: "Oakville",
            status: "Inactive",
        },
        {
            id: 4,
            user: { username: "AlexW" },
            bio: "Wildlife rescue volunteer",
            hobbies: "Camping, Bird watching",
            town: "Foresthill",
            status: "Active",
        }
    ]);

    return (
        <div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
            <Header title='Profile Page' />

            <motion.main
                className='p-4'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className='w-full max-w-4xl mx-auto'>
                    <h2 className='text-2xl font-bold text-white mb-6'>
                        Staff and Volunteers Profiles
                    </h2>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {/* Render ProfileCard components for each user profile */}
                        {userProfiles.map(profile => (
                            <ProfileCard key={profile.id} volunteerProfile={profile} />
                        ))}
                    </div>
                </div>
            </motion.main>
        </div>
    )
}

export default ProfilePage
