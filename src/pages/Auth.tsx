import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { auth, db } from "../lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatedPage } from "../components/AnimatedPage";
import SEO from "../components/SEO";
import { Mail, Lock, User, Phone, Globe, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [botField, setBotField] = useState("");
  
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUserData } = useAuth();
  
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const isStrongPassword = (pass: string) => {
    return pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Please check your inbox.");
      setIsForgotPassword(false);
    } catch (err: any) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (botField) return; // Honeypot spam defense
    
    if (isForgotPassword) {
      return handleResetPassword(e);
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (isLogin) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          
          if (!userCredential.user.emailVerified) {
            signOut(auth).catch(console.error); // fire in background
            setError("Please verify your email address before signing in. Check your inbox.");
            setLoading(false);
            return;
          }

          // Trigger context refresh but don't await blocking navigation
          refreshUserData().catch(() => {});
          
          // Background activity logging
          setDoc(doc(db, "userActivityLogs", `login_${Date.now()}`), {
             userId: userCredential.user.uid,
             userName: userCredential.user.displayName || email,
             activityType: "Login",
             pageVisited: "/auth",
             timestamp: serverTimestamp()
          }).catch(() => {}); // non-blocking

          // Fast navigation
          navigate(from, { replace: true });
        } catch (err: any) {
          setError("Invalid email or password.");
        }
      } else {
        if (!isStrongPassword(password)) {
          setError("Password must be at least 8 characters, contain a number and an uppercase letter.");
          setLoading(false);
          return;
        }

        if (password !== repeatPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          
          // Run non-critical tasks in parallel to speed up signup
          Promise.all([
            updateProfile(user, { displayName: name }),
            sendEmailVerification(user).catch(() => {})
          ]);
          
          // Data will be synced partially by backend too, but frontend drives initial profile
          setDoc(doc(db, "users", user.uid), {
             name,
             email,
             phone,
             country,
             role: "USER",
             createdAt: serverTimestamp()
          }).catch(() => {});

          setDoc(doc(db, "userActivityLogs", `signup_${Date.now()}`), {
             userId: user.uid,
             userName: name,
             activityType: "Sign Up",
             pageVisited: "/auth",
             timestamp: serverTimestamp()
          }).catch(() => {});

          // Force logout in the background
          signOut(auth).catch(() => {}); 
          
          setMessage("Account created successfully! Please verify your email to log in.");
          setIsLogin(true);
          setPassword("");
          setRepeatPassword("");
        } catch (err: any) {
          if (err.code === "auth/email-already-in-use") {
            setError("User already exists. Sign in?");
          } else {
            setError(err.message || "An error occurred during sign up");
          }
        }
      }
    } finally {
      if (!message) { // keep loading state false unless a success message intercepts
        setLoading(false); 
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
    setError("");
    setMessage("");
  };

  return (
    <AnimatedPage className="min-h-[100dvh] bg-paper flex items-center justify-center pt-24 pb-12 px-6">
      <SEO 
        title={isLogin ? "Sign In" : "Create Account"}
        description="Access your Kamojamas account or create a new one to book luxury suites."
        url="https://kamojamas.com/auth"
      />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-3xl rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white p-8 md:p-12 shadow-2xl border border-gray-100 relative z-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif text-oxblood mb-2">
            {isForgotPassword ? "Reset Password" : isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-500 font-light text-sm">
            {isForgotPassword 
              ? "Enter your email to receive recovery instructions"
              : isLogin 
              ? "Sign in to access your reservations" 
              : "Join us for exclusive luxury experiences"}
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-red-50 text-red-600 p-4 mb-6 text-sm text-center border border-red-100 rounded"
          >
            {error}
          </motion.div>
        )}
        
        {message && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-green-50 text-green-700 p-4 mb-6 text-sm text-center border border-green-100 rounded"
          >
            {message}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Spam Defense Honeypot */}
          <div className="hidden" aria-hidden="true">
            <input type="text" name="auth-bot" tabIndex={-1} value={botField} onChange={e => setBotField(e.target.value)} />
          </div>
          <AnimatePresence mode="popLayout">
            {!isLogin && !isForgotPassword && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2 relative group"
              >
                <label className="text-[9px] uppercase tracking-[0.2em] text-oxblood/40 font-bold group-hover:text-gold transition-colors flex items-center gap-2">
                  <User size={12} /> Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-oxblood transition-colors font-serif text-lg bg-transparent"
                  placeholder="John Doe"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2 relative group">
            <label className="text-[9px] uppercase tracking-[0.2em] text-oxblood/40 font-bold group-hover:text-gold transition-colors flex items-center gap-2">
              <Mail size={12} /> Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-oxblood transition-colors font-serif text-lg bg-transparent"
              placeholder="you@example.com"
            />
          </div>
          
          <AnimatePresence mode="popLayout">
            {!isLogin && !isForgotPassword && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="space-y-2 relative group">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-oxblood/40 font-bold group-hover:text-gold transition-colors flex items-center gap-2">
                    <Phone size={12} /> Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-oxblood transition-colors font-serif text-lg bg-transparent"
                    placeholder="+1 234 567 890"
                  />
                </div>
                <div className="space-y-2 relative group">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-oxblood/40 font-bold group-hover:text-gold transition-colors flex items-center gap-2">
                    <Globe size={12} /> Country
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-oxblood transition-colors font-serif text-lg bg-transparent"
                    placeholder="Nigeria"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isForgotPassword && (
            <div className="space-y-2 relative group">
              <label className="text-[9px] uppercase tracking-[0.2em] text-oxblood/40 font-bold group-hover:text-gold transition-colors flex items-center gap-2">
                <Lock size={12} /> Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-oxblood transition-colors font-serif text-lg bg-transparent"
                placeholder="••••••••"
              />
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {!isLogin && !isForgotPassword && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2 relative group"
              >
                <label className="text-[9px] uppercase tracking-[0.2em] text-oxblood/40 font-bold group-hover:text-gold transition-colors flex items-center gap-2">
                  <Lock size={12} /> Repeat Password
                </label>
                <input
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-oxblood transition-colors font-serif text-lg bg-transparent"
                  placeholder="••••••••"
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          {isLogin && !isForgotPassword && (
             <div className="flex justify-end items-center pb-2">
               <button type="button" onClick={() => setIsForgotPassword(true)} className="text-xs text-oxblood hover:text-gold transition-colors font-medium">Forgot Password?</button>
             </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 bg-oxblood text-white uppercase text-[10px] tracking-[0.3em] font-bold hover:bg-gold transition-all duration-500 shadow-[0_0_20px_rgba(74,4,4,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] flex justify-center items-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Processing...
              </>
            ) : isForgotPassword ? "Reset Password" : isLogin ? "Sign In" : "Create Account"}
            {!loading && <ArrowRight size={14} />}
          </button>
          
        </form>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm">
            {isForgotPassword 
               ? "Remember your password?" 
               : isLogin 
                  ? "Don't have an account?" 
                  : "Already have an account?"}
            <button 
              type="button"
              onClick={toggleMode}
              className="ml-2 text-oxblood font-serif italic hover:text-gold transition-colors"
            >
              {isLogin || isForgotPassword ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </motion.div>
    </AnimatedPage>
  );
}
