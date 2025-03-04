document.addEventListener('DOMContentLoaded', () => {
    const subjectName = document.getElementById('subject-name');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('test-options-container');
    const progressIndicator = document.getElementById('progress-indicator');
    const repeatQuestionBtn = document.getElementById('repeat-question');
    const voiceAnswerBtn = document.getElementById('voice-answer');
    const backBtn = document.getElementById('back-btn');

    let currentQuestion = 0;
    let questions = [];

    // Voice commands for test interface
    const commands = {
        'select answer *': (number) => selectAnswer(number),
        'next question': () => nextQuestion(),
        'repeat question': () => repeatQuestion(),
        'finish test': () => finishTest()
    };

    function loadTest() {
        // Get test ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const testId = urlParams.get('id');
        
        // Load test data based on ID
        loadTestData(testId);
    }

    function loadTestData(testId) {
        // Example test data - replace with actual data from your backend
        subjectName.textContent = 'Mathematics';
        questions = [
            {
                question: 'What is 5 × 7?',
                options: ['25', '35', '40', '45'],
                correctAnswer: 1
            }
            // Add more questions
        ];
        
        displayQuestion();
        updateProgress();
    }

    function displayQuestion() {
        const question = questions[currentQuestion];
        questionText.textContent = question.question;
        
        optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.dataset.index = index;
            optionsContainer.appendChild(button);
        });
    }

    function updateProgress() {
        progressIndicator.textContent = 
            `Question ${currentQuestion + 1} of ${questions.length}`;
    }

    function selectAnswer(index) {
        // Handle answer selection
        console.log(`Selected answer ${index}`);
        // Move to next question after brief delay
        setTimeout(nextQuestion, 1000);
    }

    function nextQuestion() {
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            displayQuestion();
            updateProgress();
        } else {
            finishTest();
        }
    }

    function repeatQuestion() {
        const speech = new SpeechSynthesisUtterance(
            questions[currentQuestion].question
        );
        window.speechSynthesis.speak(speech);
    }

    function finishTest() {
        // Calculate and display results
        console.log('Test completed');
        window.location.href = 'student-dashboard.html';
    }

    // Initialize
    loadTest();

    // Event Listeners
    repeatQuestionBtn.addEventListener('click', repeatQuestion);
    voiceAnswerBtn.addEventListener('click', () => {
        // Implement voice answer activation
        console.log('Voice answer activated');
    });
    backBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to exit the test?')) {
            window.location.href = 'student-dashboard.html';
        }
    });
    optionsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('option-btn')) {
            selectAnswer(e.target.dataset.index);
        }
    });
}); 