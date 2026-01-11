import React, { useState, useEffect } from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { IoIosCar, IoIosCard } from 'react-icons/io';
import { plaidAPI, authAPI } from '../../services/api';
// import { ChevronDown } from 'lucide-react';

const AccountPage = () => {
    const [accountData, setAccountData] = useState({
        holder: 'Loading...',
        accountNumber: '****-****-**',
        type: '-',
        currency: 'USD'
    });
    const [balance, setBalance] = useState(0);
    const [spent, setSpent] = useState(0);
    const [transactionCount, setTransactionCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAccountData();
    }, []);

    const fetchAccountData = async () => {
        try {
            setLoading(true);
            const [profileRes, reserveRes, transRes] = await Promise.all([
                authAPI.getProfile().catch(() => ({})),
                plaidAPI.getReserves().catch(() => ({ totalReserves: 0, accounts: [] })),
                plaidAPI.getTransactions().catch(() => ({ transactions: [] }))
            ]);

            // Set account holder info from profile - check multiple fields
            const profile = profileRes.profile || {};
            const user = profileRes.user || {};
            const holderName = user.cardHolderName || 
                              profile.fullName || 
                              profile.nameOnCard ||
                              user.businessNameOnCard ||
                              user.email?.split('@')[0] || 
                              'N/A';
            
            setAccountData({
                holder: holderName,
                accountNumber: reserveRes.accounts?.[0]?.mask ? 
                    `****-****-${reserveRes.accounts[0].mask}` : '****-****-**',
                type: reserveRes.accounts?.[0]?.subtype || reserveRes.accounts?.[0]?.type || 'Checking',
                currency: reserveRes.accounts?.[0]?.currency || 'USD'
            });

            // Set balance
            setBalance(reserveRes.totalReserves || 0);

            // Calculate spent (sum of negative transactions)
            const transactions = transRes.transactions || [];
            setTransactionCount(transactions.length);
            const totalSpent = transactions
                .filter(t => t.amount > 0) // Plaid: positive = money out
                .reduce((sum, t) => sum + t.amount, 0);
            setSpent(totalSpent);

        } catch (error) {
            console.error('Error fetching account data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    if (loading) {
        return (
            <div className='flex-1 flex items-center justify-center m-5'>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto mb-4"></div>
                    <p className="text-gray">Loading account...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='flex-1 overflow-x-auto relative m-2.5 sm:m-5'>

            <div className="bg-white p-3 sm:p-6 rounded-lg shadow-md">


                <h1 className='text-base sm:text-lg font-semibold mb-2'>Account</h1>


                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4'>

                    <div className='bg-[#F4F6F9] text-gray p-3 rounded-lg sm:col-span-2 lg:col-span-2 xl:col-span-1'>
                        <div className='flex items-center justify-between mt-1'>
                            <p className='text-gray text-sm'>Account Holder</p>
                            <p className='font-semibold text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[150px]'>{accountData.holder}</p>
                        </div>
                        <div className='flex items-center justify-between mt-1'>
                            <p className='text-gray text-sm'>Account Number</p>
                            <p className='font-semibold text-xs sm:text-sm'>{accountData.accountNumber}</p>
                        </div>
                        <div className='flex items-center justify-between mt-1'>
                            <p className='text-gray text-sm'>Account type</p>
                            <p className='font-semibold text-xs sm:text-sm'>{accountData.type}</p>
                        </div>
                        <div className='flex items-center justify-between mt-1'>
                            <p className='text-gray text-sm'>Currency</p>
                            <p className='font-semibold text-xs sm:text-sm'>{accountData.currency}</p>
                        </div>
                    </div>
                    <div className='bg-blue text-white p-3 rounded-lg min-h-[7rem] sm:min-h-[8.6rem]'>

                        <div className='flex justify-between items-center'>
                            <IoIosCard className='text-lg sm:text-xl'/>
                            <HiDotsVertical className='text-lg sm:text-xl'/>
                        </div>
                        <p className='mt-2 text-sm'>Current Balance</p>
                        <h1 className='mt-4 sm:mt-7 text-base sm:text-lg font-semibold'>{formatCurrency(balance)}</h1>
                    </div>
                    <div className='bg-blue text-white p-3 rounded-lg min-h-[7rem] sm:min-h-[8.6rem]'>
                        <div className='flex justify-between items-center'>
                            <IoIosCard className='text-lg sm:text-xl'/>
                            <HiDotsVertical className='text-lg sm:text-xl'/>
                        </div>
                        <p className='mt-2 text-sm'>Spent</p>
                        <h1 className='mt-4 sm:mt-7 text-base sm:text-lg font-semibold'>{formatCurrency(spent)}</h1>
                    </div>
                    <div className='bg-blue text-white p-3 rounded-lg min-h-[7rem] sm:min-h-[8.6rem]'>
                        <div className='flex justify-between items-center'>
                            <IoIosCard className='text-lg sm:text-xl'/>
                            <HiDotsVertical className='text-lg sm:text-xl'/>
                        </div>
                        <p className='mt-2 text-sm'>Transactions</p>
                        <h1 className='mt-4 sm:mt-7 text-base sm:text-lg font-semibold'>{transactionCount}</h1>
                    </div>
                    <div className='bg-blue text-white p-3 rounded-lg min-h-[7rem] sm:min-h-[8.6rem]'>
                        <div className='flex justify-between items-center'>
                            <IoIosCard className='text-lg sm:text-xl'/>
                            <HiDotsVertical className='text-lg sm:text-xl'/>
                        </div>
                        <p className='mt-2 text-sm'>Cashback</p>
                        <h1 className='mt-4 sm:mt-7 text-base sm:text-lg font-semibold'>$0</h1>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default AccountPage;
