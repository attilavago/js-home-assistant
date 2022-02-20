// speech recognition

const dictionary = {
    opening: "Hello, I'm your new home assistant. What's your name?",
    pleasedToMeet: "Pleased to meet you,",
    nameIt: "You can now assign me a name. What would you like my name to be,",
    nameAccepted: "Excellent. From now on you can call me ",
    assistantName: "",
    ownerName: "",
    isCorrect: "Is that correct?",
    affirmative: "Yes",
    negative: "No",
}

const speakButton = document.querySelector('#speak');

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.interimResults = false;
recognition.lang = 'en-US';

let response = "";

let p = document.createElement('p');
const words = document.querySelector('.words');
words.appendChild(p);

recognition.addEventListener('result', e => {
    const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
    response = transcript;
    msg.text = response;
    console.log(msg);

    if (e.results[0].isFinal) {
        p = document.createElement('p');
        words.appendChild(p);
    }
});

const msg = new SpeechSynthesisUtterance();
let voices = [];

function populateVoices() {
    voices = this.getVoices();
    msg.voice = voices[33];
    console.log(msg);
    toggle();
}

function toggle(startOver = true) {
    speechSynthesis.cancel();
    if (startOver) {
        if(dictionary.ownerName === ""){
            msg.text = dictionary.opening;
            speechSynthesis.speak(msg);
            msg.onend = () => {
                recognition.start();
                recognition.onend = () => {
                    dictionary.ownerName = response;
                    if(dictionary.ownerName !== ""){
                        msg.text = dictionary.pleasedToMeet + dictionary.ownerName;
                        document.getElementById("welcomeMessage").innerText = `Hello ${dictionary.ownerName}! I'm your new home assistant!`;
                        speechSynthesis.speak(msg);
                        msg.onend = () => {
                            msg.text = dictionary.nameIt + dictionary.ownerName;
                            speechSynthesis.speak(msg);
                            msg.onend = () => {
                                recognition.start();
                                recognition.onend = () => {
                                    dictionary.assistantName = response;
                                    document.getElementById("welcomeMessage").innerText = `Hello ${dictionary.ownerName}! I'm ${dictionary.assistantName}, your home assistant!`;
                                    msg.text = dictionary.nameAccepted + dictionary.assistantName;
                                    speechSynthesis.speak(msg);
                                    msg.onend = () => {
                                        speechSynthesis.pause();
                                        recognition.start();
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

speakButton.addEventListener('click', toggle);

speechSynthesis.addEventListener('voiceschanged', populateVoices);


//speechSynthesis.addEventListener('voiceschanged', populateVoices);
//recognition.addEventListener('end', assisstantSpeak);
