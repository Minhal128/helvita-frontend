import React from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom';
import HeroImage from '../assets/landing/hero.svg'
import PaymentImage from '../assets/landing/payment.svg'
import CardImage from '../assets/landing/card.svg'
import ServicesImage from '../assets/landing/services.svg'
import MobileImage from '../assets/landing/mobile.svg'
import CtaImage from '../assets/landing/cta.svg'
import Footer from '../components/Footer';

const testimonialsData = [
    {
        name: 'David Thompson',
        location: 'Houston, USA',
        image: 'https://t3.ftcdn.net/jpg/03/77/30/16/360_F_377301660_ClhyVNc3ThqShLjkfk7zq0SeCenc4xb7.jpg',
        text: 'Joining PBTC was a life-changing decision! The mentorship and faith-driven business model helped me build a strong spiritual foundation while creating financial opportunities. I\'ve never felt more aligned with my purpose',
    },
    {
        name: 'Grace Ndlovu',
        location: 'Johannesburg, South Africa',
        image: 'https://t3.ftcdn.net/jpg/03/77/30/16/360_F_377301660_ClhyVNc3ThqShLjkfk7zq0SeCenc4xb7.jpg',
        text: 'Before PBTC, I struggled to balance my faith and career. Through A.R.K II, I found a supportive community, gained business skills, and strengthened my walk with God. Now, I\'m thriving both spiritually and professionally',
    },
    {
        name: 'Michael O\'Connor',
        location: 'London, UK',
        image: 'https://t3.ftcdn.net/jpg/03/77/30/16/360_F_377301660_ClhyVNc3ThqShLjkfk7zq0SeCenc4xb7.jpg',
        text: 'I was skeptical at first, but PBTC proved to be a true blessing. The deliverance and healing programs changed my life, and the digital finance teachings opened doors I never thought possible. I\'m grateful for this movement',
    },
];

const LandingPage = () => {


    return (


        <div className='w-screen h-screen bg-[#FFFFFF] flex flex-col'>

            <Navbar />


            <div className='flex justify-center items-center flex-col mt-10 px-4 sm:px-6 lg:px-8'>
                <h1 className='text-[2.2rem] font-semibold text-center md:block hidden'>Revolutionizing Finance, <br /> Simplifying Transactions</h1>
                <h1 className='text-[1.8rem] font-semibold text-center md:hidden block'>Revolutionizing Finance, Simplifying Transactions</h1>
                <p className='text-gray mt-1 text-center'>Experience seamless payments, smart investments, and secure banking—all in one platform.</p>
                <Link to="/register" className='mt-4'>
                    <button className="bg-[#3D44E3] px-6 py-2 rounded-md font-medium text-white hover:bg-[#2e34d3]">Get Started</button>
                </Link>
                <img src={HeroImage} alt="" className='h-[25rem] mt-0 md:mt-10' />
            </div>


            <div className='bg-[#F3F3F3] px-4 sm:px-6 lg:px-8 pb-10'>

                <h1 className='text-[2.2rem] font-semibold text-center mt-10'>Innovate, Scale, Thrive with Helvetis</h1>

                <div className='flex items-start justify-center mt-10 flex-wrap md:flex-row flex-col gap-x-10'>

                    <div className='md:min-w-[25rem] md:max-w-[25rem] min-w-[100%] max-w-[100%] rounded-xl bg-white p-4 md:mt-0 mt-4'>
                        <h1 className='text-lg font-medium'>Instant payment</h1>
                        <p className='text-gray mt-1 text-sm'>Receive money in seconds. smart investments, and secure banking—all in one platform.</p>
                        <img src={PaymentImage} alt="" className='mt-9' />
                    </div>
                    <div className='md:min-w-[25rem] md:max-w-[25rem] min-w-[100%] max-w-[100%] rounded-xl bg-black p-4 md:mt-0 mt-4 min-h-[32rem]'>
                        <h1 className='text-lg font-medium text-white'>Virtual Card</h1>
                        <p className='text-gray mt-1 text-sm'>Create secure virtual cards for online transactions.</p>
                        <img src={CardImage} alt="" className='mt-10 flex-1' />
                    </div>

                </div>

            </div>


            <div className='bg-blue px-4 sm:px-6 lg:px-8 pb-10'>

                <h1 className='text-[2.2rem] font-semibold text-center mt-10 text-white'>Empowering Businesses with Next-Gen Banking</h1>

                <div className='w-[100%] flex justify-center items-center mt-10'>

                    <div className='bg-[#474FF4] rounded-2xl md:w-[70%] p-10'>
                        <div className="max-w-7xl mx-auto mt-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {testimonialsData.map((testimonial, index) => (
                                    <div key={index} className="bg-white rounded-2xl p-6 shadow-md">

                                        <div className='flex items-center gap-x-4'>
                                            <img src={testimonial.image} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover mb-4" />
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 mb-1">{testimonial.name}</h3>
                                                <p className="text-sm text-gray-600 mb-3">{testimonial.location}</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 text-sm">{testimonial.text}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center mt-6">
                                <span className="inline-block w-3 h-3 rounded-full bg-white mr-2 cursor-pointer"></span>
                                <span className="inline-block w-3 h-3 rounded-full bg-white mr-2 cursor-pointer"></span>
                                <span className="inline-block w-3 h-3 rounded-full bg-white cursor-pointer"></span>
                            </div>
                        </div>
                    </div>


                </div>

            </div>


            <div className='px-4 sm:px-6 lg:px-8 pb-10'>
                <h1 className='text-[2.2rem] font-semibold text-center mt-10'>Seamless Solution for Modern Businesses</h1>
                <div className='mt-10 flex justify-center items-center'>
                    <img src={ServicesImage} alt="" />
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

            <Footer/>

            


        </div >



    )


}

export default LandingPage