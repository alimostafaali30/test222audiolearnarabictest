document.addEventListener('DOMContentLoaded', () => {
    const availableTests = document.getElementById('available-tests');
    const logoutBtn = document.getElementById('logout-btn');

    // Voice commands for student dashboard
    const commands = {
        'start test *': (testName) => startTest(testName),
        'start game *': (gameName) => startGame(gameName),
        'logout': () => handleLogout()
    };

    function loadAvailableTests() {
        // Example test data - replace with actual data from your backend
        const tests = [
            { id: 1, name: 'Math Test 1', type: 'test' },
            { id: 2, name: 'English Quiz', type: 'game' }
        ];

        tests.forEach(test => {
            const testElement = createTestElement(test);
            availableTests.appendChild(testElement);
        });
    }

    function createTestElement(test) {
        const div = document.createElement('div');
        div.className = 'test-card';
        div.innerHTML = `
            <h3>${test.name}</h3>
            <button class="start-btn" data-id="${test.id}" data-type="${test.type}">
                Start ${test.type}
            </button>
        `;
        return div;
    }

    function startTest(testId) {
        window.location.href = `test.html?id=${testId}`;
    }

    function startGame(gameId) {
        window.location.href = `game.html?id=${gameId}`;
    }

    function handleLogout() {
        window.location.href = 'index.html';
    }

    // Initialize
    loadAvailableTests();

    // Event Listeners
    logoutBtn.addEventListener('click', handleLogout);
    availableTests.addEventListener('click', (e) => {
        if (e.target.classList.contains('start-btn')) {
            const { id, type } = e.target.dataset;
            if (type === 'test') startTest(id);
            else startGame(id);
        }
    });
}); 