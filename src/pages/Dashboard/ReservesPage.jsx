import React, { useState, useEffect } from 'react'
import { IoIosCard } from 'react-icons/io'
import { PlusCircle, ArrowUpRight, CheckCircle, XCircle, Clock } from 'lucide-react'; // Import icons
import { FaCalendar, FaPlus } from 'react-icons/fa'
import { HiOutlineDotsVertical } from "react-icons/hi";
import { plaidAPI } from '../../services/api';

const ReservesPage = () => {
    const [reserves, setReserves] = useState({ totalReserves: 0, accounts: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReserves();
    }, []);

    const fetchReserves = async () => {
        setLoading(true);
        try {
            const response = await plaidAPI.getReserves();
            if (response) {
                setReserves(response);
            }
        } catch (error) {
            console.error('Error fetching reserves:', error);
        } finally {
            setLoading(false);
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    // Transform accounts to reserve display format
    const accountsToReserves = reserves.accounts?.map((account, index) => ({
        description: account.name || 'Account',
        transactionId: `#${account.accountId?.slice(0, 10) || index}`,
        type: account.availableBalance > 0 ? 'Active' : 'Pending',
        dateCreated: new Date().toLocaleDateString('en-US'),
        releaseDate: '-',
        amount: formatCurrency(account.currentBalance),
        action: account.availableBalance > 0 ? 'Withdraw' : 'View details',
        icon: account.availableBalance > 0 
            ? <CheckCircle className="h-4 w-4 text-green-500" />
            : <Clock className="h-4 w-4 text-yellow-500" />,
    })) || [];


    const getTypeColor = (type) => {
        switch (type) {
            case 'Pending':
                return 'text-yellow-500';
            case 'Active':
                return 'text-green-500';
            case 'Under review':
                return 'text-red-500';
            case 'Processing':
                return 'text-orange-500';
            default:
                return 'text-gray-700';
        }
    };

    const getActionColor = (action) => {
        switch (action) {
            case 'View details':
                return 'text-blue-500 hover:text-blue-700';
            case 'Withdraw':
                return 'text-green-500 hover:text-green-700';
            case 'Contact support':
                return 'text-red-500 hover:text-red-700';
            default:
                return 'text-gray-700';
        }
    };

    const getIconForType = (type) => {
        switch (type) {
            case 'Pending':
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case 'Active':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'Under review':
                return <XCircle className="h-4 w-4 text-red-500" />;
            case 'Processing':
                return <Clock className="h-4 w-4 text-orange-500" />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className='flex-1 flex items-center justify-center m-5'>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto mb-4"></div>
                    <p className="text-gray">Loading reserves...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-x-auto  relative m-5">

            <div className="bg-white p-6 rounded-lg ">


                <h1 className='text-lg font-semibold mb-2'>Your Current Reserve</h1>


                <div className='flex justify-between items-center gap-x-3 flex-wrap'>

                    <div className='bg-[#F4F6F9] text-gray p-3 rounded-lg flex-1 min-h-[8.6rem] mt-2'>
                        <IoIosCard className='text-blue' />
                        <p className='mt-2'>Total reserved</p>
                        <h1 className='mt-7 text-lg font-semibold text-black'>{formatCurrency(reserves.totalReserves)}</h1>
                    </div>
                    <div className='bg-[#F4F6F9] text-gray p-3 rounded-lg flex-1 min-h-[8.6rem] mt-2'>
                        <IoIosCard className='text-blue' />
                        <p className='mt-2'>Linked Accounts</p>
                        <h1 className='mt-7 text-lg font-semibold text-black'>{reserves.accounts?.length || 0}</h1>
                    </div>
                    <div className='bg-[#F4F6F9] text-gray p-3 rounded-lg flex-1 min-h-[8.6rem] mt-2'>
                        <IoIosCard className='text-blue' />
                        <p className='mt-2'>Available Balance</p>
                        <h1 className='mt-7 text-lg font-semibold text-black'>{formatCurrency(reserves.accounts?.reduce((sum, a) => sum + (a.availableBalance || 0), 0))}</h1>
                    </div>
                    <div className='bg-[#F4F6F9] text-gray p-3 rounded-lg flex-1 min-h-[8.6rem] mt-2'>
                        <IoIosCard className='text-blue' />
                        <p className='mt-2'>Currency</p>
                        <h1 className='mt-7 text-lg font-semibold text-black'>{reserves.currency || 'USD'}</h1>
                    </div>

                </div>

            </div>


            <div className='mt-10 bg-white p-6 rounded-lg'>

                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center bg-[#F4F6F9] px-3 py-2 rounded-md text-gray-600 text-sm">
                        <p className='mr-2'>{new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                        <FaCalendar className="ml-1 w-4 h-4 text-blue" />
                    </div>
                    <button onClick={fetchReserves} className="bg-blue text-white py-2 px-4 rounded flex items-center">
                        <FaPlus className="mr-2" />
                        <p>Refresh</p>
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    {accountsToReserves.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <p>No accounts linked</p>
                            <p className="text-sm mt-2">Link a bank account to see reserves</p>
                        </div>
                    ) : (
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr className='border border-[#F4F6F9]'>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Account ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                                <th scope="col" className="px-6 py-3 flex justify-center items-center"><HiOutlineDotsVertical/></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[#F4F6F9] border border-[#F4F6F9]">
                            {accountsToReserves.map((transaction, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {transaction.icon}
                                            <span className="ml-2 text-sm text-gray-900">{transaction.description}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.transactionId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(transaction.type)}`}>
                                            {transaction.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.dateCreated}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reserves.accounts?.[index]?.type || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.amount}</td>
                                    <td className="py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <span className={`${getActionColor(transaction.action)} cursor-pointer`}>
                                            {transaction.action}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    )}
                </div>
            </div>

        </div>
    )
}

export default ReservesPage