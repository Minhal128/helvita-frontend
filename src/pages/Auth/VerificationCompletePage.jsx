import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TiTick } from 'react-icons/ti';

const VerificationCompletePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <TiTick className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Verification Submitted!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Your identity documents have been submitted successfully. 
            Stripe is now processing your verification.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6">
            <p className="text-sm">
              <strong>What's next?</strong> Return to your desktop browser to continue with the registration process. 
              The verification status will be updated automatically.
            </p>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            You can safely close this page on your mobile device.
          </p>

          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 transition-colors w-full"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationCompletePage;
