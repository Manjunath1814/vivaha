/* ==========================================================
   VIVAHA AI MATRIMONY
   Premium Login Page
   File : login/login.js
   Part 1
   ----------------------------------------------------------
   Imports
   DOM References
   State
   Utilities
   Validation
   Loader
   ========================================================== */

import {
    auth,
    googleProvider
} from "../firebase/firebase-config.js";

import {
    signInWithPopup,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

/* ==========================================================
   DOM REFERENCES
========================================================== */

const loaderOverlay = document.getElementById("loaderOverlay");

const googleLoginBtn = document.getElementById("googleLoginBtn");

const phoneForm = document.getElementById("phoneForm");

const phoneNumberInput = document.getElementById("phoneNumber");

const continueBtn = document.getElementById("continueBtn");

const otpSection = document.getElementById("otpSection");

const verifyOtpBtn = document.getElementById("verifyOtpBtn");

const resendOtpBtn = document.getElementById("resendOtpBtn");

const otpInputs = document.querySelectorAll(".otp-box");

/* ==========================================================
   APP STATE
========================================================== */

let confirmationResult = null;

let recaptchaVerifier = null;

let verificationId = null;

let resendCooldown = 30;

let resendInterval = null;

/* ==========================================================
   LOADER
========================================================== */

function showLoader() {

    loaderOverlay.classList.remove("hidden");

}

function hideLoader() {

    loaderOverlay.classList.add("hidden");

}

/* ==========================================================
   PHONE VALIDATION
========================================================== */

function sanitizePhone(value) {

    return value.replace(/\D/g, "");

}

function isValidIndianPhone(phone) {

    return /^[6-9]\d{9}$/.test(phone);

}

/* ==========================================================
   GET FULL PHONE NUMBER
========================================================== */

function getPhoneNumber() {

    return `+91${sanitizePhone(phoneNumberInput.value)}`;

}

/* ==========================================================
   OTP
========================================================== */

function getOTP() {

    return [...otpInputs]

        .map(input => input.value)

        .join("");

}

function clearOTP() {

    otpInputs.forEach(input => {

        input.value = "";

    });

}

/* ==========================================================
   OTP AUTO FOCUS
========================================================== */

function initializeOTPInputs() {

    otpInputs.forEach((input, index) => {

        input.addEventListener("input", () => {

            input.value = input.value.replace(/\D/g, "");

            if (input.value && index < otpInputs.length - 1) {

                otpInputs[index + 1].focus();

            }

        });

        input.addEventListener("keydown", event => {

            if (
                event.key === "Backspace" &&
                input.value === "" &&
                index > 0
            ) {

                otpInputs[index - 1].focus();

            }

        });

        input.addEventListener("paste", event => {

            event.preventDefault();

            const pasted = event.clipboardData
                .getData("text")
                .replace(/\D/g, "")
                .slice(0, 6);

            pasted.split("").forEach((digit, i) => {

                if (otpInputs[i]) {

                    otpInputs[i].value = digit;

                }

            });

            if (otpInputs[pasted.length - 1]) {

                otpInputs[pasted.length - 1].focus();

            }

        });

    });

}

/* ==========================================================
   SHOW OTP UI
========================================================== */

function showOTPSection() {

    phoneForm.classList.add("hidden");

    otpSection.classList.remove("hidden");

    clearOTP();

    otpInputs[0].focus();

}

/* ==========================================================
   HIDE OTP UI
========================================================== */

function hideOTPSection() {

    otpSection.classList.add("hidden");

    phoneForm.classList.remove("hidden");

}

/* ==========================================================
   BUTTON STATES
========================================================== */

function disableButton(button, text = "") {

    button.disabled = true;

    if (text) {

        button.dataset.original = button.textContent;

        button.textContent = text;

    }

}

function enableButton(button) {

    button.disabled = false;

    if (button.dataset.original) {

        button.textContent = button.dataset.original;

    }

}

/* ==========================================================
   RESEND TIMER
========================================================== */

function startResendTimer() {

    resendCooldown = 30;

    resendOtpBtn.disabled = true;

    resendOtpBtn.textContent = `Resend OTP (${resendCooldown}s)`;

    resendInterval = setInterval(() => {

        resendCooldown--;

        resendOtpBtn.textContent =
            `Resend OTP (${resendCooldown}s)`;

        if (resendCooldown <= 0) {

            clearInterval(resendInterval);

            resendOtpBtn.disabled = false;

            resendOtpBtn.textContent = "Resend OTP";

        }

    }, 1000);

}

/* ==========================================================
   ERROR
========================================================== */

function showError(message) {

    alert(message);

}

/* ==========================================================
   SUCCESS
========================================================== */

function showSuccess(message) {

    console.log(message);

}

/* ==========================================================
   PAGE INITIALIZATION
========================================================== */

window.addEventListener("DOMContentLoaded", () => {

    hideLoader();

    initializeOTPInputs();

});
/* ==========================================================
   VIVAHA AI MATRIMONY
   Premium Login Page
   File : login/login.js
   Part 2
   ----------------------------------------------------------
   Firebase Authentication
   Google Sign In
   Phone Authentication
   Invisible reCAPTCHA
   ========================================================== */

import {
    signInWithPopup,
    RecaptchaVerifier,
    signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

/* ==========================================================
   GOOGLE SIGN IN
========================================================== */

async function signInWithGoogle() {

    try {

        disableButton(googleLoginBtn, "Please wait...");
        showLoader();

        const result = await signInWithPopup(
            auth,
            googleProvider
        );

        const user = result.user;

        console.log("Google Login Success:", user);

        showSuccess("Successfully signed in.");

        // TODO:
        // Check Firestore user profile
        // Redirect accordingly

        window.location.href = "../dashboard/";

    } catch (error) {

        console.error(error);

        showError(error.message);

    } finally {

        hideLoader();

        enableButton(googleLoginBtn);

    }

}

/* ==========================================================
   INITIALIZE INVISIBLE RECAPTCHA
========================================================== */

function initializeRecaptcha() {

    if (recaptchaVerifier) return;

    recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {

            size: "invisible",

            callback: () => {

                console.log("reCAPTCHA verified.");

            },

            "expired-callback": () => {

                console.log("reCAPTCHA expired.");

            }

        }
    );

}

/* ==========================================================
   SEND OTP
========================================================== */

async function sendOTP() {

    const phone = sanitizePhone(
        phoneNumberInput.value
    );

    if (!isValidIndianPhone(phone)) {

        showError(
            "Please enter a valid 10-digit mobile number."
        );

        phoneNumberInput.focus();

        return;

    }

    try {

        disableButton(
            continueBtn,
            "Sending OTP..."
        );

        showLoader();

        initializeRecaptcha();

        confirmationResult =
            await signInWithPhoneNumber(
                auth,
                getPhoneNumber(),
                recaptchaVerifier
            );

        verificationId =
            confirmationResult.verificationId;

        console.log("OTP Sent");

        showOTPSection();

        startResendTimer();

    } catch (error) {

        console.error(error);

        switch (error.code) {

            case "auth/invalid-phone-number":

                showError("Invalid phone number.");

                break;

            case "auth/too-many-requests":

                showError(
                    "Too many attempts. Please try again later."
                );

                break;

            case "auth/quota-exceeded":

                showError(
                    "OTP quota exceeded. Please try later."
                );

                break;

            default:

                showError(error.message);

        }

    } finally {

        hideLoader();

        enableButton(continueBtn);

    }

}

/* ==========================================================
   RESEND OTP
========================================================== */

async function resendOTP() {

    if (resendOtpBtn.disabled) return;

    try {

        disableButton(
            resendOtpBtn,
            "Sending..."
        );

        showLoader();

        confirmationResult =
            await signInWithPhoneNumber(
                auth,
                getPhoneNumber(),
                recaptchaVerifier
            );

        verificationId =
            confirmationResult.verificationId;

        clearOTP();

        otpInputs[0].focus();

        startResendTimer();

        showSuccess("OTP sent again.");

    } catch (error) {

        console.error(error);

        showError(error.message);

    } finally {

        hideLoader();

        enableButton(resendOtpBtn);

    }

}

/* ==========================================================
   EVENT LISTENERS
========================================================== */

googleLoginBtn.addEventListener(
    "click",
    signInWithGoogle
);

phoneForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        sendOTP();

    }
);

