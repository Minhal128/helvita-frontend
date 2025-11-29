import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MobileVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sessionId = searchParams.get('session');
  const clientSecret = searchParams.get('secret');

  useEffect(() => {
    if (!sessionId || !clientSecret) {
      setError('Invalid verification link. Please scan the QR code again.');
      setLoading(false);
      return;
    }

    // Load Stripe Identity SDK
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = () => initializeStripeIdentity();
    script.onerror = () => {
      setError('Failed to load verification system. Please try again.');
      setLoading(false);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [sessionId, clientSecret]);

  const initializeStripeIdentity = async () => {
    try {
      if (!window.Stripe) {
        throw new Error('Stripe not loaded');
      }

      const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      
      const verificationSession = await stripe.verifyIdentity(clientSecret);

      if (verificationSession.error) {
        setError(verificationSession.error.message);
        setLoading(false);
      } else {
        // Verification completed successfully
        toast.success('Verification completed! You can return to your desktop.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Stripe Identity Error:', err);
      setError('Failed to initialize verification. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        {loading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Verification</h2>
            <p className="text-gray-600">Please wait while we prepare your identity verification...</p>
          </div>
        )}

        {error && (
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
            >
              Return to Home
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="text-center">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <p className="font-bold">Verification Complete!</p>
              <p>You can now return to your desktop to continue.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileVerificationPage;
