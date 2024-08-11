const startButton = document.getElementById('startButton');
const statusElement = document.getElementById('status');
const outputElement = document.getElementById('output');

let recognition;
let isRecording = false;

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        isRecording = true;
        statusElement.textContent = 'Recording started. You can speak now.';
        outputElement.textContent = '';
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        outputElement.textContent = transcript;

       
        saveTextToDatabase(transcript);
    };

    recognition.onspeechend = () => {
        // Do nothing on speech end, let the 15 seconds timer handle stopping.
    };

    recognition.onerror = (event) => {
        statusElement.textContent = 'An error occurred during recording: ' + event.error;
        isRecording = false;
    };

    startButton.addEventListener('click', () => {
        if (isRecording) {
            recognition.stop();
            isRecording = false;
            statusElement.textContent = 'Recording stopped.';
        } else {
            recognition.start();
            setTimeout(() => {
                if (isRecording) {
                    recognition.stop();
                    statusElement.textContent = 'Recording ended after 15 seconds.';
                    isRecording = false;
                }
            }, 15000); // 15 seconds
        }
    });
} else {
    statusElement.textContent = 'Your browser does not support Web Speech API';
}

function saveTextToDatabase(text) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'save_text.php', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log('Text saved to database: ' + xhr.responseText);
        } else {
            console.error('Error saving text: ' + xhr.statusText);
        }
    };
    xhr.send('text=' + encodeURIComponent(text));
}
