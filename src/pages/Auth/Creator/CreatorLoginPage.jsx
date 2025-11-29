import React, { useState } from 'react';
import Logo from '../../../assets/logo.svg'
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';



const CreatorLoginPage = () => {
    const nav = useNavigate()
    return (

        <div className='flex justify-center items-center w-screen h-screen bg-[#262628] flex-col'>


            <div className='fixed top-10 right-24 cursor-pointer text-white'>
                <RxCross1 onClick={()=>nav("/")}/>
            </div>

            <img src={Logo} alt="" className='h-[2rem]' />
            <p className='text-white font-medium text-xl mt-4'>Welcome back!</p>
            <p className='text-sm text-[#828287] mt-2'>Enter your email and password to sign in</p>
            <input type="email" placeholder='Enter Email Address' className='w-[20rem] h-[2.5rem] text-white border border-[#444444] px-3 bg-transparent outline-none rounded-md mt-3 placeholder:text-sm placeholder:text-[#808080]' />
            <input type="password" placeholder='Enter Password' className='w-[20rem] h-[2.5rem] text-white border border-[#444444] px-3 bg-transparent outline-none rounded-md mt-3 placeholder:text-sm placeholder:text-[#808080]' />
            <div className='mt-3 flex justify-between items-center w-[20rem]'>
                <div className='flex items-center gap-x-2'>
                    <input type="checkbox" name="" id="" />
                    <p className='text-[#808080] text-sm'>Remember me</p>
                </div>
                <p className='text-white cursor-pointer text-sm'>Forgot Password ?</p>
            </div>
            <button onClick={()=>nav("/creator/dashboard/home")} style={{ background: 'linear-gradient(90deg, #E54B3C 0%, #FF1700 100%)', }} className='mt-3 rounded-full text-white text-sm h-[2.3rem] w-[20rem]'>Sign In</button>
            <button onClick={()=>nav("/creator/register")} className='mt-3 rounded-full text-white text-sm h-[2.3rem] w-[20rem]'>Sign Up</button>

        </div>
    );
};

export default CreatorLoginPage;