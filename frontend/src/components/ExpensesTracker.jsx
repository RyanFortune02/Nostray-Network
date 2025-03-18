import React, { useState, useEffect } from 'react';
import { X , Plus} from 'lucide-react';
import api from '../api';

const ExpensesTracker = () => {
    const [amount, setAmount] = useState(''); // Expense amount
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);  // Modal state to toggle modal

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        // Reset form state when closing
        if (isModalOpen) {
            setAmount('');
            setError('');
            setSuccess(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset states
        setSuccess(false);
        setError('');

        // Check if amount is valid
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        // Convert to integer and round off
        const amountInt = Math.round(Number(amount));

        try {
            setLoading(true);

            // Send POST request to add expense
            await api.createExpense({
                usd_amount: amountInt
            });

            // Success handling
            setSuccess(true);
            setAmount(''); // Reset amount field
            
            // Dispatch event to notify DonationsChart to refresh data
            const event = new CustomEvent("expenseAdded");
            console.log("Dispatching expenseAdded event");
            window.dispatchEvent(event);

            // Reset success message after 3 seconds
            setTimeout(() => {
                setSuccess(false);
            }, 3000);

        } catch (err) {
            setError('Failed to add expense. Please try again.');
            console.error('Error adding expense:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            {/* Toggle Button for opening/closing form */}
            <button
                onClick={toggleModal}
                className="min-w-[140px] w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
            >
                <Plus size={16} className="sm:size-18" />
                {isModalOpen ? 'Close Expenses' : 'Add Expense'}
            </button>

            {/* Modal Form Overlay - Move to document root for better positioning */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-3 sm:p-4 md:p-5">
                    <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                        {/* Header of Modal */}
                        <div className="flex justify-between items-center border-b border-gray-700 p-3 sm:p-4">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">Add Expense</h2>
                            <button
                                onClick={toggleModal}
                                className="text-gray-400 hover:text-white focus:outline-none"
                            >
                                <X size={18} className="sm:size-20" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-4 sm:p-5 md:p-6">
                            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                                <div>
                                    <label htmlFor="expense-amount" className="block text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2">
                                        Amount (USD)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                            $
                                        </span>
                                        <input
                                            id="expense-amount"
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="block w-full pl-7 pr-12 py-1.5 sm:py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                                            placeholder="0.00"
                                            min="0"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-1.5 sm:py-2 px-4 sm:px-6 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? 'Adding...' : 'Add'}
                                </button>
                            </form>

                            {success && (
                                <div className="mt-3 sm:mt-4 py-2 px-3 sm:px-4 rounded-md bg-green-900 text-green-200 text-xs sm:text-sm">
                                    Expense added successfully!
                                </div>
                            )}

                            {error && (
                                <div className="mt-3 sm:mt-4 py-2 px-3 sm:px-4 rounded-md bg-red-900 text-red-200 text-xs sm:text-sm">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpensesTracker;
