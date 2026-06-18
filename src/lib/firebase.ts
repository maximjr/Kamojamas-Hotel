/// <reference types="vite/client" />
import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAuth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBb4IqB1n3OVlrb8nPhf0GTb0m3Ph3RSwY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "kamojam-hotel.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "kamojam-hotel",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "kamojam-hotel.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "497046966168",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:497046966168:web:00c1a8f3daa1eb04ff65ed"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase App Check
if (typeof window !== "undefined") {
  if (import.meta.env.DEV) {
    // @ts-ignore
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6Ld_fake_key_for_now_replace_me"),
    isTokenAutoRefreshEnabled: true
  });
}

export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()})
});
export const functions = getFunctions(app);
