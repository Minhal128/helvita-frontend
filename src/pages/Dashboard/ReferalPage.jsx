import React, { useState, useEffect } from 'react'
import { IoIosCard } from 'react-icons/io'
import { authAPI, supportAPI } from '../../services/api'
import toast from 'react-hot-toast'

const ReferalPage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [referralLink, setReferralLink] = useState('');
    const [loading, setLoading] = useState(true);
    const [sendingInvites, setSendingInvites] = useState(false);
    const [emailInvites, setEmailInvites] = useState(['', '', '']);
    
    // Referrals will be fetched from API
    const [referrals, setReferrals] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [profileRes, referralsRes] = await Promise.all([
                authAPI.getProfile(),
                authAPI.getReferrals()
            ]);
            
            if (profileRes && !profileRes.error) {
                setUserProfile(profileRes);
                // Generate referral link from user's referral code
                if (profileRes.user?.referralCode) {
                    setReferralLink(`${window.location.origin}/register?ref=${profileRes.user.referralCode}`);
                }
            }
            
            if (referralsRes && !referralsRes.error) {
                setReferrals(referralsRes.referrals || []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyReferralLink = () => {
        if (referralLink) {
            navigator.clipboard.writeText(referralLink);
            toast.success('Referral link copied!');
        } else {
            toast.error('No referral link available');
        }
    };

    const handleSendInvites = async () => {
        const validEmails = emailInvites.filter(email => email && email.includes('@'));
        if (validEmails.length === 0) {
            toast.error('Please enter valid email addresses');
            return;
        }
        
        try {
            setSendingInvites(true);
            const response = await supportAPI.sendReferralInvites(validEmails);
            
            if (response.error) {
                toast.error(response.error);
                return;
            }
            
            toast.success(response.message || `Invites sent to ${validEmails.length} email(s)!`);
            // Clear the email inputs after successful send
            setEmailInvites(['', '', '']);
            // Refresh referrals list
            fetchData();
        } catch (error) {
            console.error('Error sending invites:', error);
            toast.error('Failed to send invites');
        } finally {
            setSendingInvites(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center m-5">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-x-auto  relative m-5">

            <div className="bg-white p-6 rounded-lg ">

                <div className='bg-[#F4F6F9] p-3 rounded-md w-[100%] flex justify-between items-center flex-wrap'>
                    <div>
                        <p className='text-lg font-semibold'>Refer & Earn</p>
                        <p className='text-sm text-gray mt-1'>Invite your friends and earn rewards when they sign up and make their first transaction. Everyone wins!</p>
                    </div>

                    <button className='border border-gray bg-white rounded-md px-5 py-2 text-sm'>Learn More</button>
                </div>

                <div className='mt-3'>
                    <p className='text-lg font-semibold border-b border-[#DADADA] p-2'>Refer a friend </p>
                    <div className='flex justify-between items-center border-b border-[#DADADA] p-2 flex-wrap gap-2'>
                        <p className='text-lg font-semibold'>Invite Link</p>
                        <button className='border border-[#dadada] bg-white rounded-md px-5 py-2 text-sm truncate max-w-[300px]'>
                            {referralLink || 'No referral link available'}
                        </button>
                        <button 
                            onClick={copyReferralLink}
                            className='border bg-blue text-white rounded-md px-5 py-2 text-sm hover:bg-blue/90'
                        >
                            Copy Link
                        </button>
                    </div>
                </div>

                <div className='flex justify-between items-start px-2 pt-3 flex-wrap gap-3'>
                    <p className='text-lg font-semibold'>Email invites</p>
                    <div className='flex flex-col gap-1'>
                        {emailInvites.map((email, index) => (
                            <input
                                key={index}
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    const newEmails = [...emailInvites];
                                    newEmails[index] = e.target.value;
                                    setEmailInvites(newEmails);
                                }}
                                placeholder="friend@email.com"
                                className='block mt-1 border border-[#dadada] bg-white rounded-md px-5 py-2 text-sm outline-none'
                            />
                        ))}
                    </div>
                    <button 
                        onClick={handleSendInvites}
                        disabled={sendingInvites}
                        className='border border-blue text-blue rounded-md px-5 py-2 text-sm hover:bg-blue/5 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {sendingInvites ? 'Sending...' : 'Send Invites'}
                    </button>
                </div>


            </div>

            <div className="bg-white p-6 rounded-lg mt-3 ">
                <p className='text-lg font-semibold'>Your referrals</p>
                <table className="min-w-full border-collapse border border-[#F4F6F9] mt-3 ">
                    <thead className="bg-gray-50 border border-[#F4F6F9]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referral name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email address</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white border border-[#F4F6F9]">
                        {referrals.length > 0 ? (
                            referrals.map((referral, index) => (
                                <tr key={index} className='border border-[#F4F6F9]'>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                                                {referral.name?.charAt(0) || 'R'}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{referral.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap "><div className="text-sm text-gray-900">{referral.email}</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap "><div className="text-sm text-gray-900">{referral.date}</div></td>
                                    <td className={`px-6 py-4 whitespace-nowrap  ${referral.status === 'Completed' ? 'text-green-500' : 'text-gray-500'}`}>{referral.status}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right ">{referral.status === 'Completed' ? (<button className="text-indigo-600 hover:text-indigo-900 text-sm">Redeem</button>) : ('-')}</td>
                                </tr>
                            ))
                        ) : (
                            <tr className='border border-[#F4F6F9]'>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                    <p>No referrals yet</p>
                                    <p className="text-sm mt-1">Share your referral link to start earning rewards!</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


        </div>
    )
}

export default ReferalPage