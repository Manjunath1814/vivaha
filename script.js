const messages = [

    "Building Meaningful Connections...",

    "Finding Your Perfect Match...",

    "Preparing Your Journey...",

    "Welcome To Vivaha ❤️"

];

let index = 0;

const loadingText = document.getElementById("loadingText");

const interval = setInterval(() => {

    index++;

    if(index < messages.length){

        loadingText.innerText = messages[index];

    }

},750);

setTimeout(()=>{

    clearInterval(interval);

    window.location.href="login/";

},3000);
