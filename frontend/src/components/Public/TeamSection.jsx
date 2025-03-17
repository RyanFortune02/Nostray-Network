import React from 'react';
import { motion } from 'framer-motion';

const TeamSection = () => {
  const teamMembers = [
    {
      name: 'Mr. D',
      role: 'Chief Executive Officer',
    },
    {
      name: 'Alice Brown',
      role: 'Board Member',
    },
    {
      name: 'Charlie Wilson',
      role: 'Head of Caregivers',
    },
    {
      name: 'Maya Rodriguez',
      role: 'Volunteer Coordinator',
    },
  ];

  return (
    <section id="team-section" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900">Our Leadership Team</h2>
          <p className="mt-4 text-lg text-gray-600">
            Meet the dedicated individuals who lead our organization
          </p>
        </motion.div>

        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="px-4 py-5 sm:px-6 text-center">
                <h3 className="mt-4 text-lg font-medium text-gray-900">{member.name}</h3>
                <p className="mt-1 text-sm text-blue-600">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;