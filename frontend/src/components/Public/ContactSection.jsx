import React from 'react';
import { Mail, PhoneCall } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactSection = () => {
  return (
    <section id="contact-section" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900">Contact Us</h2>
          <p className="mt-4 text-lg text-gray-600">
            Want to support our cause? We'd love to hear from you!
          </p>
        </motion.div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-lg p-6 text-center"
          >
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">Email</h3>
            <p className="mt-2 text-base text-gray-600">HR Department</p>
            <p className="mt-2">
              <a
                href="mailto:hr@nsae.org"
                className="text-blue-600 hover:text-blue-500"
              >
                hr@nsae.org
              </a>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-lg p-6 text-center"
          >
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
              <PhoneCall className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">Phone</h3>
            <p className="mt-2 text-base text-gray-600">
              Monday-Friday, 9am-5pm
            </p>
            <p className="mt-2">
              <a
                href="tel:+18000000000"
                className="text-blue-600 hover:text-blue-500"
              >
                +1 (800) 000-0000
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
