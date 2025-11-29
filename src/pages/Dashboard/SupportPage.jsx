import React, { useState } from 'react'
import { IoIosAlert, IoIosCard } from "react-icons/io";
import { SiAdguard } from "react-icons/si";
import { BiSolidBarChartAlt2 } from "react-icons/bi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqs = [
    {
        question: "How do I apply for a card on the platform, and what should I expect?",
        answer: "Applying for a card on our platform is a simple and secure process designed to get you up and running quickly. To begin, navigate to the \"Cards\" section in your dashboard and select \"Apply for a New Card.\" You'll be prompted to choose between a virtual card (ideal for online payments) or a physical card (which can be delivered to your address for in-store use). Once you've selected your card type, you'll fill out a short application form with basic information such as your full name, preferred card currency, and ID verification details if required. In some cases, depending on regulatory compliance, additional documentation may be requested to complete your verification.",
    },
    {
        question: "What types of cards can I apply for on this platform?",
        answer: "On our platform, you can apply for both virtual and physical cards. Virtual cards are perfect for online transactions, offering a secure and convenient way to make purchases without using a physical card. Physical cards can be used for both online and in-store purchases, providing flexibility in how you manage your finances.",
    },
    {
        question: "Can I use my virtual card for international transactions?",
        answer: "Yes, you can use your virtual card for international transactions. Our virtual cards support a wide range of currencies, making them ideal for online purchases from international retailers. However, please be aware that foreign transaction fees may apply, depending on your card issuer's policies.",
    },
    {
        question: "How do I activate my physical card?",
        answer: "To activate your physical card, log in to your account and navigate to the \"Cards\" section.  Select the card you wish to activate and follow the on-screen instructions.  You will typically need to enter the card number, expiration date, and CVV code.  In some cases, you may also need to verify your identity.",
    },
    {
        question: "What should I do if my card is lost or stolen?",
        answer: "If your card is lost or stolen, it's crucial to act quickly.  Immediately log in to your account and report the card as lost or stolen.  This will prevent unauthorized transactions.  You should also contact our customer support team as soon as possible to request a replacement card.",
    },
];
const SupportPage = () => {

    const [activeBtn, setActiveBtn] = useState("faq")
    const [openFAQIndex, setOpenFAQIndex] = useState(null);


    const toggleFAQ = (index) => {
        setOpenFAQIndex((prevIndex) => (prevIndex === index ? null : index));
    };




    return (
        <div className="flex-1 overflow-x-auto  relative m-5 h-[100%]">


            <div className='p-5 rounded-md bg-white flex items-start flex-wrap md:flex-row flex-col h-[85vh]"'>

                <div className='mt-2 border-r border-r-[#DADADA] flex-1  h-full"'>

                    <div className='flex items-center gap-x-4 border-b border-b-[#DADADA] pb-5 flex-wrap'>
                        <button onClick={() => setActiveBtn("faq")} className={`mt-2 px-3 py-2 rounded-md text-sm ${activeBtn == "faq" ? "bg-blue text-white" : "bg-[#F4F6F9]"}`}>Faqs</button>
                        <button onClick={() => setActiveBtn("Email")} className={`mt-2 px-3 py-2 rounded-md text-sm ${activeBtn == "Email" ? "bg-blue text-white" : "bg-[#F4F6F9]"}`}>Email our customer support</button>
                    </div>

                    {
                        activeBtn === "faq" && (

                            <div className='mt-5'>
                                <h1 className='text-lg font-semibold'>FAQ</h1>
                                <div className='flex items-center justify-between flex-wrap mr-5'>
                                    <div className='p-3 rounded-md bg-[#F4F6F9] w-[13rem] mt-2'>
                                        <IoIosCard className='text-blue text-3xl' />
                                        <p className='mt-2'>Transfer dispute</p>
                                    </div>
                                    <div className='p-3 rounded-md bg-[#F4F6F9] w-[13rem] mt-2'>
                                        <IoIosCard className='text-blue text-3xl' />
                                        <p className='mt-2'>Apply for card</p>
                                    </div>
                                    <div className='p-3 rounded-md bg-[#F4F6F9] w-[13rem] mt-2'>
                                        <IoIosAlert className='text-blue text-3xl' />
                                        <p className='mt-2'>Login & Payments</p>
                                    </div>
                                    <div className='p-3 rounded-md bg-[#F4F6F9] w-[13rem] mt-2'>
                                        <SiAdguard className='text-blue text-3xl' />
                                        <p className='mt-2'>Lift restrictions</p>
                                    </div>
                                    <div className='p-3 rounded-md bg-[#F4F6F9] w-[13rem] mt-2'>
                                        <IoIosAlert className='text-blue text-3xl' />
                                        <p className='mt-2'>Report Scam</p>
                                    </div>
                                    <div className='p-3 rounded-md bg-[#F4F6F9] w-[13rem] mt-2'>
                                        <BiSolidBarChartAlt2 className='text-blue text-3xl' />
                                        <p className='mt-2'>Report Transaction</p>
                                    </div>
                                </div>
                            </div>

                        )
                    }

                    {
                        activeBtn !== "faq" && (
                            <div className='mt-5 mr-5'>

                                <h1 className='text-lg font-medium'>Customer Support</h1>


                                <div className='bg-[#F4F6F9] p-3 rounded-md w-[100%] flex justify-between items-center flex-wrap mt-3'>
                                    <div>
                                        <p className='text-lg font-semibold'>We're Just an Email Away</p>
                                        <p className='text-sm text-gray mt-1'>Got questions, issues, or feedback? Reach out to our support team anytime via email. We're here to assist you with fast, friendly, and reliable help—24/7.</p>
                                    </div>

                                    <button className='border border-gray bg-white rounded-md px-5 py-2 text-sm'>Learn More</button>
                                </div>

                                <div className='mt-5'>
                                    <textarea name="" id="" placeholder='Message' className='resize-none w-[100%] border border-[#DADADA] px-3 py-2 h-[10rem] outline-none rounded-md'/>
                                    <button className=' bg-blue text-white rounded-md px-5 py-2 text-sm mt-4'>Send Message</button>
                                </div>

                            </div>

                        )
                    }


                </div>

                {
                    activeBtn === "faq" && (


                        <div className='mt-2 flex-1 pl-5'>
                            <h1 className='font-semibold text-lg'>Apply for card</h1>
                            {/* ADD FAQ HERE  */}
                            <div className="mt-4">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="mb-4 border-b border-[#DADADA] pb-4">
                                        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFAQ(index)}>
                                            <h2 className="text-sm">Q {index + 1} : {faq.question}</h2>
                                            {openFAQIndex === index ? (<FaChevronUp className="h-5 w-5 text-gray-500" />) : (<FaChevronDown className="h-5 w-5 text-gray-500" />)}
                                        </div>
                                        {openFAQIndex === index && (
                                            <div className="mt-2 text-sm leading-relaxed">{faq.answer}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>


                    )
                }



            </div>

        </div>
    )
}

export default SupportPage