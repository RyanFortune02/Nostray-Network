import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomepageBanner from '../../images/HomepageBanner.jpg';

const Hero = () => {
  return (
    <div className="relative bg-gray-600">
      <div className="absolute inset-0">
        <img
          className="h-full w-full object-cover opacity-30"
          src={HomepageBanner}
          alt="animals paws"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-500 mix-blend-multiply" />
      </div>
      
      <div className="relative px-4 py-24 sm:px-6 sm:py-32 lg:py-40 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-blue-600 sm:text-5xl lg:text-6xl">
            No Stray Animals Ever
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100">
            A non-profit organization dedicated to caring for stray animals. <br />
            Our mission is to protect and provide shelter for animals in need.
          </p>
          <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5"
            >
              <Link
                to="/register"
                className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50 sm:px-8"
              >
                Volunteer Sign-Up
              </Link>
              <button className='flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 sm:px-8'>
                Donate Now
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;