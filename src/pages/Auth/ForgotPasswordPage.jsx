import Logo from '../../assets/logo.svg'
import { Link, useNavigate } from 'react-router-dom';
import Bg from '../../assets/auth/cover.svg'
import { useState } from 'react';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';

const ForgotPasswordPage = () => {
    const nav = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        setLoading(true);
        try {
            const response = await authAPI.forgotPassword(email);
            if (response.message) {
                toast.success('Password reset OTP sent to your email');
                setSent(true);
                // Store email for the reset password page
                localStorage.setItem('resetEmail', email);
                // Navigate to reset password page
                setTimeout(() => {
                    nav('/reset-password');
                }, 1500);
            } else {
                toast.error(response.error || 'Failed to send reset email');
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
                    <h1 className='text-[1.7rem] font-semibold mt-2'>Forgot Password?</h1>
                    <p className='text-gray mt-1 text-center text-sm'>
                        Enter your email address and we'll send you an OTP to reset your password.
                    </p>

                    {!sent ? (
                        <form onSubmit={handleSubmit} className='w-full mt-5'>
                            <input 
                                type="email" 
                                placeholder='Email address' 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='bg-[#F4F6F9] w-[100%] px-3 h-[2.8rem] rounded-md outline-none border-none' 
                            />

                            <button 
                                type="submit" 
                                disabled={loading}
                                className='mt-4 text-white bg-blue w-[100%] h-[2.5rem] rounded-md disabled:opacity-50'
                            >
                                {loading ? 'Sending...' : 'Send Reset OTP'}
                            </button>
                        </form>
                    ) : (
                        <div className='mt-5 text-center'>
                            <div className='bg-green-100 text-green-700 p-3 rounded-md mb-4'>
                                <p className='text-sm'>OTP sent successfully! Check your email.</p>
                            </div>
                            <p className='text-sm text-gray'>Redirecting to reset password page...</p>
                        </div>
                    )}

                    <div className='mt-5 flex flex-col items-center gap-2'>
                        <Link to="/login" className='text-blue text-sm'>
                            ← Back to Login
                        </Link>
                        <p className='text-gray text-sm'>
                            Don't have an account? <Link to="/register" className='text-blue'>Signup</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