resendOtpBtn.addEventListener(
    "click",
    resendOTP
);
/* ==========================================================
   VIVAHA AI MATRIMONY
   Premium Login Page
   File : login/login.js
   Part 3
   ----------------------------------------------------------
   OTP Verification
   Auth State
   Redirect
   Event Listeners
   App Initialization
   ========================================================== */

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

/* ==========================================================
   VERIFY OTP
========================================================== */

async function verifyOTP() {

    const otp = getOTP();

    if (otp.length !== 6) {

        showError("Please enter the complete 6-digit OTP.");

        return;

    }

    if (!confirmationResult) {

        showError("OTP session expired. Please request a new OTP.");

        hideOTPSection();

        return;

    }

    try {

        disableButton(
            verifyOtpBtn,
            "Verifying..."
        );

        showLoader();

        const result = await confirmationResult.confirm(otp);

        const user = result.user;

        console.log("Phone Login Success:", user);

        showSuccess("Verification successful.");

        // ----------------------------------------------------
        // TODO
        // Check if user profile exists in Firestore.
        //
        // Example:
        // Existing User  -> Dashboard
        // New User       -> Onboarding
        // ----------------------------------------------------

        window.location.href = "../dashboard/";

    } catch (error) {

        console.error(error);

        switch (error.code) {

            case "auth/invalid-verification-code":

                showError("Invalid OTP.");

                break;

            case "auth/code-expired":

                showError("OTP expired. Please request a new OTP.");

                hideOTPSection();

                break;

            default:

                showError(error.message);

        }

        clearOTP();

        otpInputs[0].focus();

    } finally {

        hideLoader();

        enableButton(verifyOtpBtn);

    }

}

