import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">NSAE</h3>
            <p className="text-gray-300 text-sm">
              No Stray Animals Ever is dedicated to rescuing, rehabilitating,
              and rehoming stray animals. Our mission is to create a world where
              every animal has a safe and loving home.
            </p>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white text-sm">
                  Home
                </Link>
              </li>
              <li>
                <a
                  href="#team-section"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Leadership Team
                </a>
              </li>
              <li>
                <Link
                  to="/donations"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Donations
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>1 Main Street, Dreamland</li>
              <li>DL 00000, ULTRA PLANET</li>
              <li>hr@nsae.org</li>
              <li>+1 (800) 000-0000</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 md:flex md:items-center md:justify-between">
          <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
            Project created for educational purposes by Sam, Ryan, and Domenica
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
