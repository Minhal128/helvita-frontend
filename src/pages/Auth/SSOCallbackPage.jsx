import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticateWithRedirectCallback, useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const SSOCallbackPage = () => {
  const { user, isLoaded } = useUser();
  const nav = useNavigate();

  useEffect(() => {
    if (isLoaded && user) {
      // Store user info in localStorage for your app
      localStorage.removeItem("token");
      localStorage.removeItem("accountId");
      localStorage.removeItem("user");
      localStorage.removeItem("registerEmail");
      localStorage.removeItem("accountType");
      localStorage.removeItem("password");

      // Store Clerk session info
      localStorage.setItem("clerkUserId", user.id);
      localStorage.setItem("accountType", "business");
      localStorage.setItem("userEmail", user.primaryEmailAddress?.emailAddress || "");

      toast.success("Apple Sign-in successful!");
      // Mark that user came from SSO so business setup can skip email verification
      try {
        localStorage.setItem('businessSetupStep', '1');
      } catch (e) {
        console.warn('Could not set businessSetupStep in localStorage', e);
      }
      nav("/business/setup");
    }
  }, [isLoaded, user, nav]);

  return (
    <AuthenticateWithRedirectCallback
      forceRedirectUrl="/business/setup"
    >
      <div className="flex justify-center items-center w-screen h-screen bg-blue flex-col">
        <div className="w-[25rem] bg-white p-5 rounded-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto"></div>
          <p className="mt-4 text-gray">Completing sign-in...</p>
        </div>
      </div>
    </AuthenticateWithRedirectCallback>
  );
};

export default SSOCallbackPage;
