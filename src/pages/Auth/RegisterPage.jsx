import Logo from '../../assets/logo.svg'
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Bg from '../../assets/auth/cover.svg'
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('personal');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref');

  useEffect(() => {
    if (referralCode) {
      console.log('Registering with referral code:', referralCode);
    }
  }, [referralCode]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.register(email, password, accountType, referralCode);
      if (response.success || response.message) {
        toast.success('Registration successful! Check your email for OTP.');
        localStorage.setItem('registerEmail', email);
        localStorage.setItem('accountType', accountType);
        localStorage.setItem('password', password);
        
        // Route to business setup page for both personal and business accounts
        navigate('/business/setup');
      } else {
        toast.error(response.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundImage: `url(${Bg})` }} className='flex justify-center items-center w-screen h-screen bg-blue flex-col'>
      <div className='w-[25rem] bg-white p-5 rounded-md'>
        <div className='flex justify-center items-center flex-col'>
          <img src={Logo} alt="" />
          <h1 className='text-[1.7rem] font-semibold mt-2'>Create an account</h1>
          <p className='text-gray mt-1 text-center'>Please fill out this form, and we'll send you a welcome email so you can verify your email address and sign in.</p>

          <form onSubmit={handleRegister} className='w-full'>
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
            <select 
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className='bg-[#F4F6F9] w-[100%] px-3 h-[2.8rem] rounded-md mt-3 outline-none border-none'
            >
              <option value="personal">Personal Account</option>
              <option value="business">Business Account</option>
            </select>

            <button 
              type="submit" 
              disabled={loading}
              className='mt-2 text-white bg-blue w-[100%] h-[2.5rem] rounded-md disabled:opacity-50'
            >
              {loading ? 'Signing up...' : 'Sign up'}
            </button>
          </form>

          <button className='mt-3 text-gray'>Already have an account ? <Link to={"/login"} className='text-blue'>Signin</Link></button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;