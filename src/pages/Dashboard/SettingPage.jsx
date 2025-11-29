import React, { useState } from 'react'
import { FaBell, FaCreditCard, FaLock, FaTrashAlt } from 'react-icons/fa'
import { HiDotsVertical } from 'react-icons/hi'
import { IoShield } from 'react-icons/io5'
import { LuLanguages } from 'react-icons/lu'
import { MdEmail, MdPrivacyTip } from 'react-icons/md'

const SettingPage = () => {
    const [btns] = useState(["Account settings", "Payment & cards", "Preferences", "Security & privacy"])
    const [activeBtn, setActiveBtn] = useState(btns[0])

    return (
        <div className="flex-1 overflow-x-auto  relative m-5 h-[100%]">


            <div className='p-5 rounded-md bg-white flex items-start flex-wrap md:flex-row flex-col h-[85vh]"'>

                <div className='mt-2  flex-1  h-full"'>

                    <div className='flex items-center gap-x-4 border-b border-b-[#DADADA] pb-5 flex-wrap'>
                        {
                            btns?.map((i) => (
                                <button onClick={() => setActiveBtn(i)} className={`mt-2 px-3 py-2 rounded-md text-sm ${activeBtn == i ? "bg-blue text-white" : "bg-[#F4F6F9]"}`}>{i}</button>
                            ))
                        }
                    </div>


                    <div className='flex items-start flex-wrap'>

                        <div className='pt-5 border-r border-[#DADADA] md:min-w-[20rem]'>
                            {
                                activeBtn === "Account settings" && (
                                    <div>
                                        <div className='flex items-center gap-x-4 bg-[#F4F6F9] p-3 border-r-[5px] border-r-blue'>
                                            <div className='w-[2rem] h-[2rem] rounded-full bg-[#F4F4FF] text-blue flex justify-center items-center'><MdEmail /></div>
                                            <div>
                                                <p className='text-[#525252]'>Update email address</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-x-4 p-3'>
                                            <div className='w-[2rem] h-[2rem] rounded-full bg-[#F4F4FF] text-blue flex justify-center items-center'><FaLock /></div>
                                            <div>
                                                <p className='text-[#525252]'>Change Password</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-x-4 p-3'>
                                            <div className='w-[2rem] h-[2rem] rounded-full bg-[#F4F4FF] text-blue flex justify-center items-center'><IoShield /></div>
                                            <div>
                                                <p className='text-[#525252]'>Add 2FA</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            {
                                activeBtn === "Payment & cards" && (
                                    <div>
                                        <div className='flex items-center gap-x-4 bg-[#F4F6F9] p-3 border-r-[5px] border-r-blue'>
                                            <div className='w-[2rem] h-[2rem] rounded-full bg-[#F4F4FF] text-blue flex justify-center items-center'><FaCreditCard /></div>
                                            <div>
                                                <p className='text-[#525252]'>Manage save cards</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-x-4 p-3'>
                                            <div className='w-[2rem] h-[2rem] rounded-full bg-[#F4F4FF] text-blue flex justify-center items-center'><FaLock /></div>
                                            <div>
                                                <p className='text-[#525252]'>View Billing History</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            {
                                activeBtn === "Preferences" && (
                                    <div>
                                        <div className='flex items-center gap-x-4 bg-[#F4F6F9] p-3 border-r-[5px] border-r-blue'>
                                            <div className='w-[2rem] h-[2rem] rounded-full bg-[#F4F4FF] text-blue flex justify-center items-center'><LuLanguages /></div>
                                            <div>
                                                <p className='text-[#525252]'>Language </p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-x-4 p-3'>
                                            <div className='w-[2rem] h-[2rem] rounded-full bg-[#F4F4FF] text-blue flex justify-center items-center'><FaBell /></div>
                                            <div>
                                                <p className='text-[#525252]'>Notification preferences</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            {
                                activeBtn === "Security & privacy" && (
                                    <div>
                                        <div className='flex items-center gap-x-4 bg-[#F4F6F9] p-3 border-r-[5px] border-r-blue'>
                                            <div className='w-[2rem] h-[2rem] rounded-full bg-[#F4F4FF] text-blue flex justify-center items-center'><MdPrivacyTip /></div>
                                            <div>
                                                <p className='text-[#525252]'>Privacy preference</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-x-4 p-3'>
                                            <div className='w-[2rem] h-[2rem] rounded-full bg-[#F4F4FF] text-blue flex justify-center items-center'><FaTrashAlt /></div>
                                            <div>
                                                <p className='text-[#525252]'>Delete Account</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>


                        <div className='flex-1'>

                            {
                                activeBtn === "Account settings" && (
                                    <div className='m-5'>
                                        <input type="email" name="" id="" placeholder='Enter old email address' className='border border-[#DADADA] w-[100%] md:w-[20rem] px-3 py-2 h-[2.8rem] rounded-md text-sm' />
                                        <input type="email" name="" id="" placeholder='Enter new email address' className='block border border-[#DADADA] mt-2 w-[100%] md:w-[20rem] px-3 py-2 h-[2.8rem] rounded-md text-sm' />
                                        <button className='bg-blue text-white rounded-md px-9 py-2 mt-3'>Update</button>
                                    </div>
                                )
                            }

                            {
                                activeBtn === "Payment & cards" && (
                                    <div className='m-5'>
                                        <table className="min-w-full border-collapse border border-[#F4F6F9] mt-3 ">
                                            <thead className="bg-gray-50 border border-[#F4F6F9]">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card name</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card Number</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"><HiDotsVertical /></th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white border border-[#F4F6F9]">
                                                {
                                                    [1, 2, 3]?.map((i) => (
                                                        <tr key={i} className='border border-[#F4F6F9]'>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <div className="flex-shrink-0 h-10 w-10">
                                                                        <img className="h-10 w-10 rounded-full" src={`https://thumbs.dreamstime.com/b/portrait-handsome-smiling-young-man-folded-arms-smiling-joyful-cheerful-men-crossed-hands-isolated-studio-shot-172869765.jpg`} />
                                                                    </div>
                                                                    <div className="ml-4">
                                                                        <div className="text-sm font-medium text-gray-900">Jessica Kimberly</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap "><div className="text-sm text-gray-900">Chase Bank</div></td>
                                                            <td className="px-6 py-4 whitespace-nowrap "><div className="text-sm text-gray-900">1234 4567 8904</div></td>
                                                            <td className="px-6 py-4 whitespace-nowrap "><div className="text-sm text-gray-900"><HiDotsVertical /></div></td>

                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                )
                            }

                            {
                                activeBtn === "Preferences" && (
                                    <div className='m-5 flex-1'>
                                        <div className='flex justify-between items-center w-[100%]'>
                                            <h1>English</h1>
                                            <input defaultChecked type="radio" name="" id="" />
                                        </div>
                                        <div className='flex justify-between items-center w-[100%] mt-2'>
                                            <h1>Francais</h1>
                                            <input type="radio" name="" id="" />
                                        </div>
                                        <div className='flex justify-between items-center w-[100%] mt-2'>
                                            <h1>Russian</h1>
                                            <input type="radio" name="" id="" />
                                        </div>
                                        <div className='flex justify-between items-center w-[100%] mt-2'>
                                            <h1>Polish</h1>
                                            <input type="radio" name="" id="" />
                                        </div>
                                    </div>
                                )
                            }


                            {
                                activeBtn === "Security & privacy" && (
                                    <div className='m-5 flex-1'>
                                        <div className='flex justify-between items-center w-[100%]'>
                                            <h1>English</h1>
                                            <input defaultChecked type="radio" name="" id="" />
                                        </div>
                                        <div className='flex justify-between items-center w-[100%] mt-2'>
                                            <h1>Francais</h1>
                                            <input type="radio" name="" id="" />
                                        </div>
                                        <div className='flex justify-between items-center w-[100%] mt-2'>
                                            <h1>Russian</h1>
                                            <input type="radio" name="" id="" />
                                        </div>
                                        <div className='flex justify-between items-center w-[100%] mt-2'>
                                            <h1>Polish</h1>
                                            <input type="radio" name="" id="" />
                                        </div>
                                    </div>
                                )
                            }


                        </div>

                    </div>






                </div>




            </div>

        </div>
    )
}

export default SettingPage