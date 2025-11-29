import React, { useState } from 'react'
import { FaTrash } from 'react-icons/fa';
import { RiBankFill } from "react-icons/ri";

const NotificationPage = () => {
    const [activeBtn, setActiveBtn] = useState("all")

    return (
        <div className="flex-1 overflow-x-auto  relative m-5 h-[100%]">


            <div className='p-5 rounded-md bg-white flex items-start flex-wrap md:flex-row flex-col h-[85vh]"'>

                <div className='mt-2  flex-1  h-full"'>

                    <div className='flex items-center gap-x-4 border-b border-b-[#DADADA] pb-5 flex-wrap'>
                        <button onClick={() => setActiveBtn("all")} className={`mt-2 px-3 py-2 rounded-md text-sm ${activeBtn == "all" ? "bg-blue text-white" : "bg-[#F4F6F9]"}`}>All</button>
                        <button onClick={() => setActiveBtn("read")} className={`mt-2 px-3 py-2 rounded-md text-sm ${activeBtn == "read" ? "bg-blue text-white" : "bg-[#F4F6F9]"}`}>Read</button>
                        <button onClick={() => setActiveBtn("unread")} className={`mt-2 px-3 py-2 rounded-md text-sm ${activeBtn == "unread" ? "bg-blue text-white" : "bg-[#F4F6F9]"}`}>Unread</button>
                    </div>


                    {
                        [1, 2, 3, 4, 5, 6, 7]?.map((i) => (
                            <div key={i} className='mt-3 flex justify-between items-center flex-wrap'>

                                <div className='flex items-center gap-x-4'>
                                    <div className='w-[2rem] h-[2rem] rounded-full bg-[#F4F4FF] text-blue flex justify-center items-center'><RiBankFill /></div>
                                    <div>
                                        <p className='font-semibold'>Deposit received   |   <span className='text-gray'>April 02, 2025</span></p>
                                        <p className='text-sm mt-1'>Your salary of $2,500 has been deposited into your account</p>
                                    </div>
                                </div>

                                <FaTrash />


                            </div>
                        ))
                    }




                </div>




            </div>

        </div>
    )
}

export default NotificationPage