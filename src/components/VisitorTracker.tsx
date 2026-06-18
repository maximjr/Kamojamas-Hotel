import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";

const getSessionId = () => {
  let sessionId = sessionStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
};

const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "Tablet";
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "Mobile";
  return "Desktop";
};

export const VisitorTracker = () => {
  const location = useLocation();
  const { user, userData } = useAuth();
  const entryTimeRef = useRef(Date.now());

  useEffect(() => {
    entryTimeRef.current = Date.now();
    
    const sessionId = getSessionId();
    const activeVisitorRef = doc(db, "activeVisitors", sessionId);
    
    const updatePresence = async () => {
       try {
          await setDoc(activeVisitorRef, {
            sessionId,
            userId: user?.uid || null,
            userName: userData?.name || user?.displayName || user?.email || "Anonymous Visitor",
            page: location.pathname,
            device: getDeviceType(),
            country: userData?.country || "Unknown",
            lastActive: serverTimestamp(),
            entryTime: entryTimeRef.current
          }, { merge: true });
       } catch (e) {
          console.warn("Could not update visitor presence");
       }
    };

    updatePresence();
    
    const interval = setInterval(updatePresence, 30000);

    const handleUnload = () => {
       // Best effort, can't guarantee execution
       sessionStorage.removeItem("sessionId"); 
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
       clearInterval(interval);
       window.removeEventListener("beforeunload", handleUnload);
    };
  }, [location.pathname, user?.uid, userData?.role, userData?.name]);

  return null;
};
