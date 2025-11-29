import React from 'react'
import { IoIosCard } from 'react-icons/io'

const ReferalPage = () => {
    const referrals = [
        {
            name: 'Jessica Kimberly',
            email: 'Jessica2com@gmail.com',
            date: '4 April 2025',
            status: 'Completed',
        },
        {
            name: 'Jessica Kimberly',
            email: 'Jessica2com@gmail.com',
            date: '4 April 2025',
            status: 'Completed',
        },
        {
            name: 'Jessica Kimberly',
            email: 'Jessica2com@gmail.com',
            date: '4 April 2025',
            status: 'Completed',
        },
    ];
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
                    <div className='flex justify-between items-center border-b border-[#DADADA] p-2 flex-wrap'>
                        <p className='text-lg font-semibold'>Invite Link</p>
                        <button className='border border-[#dadada] bg-white rounded-md px-5 py-2 text-sm'>helvetiabank.com/invite/GD7EGF9E</button>
                        <button className='border bg-blue text-white rounded-md px-5 py-2 text-sm'>Copy Link</button>
                    </div>
                </div>

                <div className='flex justify-between items-start px-2 pt-3 flex-wrap'>
                    <p className='text-lg font-semibold'>Email invites</p>
                    <div>
                        <button className='block mt-1 border border-[#dadada] bg-white rounded-md px-5 py-2 text-sm'>helvetiabank.com/invite/GD7EGF9E</button>
                        <button className='block mt-1 border border-[#dadada] bg-white rounded-md px-5 py-2 text-sm'>helvetiabank.com/invite/GD7EGF9E</button>
                        <button className='block mt-1 border border-[#dadada] bg-white rounded-md px-5 py-2 text-sm'>helvetiabank.com/invite/GD7EGF9E</button>
                    </div>
                    <button className='border border-blue text-blue rounded-md px-5 py-2 text-sm'>Send Invites</button>
                </div>


            </div>

            <div className="bg-white p-6 rounded-lg mt-3 ">
                <p className='text-lg font-semibold'>Your refferals</p>
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
                        {referrals.map((referral, index) => (
                            <tr key={index} className='border border-[#F4F6F9]'>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full" src={`https://thumbs.dreamstime.com/b/portrait-handsome-smiling-young-man-folded-arms-smiling-joyful-cheerful-men-crossed-hands-isolated-studio-shot-172869765.jpg`} alt={referral.name}/>
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
                        ))}
                    </tbody>
                </table>
            </div>


        </div>
    )
}

export default ReferalPage