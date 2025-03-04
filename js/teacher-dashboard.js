document.addEventListener('DOMContentLoaded', () => {
    // First check if user is a teacher
    if (!auth.checkTeacherAuth()) return;

    const subjectsList = document.getElementById('subjects-list');
    const addSubjectModal = document.getElementById('add-subject-modal');
    const addQuestionsModal = document.getElementById('add-questions-modal');
    const scoresView = document.getElementById('scores-view');

    let currentSubjects = [];
    let currentQuestions = [];

    // Load subjects
    function loadSubjects() {
        // Example data - replace with API call
        currentSubjects = [
            { id: 1, name: 'Mathematics', questionCount: 100 },
            { id: 2, name: 'English', questionCount: 75 }
        ];
        displaySubjects();
    }

    function displaySubjects() {
        subjectsList.innerHTML = '';
        currentSubjects.forEach(subject => {
            const subjectCard = document.createElement('div');
            subjectCard.className = 'subject-card';
            subjectCard.innerHTML = `
                <h3>${subject.name}</h3>
                <p>Total Questions: ${subject.questionCount}</p>
                <div class="subject-actions">
                    <button onclick="viewQuestions(${subject.id})">View Questions</button>
                    <button onclick="configureTest(${subject.id})">Configure Test</button>
                    <button onclick="viewScores(${subject.id})">View Scores</button>
                </div>
            `;
            subjectsList.appendChild(subjectCard);
        });
    }

    function addSubject(name) {
        // API call to add subject
        const newSubject = {
            id: Date.now(),
            name: name,
            questionCount: 0
        };
        currentSubjects.push(newSubject);
        displaySubjects();
    }

    function addQuestions(subjectId, questions) {
        // API call to add questions
        currentQuestions = [...currentQuestions, ...questions];
        const subject = currentSubjects.find(s => s.id === subjectId);
        if (subject) {
            subject.questionCount += questions.length;
            displaySubjects();
        }
    }

    function configureTest(subjectId) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Configure Test</h2>
                <div class="form-group">
                    <label>Number of Questions:</label>
                    <input type="number" id="questionCount" min="1" 
                           max="${currentSubjects.find(s => s.id === subjectId)?.questionCount || 100}">
                </div>
                <div class="form-group">
                    <label>Time Limit (minutes):</label>
                    <input type="number" id="timeLimit" min="1">
                </div>
                <button onclick="saveTestConfig(${subjectId})">Save Configuration</button>
                <button onclick="closeModal()">Cancel</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    function saveTestConfig(subjectId) {
        const questionCount = document.getElementById('questionCount').value;
        const timeLimit = document.getElementById('timeLimit').value;
        
        // Save test configuration
        const config = {
            subjectId,
            questionCount: parseInt(questionCount),
            timeLimit: parseInt(timeLimit),
            randomize: true
        };
        
        // API call to save configuration
        console.log('Saving test config:', config);
        closeModal();
    }

    function viewScores(subjectId) {
        // API call to get scores
        const scores = [
            { student: 'John Doe', score: 85, date: '2024-03-10' },
            { student: 'Jane Smith', score: 92, date: '2024-03-10' }
        ];

        scoresView.innerHTML = `
            <h3>${currentSubjects.find(s => s.id === subjectId)?.name} - Scores</h3>
            <table class="scores-table">
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Score</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${scores.map(score => `
                        <tr>
                            <td>${score.student}</td>
                            <td>${score.score}%</td>
                            <td>${score.date}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        scoresView.style.display = 'block';
    }

    // Event Listeners
    document.getElementById('add-subject-btn').addEventListener('click', () => {
        const name = prompt('Enter subject name:');
        if (name) addSubject(name);
    });

    document.getElementById('add-questions-btn').addEventListener('click', () => {
        // Show question addition form
        addQuestionsModal.style.display = 'block';
    });

    // Initialize
    loadSubjects();
}); 