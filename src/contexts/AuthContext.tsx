import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from "react";
import { User, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export interface UserData {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  role?: "USER" | "ADMIN" | "SUPER_ADMIN";
  createdAt?: string | Date | any;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  signOut: async () => {},
  refreshUserData: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (currentUser: User, attempts = 3) => {
    let currentAttempt = 0;
    
    // Determine a fallback role based on domain/email list
    const userEmailForCheck = (currentUser.email || "").toLowerCase();
    const isHardcodedAdmin = userEmailForCheck === "obenmaxjr@gmail.com" || userEmailForCheck === "njeirheinard@gmail.com";
    const defaultRole = isHardcodedAdmin ? "SUPER_ADMIN" : "USER";

    while (currentAttempt < attempts) {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        
        if (userDoc.exists()) {
          const data = userDoc.data() as UserData;
          let role = (data.role || "USER").toUpperCase();
          if (role !== "USER" && role !== "ADMIN" && role !== "SUPER_ADMIN") {
             role = "USER";
          }

          // Self-healing: if an admin logs in but their Firestore role got downgraded, restore it
          if (isHardcodedAdmin && role !== "SUPER_ADMIN") {
            role = "SUPER_ADMIN";
            try {
               await setDoc(doc(db, "users", currentUser.uid), { role: "SUPER_ADMIN" }, { merge: true });
            } catch (e) {
               console.warn("Could not elevate to SUPER_ADMIN in db (might be offline/permissions)");
            }
          }

          setUserData({ uid: currentUser.uid, ...data, role } as UserData);
        } else {
          // Initialize new user
          const newData = {
            name: currentUser.displayName || currentUser.email || "User",
            email: currentUser.email || "",
            role: defaultRole,
            createdAt: serverTimestamp()
          };
          
          try {
             await setDoc(doc(db, "users", currentUser.uid), newData);
          } catch (e) {
             console.warn("Could not setup new user doc in db (might be offline/permissions)");
          }
          
          setUserData({ uid: currentUser.uid, ...newData } as any);
        }
        return; // Success, exit retry loop
      } catch (e: any) {
        currentAttempt++;
        if (e.message?.includes('Missing or insufficient permissions')) {
          console.warn(`Attempt ${currentAttempt}: Cannot read user profile from Firestore. Your Firebase Security Rules are likely blocking access. Please deploy the 'firestore.rules' file to your Firebase console.`);
        } else {
          console.error(`Attempt ${currentAttempt} failed fetching user data.`, e);
        }
        
        if (currentAttempt >= attempts) {
          console.warn("Offline fallback activated for user session. Using local data.");
          setUserData({
            uid: currentUser.uid,
            name: currentUser.displayName || currentUser.email || "User",
            email: currentUser.email || "",
            role: defaultRole
          } as UserData);
        } else {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * currentAttempt));
        }
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserData(currentUser);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = useCallback(() => {
    setUserData(null);
    return firebaseSignOut(auth);
  }, []);

  const refreshUserData = useCallback(async () => {
    if (user) {
      await fetchUserData(user);
    }
  }, [user]);

  const value = useMemo(() => ({
    user,
    userData,
    loading,
    signOut,
    refreshUserData
  }), [user, userData, loading, signOut, refreshUserData]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
