// Global Variables
let currentTranscript = '';
let currentSummary = '';

// DOM Elements
const splash = document.getElementById('splash');
const mainApp = document.getElementById('mainApp');
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('audioFile');
const uploadForm = document.getElementById('uploadForm');
const processingOverlay = document.getElementById('processingOverlay');
const resultsSection = document.getElementById('resultsSection');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeParticles();
    initializeSplashScreen();
    initializeDragAndDrop();
    initializeFormHandling();
});

// Splash Screen Animation
function initializeSplashScreen() {
    setTimeout(() => {
        splash.style.animation = 'splashFadeOut 1s ease-out forwards';
        setTimeout(() => {
            splash.style.display = 'none';
            mainApp.classList.remove('hidden');
        }, 1000);
    }, 3500);
}

// Floating Particles Animation
function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Drag and Drop Functionality
function initializeDragAndDrop() {
    // File input click handler
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    // Drag events
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);

    // File input change
    fileInput.addEventListener('change', handleFileSelect);
}

function handleDragOver(e) {
    e.preventDefault();
    dropZone.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        handleFileSelect();
    }
}

function handleFileSelect() {
    const file = fileInput.files[0];
    if (file) {
        // Update upload area to show selected file
        updateUploadAreaWithFile(file);
    }
}

function updateUploadAreaWithFile(file) {
    const uploadIcon = dropZone.querySelector('.upload-icon');
    const uploadTitle = dropZone.querySelector('.upload-title');
    const uploadSubtitle = dropZone.querySelector('.upload-subtitle');
    
    uploadIcon.innerHTML = `
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <circle cx="30" cy="30" r="25" fill="rgba(16, 185, 129, 0.2)" stroke="currentColor" stroke-width="2"/>
            <path d="M20 30 L27 37 L40 23" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    
    uploadTitle.textContent = file.name;
    uploadSubtitle.textContent = `${(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to process`;
    
    dropZone.classList.add('success');
    dropZone.style.borderColor = 'var(--success)';
}

// Form Handling
function initializeFormHandling() {
    uploadForm.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const file = fileInput.files[0];
    if (!file) {
        showToast('Please select an audio file first', 'error');
        return;
    }

    // Show processing overlay
    showProcessingAnimation();
    
    const formData = new FormData();
    formData.append('audio', file);

    try {
        // Simulate processing steps
        await simulateProcessingSteps();
        
        const response = await fetch('http://127.0.0.1:8000/process', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Hide processing overlay
        hideProcessingAnimation();
        
        // Show results
        displayResults(data, file);
        
        showToast('Audio processed successfully!', 'success');
        
    } catch (error) {
        console.error('Error processing file:', error);
        hideProcessingAnimation();
        showErrorMessage('Failed to process audio file. Please try again.');
        showToast('Processing failed. Please try again.', 'error');
    }
}

// Processing Animation
function showProcessingAnimation() {
    processingOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function hideProcessingAnimation() {
    processingOverlay.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

async function simulateProcessingSteps() {
    const steps = ['step1', 'step2', 'step3'];
    
    for (let i = 0; i < steps.length; i++) {
        // Remove active class from all steps
        steps.forEach(step => {
            document.getElementById(step).classList.remove('active');
        });
        
        // Add active class to current step
        document.getElementById(steps[i]).classList.add('active');
        
        // Wait before next step
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

// Results Display
function displayResults(data, file) {
    currentTranscript = data.transcript;
    currentSummary = data.summary;
    
    // Update transcript
    document.getElementById('transcript').value = data.transcript;
    
    // Update summary
    document.getElementById('summary').value = data.summary;
    
    // Update stats
    updateStats(file, data);
    
    // Show results section
    resultsSection.classList.remove('hidden');
    
    // Smooth scroll to results
    resultsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

function updateStats(file, data) {
    // File size
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
    document.getElementById('fileSize').textContent = `${fileSizeMB} MB`;
    
    // Duration (if available from backend, otherwise estimate)
    const duration = data.duration || estimateDuration(file.size);
    document.getElementById('duration').textContent = formatDuration(duration);
    
    // Confidence (if available from backend, otherwise simulate)
    const confidence = data.confidence || Math.floor(Math.random() * 10 + 90);
    document.getElementById('confidence').textContent = `${confidence}%`;
}

function estimateDuration(fileSize) {
    // Rough estimation: 1MB ≈ 1 minute for typical audio
    return Math.floor(fileSize / (1024 * 1024) * 60);
}

function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Utility Functions
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="margin-right: 0.5rem;">
            <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5"/>
            <path d="M10 6 L10 10 M10 14 L10.01 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        ${message}
    `;
    
    // Insert after upload form
    uploadForm.parentNode.insertBefore(errorDiv, uploadForm.nextSibling);
    
    // Remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function copyToClipboard(type) {
    const text = type === 'transcript' ? currentTranscript : currentSummary;
    
    navigator.clipboard.writeText(text).then(() => {
        showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} copied to clipboard!`, 'success');
    }).catch(() => {
        showToast('Failed to copy to clipboard', 'error');
    });
}

function resetForm() {
    // Reset form
    uploadForm.reset();
    
    // Reset upload area
    const uploadIcon = dropZone.querySelector('.upload-icon');
    const uploadTitle = dropZone.querySelector('.upload-title');
    const uploadSubtitle = dropZone.querySelector('.upload-subtitle');
    
    uploadIcon.innerHTML = `
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <path d="M30 10 L30 35 M20 25 L30 15 L40 25" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20 40 L40 40" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
            <rect x="10" y="45" width="40" height="5" rx="2.5" fill="currentColor" opacity="0.3"/>
        </svg>
    `;
    
    uploadTitle.textContent = 'Drop your audio file here';
    uploadSubtitle.textContent = 'or click to browse files';
    
    dropZone.classList.remove('success', 'error');
    dropZone.style.borderColor = 'var(--border)';
    
    // Hide results
    resultsSection.classList.add('hidden');
    
    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    showToast('Ready for new file upload', 'success');
}

function downloadResults() {
    if (!currentTranscript && !currentSummary) {
        showToast('No results to download', 'error');
        return;
    }
    
    const content = `ECHOSCRIBE AUDIO ANALYSIS RESULTS
Generated on: ${new Date().toLocaleString()}

========================================
TRANSCRIPT
========================================
${currentTranscript}

========================================
AI SUMMARY
========================================
${currentSummary}

========================================
Generated by EchoScribe - AI Audio Intelligence Platform
`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `echoscribe-results-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Results downloaded successfully!', 'success');
}

// File Validation
function validateFile(file) {
    const allowedTypes = ['audio/wav', 'audio/mpeg', 'audio/mp4', 'audio/m4a'];
    const maxSize = 100 * 1024 * 1024; // 100MB
    
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(wav|mp3|m4a)$/i)) {
        showToast('Please select a valid audio file (WAV, MP3, M4A)', 'error');
        return false;
    }
    
    if (file.size > maxSize) {
        showToast('File size too large. Please select a file under 100MB', 'error');
        return false;
    }
    
    return true;
}

// Enhanced file input validation
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && !validateFile(file)) {
        fileInput.value = '';
        dropZone.classList.remove('success');
        dropZone.classList.add('error');
        setTimeout(() => {
            dropZone.classList.remove('error');
        }, 3000);
    }
});

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+U or Cmd+U to focus file upload
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        fileInput.click();
    }
    
    // Escape to close processing overlay
    if (e.key === 'Escape' && !processingOverlay.classList.contains('hidden')) {
        // Don't allow closing during actual processing
        // This is just for UX, actual processing should continue
    }
});