/* ==========================================================
   AUTH STATE OBSERVER
========================================================== */

onAuthStateChanged(auth, (user) => {

    if (!user) return;

    console.log("Authenticated:", user.uid);

    // --------------------------------------------------
    // Future:
    // Fetch Firestore profile
    // Redirect based on profile completion
    // --------------------------------------------------

});

/* ==========================================================
   OTP ENTER KEY SUPPORT
========================================================== */

otpInputs.forEach((input) => {

    input.addEventListener("keydown", (event) => {

        if (event.key === "Enter") {

            event.preventDefault();

            verifyOTP();

        }

    });

});

/* ==========================================================
   VERIFY BUTTON
========================================================== */

verifyOtpBtn.addEventListener(
    "click",
    verifyOTP
);

/* ==========================================================
   PREVENT NON-NUMERIC PHONE INPUT
========================================================== */

phoneNumberInput.addEventListener("input", () => {

    phoneNumberInput.value =
        sanitizePhone(phoneNumberInput.value).slice(0, 10);

});

/* ==========================================================
   PREVENT SPACES
========================================================== */

phoneNumberInput.addEventListener("keypress", (event) => {

    if (event.key === " ") {

        event.preventDefault();

    }

});

/* ==========================================================
   WINDOW EVENTS
========================================================== */

window.addEventListener("online", () => {

    console.log("Internet Connected");

});

window.addEventListener("offline", () => {

    showError("No internet connection.");

});

/* ==========================================================
   INITIALIZE APP
========================================================== */

function initializeApp() {

    hideLoader();

    hideOTPSection();

    initializeOTPInputs();

    phoneNumberInput.focus();

    console.log("Vivaha Login Initialized");

}

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);
