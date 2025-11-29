import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import GrowthImage from '../assets/landing/growth.svg';
import MobileImage from '../assets/landing/mobile.svg';
import CtaImage from '../assets/landing/cta.svg';
import CommunityImage from '../assets/landing/community.svg';
import Footer from '../components/Footer';
import { MdShield, MdOutlineSmartphone, MdBusiness, MdLocalAtm, MdReceipt, MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

const SupportPage = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqData = [
        {
            icon: MdShield,
            title: 'How secure is my money and data?',
            text: 'We use advanced encryption, multi-factor authentication, and real-time fraud monitoring to keep your funds and personal information safe. Your security is our top priority.',
        },
        {
            icon: MdOutlineSmartphone,
            title: 'Is there a mobile app available?',
            text: 'Yes, our mobile app is available on both iOS and Android. You can download it from the App Store or Google Play Store.',
        },
        {
            icon: MdBusiness,
            title: 'How do I open a business account?',
            text: 'To open a business account, please visit our website and fill out the online application form. You will need to provide some business details and documents.',
        },
        {
            icon: MdLocalAtm,
            title: 'Can I apply for a business loan on Helvetia Bank?',
            text: 'Yes, you can apply for a business loan through our online portal. We offer various loan options with competitive interest rates.',
        },
        {
            icon: MdReceipt,
            title: 'How does automated invoicing work?',
            text: 'Our automated invoicing system helps you create and send invoices to your clients easily.  It also tracks payments and sends reminders.',
        },
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div>
            <Navbar />
            <div className='flex justify-center items-center flex-col pt-10 px-4 sm:px-6 lg:px-8 bg-blue text-white min-h-[92vh]'>
                <h1 className='text-[2.2rem] font-semibold text-center md:block hidden mt-[4rem]'>Reliable Help for Every Step of<br /> Your Journey </h1>
                <h1 className='text-[1.8rem] font-semibold text-center md:hidden block mt-[4rem]'>Reliable Help for Every Step of Your Journey</h1>
                <p className='text-[#a1a5ff] mt-1 text-center'> Experience seamless payments, smart investments, and secure banking—all in one platform.</p>
                <Link to="/register" className='mt-4'>
                    <button className="text-[#3D44E3] px-10 py-2 rounded-md font-medium bg-white">Get Started</button>
                </Link>
                <img src={MobileImage} alt="" className='h-[25rem] mt-0 md:mt-[3.4rem]' />
            </div>

            <div className='bg-[#ffff] px-4 sm:px-6 lg:px-8 py-10'>

                <img src={GrowthImage} alt="" className='h-[30rem]' />

            </div>

            <div className='bg-[#F4F6F9] px-4 sm:px-6 lg:px-8 py-10 flex justify-center items-center'>

                <div className='md:w-[70%] bg-white rounded-xl py-10'>
                    <p className='text-[2rem] font-semibold text-center'>Answers to Your Most Common Questions</p>
                    <div className="mt-8 space-y-4">
                        {faqData.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div key={index} className="w-[100%] " onClick={() => toggleFAQ(index)}>
                                    <div className="flex items-center justify-evenly px-6 py-4">
                                        <div className='flex items-center gap-x-4 md:min-w-[70%]'>
                                            <Icon size={24} className="text-[#3D44E3]" />
                                            <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
                                        </div>
                                        {openIndex === index ? (<MdKeyboardArrowUp size={24} className="text-[#3D44E3]" />) : (<MdKeyboardArrowDown size={24} className="text-[#3D44E3]" />)}
                                    </div>
                                    {openIndex === index && (
                                        <div className="px-6 pb-4 bg-gray-50 rounded-b-lg flex justify-center items-center">
                                            <p className="text-gray-700 text-sm min-w-[81%] max-w-[81%]">{item.text}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>

            <div className='bg-[#ffff] px-4 sm:px-6 lg:px-8 py-10'>
                <p className='text-[2rem] font-semibold text-center'>Our Community</p>

                <div className='flex justify-center items-center mt-10'>
                    <img src={CommunityImage} alt="" className='h-[35rem]' />
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

export default SupportPage
