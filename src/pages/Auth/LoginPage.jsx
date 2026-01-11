import Logo from "../../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import Bg from "../../assets/auth/cover.svg";
import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { authAPI } from "../../services/api";
import { useSignIn } from "@clerk/clerk-react";

const LoginPage = () => {
  const nav = useNavigate();
  const { signIn, isLoaded: isClerkLoaded } = useSignIn();
  const { user, isLoaded: isUserLoaded } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAppleSignIn = async () => {
    if (!isClerkLoaded) {
      toast.error("Apple Sign-In is not ready yet");
      return;
    }

    setLoading(true);
    try {
      // If user is already signed in with Clerk, just redirect instead of starting a new OAuth flow
      if (isUserLoaded && user) {
        nav('/business/setup');
        setLoading(false);
        return;
      }

      await signIn.authenticateWithRedirect({
        strategy: "oauth_apple",
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: `${window.location.origin}/business/setup`,
      });
    } catch (error) {
      console.error("Apple Sign-In error:", error);
      // If Clerk reports the user is already signed in, redirect to the app flow instead of showing an error
      const msg = error?.message || String(error);
      if (msg?.toLowerCase?.().includes("already signed in") || msg?.toLowerCase?.().includes("already signed")) {
        nav('/business/setup');
      } else {
        toast.error("Apple Sign-In failed: " + (error.message || "Unknown error"));
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUserLoaded && user) {
      // user already authenticated with Clerk, redirect to business setup
      nav('/business/setup');
    }
  }, [isUserLoaded, user, nav]);

  const handleGoogleSignIn = useCallback(
    async (response) => {
      setLoading(true);
      try {
        const result = await authAPI.googleLogin(response.credential);
        if (result.token) {
          localStorage.removeItem("token");
          localStorage.removeItem("accountId");
          localStorage.removeItem("user");
          localStorage.removeItem("registerEmail");
          localStorage.removeItem("accountType");
          localStorage.removeItem("password");
          localStorage.setItem("token", result.token);
          localStorage.setItem("accountId", result.accountId || "");
          localStorage.setItem("accountType", result.accountType || "business");
          toast.success("Login successful!");
          
          // Redirect new users to business setup, existing users to dashboard
          if (result.isNewUser) {
            nav("/business/setup");
          } else {
            nav("/dashboard/home");
          }
        } else {
          toast.error(result.error || "Google login failed");
        }
      } catch (error) {
        toast.error("Error: " + error.message);
      } finally {
        setLoading(false);
      }
    },
    [nav],
  );

  const initializeGoogleSignIn = useCallback(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id:
          "238748490522-kgllsq9c52d05qcblsluchatii27cbn0.apps.googleusercontent.com",
        callback: handleGoogleSignIn,
      });
    }
  }, [handleGoogleSignIn]);

  const triggerGoogleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // One Tap not displayed, show manual picker
          window.google.accounts.id.prompt();
        }
      });
    } else {
      toast.error("Google Sign-In is not available");
    }
  };

  useEffect(() => {
    const checkGoogleLoaded = () => {
      if (window.google) {
        initializeGoogleSignIn();
      } else {
        setTimeout(checkGoogleLoaded, 100);
      }
    };
    checkGoogleLoaded();
  }, [initializeGoogleSignIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      if (response.token) {
        // Clear any old user data first
        localStorage.removeItem("token");
        localStorage.removeItem("accountId");
        localStorage.removeItem("user");
        localStorage.removeItem("registerEmail");
        localStorage.removeItem("accountType");
        localStorage.removeItem("password");

        // Set new user data with complete provisioning
        localStorage.setItem("token", response.token);
        localStorage.setItem("accountId", response.accountId || "");
        localStorage.setItem("accountType", response.accountType || "business");
        if (response.email) localStorage.setItem("userEmail", response.email);
        if (response.cardHolderName) localStorage.setItem("cardHolderName", response.cardHolderName);
        
        toast.success("Login successful!");
        nav("/dashboard/home");
      } else {
        // Handle specific error codes for better UX
        if (response.code === "EMAIL_NOT_VERIFIED") {
          toast.error("Please verify your email first");
          localStorage.setItem("registerEmail", response.email || email);
          nav("/business/setup");
        } else if (response.code === "IDENTITY_NOT_VERIFIED") {
          toast.error("Please complete identity verification");
          localStorage.setItem("registerEmail", response.email || email);
          localStorage.setItem("accountType", response.accountType || "business");
          // Set step to identity verification
          localStorage.setItem("businessSetupStep", "4");
          nav("/business/setup");
        } else {
          toast.error(response.error || "Login failed");
        }
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${Bg})` }}
      className="flex justify-center items-center w-screen min-h-screen bg-blue flex-col p-4"
    >
      <div className="w-full max-w-[25rem] bg-white p-4 sm:p-5 rounded-md">
        <div className="flex justify-center items-center flex-col">
          <img src={Logo} alt="" className="h-10 sm:h-auto" />
          <h1 className="text-xl sm:text-[1.7rem] font-semibold mt-2">Welcome back!</h1>
          <p className="text-gray mt-1 text-sm sm:text-base text-center">Log in to access your account</p>

          <div className="mt-5 w-full flex flex-col gap-2">
            <button
              type="button"
              onClick={triggerGoogleSignIn}
              className="w-full bg-[#F4F4FF] py-3 rounded-md text-sm cursor-pointer font-medium flex items-center justify-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9.003 18z" fill="#34A853"/>
                <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
              </svg>
              Continue With Google
            </button>
            <button 
              onClick={handleAppleSignIn}
              disabled={loading || !isClerkLoaded}
              className="w-full bg-[#F4F4FF] py-3 rounded-md text-sm cursor-pointer font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.94 9.88c-.02-2.06 1.68-3.05 1.76-3.1-.96-1.4-2.45-1.59-2.98-1.61-1.27-.13-2.48.75-3.12.75-.64 0-1.63-.73-2.68-.71-1.38.02-2.65.8-3.36 2.03-1.43 2.49-.37 6.17 1.03 8.19.68.99 1.5 2.1 2.57 2.06 1.03-.04 1.42-.67 2.67-.67s1.6.67 2.68.65c1.11-.02 1.82-.99 2.49-1.99.79-1.14 1.11-2.25 1.13-2.31-.02-.01-2.17-.83-2.19-3.29zm-2.05-6.04c.57-.69.95-1.64.85-2.59-.82.03-1.81.55-2.4 1.23-.53.61-.99 1.59-.87 2.53.92.07 1.85-.46 2.42-1.17z" fill="#000"/>
              </svg>
              {loading ? "Signing in..." : "Continue With Apple"}
            </button>
          </div>

          <div className="flex justify-center items-center mt-3 gap-x-3">
            <p className="text-sm text-gray">Or Signin With</p>
          </div>

          <form onSubmit={handleLogin} className="w-full">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#F4F6F9] w-[100%] px-3 h-[2.8rem] rounded-md mt-3 outline-none border-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#F4F6F9] w-[100%] px-3 h-[2.8rem] rounded-md mt-3 outline-none border-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-2 text-white bg-blue w-[100%] h-[2.5rem] rounded-md disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <Link to="/forgot-password" className="mt-3 text-blue">
            Forgot Password
          </Link>
          <button className="mt-3 text-gray">
            Don&apos;t have an account ?{" "}
            <Link to={"/register"} className="text-blue">
              Signup
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
