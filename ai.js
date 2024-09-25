const cursorDot = document.querySelector(".cursor-dot"); 
const cursorOutline = document.querySelector(".cursor-outline");

window.addEventListener("mousemove", function(e) {
    const posX = e.clientX;
    const posY = e.clientY;
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    cursorOutline.style.left = `${posX}px`;
    cursorOutline.style.top = `${posY}px`;
});

let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");

function speak(text) {
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.volume = 1;
    text_speak.lang = "hi-GB";
    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    let day = new Date();
    let hours = day.getHours();
    if (hours >= 0 && hours < 12) {
        speak("Good Morning Sir");
    } else if (hours >= 12 && hours < 16) {
        speak("Good Afternoon Sir");
    } else {
        speak("Good Evening Sir");
    }
}

window.addEventListener('load', () => {
    wishMe();
});

let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new speechRecognition();

let recognitionTimeout;

recognition.onresult = (event) => {
    clearTimeout(recognitionTimeout);
    let currentIndex = event.resultIndex;
    let transcript = event.results[currentIndex][0].transcript;
    content.innerText = transcript;
    takeCommand(transcript.toLowerCase());
};

btn.addEventListener("click", () => {
    recognition.start();
    voice.style.display = "block";
    btn.style.display = "none";


});

function takeCommand(message) {
    voice.style.display = "none";
    btn.style.display = "flex";



    if (message.includes("hello") || message.includes("hey")) {
        speak("Hello Sir, how can I help you?");
    } else if (message.includes("who are you")) {
        speak("I am a virtual assistant, created by Nishant.");
    } else if (message.includes("open youtube")) {
        speak("Opening YouTube...");
        window.open("https://youtube.com/", "_blank");
    } else if (message.includes("open instagram")) {
        speak("Opening Instagram...");
        window.open("https://instagram.com/", "_blank");
    } else if (message.includes("tell me a joke")) {
        speak("Why don't programmers like nature? It has too many bugs.");
    } else if (message.includes("set reminder")) {
        speak("Sure, what's the reminder?");
    } else if (message.includes("time")) {
        let time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        speak(time);
    } else if (message.includes("date")) {
        let date = new Date().toLocaleString(undefined, { day: "numeric", month: "short" });
        speak(date);
    } else if (message.includes("weather in")) {
        let city = message.split("in")[1].trim();
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=3117d998cbd4164888930c357268e36e`)
            .then(response => {
                if (!response.ok) throw new Error("Weather data not available.");
                return response.json();
            })
            .then(data => {
                let weather = `The weather in ${city} is ${data.weather[0].description} with a temperature of ${Math.round(data.main.temp - 273.15)}°C.`;
                speak(weather);
            })
            .catch(error => {
                speak("Sorry, I couldn't fetch the weather. Please try again later.");
            });
    } else {
        speak(`This is what I found on the internet regarding ${message}`);
        window.open(`https://www.google.com/search?q=${message}`, "_blank");
    }

    // Reset the button state after a short delay
    setTimeout(() => {
        btn.style.display = "flex"; // Show the button
        voice.style.display = "none"; // Hide the voice indicator
        content.innerText = "Click Here to Talk to Me!"; // Reset button text
    }, 2000); // Adjust the timeout duration as needed
}
