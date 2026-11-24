import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticateWithRedirectCallback, useAuth, useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { authAPI } from "../../services/api";

const SSOCallbackPage = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const nav = useNavigate();
  const exchanged = useRef(false);

  useEffect(() => {
    if (!isLoaded || !user || exchanged.current) return;
    exchanged.current = true;

    (async () => {
      // Trade the Clerk session for our own API token (same storage as Google login)
      const result = await authAPI.clerkLogin(await getToken()).catch(() => ({ error: "Apple sign-in failed" }));
      if (result.error || !(result.token || result.onboardingToken)) {
        toast.error(result.error || "Apple sign-in failed");
        nav("/login");
        return;
      }

      localStorage.removeItem("user");
      localStorage.removeItem("password");
      localStorage.removeItem("token");
      localStorage.removeItem("onboardingToken");
      if (result.onboardingToken) {
        // Identity not verified yet: setup-only token; setup reads the email from registerEmail
        localStorage.setItem("onboardingToken", result.onboardingToken);
        localStorage.setItem("registerEmail", result.email || "");
      } else {
        localStorage.removeItem("registerEmail");
        localStorage.setItem("token", result.token);
      }
      localStorage.setItem("accountId", result.accountId || "");
      localStorage.setItem("accountType", result.accountType || "business");
      localStorage.setItem("clerkUserId", user.id);
      localStorage.setItem("userEmail", user.primaryEmailAddress?.emailAddress || "");

      toast.success("Apple Sign-in successful!");
      // Mark that user came from SSO so business setup can skip email verification
      try {
        localStorage.setItem('businessSetupStep', '1');
      } catch (e) {
        console.warn('Could not set businessSetupStep in localStorage', e);
      }
      nav("/business/setup");
    })();
  }, [isLoaded, user, getToken, nav]);

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
