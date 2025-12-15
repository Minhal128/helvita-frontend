import Logo from '../../assets/logo.svg'
import { Link, useNavigate } from 'react-router-dom';
import Bg from '../../assets/auth/cover.svg'
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';

const ResetPasswordPage = () => {
    const nav = useNavigate();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: verify OTP, 2: set new password

    useEffect(() => {
        const storedEmail = localStorage.getItem('resetEmail');
        if (storedEmail) {
            setEmail(storedEmail);
        } else {
            // If no email stored, redirect to forgot password
            nav('/forgot-password');
        }
    }, [nav]);

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp || otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const response = await authAPI.verifyResetOtp(email, otp);
            if (response.message || response.valid) {
                toast.success('OTP verified successfully');
                setStep(2);
            } else {
                toast.error(response.error || 'Invalid OTP');
            }
        } catch (error) {
            toast.error('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        if (!newPassword || newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const response = await authAPI.resetPassword(email, otp, newPassword);
            if (response.message) {
                toast.success('Password reset successfully!');
                // Clean up
                localStorage.removeItem('resetEmail');
                // Navigate to login
                setTimeout(() => {
                    nav('/login');
                }, 1500);
            } else {
                toast.error(response.error || 'Failed to reset password');
            }
        } catch (error) {
            toast.error('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        try {
            const response = await authAPI.forgotPassword(email);
            if (response.message) {
                toast.success('New OTP sent to your email');
            } else {
                toast.error(response.error || 'Failed to resend OTP');
            }
        } catch (error) {
            toast.error('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{backgroundImage:`url(${Bg})`}} className='flex justify-center items-center w-screen h-screen bg-blue flex-col'>
            <div className='w-[25rem] bg-white p-5 rounded-md'>
                <div className='flex justify-center items-center flex-col'>
                    <img src={Logo} alt="" />
                    <h1 className='text-[1.7rem] font-semibold mt-2'>
                        {step === 1 ? 'Verify OTP' : 'Reset Password'}
                    </h1>
                    <p className='text-gray mt-1 text-center text-sm'>
                        {step === 1 
                            ? `Enter the OTP sent to ${email}` 
                            : 'Enter your new password'}
                    </p>

                    {step === 1 ? (
                        <form onSubmit={handleVerifyOtp} className='w-full mt-5'>
                            <input 
                                type="text" 
                                placeholder='Enter 6-digit OTP' 
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                maxLength={6}
                                className='bg-[#F4F6F9] w-[100%] px-3 h-[2.8rem] rounded-md outline-none border-none text-center tracking-widest text-lg' 
                            />

                            <button 
                                type="submit" 
                                disabled={loading}
                                className='mt-4 text-white bg-blue w-[100%] h-[2.5rem] rounded-md disabled:opacity-50'
                            >
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>

                            <button 
                                type="button"
                                onClick={handleResendOtp}
                                disabled={loading}
                                className='mt-2 text-blue w-[100%] h-[2.5rem] rounded-md disabled:opacity-50 text-sm'
                            >
                                Resend OTP
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className='w-full mt-5'>
                            <input 
                                type="password" 
                                placeholder='New Password' 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className='bg-[#F4F6F9] w-[100%] px-3 h-[2.8rem] rounded-md outline-none border-none' 
                            />
                            <input 
                                type="password" 
                                placeholder='Confirm New Password' 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className='bg-[#F4F6F9] w-[100%] px-3 h-[2.8rem] rounded-md mt-3 outline-none border-none' 
                            />

                            <button 
                                type="submit" 
                                disabled={loading}
                                className='mt-4 text-white bg-blue w-[100%] h-[2.5rem] rounded-md disabled:opacity-50'
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}

                    <div className='mt-5 flex flex-col items-center gap-2'>
                        <Link to="/forgot-password" className='text-blue text-sm'>
                            ← Try different email
                        </Link>
                        <Link to="/login" className='text-gray text-sm'>
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
