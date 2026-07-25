// script.js

/* ==========================================
   VIVAHA SPLASH SCREEN
   Premium Production Ready
========================================== */

"use strict";

const messages = [

    "Building Meaningful Connections...",

    "Finding Your Perfect Match...",

    "Preparing Your Journey...",

    "Welcome To Vivaha ❤"

];

const loadingText = document.getElementById("loadingText");

let index = 0;

const interval = setInterval(() => {

    index++;

    if(index >= messages.length) return;

    loadingText.style.opacity = "0";
    loadingText.style.transform = "translateY(6px)";

    setTimeout(() => {

        loadingText.textContent = messages[index];

        loadingText.style.opacity = "1";
        loadingText.style.transform = "translateY(0)";

    },180);

},1000);

setTimeout(() => {

    clearInterval(interval);

    document.querySelector(".splash-screen").classList.add("fade-out");

    setTimeout(() => {

        window.location.replace("/login/");

    },600);

},3000);

window.addEventListener("wheel",(e)=>{

    e.preventDefault();

},{passive:false});

window.addEventListener("touchmove",(e)=>{

    e.preventDefault();

},{passive:false});

window.addEventListener("keydown",(e)=>{

    const blockedKeys=[32,33,34,35,36,37,38,39,40];

    if(blockedKeys.includes(e.keyCode)){

        e.preventDefault();

    }

});
