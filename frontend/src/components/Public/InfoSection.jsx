import React from 'react';
import { MapPin, Building } from 'lucide-react';
import { motion } from 'framer-motion';

const InfoSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900">Our Locations</h2>
          <p className="mt-4 text-lg text-gray-600">
            Visit our main office or our safari park to learn more about our work
          </p>
        </motion.div>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-blue-600" />
                <h3 className="ml-3 text-xl font-medium text-gray-900">Main Office</h3>
              </div>
              <p className="mt-4 text-gray-700">
                Our headquarters where we manage our operations and host events. 
              </p>
              <div className="mt-6 flex items-start">
                <MapPin className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <p className="ml-3 text-gray-600">
                  1 Main Street, Dreamland, DL 00000, ULTRA PLANET
                </p>
              </div>
              <div className="mt-6">
                <p className="text-gray-600">
                  <span className="font-medium">Working Spaces:</span> Conference Room 101, Auditorium 202
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-blue-600" />
                <h3 className="ml-3 text-xl font-medium text-gray-900">Safari Park</h3>
              </div>
              <p className="mt-4 text-gray-700">
                We can accomodate up to 3,000 animals of various types in our park.
              </p>
              <div className="mt-6 flex items-start">
                <MapPin className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <p className="ml-3 text-gray-600">
                  2 Park Street, Dreamland, DL 00000, ULTRA PLANET
                </p>
              </div>
              <div className="mt-6">
                <p className="text-gray-600">
                  <span className="font-medium">Visiting Hours:</span> 9:00 AM - 5:00 PM (Monday - Sunday)
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;