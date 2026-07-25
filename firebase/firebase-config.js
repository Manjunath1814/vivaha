// Firebase SDK Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import { getStorage } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";

const firebaseConfig = {

    apiKey: "AIzaSyBY8910KYqA-Fqc650-O_muQZ8BE-FuWI0",

    authDomain: "my-partner-a2c99.firebaseapp.com",

    projectId: "my-partner-a2c99",

    storageBucket: "my-partner-a2c99.firebasestorage.app",

    messagingSenderId: "1083074265867",

    appId: "1:1083074265867:web:ce970034f78b490ac3180e",

    measurementId: "G-MLKY5H9T0V"

};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);

export {

    app,

    auth,

    db,

    storage

};
