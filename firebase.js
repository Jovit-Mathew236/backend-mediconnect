const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyD7ac-IkhbCEXBERLL0K1gdOQ3pVBiSwuQ",
  authDomain: "otp-generation-8ec8d.firebaseapp.com",
  projectId: "otp-generation-8ec8d",
  storageBucket: "otp-generation-8ec8d.firebasestorage.app",
  messagingSenderId: "114820837715",
  appId: "1:114820837715:web:6d24d667279748a57bf1a6",
  measurementId: "G-1PR2ZLSP7L"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = { db };