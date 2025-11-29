import React from 'react'
import CardImage from '../../assets/dashboard/card.svg'
import PieImage from '../../assets/dashboard/pie.svg'
import { IoIosCard } from "react-icons/io";
import { TiCancel } from "react-icons/ti";
import { FaApplePay, FaGooglePay } from "react-icons/fa";
import { IoSync } from "react-icons/io5";

const CardPage = () => {

    return (
        <div className='flex-1 overflow-x-auto  relative m-5'>


            <div className='flex items-start gap-x-6 flex-wrap w-[100%]'>

                <div className='flex-1 bg-white p-5 rounded-lg w-[100%]'>

                    <div className='flex items-start gap-x-5 overflow-x-auto w-[100%] flex-wrap'>


                        <div className='min-w-[20rem] mt-2'>
                            <img src={CardImage} alt="" />
                        </div>

                        <div className='min-w-[20rem] mt-2'>
                            <img src={CardImage} alt="" />
                        </div>

                    </div>

                    <div className='mt-6'>

                        <p className='text-[#2A2F47] text-lg font-semibold'>Card list</p>

                        {
                            [1, 2, 3]?.map((i) => (
                                <div key={i} className='bg-[#FAFAFA] mt-2 flex items-center justify-between p-2 rounded-md flex-wrap'>

                                    <div style={{ backgroundColor: i == 2 && "#16C79A" }} className='w-[2rem] h-[2rem] rounded-md bg-blue flex justify-center items-center text-white mt-2'>
                                        <IoIosCard />
                                    </div>

                                    <div className='mt-2'>
                                        <h1 className='font-semibold'>Secondary Type</h1>
                                        <p className='mt-1 text-gray'>Bank Type</p>
                                    </div>
                                    <div className='mt-2'>
                                        <h1 className='font-semibold'>DBL Bank</h1>
                                        <p className='mt-1 text-gray'>Bank</p>
                                    </div>
                                    <div className='mt-2'>
                                        <h1 className='font-semibold'>1234 *** ***</h1>
                                        <p className='mt-1 text-gray'>Card Number</p>
                                    </div>
                                    <div className='mt-2'>
                                        <h1 className='font-semibold'>Jessica K</h1>
                                        <p className='mt-1 text-gray'>Card Name</p>
                                    </div>

                                    <p className='text-blue font-medium cursor-pointer'>View Details</p>

                                </div>
                            ))
                        }



                    </div>

                </div>

                <div className='w-[22rem]'>
                    <div className='min-w-[20rem] w-[100%] bg-white rounded-xl p-5'>
                        <p className='text-[#2A2F47] text-lg font-semibold'>My card statistics</p>
                        <img src={PieImage} alt="" className='mt-6' />
                    </div>

                    <div className='min-w-[20rem] w-[100%] bg-white rounded-xl p-5 mt-6'>

                        <p className='text-[#2A2F47] text-lg font-semibold'>Card Settings</p>

                        <div className='flex items-center gap-x-3 mt-2'>
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
                    <button className='bg-blue text-white px-3 py-2 rounded-lg'>Save Card</button>
                </div>

                <div className='mt-2 flex justify-between items-center flex-wrap'>
                    <input type="text" name="" id="" placeholder='Card number' className='px-3 py-2 w-[18rem] mt-2 rounded-md outline-none border border-[#dadada]' />
                    <input type="text" name="" id="" placeholder='Card name' className='px-3 py-2 w-[15rem] mt-2 rounded-md outline-none border border-[#dadada]' />
                    <input type="text" name="" id="" placeholder='mm/yy' className='px-3 py-2 mt-2 rounded-md outline-none border border-[#dadada]' />
                    <input type="text" name="" id="" placeholder='CVV' className='px-3 py-2 mt-2 rounded-md outline-none border border-[#dadada]' />

                </div>


            </div>


        </div>
    )
}

export default CardPage