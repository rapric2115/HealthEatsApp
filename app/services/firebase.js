// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7_A_QzafHdeyWsSaincgvDs_VRyrZTeA",
  authDomain: "healthymeal-e666d.firebaseapp.com",
  projectId: "healthymeal-e666d",
  storageBucket: "healthymeal-e666d.firebasestorage.app",
  messagingSenderId: "204773249610",
  appId: "1:204773249610:web:0bbc485d36abe38434ccb3",
  measurementId: "G-YKPCCDVM20"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);