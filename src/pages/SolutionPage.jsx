import React from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import CardsImage from '../assets/landing/cards.svg'
import StatsImage from '../assets/landing/stats.svg'
import GraphImage from '../assets/landing/graph.svg'
import DetailsImage from '../assets/landing/details.svg'
import MobileImage from '../assets/landing/mobile.svg'
import CtaImage from '../assets/landing/cta.svg'
import Footer from '../components/Footer';
const SolutionPage = () => {
    return (
        <div>
            <Navbar />
            <div className='flex justify-center items-center flex-col pt-10 px-4 sm:px-6 lg:px-8 bg-black text-white min-h-[92vh]'>
                <h1 className='text-[2.2rem] font-semibold text-center md:block hidden mt-[4rem]'>A New Era of Banking <br /> for Businesses and Professional</h1>
                <h1 className='text-[1.8rem] font-semibold text-center md:hidden block mt-[4rem]'>A New Era of Banking for Businesses and Professional</h1>
                <p className='text-gray mt-1 text-center'>Experience seamless payments, smart investments, and secure banking—all in one platform.</p>
                <Link to="/register" className='mt-4'>
                    <button className="bg-[#3D44E3] px-6 py-2 rounded-md font-medium text-white hover:bg-[#2e34d3]">Get Started</button>
                </Link>
                <img src={CardsImage} alt="" className='h-[25rem] mt-0 md:mt-[3.4rem]' />
            </div>

            <div className='bg-[#ffff] px-4 sm:px-6 lg:px-8 pb-10'>
                <div className='flex items-center justify-evenly mt-10 flex-wrap md:flex-row flex-col gap-x-10'>

                    <div className='md:min-w-[25rem] md:max-w-[25rem] min-w-[100%] max-w-[100%] rounded-xl bg-white p-4 md:mt-0 mt-4'>
                        <h1 className='text-[2rem] font-medium'>Smart, Secure and Scalable</h1>
                        <p className='text-gray mt-1 text-sm'>Future-proof your finances with advanced security and scalable banking tools.</p>
                    </div>
                    <div className='md:min-w-[25rem] md:max-w-[25rem] min-w-[100%] max-w-[100%] rounded-xl bg-[#F4F6F9] p-4 md:mt-0 mt-4'>
                        <img src={StatsImage} alt="" className='mt-10 flex-1' />
                    </div>

                </div>

            </div>

            <div className='bg-[#ffff] px-4 sm:px-6 lg:px-8 pb-10'>
                <div className='flex items-center justify-evenly mt-10 flex-wrap md:flex-row flex-col gap-x-10'>

                    <div className='md:min-w-[25rem] md:max-w-[25rem] min-w-[100%] max-w-[100%] rounded-xl bg-[#F4F6F9] p-4 md:mt-0 mt-4'>
                        <img src={GraphImage} alt="" className='mt-10 flex-1' />
                    </div>

                    <div className='md:min-w-[25rem] md:max-w-[25rem] min-w-[100%] max-w-[100%] rounded-xl bg-white p-4 md:mt-0 mt-4'>
                        <h1 className='text-[2rem] font-medium'>Financial Flexibility for Visionary Entrepreneurs</h1>
                        <p className='text-gray mt-1 text-sm'>Future-proof your finances with advanced security and scalable banking tools.</p>
                    </div>

                </div>

            </div>

            <div className='bg-[#F4F6F9] mx-4 sm:mx-6 lg:mx-8 rounded-2xl mb-10'>

                <h1 className='text-[2.2rem] font-semibold text-center pt-10'>Banking That Moves Your Business Forward</h1>


                <div className='flex items-center justify-center'>
                    <img src={DetailsImage} alt="" className='h-[27rem]' />
                </div>

            </div>

            <div className='px-4 sm:px-6 lg:px-8 pt-10 bg-[#F4F4FF] flex justify-center items-center gap-x-10 flex-wrap'>


                <div className='mt-2'>
                    <h1 className='text-[2rem] font-medium'>Start Making Smart <br /> Choices-Join Us</h1>
                    <p className='text-sm mt-2 text-gray'>Download Helvetia on IOS store and Google playstore to begin empowering your business with the Next-Gen bank </p>
                    <img src={CtaImage} alt="" className='mt-4 h-[3rem] cursor-pointer' />
                </div>


                <div className='mt-2'>
                    <img src={MobileImage} alt="" className='h-[25rem]' />
                </div>



            </div>

            <Footer />


        </div>
    )
}

export default SolutionPage