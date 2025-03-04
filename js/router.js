// Router for handling view changes
const router = {
    currentView: null,
    views: {
        'login': document.getElementById('login-view'),
        'teacher': document.getElementById('teacher-view'),
        'student': document.getElementById('student-view'),
        'test': document.getElementById('test-view'),
        'game': document.getElementById('game-view')
    },

    init() {
        // Initial route check
        const view = this.getViewFromPath();
        
        // If not authenticated and not on login page, redirect to login
        if (view !== 'login' && !auth.isAuthenticated()) {
            auth.checkAuth();
            return;
        }

        this.showView(view);

        // Handle browser back/forward buttons
        window.addEventListener('popstate', (event) => {
            const newView = this.getViewFromPath();
            if (newView !== 'login' && !auth.isAuthenticated()) {
                auth.checkAuth();
                return;
            }
            this.showView(newView);
        });
    },

    getViewFromPath() {
        const path = window.location.hash.slice(1) || 'login';
        return path.split('/')[0];
    },

    showView(viewName) {
        // Always check authentication except for login page
        if (viewName !== 'login' && !auth.isAuthenticated()) {
            auth.checkAuth();
            return;
        }

        // Hide all views
        Object.values(this.views).forEach(view => {
            if (view) view.style.display = 'none';
        });

        // Show requested view
        const view = this.views[viewName];
        if (view) {
            view.style.display = 'block';
            this.currentView = viewName;
            this.updateNavButtons();
            this.initializeView(viewName);
        }
    },

    navigate(viewName, params = {}) {
        // Don't navigate to the same view
        if (this.currentView === viewName) return;

        // Update URL without triggering popstate
        window.location.hash = viewName;
        
        // Show view
        this.showView(viewName);
    },

    updateNavButtons() {
        const navButtons = document.getElementById('nav-buttons');
        navButtons.innerHTML = '';

        if (this.currentView !== 'login') {
            // Add logout button
            const logoutBtn = document.createElement('button');
            logoutBtn.className = 'icon-btn';
            logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
            logoutBtn.onclick = () => auth.logout();
            navButtons.appendChild(logoutBtn);

            // Add back button for test and game views
            if (this.currentView === 'test' || this.currentView === 'game') {
                const backBtn = document.createElement('button');
                backBtn.className = 'icon-btn';
                backBtn.innerHTML = '<i class="fas fa-arrow-left"></i>';
                backBtn.onclick = () => window.history.back();
                navButtons.insertBefore(backBtn, logoutBtn);
            }
        }
    },

    initializeView(viewName) {
        switch (viewName) {
            case 'teacher':
                if (typeof loadSubjects === 'function') loadSubjects();
                break;
            case 'student':
                if (typeof loadAvailableTests === 'function') loadAvailableTests();
                break;
            case 'test':
                if (typeof loadTest === 'function') loadTest(params.id);
                break;
            case 'game':
                if (typeof loadGame === 'function') loadGame(params.id);
                break;
        }
    }
};

// Initialize router when document is ready
document.addEventListener('DOMContentLoaded', () => {
    router.init();
}); 