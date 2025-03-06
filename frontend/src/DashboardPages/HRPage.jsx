import { UserPlus, UsersIcon } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import MembersTable from "../components/Tables/MembersTable";


const teamStats = {
    teamMembers: 20,
    newVolunteers: 5,
};

const HRPage = () => {
    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Human Resources' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* STATS */}
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard
                        name='Total Members'
                        icon={UsersIcon}
                        value={teamStats.teamMembers.toLocaleString()}
                        color='#6366F1'
                    />
                    <StatCard name='New Volunteers' icon={UserPlus} value={teamStats.newVolunteers} color='#10B981' />
                </motion.div>

                <MembersTable />
            </main>
        </div>
    );
};
export default HRPage;