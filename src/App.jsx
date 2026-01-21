
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import LoaderGif from './assets/loader.gif';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import SolutionPage from './pages/SolutionPage';
import SupportPage from './pages/SupportPage';
import BusinessSetupPage from './pages/Auth/BusinessSetupPage';
import MobileVerificationPage from './pages/Auth/MobileVerificationPage';
import VerificationCompletePage from './pages/Auth/VerificationCompletePage';
import TransactionPage from './pages/Dashboard/TransactionPage';
import AccountPage from './pages/Dashboard/AccountPage';
import CardPage from './pages/Dashboard/CardPage';
import StatementPage from './pages/Dashboard/StatementPage';
import ReservesPage from './pages/Dashboard/ReservesPage';
import InvoicesPage from './pages/Dashboard/InvoicesPage';
import ReferalPage from './pages/Dashboard/ReferalPage';
import DashboardSupportPage from './pages/Dashboard/SupportPage';
import NotificationPage from './pages/Dashboard/NotificationPage';
import SettingPage from './pages/Dashboard/SettingPage';
import CurrencyPage from './pages/Dashboard/CurrencyPage';
import CurrencyAccountPage from './pages/Dashboard/CurrencyAccountPage';
import ProtectedRoute from './components/ProtectedRoute';
import SSOCallbackPage from './pages/Auth/SSOCallbackPage';

const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'));
const Layout = lazy(() => import('./components/dashboard/Layout'));
const HomePage = lazy(() => import('./pages/Dashboard/HomePage'));


function SuspenseWithDelay({ children, fallback, delay = 0, minDisplayTime = 2000 }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), minDisplayTime);
    return () => clearTimeout(timer);
  }, [minDisplayTime]);

  return isLoading ? (
    <div className="flex justify-center items-center w-screen h-screen">
      <img src={LoaderGif} alt="Loading..." className="h-[6rem]" />
    </div>
  ) : (
    <Suspense fallback={fallback}>{children}</Suspense>
  );
}

function App() {

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <SuspenseWithDelay fallback={<div className="flex justify-center items-center w-screen h-screen"><img src={LoaderGif} alt="HopOn Dashboard- Loader" className="h-[6rem]" /></div>} minDisplayTime={2000}>

          <Routes>

            <Route path='/' element={<LandingPage/>} />
            <Route path='/solution' element={<SolutionPage/>} />
            <Route path='/support' element={<SupportPage/>} />
            <Route path='/business/setup' element={<BusinessSetupPage/>} />
            <Route path='/verify' element={<MobileVerificationPage/>} />
            <Route path='/verification-complete' element={<VerificationCompletePage/>} />




            <Route path='/login' element={<LoginPage />} />
            <Route path='/forgot-password' element={<ForgotPasswordPage />} />
            <Route path='/reset-password' element={<ResetPasswordPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/sso-callback' element={<SSOCallbackPage />} />

            
            <Route path="/dashboard/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="home" element={<HomePage />} />
              <Route path="currency" element={<CurrencyPage />} />
              <Route path="currency/:accountId" element={<CurrencyAccountPage />} />
              <Route path="transaction" element={<TransactionPage />} />
              <Route path="account" element={<AccountPage />} />
              <Route path="card" element={<CardPage />} />
              <Route path="statement" element={<StatementPage />} />
              <Route path="reserve" element={<ReservesPage />} />
              <Route path="invoice" element={<InvoicesPage />} />
              <Route path="referal" element={<ReferalPage />} />
              <Route path="support" element={<DashboardSupportPage />} />
              <Route path="notification" element={<NotificationPage />} />
              <Route path="setting" element={<SettingPage/>} />
            </Route>

          </Routes>
        </SuspenseWithDelay>
      </BrowserRouter>
    </>
  );
}

export default App;
