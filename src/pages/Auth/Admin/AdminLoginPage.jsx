import React, { useState } from 'react';
import Logo from '../../../assets/logo.svg'
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI, adminAPI } from '../../../services/api';



const AdminLoginPage = () => {
    const nav = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSignIn = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const result = await authAPI.login(email, password)
            if (!result.token) {
                toast.error(result.error || result.errors?.[0]?.msg || 'Login failed')
                return
            }
            localStorage.setItem('token', result.token)
            // Admins are an allow-list on the server; confirm before entering the panel
            const me = await adminAPI.me()
            if (me.error) {
                localStorage.removeItem('token')
                toast.error(me.error)
                return
            }
            nav('/admin/dashboard')
        } catch {
            toast.error('Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (

        <form onSubmit={handleSignIn} className='flex justify-center items-center w-screen h-screen bg-[#262628] flex-col'>


            <div className='fixed top-10 right-24 cursor-pointer text-white'>
                <RxCross1 onClick={()=>nav("/")}/>
            </div>

            <img src={Logo} alt="" className='h-[2rem]' />
            <p className='text-white font-medium text-xl mt-4'>Welcome back!</p>
            <p className='text-sm text-[#828287] mt-2'>Enter your email and password to sign in</p>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter Email Address' className='w-[20rem] h-[2.5rem] text-white border border-[#444444] px-3 bg-transparent outline-none rounded-md mt-3 placeholder:text-sm placeholder:text-[#808080]' />
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter Password' className='w-[20rem] h-[2.5rem] text-white border border-[#444444] px-3 bg-transparent outline-none rounded-md mt-3 placeholder:text-sm placeholder:text-[#808080]' />
            <button type="submit" disabled={loading} style={{ background: 'linear-gradient(90deg, #E54B3C 0%, #FF1700 100%)', }} className='mt-3 rounded-md text-white text-sm h-[2.3rem] w-[20rem] disabled:opacity-60'>{loading ? 'Signing in...' : 'Sign In'}</button>

        </form>
    );
};

export default AdminLoginPage;
