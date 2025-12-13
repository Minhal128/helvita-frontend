import React, { useState } from 'react';
import { MdEditSquare, MdLoop } from 'react-icons/md';
import { TiTick } from "react-icons/ti";
import Mobile from '../../assets/landing/animated.svg'
import Gif from '../../assets/auth/gif.svg'
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI, businessAPI, setupAPI } from '../../services/api';

const steps = [
    { id: 0, label: 'Email verification' },
    { id: 1, label: 'Profile info' },
    { id: 2, label: 'Personal info' },
    { id: 3, label: 'Business info' },
    { id: 4, label: 'Documents' },
    { id: 5, label: 'Preferences' },
    { id: 6, label: 'Submit' },
];

const US_STATES = [
    { code: 'AL', name: 'Alabama' },
    { code: 'AK', name: 'Alaska' },
    { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' },
    { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' },
    { code: 'DE', name: 'Delaware' },
    { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' },
    { code: 'HI', name: 'Hawaii' },
    { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' },
    { code: 'IN', name: 'Indiana' },
    { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' },
    { code: 'KY', name: 'Kentucky' },
    { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' },
    { code: 'MD', name: 'Maryland' },
    { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' },
    { code: 'MN', name: 'Minnesota' },
    { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' },
    { code: 'MT', name: 'Montana' },
    { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' },
    { code: 'NH', name: 'New Hampshire' },
    { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' },
    { code: 'NY', name: 'New York' },
    { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' },
    { code: 'OH', name: 'Ohio' },
    { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' },
    { code: 'PA', name: 'Pennsylvania' },
    { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' },
    { code: 'SD', name: 'South Dakota' },
    { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' },
    { code: 'UT', name: 'Utah' },
    { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' },
    { code: 'WA', name: 'Washington' },
    { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' },
    { code: 'WY', name: 'Wyoming' },
    { code: 'DC', name: 'District of Columbia' },
];

const BusinessSetupPage = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [accountType, setAccountType] = useState('');
    const inputRefs = Array(6).fill(null).map(() => React.createRef());
    const [address, setAddress] = useState('');
    const [unit, setUnit] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');

    // Business info state variables
    const [businessName, setBusinessName] = useState('');
    const [businessRole, setBusinessRole] = useState('');
    const [ownershipPercentage, setOwnershipPercentage] = useState('');
    const [businessRegisteredState, setBusinessRegisteredState] = useState('');
    const [businessAddress, setBusinessAddress] = useState('');
    const [businessUnit, setBusinessUnit] = useState('');
    const [businessCity, setBusinessCity] = useState('');
    const [businessState, setBusinessState] = useState('');
    const [businessZipCode, setBusinessZipCode] = useState('');

    // Debit card state variables
    const [getDebitCard, setGetDebitCard] = useState(false);
    const [cardDeliveryEmail, setCardDeliveryEmail] = useState('');
    const [nameOnCard, setNameOnCard] = useState('');
    const [businessNameOnCard, setBusinessNameOnCard] = useState('');

    const [showQrCode, setShowQrCode] = useState(false);
    const [verificationComplete, setVerificationComplete] = useState(false);
    const [verificationSessionId, setVerificationSessionId] = useState('');
    const [verificationUrl, setVerificationUrl] = useState('');
    const [qrCodeImage, setQrCodeImage] = useState('');
    const [loadingQR, setLoadingQR] = useState(false);
    const [pollingInterval, setPollingInterval] = useState(null);

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5 && inputRefs[index + 1].current) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace' && !otp[index] && index > 0 && inputRefs[index - 1].current) {
            inputRefs[index - 1].current.focus();
        }
    };

    const handleNext = async () => {
        const otpCode = otp.join('');
        const email = localStorage.getItem('registerEmail');
        
        if (!otpCode || otpCode.length !== 6) {
            toast.error('Please enter valid OTP');
            return;
        }

        try {
            const response = await authAPI.verifyOtp(email, otpCode);
            if (response.success || response.message) {
                toast.success('Email verified successfully!');
                setCurrentStep(1);
            } else {
                toast.error(response.error || 'OTP verification failed');
            }
        } catch (error) {
            toast.error('Error: ' + error.message);
        }
    };

    const handleResend = async () => {
        const email = localStorage.getItem('registerEmail');
        const password = localStorage.getItem('password');
        const accountType = localStorage.getItem('accountType') || 'business';
        
        if (!email || !password) {
            toast.error('Email or password not found. Please register again.');
            return;
        }
        
        try {
            const response = await authAPI.register(email, password, accountType);
            
            if (response.message === 'OTP sent to email' || response.success) {
                toast.success('OTP resent to your email');
            } else if (response.error) {
                toast.error(response.error);
            } else {
                toast.error('Failed to resend OTP. Please try again.');
            }
        } catch (error) {
            toast.error('Error resending OTP: ' + error.message);
        }
    };

    const handleStepClick = (id) => {
        // Prevent clicking on future steps - only allow going to current step or backwards
        if (id > currentStep) {
            toast.error('Please complete the current step first');
            return;
        }
        setCurrentStep(id);
    };

    const handleIncrementStepClick = () => {
        // Validate current step before moving to next
        if (currentStep === 1) {
            if (!accountType) {
                toast.error('Please select an account type');
                return;
            }
        } else if (currentStep === 2) {
            if (!address || !city || !state || !zipCode) {
                toast.error('Please fill in all required fields for personal address');
                return;
            }
        } else if (currentStep === 3) {
            if (!businessName || !businessRole || !ownershipPercentage || !businessRegisteredState || !businessAddress || !businessCity || !businessState || !businessZipCode) {
                toast.error('Please fill in all required fields for business info');
                return;
            }
        }
        setCurrentStep(currentStep + 1);
    };

    const handleAccountTypeChange = (type) => {
        setAccountType(type);
    };

    const handleCreateCard = async () => {
        if (!getDebitCard) {
            toast.error('Please select to get a debit card');
            return;
        }

        if (!nameOnCard || !businessNameOnCard || !cardDeliveryEmail) {
            toast.error('Please fill in all required fields');
            return;
        }

        const email = localStorage.getItem('registerEmail');
        if (!email) {
            toast.error('Email not found. Please complete registration first.');
            return;
        }

        try {
            // Create the card via backend API
            const cardDeliveryAddress = {
                line1: businessAddress || address,
                city: businessCity || city,
                state: businessState || state,
                postal_code: businessZipCode || zipCode,
                country: 'US'
            };

            const response = await setupAPI.createCard({
                email,
                cardName: nameOnCard,
                businessNameOnCard,
                cardDeliveryAddress
            });

            if (response.cardId) {
                toast.success('Debit card created successfully!');
                localStorage.setItem('stripeCardId', response.cardId);
            } else {
                toast.success('Debit card preferences saved!');
            }
            setCurrentStep(6);
        } catch (error) {
            console.error('Card creation error:', error);
            // If card creation fails, still proceed with the flow
            toast.success('Debit card preferences saved! Card will be issued after verification.');
            setCurrentStep(6);
        }
    };

    const handleGenerateQRCode = async () => {
        const email = localStorage.getItem('registerEmail');
        
        console.log('Starting verification for email:', email);
        
        if (!email) {
            toast.error('Email not found. Please complete registration first.');
            return;
        }
        
        setLoadingQR(true);

        try {
            // First create identity session - this now returns the Stripe-hosted URL
            const identityResponse = await setupAPI.businessIdentity({ email });
            
            console.log('Identity response:', identityResponse);
            
            // Check for error messages
            if (identityResponse.msg && identityResponse.msg.includes('not found')) {
                toast.error('User not found. Please complete registration first.');
                setLoadingQR(false);
                return;
            }
            
            if (!identityResponse.verification_url) {
                toast.error(identityResponse.msg || 'Failed to create verification session');
                setLoadingQR(false);
                return;
            }

            // Then generate QR code - now uses the Stripe-hosted URL
            const qrResponse = await setupAPI.generateQRCode(email);
            
            if (qrResponse.success) {
                setQrCodeImage(qrResponse.qrCode);
                setVerificationSessionId(qrResponse.verificationSessionId);
                setVerificationUrl(qrResponse.verificationUrl);
                setShowQrCode(true);
                setCurrentStep(null);
                
                // Start polling for verification status
                startPolling(email, qrResponse.verificationSessionId);
            } else if (qrResponse.needsNewSession) {
                // Session expired, try creating a new one
                toast.error('Verification session expired. Creating a new one...');
                setTimeout(() => handleGenerateQRCode(), 1000);
            } else {
                toast.error(qrResponse.msg || 'Failed to generate QR code');
            }
        } catch (error) {
            console.error('QR Generation Error:', error);
            toast.error('Error generating QR code. Please try again.');
        } finally {
            setLoadingQR(false);
        }
    };

    const startPolling = (email, sessionId) => {
        // Poll every 3 seconds
        const interval = setInterval(async () => {
            try {
                const response = await setupAPI.verifyDocumentStatus(email, sessionId);
                
                if (response.success && response.canProceed) {
                    clearInterval(interval);
                    setPollingInterval(null);
                    toast.success('Documents verified successfully!');
                    setVerificationComplete(false);
                    setShowQrCode(false);
                    setCurrentStep(5);
                } else if (response.status === 'unverified') {
                    clearInterval(interval);
                    setPollingInterval(null);
                    toast.error('Documents could not be verified. Please try again.');
                    setShowQrCode(false);
                    setCurrentStep(4);
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        }, 3000);

        setPollingInterval(interval);

        // Stop polling after 10 minutes
        setTimeout(() => {
            if (interval) {
                clearInterval(interval);
                setPollingInterval(null);
                toast.error('Verification timeout. Please try again.');
            }
        }, 600000);
    };

    const handleVerificationComplete = async () => {
        const email = localStorage.getItem('registerEmail');
        
        if (!verificationSessionId) {
            toast.error('Verification session not found');
            return;
        }

        try {
            const response = await setupAPI.verifyDocumentStatus(email, verificationSessionId);
            
            if (response.success && response.canProceed) {
                toast.success('Documents verified successfully!');
                setVerificationComplete(false);
                setShowQrCode(false);
                setCurrentStep(5);
            } else if (response.status === 'requires_input') {
                toast.error('Verification requires additional input. Please try again.');
            } else if (response.status === 'unverified') {
                toast.error('Documents could not be verified. Please try again.');
            } else {
                toast.error(response.msg || 'Verification still in progress. Please try again later.');
            }
        } catch (error) {
            toast.error('Error verifying documents: ' + error.message);
        }
    };

    // Cleanup polling on unmount
    React.useEffect(() => {
        return () => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [pollingInterval]);

    return (

        <div>

            {
                currentStep !== 6 && (
                    <div className='w-[100%] px-5 py-11 bg-[#F4F6F9] flex items-center overflow-x-auto'>
                        {steps?.map((i) => (
                            <div onClick={() => handleStepClick(i.id)} key={i.id} className='flex items-center'>

                                <button className={`px-5 text-nowrap py-2 rounded-full flex items-center gap-x-2 font-medium ${i?.id == currentStep ? "border border-blue text-blue" : "border border-[#DADADA] text-gray"}`}><TiTick />{i?.label}</button>

                                <div className={`w-[3rem] h-[.3rem] ${i?.id == currentStep ? "bg-blue" : "bg-gray"}`}></div>

                            </div>
                        ))}
                    </div>
                )
            }

            {/* ADD OTP HERE IF CURRENT STEP IS  0  */}

            {
                currentStep === 0 && (
                    <div className='p-5 mt-10'>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Confirm your email address</h2>
                        <p className="text-gray mb-3">We sent a verification code to <span className="font-medium">yourcompany@gmail.com</span> <MdEditSquare className="inline-block text-blue" /></p>
                        <div className="mb-4">
                            <label htmlFor="otp" className="block text-gray-700 text-sm  mb-2">Enter your code here</label>
                            <div className="flex space-x-2">
                                {otp.map((digit, index) => (
                                    <input key={index} type="text" maxLength="1" className="w-12 h-12 border border-[#DADADA] rounded text-center text-xl font-mono outline-blue mt-3" value={digit} onChange={(e) => handleOtpChange(index, e.target.value)} onKeyDown={(e) => handleKeyDown(index, e)} ref={inputRefs[index]} />
                                ))}
                            </div>
                        </div>
                        <button className="bg-blue text-white py-2 px-12 w-[18rem] block rounded-md cursor-pointer" onClick={handleNext} disabled={otp.some(digit => !digit)}>Next</button>
                        <button className="mt-3 text-sm text-blue-500 hover:underline focus:outline-none" onClick={handleResend}>Resend code <MdLoop className="inline-block text-blue" /></button>
                    </div>
                )
            }

            {
                currentStep === 1 && (
                    <div className='p-5 mt-10'>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">What type of investment account are you applying for?</h2>
                        <p className="text-gray mb-3">Pick sole proprietorship if your business isn’t registered with the state</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                            <label className={`inline-flex items-center rounded-md border p-3 cursor-pointer ${accountType === 'Sole proprietorship' ? 'border-blue' : 'border-[#DADADA]'}`}>
                                <input type="radio" className="form-radio h-4 w-4" name="accountType" value="Sole proprietorship" checked={accountType === 'Sole proprietorship'} onChange={(e) => handleAccountTypeChange(e.target.value)} />
                                <span className="ml-2 text-gray">Sole proprietorship</span>
                            </label>
                            <label className={`inline-flex items-center rounded-md border p-3 cursor-pointer ${accountType === 'Single Member LLC' ? 'border-blue' : 'border-[#DADADA]'}`}>
                                <input type="radio" className="form-radio h-4 w-4" name="accountType" value="Single Member LLC" checked={accountType === 'Single Member LLC'} onChange={(e) => handleAccountTypeChange(e.target.value)} />
                                <span className="ml-2 text-gray-700">Single Member LLC</span>
                            </label>
                            <label className={`inline-flex items-center rounded-md border p-3 cursor-pointer ${accountType === 'LLC' ? 'border-blue' : 'border-[#DADADA]'}`}>
                                <input type="radio" className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-[#DADADA]" name="accountType" value="LLC" checked={accountType === 'LLC'} onChange={(e) => handleAccountTypeChange(e.target.value)} />
                                <span className="ml-2 text-gray-700">LLC</span>
                            </label>
                            <label className={`inline-flex items-center rounded-md border p-3 cursor-pointer ${accountType === 'General Partnership' ? 'border-blue' : 'border-[#DADADA]'}`}>
                                <input type="radio" className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-[#DADADA]" name="accountType" value="General Partnership" checked={accountType === 'General Partnership'} onChange={(e) => handleAccountTypeChange(e.target.value)} />
                                <span className="ml-2 text-gray-700">General Partnership</span>
                            </label>
                            <label className={`inline-flex items-center rounded-md border p-3 cursor-pointer ${accountType === 'Corporation' ? 'border-blue' : 'border-[#DADADA]'}`}>
                                <input type="radio" className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-[#DADADA]" name="accountType" value="Corporation" checked={accountType === 'Corporation'} onChange={(e) => handleAccountTypeChange(e.target.value)} />
                                <span className="ml-2 text-gray-700">Corporation</span>
                            </label>
                            <label className={`inline-flex items-center rounded-md border p-3 cursor-pointer ${accountType === 'Non-resident premium' ? 'border-blue' : 'border-[#DADADA]'}`}>
                                <input type="radio" className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-[#DADADA]" name="accountType" value="Non-resident premium" checked={accountType === 'Non-resident premium'} onChange={(e) => handleAccountTypeChange(e.target.value)} />
                                <span className="ml-2 text-gray-700">Non-resident premium</span>
                            </label>
                            <label className={`inline-flex items-center rounded-md border p-3 cursor-pointer ${accountType === 'Checking Premium' ? 'border-blue' : 'border-[#DADADA]'}`}>
                                <input type="radio" className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-[#DADADA]" name="accountType" value="Checking Premium" checked={accountType === 'Checking Premium'} onChange={(e) => handleAccountTypeChange(e.target.value)} />
                                <span className="ml-2 text-gray-700">Checking Premium</span>
                            </label>
                            <label className={`inline-flex items-center rounded-md border p-3 cursor-pointer ${accountType === 'Savings Premium' ? 'border-blue' : 'border-[#DADADA]'}`}>
                                <input type="radio" className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-[#DADADA]" name="accountType" value="Savings Premium" checked={accountType === 'Savings Premium'} onChange={(e) => handleAccountTypeChange(e.target.value)} />
                                <span className="ml-2 text-gray-700">Savings Premium</span>
                            </label>
                        </div>
                        <button className="bg-blue text-white py-2 px-12 w-[18rem] block rounded-md cursor-pointer" onClick={handleIncrementStepClick}>Next</button>
                    </div>
                )
            }

            {
                currentStep === 2 && (
                    <div className='p-5 mt-10'>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Where do you live?</h2>
                        <p className="text-gray mb-3">For security reasons, we can’t accept P.O. Boxes or post offices</p>
                        <div className="flex items-center w-fit gap-x-6 flex-wrap md:flex-nowrap">

                            <div className='w-[100%]'>
                                <label htmlFor="personalAddress" className="block text-gray-700 text-sm  mb-2">Personal Address</label>
                                <input type="text" id="personalAddress" className="rounded md:w-[25rem] w-[100%] px-3 py-2 border border-[#dadada] outline-blue" placeholder="Enter address" value={address} onChange={(e) => setAddress(e.target.value)} />
                            </div>

                            <div className='w-[100%]'>
                                <label htmlFor="unit" className="block text-gray-700 text-sm  mb-2">Unit (Optional)</label>
                                <input type="text" id="unit" className="rounded md:w-[25rem] w-[100%] px-3 py-2 border border-[#dadada] outline-blue" placeholder="Enter unit" value={unit} onChange={(e) => setUnit(e.target.value)} />
                            </div>
                        </div>
                        <div className='my-4 flex items-center gap-x-6 flex-wrap md:flex-nowrap w-fit'>
                            <div className='w-[100%]'>
                                <label htmlFor="city" className="block text-gray-700 text-sm  mb-2">City</label>
                                <input type="text" id="city" className="rounded md:w-[25rem] w-[100%] px-3 py-2 border border-[#dadada] outline-blue" placeholder="Enter city" value={city} onChange={(e) => setCity(e.target.value)} />
                            </div>

                            <div className='w-[100%]'>
                                <label htmlFor="state" className="block text-gray-700 text-sm  mb-2">State</label>
                                <div className="relative">
                                    <select id="state" className="rounded md:w-[25rem] w-[100%] px-3 py-2 border border-[#dadada] outline-blue" value={state} onChange={(e) => setState(e.target.value)}>
                                        <option value="" disabled>Enter state</option>
                                        {US_STATES.map((s) => (
                                            <option key={s.code} value={s.code}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className='w-[100%]'>
                                <label htmlFor="zipCode" className="block text-gray-700 text-sm  mb-2">Zip code</label>
                                <input type="text" id="zipCode" className="rounded md:w-[25rem] w-[100%] px-3 py-2 border border-[#dadada] outline-blue" placeholder="Enter code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                            </div>
                        </div>
                        <button className="bg-blue text-white py-2 px-12 w-[18rem] block rounded-md cursor-pointer" onClick={handleIncrementStepClick}>Next</button>
                    </div>
                )
            }

            {
                currentStep === 3 && (
                    <div className='p-5 mt-10'>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Let’s know about your business</h2>
                        <p className="text-gray mb-3">We’ll like to know more about your business</p>

                        <div className="flex items-center w-fit gap-x-6 flex-wrap md:flex-nowrap">

                            <div className='w-[100%]'>
                                <label htmlFor="businessName" className="block text-gray-700 text-sm  mb-2">What's the name of your business?</label>
                                <input type="text" id="businessName" className="rounded md:w-[25rem] w-[100%] px-3 py-2 border border-[#dadada] outline-blue" placeholder="Business name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
                            </div>

                            <div className='w-[100%]'>
                                <label htmlFor="businessRole" className="block text-gray-700 text-sm  mb-2">What's role in the business?</label>
                                <input type="text" id="businessRole" className="rounded md:w-[25rem] w-[100%] px-3 py-2 border border-[#dadada] outline-blue" placeholder="Position in business" value={businessRole} onChange={(e) => setBusinessRole(e.target.value)} />
                            </div>
                        </div>

                        <div className='my-4 flex items-center w-fit gap-x-6 flex-wrap md:flex-nowrap'>
                            <div className='w-[100%]'>
                                <label htmlFor="ownershipPercentage" className="block text-gray-700 text-sm  mb-2">How much of the business do you own?</label>
                                <input type="number" id="ownershipPercentage" className="rounded md:w-[25rem] w-[100%] px-3 py-2 border border-[#dadada] outline-blue" placeholder="In percentage" value={ownershipPercentage} onChange={(e) => setOwnershipPercentage(e.target.value)} />
                            </div>

                            <div className='w-[100%]'>
                                <label htmlFor="businessRegisteredState" className="block text-gray-700 text-sm  mb-2">Where's your business registered?</label>
                                <div className="relative">
                                    <select id="businessRegisteredState" className="rounded md:w-[25rem] w-[100%] px-3 py-2 border border-[#dadada] outline-blue" value={businessRegisteredState} onChange={(e) => setBusinessRegisteredState(e.target.value)}>
                                        <option value="" disabled>Enter state</option>
                                        {US_STATES.map((s) => (
                                            <option key={s.code} value={s.code}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center w-fit gap-x-6 flex-wrap md:flex-nowrap">

                            <div className='w-[100%]'>
                                <label htmlFor="businessAddress" className="block text-gray-700 text-sm  mb-2">Business Address</label>
                                <input type="text" id="businessAddress" className="rounded md:w-[25rem] w-[100%] px-3 py-2 border border-[#dadada] outline-blue" placeholder="Enter address" value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} />
                            </div>

                            <div className='w-[100%]'>
                                <label htmlFor="businessUnit" className="block text-gray-700 text-sm  mb-2">Unit (Optional)</label>
                                <input type="text" id="businessUnit" className="rounded md:w-[25rem] w-[100%] px-3 py-2 border border-[#dadada] outline-blue" placeholder="Enter unit" value={businessUnit} onChange={(e) => setBusinessUnit(e.target.value)} />
                            </div>
                        </div>
                        <div className='my-4 flex items-center w-fit gap-x-6 flex-wrap md:flex-nowrap'>
                            <div className='w-[100%]'>
                                <label htmlFor="businessCity" className="block text-gray-700 text-sm  mb-2">City</label>
                                <input type="text" id="businessCity" className="rounded md:w-[25rem] w-[100%] px-3 py-2 border border-[#dadada] outline-blue" placeholder="Enter city" value={businessCity} onChange={(e) => setBusinessCity(e.target.value)} />
                            </div>

                            <div className='w-[100%]'>
                                <label htmlFor="businessState" className="block text-gray-700 text-sm  mb-2">State</label>
                                <div className="relative">
                                    <select id="businessState" className="rounded md:w-[25rem] w-[100%] px-3 py-2 border border-[#dadada] outline-blue" value={businessState} onChange={(e) => setBusinessState(e.target.value)}>
                                        <option value="" disabled>Enter state</option>
                                        {US_STATES.map((s) => (
                                            <option key={s.code} value={s.code}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className='w-[100%]'>
                                <label htmlFor="businessZipCode" className="block text-gray-700 text-sm  mb-2">Zip code</label>
                                <input type="text" id="businessZipCode" className="rounded md:w-[25rem] w-[100%] px-3 py-2 border border-[#dadada] outline-blue" placeholder="Enter code" value={businessZipCode} onChange={(e) => setBusinessZipCode(e.target.value)} />
                            </div>
                        </div>
                        <button className="bg-blue text-white py-2 px-12 w-[18rem] block rounded-md cursor-pointer" onClick={handleIncrementStepClick}>Next</button>
                    </div>
                )
            }

            {
                currentStep === 4 && (
                    <div className='p-5 mt-10'>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Upload your ID </h2>
                        <p className="text-gray mb-3">We’ll like to know more about your business</p>

                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Accepted form of Identification </h2>

                        <div className='mb-2 flex items-center gap-x-3'>
                            <div className='w-5 h-5 flex justify-center items-center rounded-full bg-[#14AE5C] text-white'>
                                <TiTick />
                            </div>
                            <p>Driver License</p>
                        </div>

                        <div className='mb-2 flex items-center gap-x-3'>
                            <div className='w-5 h-5 flex justify-center items-center rounded-full bg-[#14AE5C] text-white'>
                                <TiTick />
                            </div>
                            <p>State Id</p>
                        </div>

                        <div className='mb-2 flex items-center gap-x-3'>
                            <div className='w-5 h-5 flex justify-center items-center rounded-full bg-[#14AE5C] text-white'>
                                <TiTick />
                            </div>
                            <p>Passport</p>
                        </div>

                        <div className='flex items-center gap-x-7 mb-3 mt-6 bg-[#F4F6F9] p-5 w-fit rounded-xl flex-wrap'>
                            <img src={Mobile} alt="" className='mt-2' />
                            <div>
                                <h1 className='text-lg font-medium mt-2'>This shouldn't take too long</h1>
                                <p className='text-gray'>Scan and upload your ID using your smartphone</p>
                                <button 
                                    className="bg-blue text-white py-2 px-12 w-[18rem] block rounded-md cursor-pointer mt-3 disabled:opacity-50 disabled:cursor-not-allowed" 
                                    onClick={handleGenerateQRCode}
                                    disabled={loadingQR}
                                >
                                    {loadingQR ? 'Generating...' : 'Verify your identity'}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                currentStep === 5 && (
                    <div className='p-5 mt-10'>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Get Helvetia Debit card</h2>
                        <p className="text-gray mb-3">Let's know your preferred location to get your card delivered</p>

                        <div className="mt-10 flex items-start">

                            <div className=' border-r border-r-[#dadada] pr-10'>

                                <div className='flex items-center'>
                                    <input id="getDebitCard" type="checkbox" className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer" checked={getDebitCard} onChange={(e) => setGetDebitCard(e.target.checked)} />
                                    <label htmlFor="getDebitCard" className="ml-2 text-gray-700">Get a Helvetia Debit card</label>
                                </div>
                                <div className='bg-[#dadada] w-[19rem] h-[16rem] rounded-lg mt-3'></div>
                                <p className='my-2'>We'll send you the debit card to this address</p>
                                <input type="email" placeholder='Enter Email Address' className='outline-none w-[19rem] px-3 py-3 border border-[#dadada] mb-2 rounded-md' value={cardDeliveryEmail} onChange={(e) => setCardDeliveryEmail(e.target.value)} />
                                <button className="bg-blue text-white py-2 px-12 w-[18rem] block rounded-md cursor-pointer mt-3" onClick={handleCreateCard}>Next</button>
                            </div>

                            <div className='pl-10'>

                                <h1 className='font-semibold text-lg mb-2'>Debit Card Details</h1>
                                <p className='my-2'>Name on Debit card</p>
                                <input type="text" placeholder='Name' className='outline-none w-[19rem] px-3 py-3 border border-[#dadada] mb-2 rounded-md' value={nameOnCard} onChange={(e) => setNameOnCard(e.target.value)} />
                                <p className='my-2'>Business Name on Debit card</p>
                                <input type="text" placeholder='Business Name' className='outline-none w-[19rem] px-3 py-3 border border-[#dadada] mb-2 rounded-md' value={businessNameOnCard} onChange={(e) => setBusinessNameOnCard(e.target.value)} />
                            </div>

                        </div>
                    </div>
                )
            }

            {
                currentStep === 6 && (
                    <div className='p-5 mt-10'>

                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Application is being reviewed</h2>
                        <p className="text-gray mb-3">You can setup your account while you await our response</p>

                        <div className='p-5 rounded-lg border border-[#dadada] md:w-[60%] mt-7'>

                            <div className='flex items-center gap-x-3 mb-4'>
                                <img src={Gif} alt="" />
                                <div>
                                    <h1 className='text-lg font-semibold'>Start setting up while you wait</h1>
                                    <p>Setup your account</p>
                                </div>
                            </div>


                            <div className='mb-2 flex items-center gap-x-3'>
                                <div className='w-5 h-5 flex justify-center items-center rounded-full bg-[#14AE5C] text-white'>
                                    <TiTick />
                                </div>
                                <p className='text-[#14AE5C]'>Confirm card preference</p>
                            </div>

                            <div className='w-[1px] h-[2rem] border border-r-[#dadada] ml-2'></div>

                            <div className='my-2 flex items-center gap-x-3'>
                                <div className='w-5 h-5 flex justify-center items-center rounded-full border'>
                                </div>
                                <p className=''>Connect external account</p>
                            </div>

                            <div className='w-[1px] h-[2rem] border border-r-[#dadada] ml-2'></div>

                            <h1 className='mt-2 font-medium text-lg'>Setup your first deposit</h1>
                            <p>Connect your bank account to make your first deposit</p>

                            <Link to={"/dashboard/home"}><button className="bg-blue text-white py-2 px-12  block rounded-md cursor-pointer mt-3">Connect to an external account</button></Link>


                        </div>



                    </div>
                )
            }


            {
                showQrCode && (
                    <div className='p-5 mt-10'>

                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Scan QR code</h2>

                        <p className="text-gray mb-3">Scan the QR code below to continue your verification on Stripe's secure page</p>

                        <h2 className="text-gray-800 mb-2">Scan QR code below with your smart phone</h2>

                        <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
                            {qrCodeImage ? (
                                <img src={qrCodeImage} alt="Verification QR Code" className='h-[15rem] w-[15rem]' />
                            ) : (
                                <div className="h-[15rem] w-[15rem] flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            )}
                        </div>

                        {verificationUrl && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-600 mb-2">
                                    <strong>Can't scan?</strong> Open this link on your mobile device:
                                </p>
                                <a 
                                    href={verificationUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-sm break-all underline"
                                >
                                    Open Verification Page
                                </a>
                            </div>
                        )}

                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-800">
                                <strong>Waiting for verification...</strong><br />
                                Please scan the QR code with your mobile device and upload your documents on the Stripe verification page. 
                                This page will automatically update when verification is complete.
                            </p>
                        </div>

                        <button 
                            className="bg-gray-500 text-white py-2 px-12 w-[18rem] block rounded-md cursor-pointer mt-3 hover:bg-gray-600" 
                            onClick={() => { 
                                if (pollingInterval) clearInterval(pollingInterval);
                                setShowQrCode(false); 
                                setCurrentStep(4);
                            }}
                        >
                            Cancel
                        </button>


                    </div>
                )
            }

            {
                verificationComplete && (
                    <div className='p-5 mt-10'>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Complete the verification</h2>
                        <p className="text-gray mb-3">Begin the verification step on your phone and come back here when you’re done!</p>



                        <div className='flex items-center gap-x-7 mb-3 mt-6 bg-[#F4F6F9] p-5 w-fit rounded-xl flex-wrap'>
                            <img src={Mobile} alt="" className='mt-2' />
                            <div>
                                <h1 className='text-lg font-medium mt-2'>Nicely done! Upload successful</h1>
                            </div>
                        </div>

                        <button className="bg-blue text-white py-2 px-12 w-[18rem] block rounded-md cursor-pointer mt-3" onClick={handleVerificationComplete}>Next</button>



                    </div>
                )
            }



        </div>


    );
};

export default BusinessSetupPage;