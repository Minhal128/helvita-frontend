import React, { useState, useEffect } from 'react'
import { FaCalendar } from 'react-icons/fa';
import { FiDownload } from 'react-icons/fi';
import { LuCircleChevronDown, LuCircleChevronUp } from "react-icons/lu";
import { plaidAPI } from '../../services/api';

const TransactionPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'deposit', 'transfer'

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            // Fetch both Plaid transactions and our Stripe transfers
            const [plaidResponse, transfersResponse] = await Promise.all([
                plaidAPI.getTransactions(),
                plaidAPI.getTransfers()
            ]);

            let allTransactions = [];

            // Format Plaid transactions
            if (plaidResponse.transactions && plaidResponse.transactions.length > 0) {
                const formattedPlaidTransactions = plaidResponse.transactions.map((t, index) => ({
                    description: t.merchant_name || t.name || 'Transaction',
                    transactionId: `#${t.transaction_id?.slice(0, 10) || index}`,
                    type: t.amount > 0 ? 'Transfer' : 'Deposit',
                    card: t.account_id ? `****${t.account_id.slice(-4)}` : '****',
                    date: new Date(t.date).toLocaleDateString('en-US'),
                    rawDate: new Date(t.date),
                    amount: t.amount < 0 ? `$${Math.abs(t.amount).toFixed(2)}` : `-$${t.amount.toFixed(2)}`,
                    isExpense: t.amount > 0,
                    source: 'plaid'
                }));
                allTransactions = [...allTransactions, ...formattedPlaidTransactions];
            }

            // Format our Stripe transfers
            if (transfersResponse.transfers && transfersResponse.transfers.length > 0) {
                const formattedTransfers = transfersResponse.transfers.map((t) => ({
                    description: `Helvita Transfer to ${t.destination || 'Bank Account'}`,
                    transactionId: `#${t.id?.slice(0, 10) || t.stripePaymentIntentId?.slice(0, 10) || 'N/A'}`,
                    type: 'Transfer',
                    card: '****Helvita',
                    date: new Date(t.createdAt).toLocaleDateString('en-US'),
                    rawDate: new Date(t.createdAt),
                    amount: `-$${Number(t.amount).toFixed(2)}`,
                    isExpense: true,
                    source: 'helvita',
                    status: t.status
                }));
                allTransactions = [...allTransactions, ...formattedTransfers];
            }

            // Sort by date (newest first)
            allTransactions.sort((a, b) => b.rawDate - a.rawDate);

            setTransactions(allTransactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = transactions.filter(t => {
        if (filter === 'all') return true;
        if (filter === 'deposit') return !t.isExpense;
        if (filter === 'transfer') return t.isExpense;
        return true;
    });

    if (loading) {
        return (
            <div className='flex-1 flex items-center justify-center m-2.5 sm:m-5 bg-white rounded-lg p-3 sm:p-5'>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue mx-auto mb-4"></div>
                    <p className="text-gray text-sm sm:text-base">Loading transactions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='flex-1 overflow-x-auto relative m-2.5 sm:m-5 bg-white rounded-lg p-3 sm:p-5'>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                <div className="flex items-center flex-wrap gap-1 sm:gap-2">
                    <button 
                        onClick={() => setFilter('all')}
                        className={`${filter === 'all' ? 'bg-blue text-white' : 'text-gray-700 bg-gray-50'} rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium focus:outline-none`}
                    >
                        <span className="flex items-center"><svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4 mr-1"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 6.75a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5a.75.75 0 01.75-.75z" clipRule="evenodd" /></svg>All ({transactions.length})</span>
                    </button>
                    <button 
                        onClick={() => setFilter('deposit')}
                        className={`${filter === 'deposit' ? 'bg-green-500 text-white' : 'text-gray-700 bg-gray-50'} rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium focus:outline-none`}
                    >
                        <span className="flex items-center"><LuCircleChevronUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-green-500" />Deposit</span>
                    </button>
                    <button 
                        onClick={() => setFilter('transfer')}
                        className={`${filter === 'transfer' ? 'bg-red-500 text-white' : 'text-gray-700 bg-gray-50'} rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium focus:outline-none`}
                    >
                        <span className="flex items-center"><LuCircleChevronDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-red-500" />Transfer</span>
                    </button>
                </div>
                <div className="flex items-center bg-[#F4F6F9] px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-gray-600 text-xs sm:text-sm">
                    <p className='mr-2'>{new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                    <FaCalendar className="ml-1 w-3 h-3 sm:w-4 sm:h-4 text-blue" />
                </div>
            </div>
            <div className="overflow-x-auto">
                {filteredTransactions.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        <p>No transactions found</p>
                        <p className="text-sm mt-2">Link a bank account to see transactions</p>
                    </div>
                ) : (
                <>
                {/* Mobile Card View */}
                <div className="sm:hidden space-y-3">
                    {filteredTransactions.map((transaction, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {transaction.isExpense ? (
                                        <LuCircleChevronDown className="w-5 h-5 text-red-500 flex-shrink-0" />
                                    ) : (
                                        <LuCircleChevronUp className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    )}
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{transaction.description}</p>
                                        <p className="text-xs text-gray-500">{transaction.date}</p>
                                    </div>
                                </div>
                                <div className={`text-sm font-semibold ${transaction.isExpense ? 'text-red-500' : 'text-green-500'}`}>
                                    {transaction.amount}
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                                <span className="px-2 py-0.5 bg-gray-200 rounded">{transaction.type}</span>
                                <span>{transaction.transactionId}</span>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Desktop Table View */}
                <table className="hidden sm:table min-w-full divide-y divide-[#F4F6F9]">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs  text-gray-500 uppercase tracking-wider font-semibold">Description</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs  text-gray-500 uppercase tracking-wider font-semibold">Transaction ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs  text-gray-500 uppercase tracking-wider font-semibold">Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs  text-gray-500 uppercase tracking-wider font-semibold">Card</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider font-semibold">Date</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs  text-gray-500 uppercase tracking-wider font-semibold">Amount</th>
                            <th scope="col" className="relative px-6 py-3 font-semibold"><span className="sr-only">Download</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-[#F4F6F9]">
                        {filteredTransactions.map((transaction, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {transaction.isExpense ? (
                                            <LuCircleChevronDown className="w-5 h-5 text-red-500 mr-2" />
                                        ) : (
                                            <LuCircleChevronUp className="w-5 h-5 text-green-500 mr-2" />
                                        )}
                                        <div className="text-sm text-gray-900">{transaction.description}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{transaction.transactionId}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                        {transaction.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.card}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className={`text-sm font-medium ${transaction.isExpense ? 'text-red-500' : 'text-green-500'}`}>
                                        {transaction.amount}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <FiDownload className="w-5 h-5 text-gray-500 cursor-pointer" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </>
                )}
            </div>
        </div>
    )
}

export default TransactionPage