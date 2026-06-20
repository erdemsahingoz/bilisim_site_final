import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

let app = null;
let auth = null;

// Initialize Firebase only if the API key is present
if (firebaseConfig.apiKey && firebaseConfig.apiKey.trim() !== "") {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    console.log("Firebase client initialized successfully.");
  } catch (error) {
    console.error("Firebase initialization failed: ", error);
  }
} else {
  console.warn("Firebase API key missing in environment variables. Web app is running in DEV-MOCK mode.");
}

export { auth };
export default app;
