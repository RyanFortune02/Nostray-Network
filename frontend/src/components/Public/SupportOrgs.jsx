import React from 'react';
import { motion } from 'framer-motion';
import pollutionExtractor from '../../images/pollutionExtractor.png';
import saveThePlanet from '../../images/saveThePlanet.png';
import natureAndUs from '../../images/natureAndUs.png';

/*
" Hi there! We have three long-term partners (pollution extractor, save the planet, nature, and us) who have greatly supported the organization,
No Stray Animals Ever (NSAE). It would be great if you could add their logos somewhere and acknowledge them for their support
*/
const SupportOrgs = () => {
    const supporters = [
        {
            name: 'Pollution Extractor',
            logo: pollutionExtractor,
        },
        {
            name: 'Save the Planet',
            logo: saveThePlanet,
        },
        {
            name: 'Nature and Us',
            logo: natureAndUs,
        },
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold text-gray-900">Our Valued Partners</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        These organizations have been long-term supporters of No Stray Animals Ever (NSAE). <br />
                        We're deeply grateful for their continued commitment to our mission.
                    </p>
                </motion.div>

                <div className="mt-10 grid gap-8 md:grid-cols-3">
                    {supporters.map((supporter, index) => (
                        <motion.div
                            key={supporter.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="px-6 py-8 flex flex-col items-center">
                                <div className="h-24 flex items-center justify-center mb-6">
                                    <img
                                        className="h-full object-contain"
                                        src={supporter.logo}
                                        alt={`${supporter.name} logo`}
                                    />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">{supporter.name}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SupportOrgs;