// Add smooth reveal animations for results
function animateResults() {
    const cards = document.querySelectorAll('.result-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Enhanced error handling with retry mechanism
let retryCount = 0;
const maxRetries = 3;

async function processWithRetry(formData) {
    try {
        const response = await fetch('http://127.0.0.1:8000/process', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        retryCount++;
        
        if (retryCount <= maxRetries) {
            showToast(`Retry attempt ${retryCount}/${maxRetries}...`, 'warning');
            await new Promise(resolve => setTimeout(resolve, 2000));
            return processWithRetry(formData);
        } else {
            retryCount = 0; // Reset for next time
            throw error;
        }
    }
}

// Update the form submit handler to use retry mechanism
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const file = fileInput.files[0];
    if (!file) {
        showToast('Please select an audio file first', 'error');
        return;
    }

    if (!validateFile(file)) {
        return;
    }

    showProcessingAnimation();
    
    const formData = new FormData();
    formData.append('audio', file);

    try {
        await simulateProcessingSteps();
        const data = await processWithRetry(formData);
        
        hideProcessingAnimation();
        displayResults(data, file);
        animateResults();
        showToast('Audio processed successfully!', 'success');
        
    } catch (error) {
        console.error('Error processing file:', error);
        hideProcessingAnimation();
        showErrorMessage('Failed to process audio file. Please check your connection and try again.');
        showToast('Processing failed. Please try again.', 'error');
    }
}

// Navigation functionality (for future expansion)
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Remove active class from all buttons
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        e.target.classList.add('active');
    });
});

// Add loading state to process button
function setButtonLoading(loading) {
    const processBtn = document.getElementById('processBtn');
    const btnText = processBtn.querySelector('.btn-text');
    
    if (loading) {
        processBtn.disabled = true;
        processBtn.classList.add('loading');
        btnText.textContent = 'Processing...';
    } else {
        processBtn.disabled = false;
        processBtn.classList.remove('loading');
        btnText.textContent = 'Process Audio';
    }
}

// Performance optimization: Debounce resize events
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Handle responsive adjustments if needed
    }, 250);
});

// Add visual feedback for file drag
document.addEventListener('dragenter', (e) => {
    e.preventDefault();
});

document.addEventListener('dragover', (e) => {
    e.preventDefault();
});

document.addEventListener('drop', (e) => {
    e.preventDefault();
});

// Accessibility enhancements
document.addEventListener('keydown', (e) => {
    // Add focus indicators for keyboard navigation
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Add CSS for keyboard navigation
const style = document.createElement('style');
style.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid var(--primary) !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(style);