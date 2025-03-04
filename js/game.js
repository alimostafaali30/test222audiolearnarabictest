document.addEventListener('DOMContentLoaded', () => {
    const levelInfo = document.getElementById('level-info');
    const questionContainer = document.getElementById('question-container');
    const optionsContainer = document.getElementById('game-options-container');
    const playQuestionBtn = document.getElementById('play-question');
    const playOptionsBtn = document.getElementById('play-options');
    const backBtn = document.getElementById('back-btn');

    let currentLevel = 1;
    let currentQuestion = null;

    // Voice commands for game interface
    const commands = {
        'select option *': (number) => selectOption(number),
        'next question': () => nextQuestion(),
        'repeat question': () => playQuestion(),
        'play options': () => playOptions()
    };

    function loadGame() {
        // Get game ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const gameId = urlParams.get('id');
        
        // Load game data based on ID
        loadGameData(gameId);
    }

    function loadGameData(gameId) {
        // Example game data - replace with actual data from your backend
        const question = {
            text: 'What is 2 + 2?',
            options: ['3', '4', '5', '6'],
            correctAnswer: 1
        };
        
        displayQuestion(question);
    }

    function displayQuestion(question) {
        currentQuestion = question;
        questionContainer.textContent = question.text;
        
        optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.dataset.index = index;
            optionsContainer.appendChild(button);
        });
    }

    function playQuestion() {
        // Implement text-to-speech for question
        if (currentQuestion) {
            const speech = new SpeechSynthesisUtterance(currentQuestion.text);
            window.speechSynthesis.speak(speech);
        }
    }

    function playOptions() {
        // Implement text-to-speech for options
        if (currentQuestion) {
            currentQuestion.options.forEach((option, index) => {
                const speech = new SpeechSynthesisUtterance(`Option ${index + 1}: ${option}`);
                window.speechSynthesis.speak(speech);
            });
        }
    }

    function selectOption(index) {
        // Handle option selection
        console.log(`Selected option ${index}`);
    }

    function nextQuestion() {
        currentLevel++;
        levelInfo.textContent = `Level ${currentLevel}`;
        loadGameData(); // Load next question
    }

    // Initialize
    loadGame();

    // Event Listeners
    playQuestionBtn.addEventListener('click', playQuestion);
    playOptionsBtn.addEventListener('click', playOptions);
    backBtn.addEventListener('click', () => {
        window.location.href = 'student-dashboard.html';
    });
    optionsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('option-btn')) {
            selectOption(e.target.dataset.index);
        }
    });
}); 