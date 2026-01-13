import React, { useState } from 'react'
import { IoIosAlert, IoIosCard } from "react-icons/io";
import { SiAdguard } from "react-icons/si";
import { BiSolidBarChartAlt2 } from "react-icons/bi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { supportAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const allFaqs = {
    'Apply for card': [
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
    ],
    'Transfer dispute': [
        {
            question: "How do I file a transfer dispute?",
            answer: "To file a transfer dispute, navigate to the Transactions section in your dashboard, find the transaction in question, and click on 'Dispute Transaction'. Fill out the dispute form with all relevant details including the date, amount, and reason for the dispute. Our team will review your case within 3-5 business days.",
        },
        {
            question: "What is the timeframe for resolving a transfer dispute?",
            answer: "Transfer disputes are typically resolved within 7-14 business days. However, complex cases may take up to 30 days. You will receive email updates throughout the investigation process.",
        },
        {
            question: "Can I cancel a dispute once filed?",
            answer: "Yes, you can cancel a dispute by contacting our support team before a resolution is reached. However, once a decision has been made, the dispute cannot be reversed.",
        },
    ],
    'Login & Payments': [
        {
            question: "I forgot my password. How do I reset it?",
            answer: "Click on 'Forgot Password' on the login page. Enter your registered email address and we'll send you a password reset link. The link expires in 24 hours for security purposes.",
        },
        {
            question: "Why is my payment being declined?",
            answer: "Payments can be declined for several reasons: insufficient funds, incorrect card details, expired card, or security blocks. Please verify your card information and ensure you have sufficient balance. If the problem persists, contact your bank or our support team.",
        },
        {
            question: "How do I enable two-factor authentication?",
            answer: "Go to Settings > Security & Privacy > Add 2FA. You can choose to receive codes via SMS or use an authenticator app. Follow the on-screen instructions to complete the setup.",
        },
    ],
    'Lift restrictions': [
        {
            question: "Why is my account restricted?",
            answer: "Account restrictions may be applied due to suspicious activity, incomplete verification, or policy violations. Check your email for details about the restriction and required actions to lift it.",
        },
        {
            question: "How do I verify my identity to lift restrictions?",
            answer: "Navigate to Settings > Account Verification and upload the required documents (government-issued ID, proof of address). Verification typically takes 1-3 business days.",
        },
    ],
    'Report Scam': [
        {
            question: "How do I report a suspected scam?",
            answer: "If you suspect fraudulent activity, immediately contact our support team through the 'Report Scam' option. Provide all relevant details including transaction IDs, dates, and any communications with the suspected scammer.",
        },
        {
            question: "What happens after I report a scam?",
            answer: "Our fraud investigation team will review your report within 24 hours. We may temporarily freeze related transactions for your protection. You'll receive updates via email as the investigation progresses.",
        },
    ],
    'Report Transaction': [
        {
            question: "How do I report an unauthorized transaction?",
            answer: "Go to Transactions, find the suspicious transaction, and click 'Report'. Select 'Unauthorized Transaction' and provide details. We recommend also freezing your card while the investigation is ongoing.",
        },
        {
            question: "How long does it take to get a refund for fraudulent transactions?",
            answer: "Once the investigation confirms the transaction was fraudulent, refunds are typically processed within 5-10 business days. You'll receive email confirmation once the refund is initiated.",
        },
    ],
};

