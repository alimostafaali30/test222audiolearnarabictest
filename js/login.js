// Login page functionality
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const voiceToggle = document.getElementById('voice-toggle');
    const voiceFeedback = document.getElementById('voice-feedback');
    const registerForm = document.getElementById('register-form');
    const cancelRegisterBtn = document.getElementById('cancel-register');
    const registerModal = document.getElementById('register-modal');

    // Voice command setup
    const commands = {
        'login': () => handleLogin(),
        'log in': () => handleLogin(),
        'sign in': () => handleLogin(),
        'register': () => showRegisterModal(),
        'sign up': () => showRegisterModal(),
        'username *': (name) => usernameInput.value = name,
        'user *': (name) => usernameInput.value = name,
        'password *': (pass) => passwordInput.value = pass,
        'pass *': (pass) => passwordInput.value = pass,
        'cancel': () => hideRegisterModal(),
        'close': () => hideRegisterModal(),
        'dark mode': () => window.themeController.currentTheme === 'light' && window.themeController.toggleTheme(),
        'light mode': () => window.themeController.currentTheme === 'dark' && window.themeController.toggleTheme()
    };

    // Register commands with voice controller
    if (window.voiceController) {
        window.voiceController.registerCommands(commands);
    }

    function handleLogin(event) {
        if (event) event.preventDefault();
        
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (!username || !password) {
            alert('Please enter both username and password');
            return;
        }

        if (auth.login(username, password)) {
            // Login successful - redirect handled by auth.login
        } else {
            alert('Invalid credentials!\nTry:\nTeacher: teacher/teacher123\nStudent: student/student123');
        }
    }

    function handleRegister(e) {
        e.preventDefault();
        
        const userData = {
            username: document.getElementById('reg-username').value,
            seat: document.getElementById('reg-seat').value,
            password: document.getElementById('reg-password').value,
            confirmPassword: document.getElementById('reg-confirm-password').value,
            role: document.getElementById('reg-role').value
        };

        try {
            const user = auth.register(userData);
            utils.showNotification('Registration successful! Please login.', 'success');
            registerModal.style.display = 'none';
            registerForm.reset();
        } catch (error) {
            utils.showNotification(error.message, 'error');
        }
    }

    function showRegisterModal() {
        registerModal.style.display = 'block';
    }

    function hideRegisterModal() {
        registerModal.style.display = 'none';
        registerForm.reset();
    }

    // Event Listeners
    loginForm.addEventListener('submit', handleLogin);
    registerBtn.addEventListener('click', showRegisterModal);
    cancelRegisterBtn.addEventListener('click', hideRegisterModal);
    registerForm.addEventListener('submit', handleRegister);

    // Close modal when clicking outside
    registerModal.addEventListener('click', (e) => {
        if (e.target === registerModal) {
            hideRegisterModal();
        }
    });

    voiceToggle.addEventListener('click', () => {
        voiceFeedback.style.display = 
            voiceFeedback.style.display === 'none' ? 'block' : 'none';
    });
});