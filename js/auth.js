// Authentication utility functions
const auth = {
    isAuthenticated: () => {
        return localStorage.getItem('user') !== null;
    },

    getUserRole: () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.role || null;
    },

    checkAuth: () => {
        // Always redirect to login if not authenticated
        if (!auth.isAuthenticated()) {
            // Store the intended destination
            const currentPath = window.location.hash.slice(1);
            if (currentPath && currentPath !== 'login') {
                localStorage.setItem('redirectUrl', currentPath);
            }
            window.location.href = 'index.html#login';
            return false;
        }
        return true;
    },

    checkTeacherAuth: () => {
        if (!auth.isAuthenticated() || auth.getUserRole() !== 'teacher') {
            router.navigate('login');
            return false;
        }
        return true;
    },

    login: (username, password) => {
        // Simulate login - replace with actual API call
        let user = null;
        if (username === 'teacher' && password === 'teacher123') {
            user = { username, role: 'teacher' };
        } else if (username === 'student' && password === 'student123') {
            user = { username, role: 'student' };
        }

        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            // Get stored destination or default to user role
            const redirectUrl = localStorage.getItem('redirectUrl') || user.role;
            localStorage.removeItem('redirectUrl');
            window.location.href = `index.html#${redirectUrl}`;
            return true;
        }
        return false;
    },

    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('redirectUrl');
        window.location.href = 'index.html#login';
    },

    register: (userData) => {
        // Validate seat number format
        if (!utils.validateInput(userData.seat, 'seat')) {
            throw new Error('Seat number must be 1-4 digits');
        }

        // Validate username format
        if (!utils.validateInput(userData.username, 'username')) {
            throw new Error('Username must be 3-20 characters and contain only letters, numbers, and underscores');
        }

        // Validate password
        if (!utils.validateInput(userData.password, 'password')) {
            throw new Error('Password must be at least 6 characters long');
        }

        // Check if passwords match
        if (userData.password !== userData.confirmPassword) {
            throw new Error('Passwords do not match');
        }

        // In a real application, you would make an API call here
        // For now, we'll store in localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if username already exists
        if (users.some(user => user.username === userData.username)) {
            throw new Error('Username already exists');
        }

        // Check if seat number already exists
        if (users.some(user => user.seat === userData.seat)) {
            throw new Error('Seat number already registered');
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            username: userData.username,
            seat: userData.seat,
            role: userData.role,
            password: userData.password // In real app, this should be hashed
        };

        // Add to users array
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        return newUser;
    }
};

// Check authentication on every page load
document.addEventListener('DOMContentLoaded', () => {
    // Get current view from hash
    const currentView = window.location.hash.slice(1) || 'login';
    
    // If not on login page and not authenticated, redirect to login
    if (currentView !== 'login' && !auth.isAuthenticated()) {
        auth.checkAuth();
    }
}); 