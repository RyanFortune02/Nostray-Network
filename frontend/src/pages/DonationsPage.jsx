import React, { useState } from "react";
import Navbar from "../components/Public/Navbar";
import Footer from "../components/Public/Footer";
import api from "../api";

const DonationsPage = () => {
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Validate amount first
    const usdAmount = parseInt(amount, 10);
    if (isNaN(usdAmount)) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      await api.post("/api/donations/", {
        donor_name: donorName,
        usd_amount: usdAmount,
      });

      setMessage("Thank you for your donation!");
      setDonorName("");
      setAmount("");
    } catch {
      setError("Failed to process donation. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900">
              Make a Donation
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Help us continue our mission of rescuing and caring for animals in
              need
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="donorName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="donorName"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Donation Amount (USD)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="1"
                    className="block w-full pl-7 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 py-2"
                    placeholder="0"
                  />
                </div>
              </div>

              {message && (
                <div className="rounded-md bg-green-50 p-4">
                  <p className="text-sm font-medium text-green-800">
                    {message}
                  </p>
                </div>
              )}

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Donate Now
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DonationsPage;
