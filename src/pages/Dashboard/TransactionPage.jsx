import React from 'react'
import { FaCalendar } from 'react-icons/fa';
import { FiDownload } from 'react-icons/fi';
import { LuCircleChevronDown, LuCircleChevronUp } from "react-icons/lu";


const transactionsData = [
    {
        description: 'Spotify subscription',
        transactionId: '#1234567778',
        type: 'Shopping',
        card: '1234 **** **** 2025',
        date: '12-03-2025',
        amount: '-$120',
    },
    {
        description: 'Sales of good',
        transactionId: '#1234567778',
        type: 'Transfer',
        card: '1234 **** **** 2025',
        date: '15-03-2025',
        amount: '$1000',
    },
    {
        description: 'Sales of good',
        transactionId: '#1234567778',
        type: 'Transfer',
        card: '1234 **** **** 2025',
        date: '15-03-2025',
        amount: '$1000',
    },
    {
        description: 'Wilson Wilfred',
        transactionId: '#1234567778',
        type: 'Transfer',
        card: '1234 **** **** 2025',
        date: '12-03-2025',
        amount: '-$120',
    },
    {
        description: 'Wilson Wilfred',
        transactionId: '#1234567778',
        type: 'Transfer',
        card: '1234 **** **** 2025',
        date: '12-03-2025',
        amount: '-$120',
    },
    {
        description: 'Wilson Wilfred',
        transactionId: '#1234567778',
        type: 'Transfer',
        card: '1234 **** **** 2025',
        date: '12-03-2025',
        amount: '-$120',
    },
    {
        description: 'Wilson Wilfred',
        transactionId: '#1234567778',
        type: 'Transfer',
        card: '1234 **** **** 2025',
        date: '12-03-2025',
        amount: '-$120',
    },
    {
        description: 'Wilson Wilfred',
        transactionId: '#1234567778',
        type: 'Transfer',
        card: '1234 **** **** 2025',
        date: '12-03-2025',
        amount: '-$120',
    },
    {
        description: 'Wilson Wilfred',
        transactionId: '#1234567778',
        type: 'Transfer',
        card: '1234 **** **** 2025',
        date: '12-03-2025',
        amount: '-$120',
    },
    {
        description: 'Wilson Wilfred',
        transactionId: '#1234567778',
        type: 'Transfer',
        card: '1234 **** **** 2025',
        date: '12-03-2025',
        amount: '-$120',
    },
    {
        description: 'Wilson Wilfred',
        transactionId: '#1234567778',
        type: 'Transfer',
        card: '1234 **** **** 2025',
        date: '12-03-2025',
        amount: '-$120',
    },
    {
        description: 'Biaq',
        transactionId: '#1234567778',
        type: 'Transfer',
        card: '1234 **** **** 2025',
        date: '12-03-2025',
        amount: '$120',
    },
];


const TransactionPage = () => {
    return (
        <div className='flex-1 overflow-x-auto relative m-5 bg-white rounded-lg p-5'>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <button className="bg-blue-500 text-white bg-blue rounded-md px-3 py-2 text-sm font-medium focus:outline-none">
                        <span className="flex items-center"><svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 6.75a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5a.75.75 0 01.75-.75z" clipRule="evenodd" /></svg>All</span>
                    </button>
                    <button className="text-gray-700 rounded-md px-3 py-2 text-sm font-medium focus:outline-none">
                        <span className="flex items-center"><LuCircleChevronUp className="w-4 h-4 mr-1 text-green-500" />Deposit</span>
                    </button>
                    <button className="text-gray-700 rounded-md px-3 py-2 text-sm font-medium focus:outline-none">
                        <span className="flex items-center"><LuCircleChevronDown className="w-4 h-4 mr-1 text-red-500" />Transfer</span>
                    </button>
                </div>
                <div className="flex items-center bg-[#F4F6F9] px-3 py-2 rounded-md text-gray-600 text-sm">
                    <p className='mr-2'>Jan 01 - Feb 15</p>
                    <FaCalendar className="ml-1 w-4 h-4 text-blue" />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#F4F6F9]">
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
                        {transactionsData.map((transaction, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {transaction.amount.startsWith('-') ? (
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
                                    <div className={`text-sm font-medium ${transaction.amount.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>
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
            </div>
        </div>
    )
}

export default TransactionPage