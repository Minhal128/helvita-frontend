import React, { useState, useEffect } from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { IoIosCar, IoIosCard } from 'react-icons/io';
import { plaidAPI, authAPI } from '../../services/api';
import { useTranslation } from 'react-i18next';
// import { ChevronDown } from 'lucide-react';

const AccountPage = () => {
    const { t } = useTranslation();
    const [accountData, setAccountData] = useState({
        holder: 'Loading...',
        accountNumber: 'N/A',
        fullAccountNumber: null,
        type: '-',
        currency: 'USD'
    });
    const [balance, setBalance] = useState(0);
    const [spent, setSpent] = useState(0);
    const [transactionCount, setTransactionCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isPlaidConnected, setIsPlaidConnected] = useState(false);
    const [showFullAccountNumber, setShowFullAccountNumber] = useState(false);

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
            
            // Check if Plaid account is connected (has accounts)
            const hasPlaidAccount = reserveRes.accounts && reserveRes.accounts.length > 0;
            const plaidAccount = hasPlaidAccount ? reserveRes.accounts[0] : null;
            setIsPlaidConnected(hasPlaidAccount);
            
            // Get the full account number if available (account_id from Plaid)
            const fullAccNumber = plaidAccount?.accountId || null;
            const maskNumber = plaidAccount?.mask || (plaidAccount?.accountId ? plaidAccount.accountId.slice(-4) : null);
            
            setAccountData({
                holder: holderName,
                // Show N/A if no Plaid account connected, otherwise show masked account number
                accountNumber: hasPlaidAccount && maskNumber ? 
                    `****-****-${maskNumber}` : 'N/A',
                fullAccountNumber: fullAccNumber,
                type: hasPlaidAccount ? 
                    (plaidAccount?.subtype || plaidAccount?.type || 'Checking') : '-',
                currency: hasPlaidAccount ? 
                    (plaidAccount?.currency || 'USD') : 'USD'
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
                    <p className="text-gray">{t('account.loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className='flex-1 overflow-x-auto relative m-2.5 sm:m-5'>

            <div className="bg-white p-3 sm:p-6 rounded-lg shadow-md">


                <h1 className='text-base sm:text-lg font-semibold mb-2'>{t('account.title')}</h1>


                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4'>

                    <div className='bg-[#F4F6F9] text-gray p-3 rounded-lg sm:col-span-2 lg:col-span-2 xl:col-span-1'>
                        <div className='flex items-center justify-between mt-1'>
                            <p className='text-gray text-sm'>{t('account.accountHolder')}</p>
                            <p className='font-semibold text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[150px]'>{accountData.holder}</p>
                        </div>
                        <div className='flex items-center justify-between mt-1'>
                            <p className='text-gray text-sm'>{t('account.accountNumber')}</p>
                            <p 
                                className={`font-semibold text-xs sm:text-sm ${isPlaidConnected ? 'cursor-pointer hover:text-blue select-none' : ''}`}
                                onClick={() => isPlaidConnected && setShowFullAccountNumber(!showFullAccountNumber)}
                                title={isPlaidConnected ? (showFullAccountNumber ? 'Click to hide' : 'Click to reveal') : ''}
                            >
                                {showFullAccountNumber && accountData.fullAccountNumber 
                                    ? accountData.fullAccountNumber 
                                    : accountData.accountNumber}
                            </p>
                        </div>
                        <div className='flex items-center justify-between mt-1'>
                            <p className='text-gray text-sm'>{t('account.accountType')}</p>
                            <p className='font-semibold text-xs sm:text-sm'>{accountData.type}</p>
                        </div>
                        <div className='flex items-center justify-between mt-1'>
                            <p className='text-gray text-sm'>{t('account.currency')}</p>
                            <p className='font-semibold text-xs sm:text-sm'>{accountData.currency}</p>
                        </div>
                    </div>
                    <div className='bg-blue text-white p-3 rounded-lg min-h-[7rem] sm:min-h-[8.6rem]'>

                        <div className='flex justify-between items-center'>
                            <IoIosCard className='text-lg sm:text-xl'/>
                            <HiDotsVertical className='text-lg sm:text-xl'/>
                        </div>
                        <p className='mt-2 text-sm'>{t('account.currentBalance')}</p>
                        <h1 className='mt-4 sm:mt-7 text-base sm:text-lg font-semibold'>{formatCurrency(balance)}</h1>
                    </div>
                    <div className='bg-blue text-white p-3 rounded-lg min-h-[7rem] sm:min-h-[8.6rem]'>
                        <div className='flex justify-between items-center'>
                            <IoIosCard className='text-lg sm:text-xl'/>
                            <HiDotsVertical className='text-lg sm:text-xl'/>
                        </div>
                        <p className='mt-2 text-sm'>{t('account.spent')}</p>
                        <h1 className='mt-4 sm:mt-7 text-base sm:text-lg font-semibold'>{formatCurrency(spent)}</h1>
                    </div>
                    <div className='bg-blue text-white p-3 rounded-lg min-h-[7rem] sm:min-h-[8.6rem]'>
                        <div className='flex justify-between items-center'>
                            <IoIosCard className='text-lg sm:text-xl'/>
                            <HiDotsVertical className='text-lg sm:text-xl'/>
                        </div>
                        <p className='mt-2 text-sm'>{t('account.transactions')}</p>
                        <h1 className='mt-4 sm:mt-7 text-base sm:text-lg font-semibold'>{transactionCount}</h1>
                    </div>
                    <div className='bg-blue text-white p-3 rounded-lg min-h-[7rem] sm:min-h-[8.6rem]'>
                        <div className='flex justify-between items-center'>
                            <IoIosCard className='text-lg sm:text-xl'/>
                            <HiDotsVertical className='text-lg sm:text-xl'/>
                        </div>
                        <p className='mt-2 text-sm'>{t('account.cashback')}</p>
                        <h1 className='mt-4 sm:mt-7 text-base sm:text-lg font-semibold'>$0</h1>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default AccountPage;
