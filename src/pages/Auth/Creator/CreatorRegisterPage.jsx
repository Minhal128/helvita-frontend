import React, { useEffect, useRef, useState } from 'react';
import Logo from '../../../assets/logo.svg'
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import { TiTick } from "react-icons/ti";



const CreatorRegisterPage = () => {

  const nav = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState({ preferrence: "music" })
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, event) => {
    const value = event.target.value;
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < inputRefs.current.length - 1) { inputRefs.current[index + 1]?.focus(); }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (

    <div className='flex justify-center items-center w-screen h-screen bg-[#262628] flex-col'>


      <div className='fixed top-10 right-24 cursor-pointer text-white'>
        <RxCross1 onClick={() => nav("/")} />
      </div>

      <img src={Logo} alt="" className='h-[2rem]' />

      {
        currentStep === 1 ?
          <div className='flex justify-center items-center flex-col'>
            <p className='text-white font-medium text-xl mt-4'>Do you really love music?</p>
            <p className='text-sm text-[#828287] mt-2 w-[20rem] text-center'>Kindly select your preferrable aspect, are you a music lover or an artist/podcaster? </p>
          </div>
          :
          currentStep === 2 ?
            <div className='flex justify-center items-center flex-col'>
              <p className='text-white font-medium text-xl mt-4'>Continue with Email</p>
              <p className='text-sm text-[#828287] mt-2 w-[20rem] text-center'>You can sign in if you already have an account, or we’ll help you create one.</p>
            </div>
            :
            currentStep === 3 ?
              <div className='flex justify-center items-center flex-col'>
                <p className='text-white font-medium text-xl mt-4'>Create your account</p>
                <p className='text-sm text-[#828287] mt-2 w-[20rem] text-center'>You can sign in if you already have an account, or we’ll help you create one.</p>
              </div>
              :
              <div className='flex justify-center items-center flex-col'>
                <p className='text-white font-medium text-xl mt-4'>Verification Code</p>
                <p className='text-sm text-[#828287] mt-2 w-[20rem] text-center'>Enter the verification code sent to greggedward@gmail.com</p>
              </div>
      }


      {
        currentStep === 1 ?
          <div>
            <div onClick={() => { setData({ ...data, preferrence: "Music" }) }} className='flex cursor-pointer justify-between items-center px-3 textsm text-white bg-[#262628] w-[20rem] h-[2.5rem] border border-[#444444] mt-8 my-2 rounded-md text-sm'>
              <p>A music Lover</p>
              {data?.preferrence == "Music" && <div style={{ background: 'linear-gradient(90deg, #E54B3C 0%, #FF1700 100%)', }} className='w-4 h-4 rounded-full flex justify-center items-center'><TiTick /></div>}
            </div>
            <div onClick={() => { setData({ ...data, preferrence: "Artist" }) }} className='flex cursor-pointer justify-between items-center px-3 textsm text-white bg-[#262628] w-[20rem] h-[2.5rem] border border-[#444444] my-2 rounded-md text-sm'>
              <p>An Artist Or Podcaster</p>
              {data?.preferrence == "Artist" && <div style={{ background: 'linear-gradient(90deg, #E54B3C 0%, #FF1700 100%)', }} className='w-4 h-4 rounded-full flex justify-center items-center'><TiTick /></div>}
            </div>

          </div>
          :
          currentStep == 2 ? <input type="email" placeholder='Enter Email Address' className='w-[20rem] h-[2.5rem] text-white border border-[#444444] px-3 bg-transparent outline-none rounded-md mt-3 placeholder:text-sm placeholder:text-[#808080]' />
            :
            currentStep == 3 ?
              <div>
                <input type="email" placeholder='Enter Email Address' className='block w-[20rem] h-[2.5rem] text-white border border-[#444444] px-3 bg-transparent outline-none rounded-md mt-3 placeholder:text-sm placeholder:text-[#808080]' />
                <input type="password" placeholder='Password' className='block w-[20rem] h-[2.5rem] text-white border border-[#444444] px-3 bg-transparent outline-none rounded-md mt-3 placeholder:text-sm placeholder:text-[#808080]' />
                <input type="text" placeholder='First Name' className='block w-[20rem] h-[2.5rem] text-white border border-[#444444] px-3 bg-transparent outline-none rounded-md mt-3 placeholder:text-sm placeholder:text-[#808080]' />
                <input type="text" placeholder='Last Name' className='block w-[20rem] h-[2.5rem] text-white border border-[#444444] px-3 bg-transparent outline-none rounded-md mt-3 placeholder:text-sm placeholder:text-[#808080]' />
                <input type="text" placeholder='Date Of Birth' className='block w-[20rem] h-[2.5rem] text-white border border-[#444444] px-3 bg-transparent outline-none rounded-md mt-3 placeholder:text-sm placeholder:text-[#808080]' />
                <input type="text" placeholder='Country' className='block w-[20rem] h-[2.5rem] text-white border border-[#444444] px-3 bg-transparent outline-none rounded-md mt-3 placeholder:text-sm placeholder:text-[#808080]' />
                <div className='mt-2 flex items-center gap-x-2'>
                  <input type="checkbox" name="" id="" />
                  <p className='text-sm text-[#808080]'>Agree to Terms & Conditions</p>
                </div>
              </div>
              :
              <div>
                <div className="flex items-center space-x-4 mt-4">
                  {otp.map((digit, index) => (<input key={index} type="text" maxLength="1" className={`w-12 h-12 bg-transparent rounded-lg border border-gray-300 text-center text-xl font-semibold focus:outline-none focus:border-red-500`} value={digit} onChange={(event) => handleChange(index, event)} onKeyDown={(event) => handleKeyDown(index, event)} ref={(el) => (inputRefs.current[index] = el)}/>))}
                </div>
                <div className='w-[20rem] flex justify-center items-center mt-4 text-sm text-white cursor-pointer'>Resend code</div>
              </div>

      }
      {
        currentStep ===4 ? 
        <button onClick={() => nav("/creator/dashboard/home")} style={{ background: 'linear-gradient(90deg, #E54B3C 0%, #FF1700 100%)', }} className='mt-3 rounded-md text-white text-sm h-[2.3rem] w-[20rem]'>Verify</button>:
        <button onClick={() => setCurrentStep(currentStep+1)} style={{ background: 'linear-gradient(90deg, #E54B3C 0%, #FF1700 100%)', }} className='mt-3 rounded-md text-white text-sm h-[2.3rem] w-[20rem]'>Conitnue</button>


      }
      <button onClick={() => nav("/creator/login")} className='mt-3 rounded-full text-white text-sm h-[2.3rem] w-[20rem]'>Sign In</button>

    </div>
  );
};

export default CreatorRegisterPage;