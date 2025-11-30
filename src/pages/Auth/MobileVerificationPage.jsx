import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MobileVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  // Support both old format (session/secret) and new format (direct Stripe URL via redirect)
  const sessionId = searchParams.get('session');
  const clientSecret = searchParams.get('secret');
  
  // Check if this is a return from Stripe verification
  const isReturn = searchParams.get('return') === 'true';

  useEffect(() => {
    // If this is a return from Stripe verification
    if (isReturn) {
      setLoading(false);
      setMessage('Verification submitted! You can now return to your desktop to continue.');
      return;
    }

    // Old flow - redirect to error since we now use Stripe-hosted URLs
    if (sessionId && clientSecret) {
      setError('This verification link format is outdated. Please generate a new QR code from the registration page.');
      setLoading(false);
      return;
    }

    // If no params, show generic message
    setError('Invalid verification link. Please scan the QR code from the registration page.');
    setLoading(false);
  }, [sessionId, clientSecret, isReturn]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        {loading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading</h2>
            <p className="text-gray-600">Please wait...</p>
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

        {!loading && !error && message && (
          <div className="text-center">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <p className="font-bold">Success!</p>
              <p>{message}</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 mt-4"
            >
              Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileVerificationPage;
