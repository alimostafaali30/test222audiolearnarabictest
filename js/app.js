// Voice recognition setup and shared utilities
class VoiceController {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.commands = { en: {}, ar: {} };
        this.currentLang = 'en';
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
            this.recognition.lang = this.currentLang === 'ar' ? 'ar-SA' : 'en-US';

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
            if (this.voiceFeedback) {
                this.voiceFeedback.style.display = 'block';
            }
        }
        console.log('Voice status:', message);
    }

    registerCommands(newCommands) {
        // Handle both language commands
        if (newCommands.en) {
            this.commands.en = { ...(this.commands.en || {}), ...newCommands.en };
            this.commands.ar = { ...(this.commands.ar || {}), ...newCommands.ar };
        } else {
            // For backward compatibility
            this.commands = { ...this.commands, ...newCommands };
        }
        this.updateAvailableCommands();
        console.log('Registered commands for current language:', 
            this.currentLang === 'ar' ? this.commands.ar : this.commands.en);
    }

    updateAvailableCommands() {
        if (this.availableCommands) {
            this.availableCommands.innerHTML = '';
            const currentCommands = this.currentLang === 'ar' ? 
                this.commands.ar : this.commands.en;
            Object.keys(currentCommands).forEach(command => {
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

        // Get commands for current language
        const currentCommands = this.currentLang === 'ar' ? 
            this.commands.ar : this.commands.en;
        console.log('Available commands:', currentCommands);

        // Check for exact matches first
        if (currentCommands && currentCommands[cleanCommand]) {
            console.log('Executing command:', cleanCommand);
            currentCommands[cleanCommand]();
            return;
        }

        // Check for wildcard commands
        if (currentCommands) {
            for (let pattern in currentCommands) {
                if (pattern.includes('*')) {
                    const cleanPattern = pattern.trim().toLowerCase();
                    const regex = new RegExp('^' + cleanPattern.replace('*', '(.+)') + '$');
                    const match = cleanCommand.match(regex);
                    if (match) {
                        console.log('Executing wildcard command:', pattern, 'with value:', match[1]);
                        currentCommands[pattern](match[1]);
                        return;
                    }
                }
            }
        }

        this.updateVoiceStatus(
            window.langController ? 
                window.langController.getText('commandNotRecognized') + ' ' + cleanCommand :
                'Command not recognized: ' + cleanCommand
        );
    }

    setLanguage(lang) {
        this.currentLang = lang;
        if (this.recognition) {
            // Stop current recognition if it's running
            if (this.isListening) {
                this.stopListening();
            }
            this.recognition.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
            // Restart if it was listening
            if (this.isListening) {
                this.startListening();
            }
        }
        this.updateAvailableCommands();
        console.log('Voice recognition language set to:', this.recognition.lang);
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

// Add this after the ThemeController class
class LanguageController {
    constructor() {
        this.langToggle = document.getElementById('lang-toggle');
        this.currentLang = localStorage.getItem('lang') || 'en';
        this.translations = {
            en: {
                welcome: 'Welcome Back',
                subtitle: 'Please login to continue',
                username: 'Username',
                password: 'Password',
                login: 'Login',
                register: 'Register',
                createAccount: 'Create Account',
                seatNumber: 'Seat Number',
                confirmPassword: 'Confirm Password',
                role: 'Role',
                student: 'Student',
                teacher: 'Teacher',
                cancel: 'Cancel',
                platformName: 'Voice Learning Platform',
                listening: 'Listening...',
                voiceCommandsPaused: 'Voice commands paused',
                availableCommands: 'Available commands:',
                commandNotRecognized: 'Command not recognized:'
            },
            ar: {
                welcome: 'مرحباً بعودتك',
                subtitle: 'الرجاء تسجيل الدخول للمتابعة',
                username: 'اسم المستخدم',
                password: 'كلمة المرور',
                login: 'تسجيل الدخول',
                register: 'تسجيل',
                createAccount: 'إنشاء حساب',
                seatNumber: 'رقم المقعد',
                confirmPassword: 'تأكيد كلمة المرور',
                role: 'الدور',
                student: 'طالب',
                teacher: 'معلم',
                cancel: 'إلغاء',
                platformName: 'منصة التعلم الصوتي',
                listening: 'جاري الاستماع...',
                voiceCommandsPaused: 'تم إيقاف الأوامر الصوتية',
                availableCommands: 'الأوامر المتاحة:',
                commandNotRecognized: 'لم يتم التعرف على الأمر:'
            }
        };
        
        this.init();
        this.setupEventListeners();
    }

    init() {
        document.documentElement.setAttribute('lang', this.currentLang);
        document.documentElement.setAttribute('dir', this.currentLang === 'ar' ? 'rtl' : 'ltr');
        this.updateTexts();
    }

    setupEventListeners() {
        this.langToggle.addEventListener('click', () => this.toggleLanguage());
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
        localStorage.setItem('lang', this.currentLang);
        document.documentElement.setAttribute('lang', this.currentLang);
        document.documentElement.setAttribute('dir', this.currentLang === 'ar' ? 'rtl' : 'ltr');
        if (window.voiceController) {
            window.voiceController.setLanguage(this.currentLang);
        }
        this.updateTexts();
    }

    updateTexts() {
        const texts = this.translations[this.currentLang];
        
        // Update all text elements
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (texts[key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
                    element.placeholder = texts[key];
                } else {
                    element.textContent = texts[key];
                }
            }
        });

        // Update document title
        document.title = texts.platformName;
        
        // Update nav brand
        document.querySelector('.nav-brand').textContent = texts.platformName;
    }

    getText(key) {
        return this.translations[this.currentLang][key];
    }
}

// Initialize controllers
document.addEventListener('DOMContentLoaded', () => {
    window.themeController = new ThemeController();
    window.langController = new LanguageController();
    window.voiceController = new VoiceController();
    
    // Register page-specific commands if they exist
    if (typeof commands !== 'undefined') {
        window.voiceController.registerCommands(commands);
    }
});

// Export utilities for use in other files
window.utils = utils; 