const SupportPage = () => {
    const { t } = useTranslation();
    const [activeBtn, setActiveBtn] = useState("faq")
    const [selectedCategory, setSelectedCategory] = useState('Apply for card');
    const [openFAQIndex, setOpenFAQIndex] = useState(null);
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    const toggleFAQ = (index) => {
        setOpenFAQIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setOpenFAQIndex(null); // Reset FAQ expansion when switching categories
    };

    const handleSendMessage = async () => {
        if (!message.trim()) {
            toast.error('Please enter a message');
            return;
        }

        try {
            setSending(true);
            const response = await supportAPI.sendMessage(message);
            
            if (response.error) {
                toast.error(response.error);
                return;
            }
            
            toast.success('Message sent successfully! Our team will respond soon.');
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const currentFaqs = allFaqs[selectedCategory] || [];




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
                                <h1 className='text-lg font-semibold'>{t('support.faq')}</h1>
                                <div className='flex items-center justify-between flex-wrap mr-5'>
                                    <div 
                                        onClick={() => handleCategoryClick('Transfer dispute')}
                                        className={`p-3 rounded-md w-[13rem] mt-2 cursor-pointer transition-all hover:shadow-md ${selectedCategory === 'Transfer dispute' ? 'bg-blue text-white' : 'bg-[#F4F6F9]'}`}
                                    >
                                        <IoIosCard className={`text-3xl ${selectedCategory === 'Transfer dispute' ? 'text-white' : 'text-blue'}`} />
                                        <p className='mt-2'>{t('support.transferDispute')}</p>
                                    </div>
                                    <div 
                                        onClick={() => handleCategoryClick('Apply for card')}
                                        className={`p-3 rounded-md w-[13rem] mt-2 cursor-pointer transition-all hover:shadow-md ${selectedCategory === 'Apply for card' ? 'bg-blue text-white' : 'bg-[#F4F6F9]'}`}
                                    >
                                        <IoIosCard className={`text-3xl ${selectedCategory === 'Apply for card' ? 'text-white' : 'text-blue'}`} />
                                        <p className='mt-2'>{t('support.applyForCard')}</p>
                                    </div>
                                    <div 
                                        onClick={() => handleCategoryClick('Login & Payments')}
                                        className={`p-3 rounded-md w-[13rem] mt-2 cursor-pointer transition-all hover:shadow-md ${selectedCategory === 'Login & Payments' ? 'bg-blue text-white' : 'bg-[#F4F6F9]'}`}
                                    >
                                        <IoIosAlert className={`text-3xl ${selectedCategory === 'Login & Payments' ? 'text-white' : 'text-blue'}`} />
                                        <p className='mt-2'>{t('support.loginPayments')}</p>
                                    </div>
                                    <div 
                                        onClick={() => handleCategoryClick('Lift restrictions')}
                                        className={`p-3 rounded-md w-[13rem] mt-2 cursor-pointer transition-all hover:shadow-md ${selectedCategory === 'Lift restrictions' ? 'bg-blue text-white' : 'bg-[#F4F6F9]'}`}
                                    >
                                        <SiAdguard className={`text-3xl ${selectedCategory === 'Lift restrictions' ? 'text-white' : 'text-blue'}`} />
                                        <p className='mt-2'>{t('support.liftRestrictions')}</p>
                                    </div>
                                    <div 
                                        onClick={() => handleCategoryClick('Report Scam')}
                                        className={`p-3 rounded-md w-[13rem] mt-2 cursor-pointer transition-all hover:shadow-md ${selectedCategory === 'Report Scam' ? 'bg-blue text-white' : 'bg-[#F4F6F9]'}`}
                                    >
                                        <IoIosAlert className={`text-3xl ${selectedCategory === 'Report Scam' ? 'text-white' : 'text-blue'}`} />
                                        <p className='mt-2'>{t('support.reportScam')}</p>
                                    </div>
                                    <div 
                                        onClick={() => handleCategoryClick('Report Transaction')}
                                        className={`p-3 rounded-md w-[13rem] mt-2 cursor-pointer transition-all hover:shadow-md ${selectedCategory === 'Report Transaction' ? 'bg-blue text-white' : 'bg-[#F4F6F9]'}`}
                                    >
                                        <BiSolidBarChartAlt2 className={`text-3xl ${selectedCategory === 'Report Transaction' ? 'text-white' : 'text-blue'}`} />
                                        <p className='mt-2'>{t('support.reportTransaction')}</p>
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
                                    <textarea 
                                        placeholder='Type your message here...' 
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className='resize-none w-[100%] border border-[#DADADA] px-3 py-2 h-[10rem] outline-none rounded-md'
                                    />
                                    <button 
                                        onClick={handleSendMessage}
                                        disabled={sending}
                                        className='bg-blue text-white rounded-md px-5 py-2 text-sm mt-4 disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        {sending ? 'Sending...' : 'Send Message'}
                                    </button>
                                </div>

                            </div>

                        )
                    }


                </div>

                {
                    activeBtn === "faq" && (


                        <div className='mt-2 flex-1 pl-5'>
                            <h1 className='font-semibold text-lg'>{selectedCategory}</h1>
                            {/* FAQ Content */}
                            <div className="mt-4">
                                {currentFaqs.length > 0 ? (
                                    currentFaqs.map((faq, index) => (
                                        <div key={index} className="mb-4 border-b border-[#DADADA] pb-4">
                                            <div 
                                                className="flex items-center justify-between cursor-pointer hover:bg-[#F4F6F9] p-2 rounded transition-colors" 
                                                onClick={() => toggleFAQ(index)}
                                            >
                                                <h2 className="text-sm flex-1 pr-4">Q {index + 1} : {faq.question}</h2>
                                                {openFAQIndex === index ? (
                                                    <FaChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                                ) : (
                                                    <FaChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                                )}
                                            </div>
                                            {openFAQIndex === index && (
                                                <div className="mt-2 text-sm leading-relaxed text-gray-600 p-2 bg-[#F4F6F9] rounded">
                                                    {faq.answer}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No FAQs available for this category.</p>
                                )}
                            </div>
                        </div>


                    )
                }



            </div>

        </div>
    )
}

export default SupportPage