// Voice recognition setup and shared utilities
class VoiceController {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.commands = {};
        this.voiceToggle = document.getElementById('voice-toggle');
        this.voiceFeedback = document.getElementById('voice-feedback');
        this.voiceStatusText = document.getElementById('voice-status-text');
        this.availableCommands = document.getElementById('available-commands');
        
        this.initializeVoiceRecognition();
        this.setupEventListeners();
    }

    initializeVoiceRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateVoiceStatus('Listening...');
                this.voiceToggle.classList.add('listening');
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.updateVoiceStatus('Voice commands paused');
                this.voiceToggle.classList.remove('listening');
            };

            this.recognition.onresult = (event) => {
                const command = event.results[0][0].transcript.toLowerCase();
                console.log('Heard command:', command);
                this.processCommand(command);
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.updateVoiceStatus('Error: ' + event.error);
                this.voiceToggle.classList.remove('listening');
            };
        } else {
            console.error('Speech recognition not supported');
            this.updateVoiceStatus('Speech recognition not supported');
        }
    }

    setupEventListeners() {
        if (this.voiceToggle) {
            this.voiceToggle.addEventListener('click', () => {
                this.toggleVoiceRecognition();
            });
        }
    }

    toggleVoiceRecognition() {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
        if (this.voiceFeedback) {
            this.voiceFeedback.style.display = this.isListening ? 'block' : 'none';
        }
    }

    startListening() {
        if (this.recognition) {
            try {
                this.recognition.start();
                this.isListening = true;
            } catch (error) {
                console.error('Error starting recognition:', error);
            }
        }
    }

    stopListening() {
        if (this.recognition) {
            try {
                this.recognition.stop();
                this.isListening = false;
            } catch (error) {
                console.error('Error stopping recognition:', error);
            }
        }
    }

    updateVoiceStatus(message) {
        if (this.voiceStatusText) {
            this.voiceStatusText.textContent = message;
        }
        console.log('Voice status:', message);
    }

    registerCommands(newCommands) {
        this.commands = { ...this.commands, ...newCommands };
        this.updateAvailableCommands();
        console.log('Registered commands:', this.commands);
    }

    updateAvailableCommands() {
        if (this.availableCommands) {
            this.availableCommands.innerHTML = '';
            Object.keys(this.commands).forEach(command => {
                const li = document.createElement('li');
                li.textContent = command;
                this.availableCommands.appendChild(li);
            });
        }
    }

    processCommand(command) {
        console.log('Processing command:', command);
        
        // Clean the command by removing punctuation and extra spaces
        const cleanCommand = command.trim().toLowerCase().replace(/[.,!?]/g, '');
        console.log('Cleaned command:', cleanCommand);

        // Check for exact matches first
        if (this.commands[cleanCommand]) {
            console.log('Executing command:', cleanCommand);
            this.commands[cleanCommand]();
            return;
        }

        // Check for wildcard commands
        for (let pattern in this.commands) {
            if (pattern.includes('*')) {
                // Clean the pattern as well
                const cleanPattern = pattern.trim().toLowerCase();
                const regex = new RegExp('^' + cleanPattern.replace('*', '(.+)') + '$');
                const match = cleanCommand.match(regex);
                if (match) {
                    console.log('Executing wildcard command:', pattern, 'with value:', match[1]);
                    this.commands[pattern](match[1]);
                    return;
                }
            }
        }

        this.updateVoiceStatus('Command not recognized: ' + cleanCommand);
    }
}

// Utility functions
const utils = {
    formatDate(date) {
        return new Date(date).toLocaleDateString();
    },

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Add to document
        document.body.appendChild(notification);

        // Remove after delay
        setTimeout(() => {
            notification.remove();
        }, 3000);
    },

    validateInput(input, type) {
        const patterns = {
            seat: /^[0-9]{1,4}$/,
            username: /^[a-zA-Z0-9_]{3,20}$/,
            password: /^.{6,}$/
        };

        return patterns[type] ? patterns[type].test(input) : false;
    }
};

// Add this after the VoiceController class
class ThemeController {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = this.themeToggle.querySelector('i');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
        this.setupEventListeners();
    }

    init() {
        // Apply saved theme
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateIcon();
    }

    setupEventListeners() {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        this.updateIcon();
    }

    updateIcon() {
        // Update icon based on current theme
        this.themeIcon.className = this.currentTheme === 'light' 
            ? 'fas fa-moon'  // Show moon for light mode (clicking will switch to dark)
            : 'fas fa-sun';  // Show sun for dark mode (clicking will switch to light)
    }
}

// Initialize theme controller
document.addEventListener('DOMContentLoaded', () => {
    window.themeController = new ThemeController();
    window.voiceController = new VoiceController();
    
    // Register page-specific commands if they exist
    if (typeof commands !== 'undefined') {
        window.voiceController.registerCommands(commands);
    }
});

// Export utilities for use in other files
window.utils = utils; 