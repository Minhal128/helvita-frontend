import Logo from '../../assets/logo.svg'
import { Link, useNavigate } from 'react-router-dom';
import Bg from '../../assets/auth/cover.svg'
import { useState } from 'react';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';

const LoginPage = () => {
    const nav = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await authAPI.login(email, password);
            if (response.token) {
                // Clear any old user data first
                localStorage.removeItem('token');
                localStorage.removeItem('accountId');
                localStorage.removeItem('user');
                localStorage.removeItem('registerEmail');
                localStorage.removeItem('accountType');
                localStorage.removeItem('password');
                
                // Set new user data
                localStorage.setItem('token', response.token);
                localStorage.setItem('accountId', response.accountId || '');
                toast.success('Login successful!');
                nav("/dashboard/home");
            } else {
                toast.error(response.error || 'Login failed');
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
                    <h1 className='text-[1.7rem] font-semibold mt-2'>Welcome back!</h1>
                    <p className='text-gray mt-1'>Log in to access your account</p>

                    <div className='mt-5 w-[100%]'>
                        <button className='block w-[100%] bg-[#F4F4FF] py-3 rounded-md text-sm cursor-pointer font-medium'>Continue With Google</button>
                        <button className='block w-[100%] bg-[#F4F4FF] py-3 rounded-md text-sm cursor-pointer mt-2 font-medium'>Continue With Apple</button>
                    </div>

                    <div className='flex justify-center items-center mt-3 gap-x-3'>
                        <p className='text-sm text-gray'>Or Signin With</p>
                    </div>

                    <form onSubmit={handleLogin} className='w-full'>
                        <input 
                            type="email" 
                            placeholder='Email address' 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='bg-[#F4F6F9] w-[100%] px-3 h-[2.8rem] rounded-md mt-3 outline-none border-none' 
                        />
                        <input 
                            type="password" 
                            placeholder='Password' 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='bg-[#F4F6F9] w-[100%] px-3 h-[2.8rem] rounded-md mt-3 outline-none border-none' 
                        />

                        <button 
                            type="submit" 
                            disabled={loading}
                            className='mt-2 text-white bg-blue w-[100%] h-[2.5rem] rounded-md disabled:opacity-50'
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <button className='mt-3 text-blue'>Forgot Password</button>
                    <button className='mt-3 text-gray'>Don't have an account ? <Link to={"/register"} className='text-blue'>Signup</Link></button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
