import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyAHXv-czb4MoceuvUjPqStzffzVe-60KDM",
    authDomain: "galaxy-mart-1.firebaseapp.com",
    projectId: "galaxy-mart-1",
    storageBucket: "galaxy-mart-1.appspot.com",
    messagingSenderId: "558064707946",
    appId: "1:558064707946:web:f9e30f34172ac2d9f65d13",
    measurementId: "G-3ZS94D789T"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);
const auth = getAuth(app)
export { app, db, analytics, storage, auth }