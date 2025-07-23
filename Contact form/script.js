document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    
    // Form elements
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    
    // Error message elements
    const fullNameError = document.getElementById('fullNameError');
    const emailError = document.getElementById('emailError');
    const subjectError = document.getElementById('subjectError');
    const messageError = document.getElementById('messageError');
    
    // Validation functions
    function validateFullName() {
        const value = fullName.value.trim();
        if (value === '') {
            showError(fullName, fullNameError, 'Full name is required');
            return false;
        } else if (value.length < 2) {
            showError(fullName, fullNameError, 'Full name must be at least 2 characters');
            return false;
        } else {
            showSuccess(fullName, fullNameError);
            return true;
        }
    }
    
    function validateEmail() {
        const value = email.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (value === '') {
            showError(email, emailError, 'Email address is required');
            return false;
        } else if (!emailRegex.test(value)) {
            showError(email, emailError, 'Please enter a valid email address');
            return false;
        } else {
            showSuccess(email, emailError);
            return true;
        }
    }
    
    function validateSubject() {
        const value = subject.value.trim();
        if (value === '') {
            showError(subject, subjectError, 'Subject is required');
            return false;
        } else if (value.length < 3) {
            showError(subject, subjectError, 'Subject must be at least 3 characters');
            return false;
        } else {
            showSuccess(subject, subjectError);
            return true;
        }
    }
    
    function validateMessage() {
        const value = message.value.trim();
        if (value === '') {
            showError(message, messageError, 'Message is required');
            return false;
        } else if (value.length < 10) {
            showError(message, messageError, 'Message must be at least 10 characters');
            return false;
        } else {
            showSuccess(message, messageError);
            return true;
        }
    }
    
    function showError(input, errorElement, errorMessage) {
        input.classList.remove('success');
        input.classList.add('error');
        errorElement.textContent = errorMessage;
    }
    
    function showSuccess(input, errorElement) {
        input.classList.remove('error');
        input.classList.add('success');
        errorElement.textContent = '';
    }
    
    // Real-time validation
    fullName.addEventListener('blur', validateFullName);
    email.addEventListener('blur', validateEmail);
    subject.addEventListener('blur', validateSubject);
    message.addEventListener('blur', validateMessage);
    
    // Clear error states on input
    fullName.addEventListener('input', function() {
        if (fullName.classList.contains('error')) {
            fullName.classList.remove('error');
            fullNameError.textContent = '';
        }
    });
    
    email.addEventListener('input', function() {
        if (email.classList.contains('error')) {
            email.classList.remove('error');
            emailError.textContent = '';
        }
    });
    
    subject.addEventListener('input', function() {
        if (subject.classList.contains('error')) {
            subject.classList.remove('error');
            subjectError.textContent = '';
        }
    });
    
    message.addEventListener('input', function() {
        if (message.classList.contains('error')) {
            message.classList.remove('error');
            messageError.textContent = '';
        }
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        const isFullNameValid = validateFullName();
        const isEmailValid = validateEmail();
        const isSubjectValid = validateSubject();
        const isMessageValid = validateMessage();
        
        // If all fields are valid, show success message
        if (isFullNameValid && isEmailValid && isSubjectValid && isMessageValid) {
            // Hide the form
            form.style.display = 'none';
            
            // Show success message
            successMessage.style.display = 'block';
            
            // Reset form after 3 seconds and show it again
            setTimeout(function() {
                form.reset();
                form.style.display = 'flex';
                successMessage.style.display = 'none';
                
                // Clear all validation classes
                const inputs = form.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    input.classList.remove('error', 'success');
                });
                
                // Clear all error messages
                const errorMessages = form.querySelectorAll('.error-message');
                errorMessages.forEach(error => {
                    error.textContent = '';
                });
            }, 3000);
        }
    });
});