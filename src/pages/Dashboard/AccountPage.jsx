import React from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { IoIosCar, IoIosCard } from 'react-icons/io';
// import { ChevronDown } from 'lucide-react';

const AccountPage = () => {
    return (
        <div className='flex-1 overflow-x-auto relative m-5'>

            <div className="bg-white p-6 rounded-lg shadow-md ">


                <h1 className='text-lg font-semibold mb-2'>Account</h1>


                <div className='flex justify-between items-center gap-x-3 flex-wrap'>

                    <div className='bg-[#F4F6F9] text-gray p-3 rounded-lg md:w-[25rem] mt-2'>
                        <div className='flex items-center justify-between mt-1'>
                            <p className='text-gray'>Account Holder</p>
                            <p className='font-semibold text-sm'>Jessica KIMBERLY</p>
                        </div>
                        <div className='flex items-center justify-between mt-1'>
                            <p className='text-gray'>Account Holder</p>
                            <p className='font-semibold text-sm'>1234-5678-92</p>
                        </div>
                        <div className='flex items-center justify-between mt-1'>
                            <p className='text-gray'>Account type</p>
                            <p className='font-semibold text-sm'>Savings</p>
                        </div>
                        <div className='flex items-center justify-between mt-1'>
                            <p className='text-gray'>Currency</p>
                            <p className='font-semibold text-sm'>USD</p>
                        </div>
                    </div>
                    <div className='bg-blue text-white p-3 rounded-lg flex-1 min-h-[8.6rem] mt-2'>

                        <div className='flex justify-between items-center'>
                            <IoIosCard />
                            <HiDotsVertical />
                        </div>
                        <p className='mt-2'>Current Balance</p>
                        <h1 className='mt-7 text-lg font-semibold'>$140,000</h1>
                    </div>
                    <div className='bg-blue text-white p-3 rounded-lg flex-1 min-h-[8.6rem] mt-2'>
                        <div className='flex justify-between items-center'>
                            <IoIosCard />
                            <HiDotsVertical />
                        </div>
                        <p className='mt-2'>Spent</p>
                        <h1 className='mt-7 text-lg font-semibold'>$140,000</h1>
                    </div>
                    <div className='bg-blue text-white p-3 rounded-lg flex-1 min-h-[8.6rem] mt-2'>
                        <div className='flex justify-between items-center'>
                            <IoIosCard />
                            <HiDotsVertical />
                        </div>
                        <p className='mt-2'>Transactions</p>
                        <h1 className='mt-7 text-lg font-semibold'>$140,000</h1>
                    </div>
                    <div className='bg-blue text-white p-3 rounded-lg flex-1 min-h-[8.6rem] mt-2'>
                        <div className='flex justify-between items-center'>
                            <IoIosCard />
                            <HiDotsVertical />
                        </div>
                        <p className='mt-2'>Cashback</p>
                        <h1 className='mt-7 text-lg font-semibold'>$140,000</h1>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default AccountPage;
