import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PieImage from '../../assets/dashboard/pie.svg'
import { IoIosCard } from "react-icons/io";
import { TiCancel } from "react-icons/ti";
import { FaApplePay, FaGooglePay } from "react-icons/fa";
import { IoSync } from "react-icons/io5";
import { cardAPI, plaidAPI, authAPI } from '../../services/api';
import toast from 'react-hot-toast';

const CardPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [cards, setCards] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);
    const [userCard, setUserCard] = useState(null);
    const [newCard, setNewCard] = useState({ cardNumber: '', cardName: '', expiry: '', cvv: '' });

    useEffect(() => {
        fetchCardData();
    }, []);

    const fetchCardData = async () => {
        try {
            setLoading(true);
            const [accountRes, profileRes] = await Promise.all([
                plaidAPI.getReserves().catch(() => ({ accounts: [] })),
                authAPI.getProfile().catch(() => null)
            ]);
            console.log('Profile response:', profileRes);
            console.log('Saved cards from response:', profileRes?.savedCards);
            setAccounts(accountRes.accounts || []);
            if (profileRes && !profileRes.error) {
                // Merge user and profile data for easier access
                setUserProfile({
                    ...profileRes.profile,
                    cardHolderName: profileRes.user?.cardHolderName,
                    businessNameOnCard: profileRes.user?.businessNameOnCard
                });
                setUserCard(profileRes.card);
                
                // Combine Stripe card and saved cards
                const allCards = [];
                if (profileRes.card) {
                    allCards.push(profileRes.card);
                }
                if (profileRes.savedCards && profileRes.savedCards.length > 0) {
                    console.log('Adding saved cards:', profileRes.savedCards);
                    allCards.push(...profileRes.savedCards);
                }
                console.log('All cards:', allCards);
                setCards(allCards);
            }
        } catch (error) {
            console.error('Error fetching card data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveCard = async () => {
        if (!newCard.cardNumber || !newCard.cardName) {
            toast.error('Please fill card number and name');
            return;
        }
        if (!newCard.expiry) {
            toast.error('Please enter expiry date (MM/YY)');
            return;
        }
        try {
            const response = await cardAPI.addCard(newCard);
            if (response.error) {
                toast.error(response.error);
                return;
            }
            toast.success('Card added successfully');
            setNewCard({ cardNumber: '', cardName: '', expiry: '', cvv: '' });
            fetchCardData();
        } catch (error) {
            console.error('Add card error:', error);
            toast.error('Failed to add card');
        }
    };

    const handleBlockCard = async () => {
        try {
            await cardAPI.blockCard();
            toast.success('Card blocked successfully');
            fetchCardData();
        } catch (error) {
            toast.error('Failed to block card');
        }
    };

    const maskCardNumber = (number) => {
        if (!number) return '•••• •••• •••• ••••';
        const last4 = number.slice(-4);
        return `•••• •••• •••• ${last4}`;
    };

    const formatExpiry = (month, year) => {
        if (month && year) {
            return `${String(month).padStart(2, '0')}/${String(year).slice(-2)}`;
        }
        return 'MM/YY';
    };

    // Virtual Card Component
    const VirtualCard = ({ card, profile, isPrimary = true }) => (
        <div className={`min-w-[20rem] h-[12.5rem] rounded-2xl p-5 text-white shadow-xl relative overflow-hidden ${
            isPrimary 
                ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800' 
                : 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900'
        }`}>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
            </div>
            
            {/* Card content */}
            <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs text-white/70">{isPrimary ? t('cards.virtualCard') : t('cards.physicalCard')}</p>
                        <p className="text-sm font-medium">Helvita</p>
                    </div>
                    <div className="flex space-x-1">
                        <div className="w-8 h-8 bg-red-500 rounded-full opacity-80"></div>
                        <div className="w-8 h-8 bg-yellow-400 rounded-full -ml-4 opacity-80"></div>
                    </div>
                </div>
                
                <div>
                    <p className="text-lg tracking-widest font-mono">
                        {card ? `**** **** **** ${card.last4}` : '**** **** **** ****'}
                    </p>
                </div>
                
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-xs text-white/70">{t('dashboard.cardHolder')}</p>
                        <p className="text-sm font-medium uppercase">
                            {card?.cardholderName || profile?.cardHolderName || profile?.nameOnCard || profile?.fullName || 'CARD HOLDER'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-white/70">{t('dashboard.expires')}</p>
                        <p className="text-sm font-medium">
                            {card ? formatExpiry(card.expMonth, card.expYear) : 'MM/YY'}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-white/70">{t('dashboard.status')}</p>
                        <p className="text-xs font-medium capitalize">
                            {card?.status || 'N/A'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className='flex-1 flex items-center justify-center m-5'>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto mb-4"></div>
                    <p className="text-gray">{t('cards.loading')}</p>
                </div>
            </div>
        );
    }

    // Combine cards and accounts for display
    const displayCards = [
        ...cards.map(card => {
            console.log('Mapping card:', card);
            return {
                id: card.id,
                type: card.brand ? card.brand.toUpperCase() : 'CARD',
                name: card.cardholderName || card.name || 'Card',
                number: card.last4 ? `****${card.last4}` : '****',
                institution: card.cardType === 'external' ? 'External Card' : 'Helvita',
                expiry: card.expMonth && card.expYear ? `${String(card.expMonth).padStart(2, '0')}/${String(card.expYear).slice(-2)}` : 'N/A',
                isCard: true,
                status: card.status || 'active'
            };
        }),
        ...accounts.map(acc => ({
            id: acc.accountId,
            type: acc.type || 'Bank Account',
            name: acc.name || 'Linked Account',
            number: acc.mask ? `****${acc.mask}` : acc.accountId?.slice(-4),
            institution: acc.institutionName || 'Bank',
            isAccount: true
        }))
    ];

    console.log('Display cards:', displayCards);

    return (
        <div className='flex-1 overflow-x-auto  relative m-5'>


            <div className='flex items-start gap-x-6 flex-wrap w-[100%]'>

                <div className='flex-1 bg-white p-5 rounded-lg w-[100%]'>

                    <div className='flex items-start gap-x-5 overflow-x-auto w-[100%] flex-wrap'>

                        {/* Primary Card */}
                        <div className='mt-2'>
                            <VirtualCard card={userCard} profile={userProfile} isPrimary={true} />
                        </div>

                        {/* Secondary Card (if multiple accounts) */}
                        {accounts.length > 1 && (
                            <div className='mt-2'>
                                <VirtualCard card={null} profile={userProfile} isPrimary={false} />
                            </div>
                        )}

                    </div>

                    <div className='mt-6'>

                        <p className='text-[#2A2F47] text-lg font-semibold'>Card list</p>

                        {displayCards.length === 0 ? (
                            <div className='bg-[#FAFAFA] mt-2 p-4 rounded-md text-center text-gray'>
                                No cards or accounts linked yet
                            </div>
                        ) : (
                            displayCards.map((card, i) => (
                                <div key={card.id || i} className='bg-[#FAFAFA] mt-2 flex items-center justify-between p-2 rounded-md flex-wrap'>

                                    <div style={{ backgroundColor: card.isAccount ? "#16C79A" : undefined }} className='w-[2rem] h-[2rem] rounded-md bg-blue flex justify-center items-center text-white mt-2'>
                                        <IoIosCard />
                                    </div>

                                    <div className='mt-2'>
                                        <h1 className='font-semibold'>{card.type || 'Primary'}</h1>
                                        <p className='mt-1 text-gray'>{card.isAccount ? 'Bank Account' : 'Card Type'}</p>
                                    </div>
                                    <div className='mt-2'>
                                        <h1 className='font-semibold'>{card.institution || 'N/A'}</h1>
                                        <p className='mt-1 text-gray'>Bank</p>
                                    </div>
                                    <div className='mt-2'>
                                        <h1 className='font-semibold'>{maskCardNumber(card.number)}</h1>
                                        <p className='mt-1 text-gray'>Card Number</p>
                                    </div>
                                    <div className='mt-2'>
                                        <h1 className='font-semibold'>{card.name || 'N/A'}</h1>
                                        <p className='mt-1 text-gray'>Card Name</p>
                                    </div>

                                    <p 
                                        className='text-blue font-medium cursor-pointer hover:underline'
                                        onClick={() => navigate(card.isAccount ? `/dashboard/account?id=${card.id}` : `/dashboard/statement?cardId=${card.id}`)}
                                    >View Details</p>

                                </div>
                            ))
                        )}



                    </div>

                </div>

                <div className='w-[22rem]'>
                    <div className='min-w-[20rem] w-[100%] bg-white rounded-xl p-5'>
                        <p className='text-[#2A2F47] text-lg font-semibold'>My card statistics</p>
                        <img src={PieImage} alt="" className='mt-6' />
                    </div>

                    <div className='min-w-[20rem] w-[100%] bg-white rounded-xl p-5 mt-6'>

                        <p className='text-[#2A2F47] text-lg font-semibold'>Card Settings</p>

                        <div className='flex items-center gap-x-3 mt-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md' onClick={handleBlockCard}>
                            <div className='w-8 h-8 rounded-full bg-[#F4F6F9] text-blue text-xl flex justify-center items-center'><TiCancel /></div>
                            <div>
                                <h1 className='font-semibold'>Block card</h1>
                                <p className='text-gray'>Instantly block your card</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-x-3 mt-2'>
                            <div className='w-8 h-8 rounded-full bg-[#F4F6F9] text-blue text-xl flex justify-center items-center'><IoSync  /></div>
                            <div>
                                <h1 className='font-semibold'>Change pin code</h1>
                                <p className='text-gray'>Choose another pin code</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-x-3 mt-2'>
                            <div className='w-8 h-8 rounded-full bg-[#F4F6F9] text-blue text-xl flex justify-center items-center'><FaGooglePay/></div>
                            <div>
                                <h1 className='font-semibold'>Add to Google Pay</h1>
                                <p className='text-gray'>Withdraw without any card</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-x-3 mt-2'>
                            <div className='w-8 h-8 rounded-full bg-[#F4F6F9] text-blue text-xl flex justify-center items-center'><FaApplePay/></div>
                            <div>
                                <h1 className='font-semibold'>Add to Apple Pay</h1>
                                <p className='text-gray'>Withdraw without any card</p>
                            </div>
                        </div>

                    </div>


                </div>

            </div>

            <div className='md:w-[73.7%] bg-white rounded-md p-5 mt-5'>

                <div className='flex justify-between items-center'>
                    <h1 className='font-semibold'>Add card</h1>
                    <button onClick={handleSaveCard} className='bg-blue text-white px-3 py-2 rounded-lg'>Save Card</button>
                </div>

                <div className='mt-2 flex justify-between items-center flex-wrap'>
                    <input 
                        type="text" 
                        placeholder='Card number' 
                        value={newCard.cardNumber}
                        onChange={(e) => setNewCard({...newCard, cardNumber: e.target.value})}
                        className='px-3 py-2 w-[18rem] mt-2 rounded-md outline-none border border-[#dadada]' 
                    />
                    <input 
                        type="text" 
                        placeholder='Card name' 
                        value={newCard.cardName}
                        onChange={(e) => setNewCard({...newCard, cardName: e.target.value})}
                        className='px-3 py-2 w-[15rem] mt-2 rounded-md outline-none border border-[#dadada]' 
                    />
                    <input 
                        type="text" 
                        placeholder='mm/yy' 
                        value={newCard.expiry}
                        onChange={(e) => setNewCard({...newCard, expiry: e.target.value})}
                        className='px-3 py-2 mt-2 rounded-md outline-none border border-[#dadada]' 
                    />
                    <input 
                        type="text" 
                        placeholder='CVV' 
                        value={newCard.cvv}
                        onChange={(e) => setNewCard({...newCard, cvv: e.target.value})}
                        className='px-3 py-2 mt-2 rounded-md outline-none border border-[#dadada]' 
                    />

                </div>


            </div>


        </div>
    )
}

export default CardPage