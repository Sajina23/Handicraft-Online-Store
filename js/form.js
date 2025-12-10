/* ==================== FORM VALIDATION & HANDLING ==================== */
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const subjectSelect = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const privacyCheckbox = document.getElementById('privacy');
  const formSuccess = document.getElementById('form-success');

  // Validation rules
  const validators = {
    name: {
      element: nameInput,
      errorEl: document.getElementById('name-error'),
      validate: (value) => {
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'Name can only contain letters, spaces, hyphens, and apostrophes';
        return null;
      }
    },
    email: {
      element: emailInput,
      errorEl: document.getElementById('email-error'),
      validate: (value) => {
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return null;
      }
    },
    phone: {
      element: phoneInput,
      errorEl: document.getElementById('phone-error'),
      validate: (value) => {
        if (value && !/^[0-9\s\-\+\(\)]+$/.test(value)) return 'Please enter a valid phone number';
        return null;
      }
    },
    subject: {
      element: subjectSelect,
      errorEl: document.getElementById('subject-error'),
      validate: (value) => {
        if (!value) return 'Please select a subject';
        return null;
      }
    },
    message: {
      element: messageInput,
      errorEl: document.getElementById('message-error'),
      validate: (value) => {
        if (!value.trim()) return 'Message is required';
        if (value.trim().length < 10) return 'Message must be at least 10 characters';
        if (value.trim().length > 1000) return 'Message must not exceed 1000 characters';
        return null;
      }
    },
    privacy: {
      element: privacyCheckbox,
      errorEl: document.getElementById('privacy-error'),
      validate: (checked) => {
        if (!checked) return 'You must agree to the privacy policy';
        return null;
      }
    }
  };

  // Show error message
  function showError(validator, message) {
    if (validator.errorEl) {
      validator.errorEl.textContent = message;
      validator.errorEl.classList.add('show');
    }
    validator.element.setAttribute('aria-invalid', 'true');
  }

  // Clear error message
  function clearError(validator) {
    if (validator.errorEl) {
      validator.errorEl.textContent = '';
      validator.errorEl.classList.remove('show');
    }
    validator.element.setAttribute('aria-invalid', 'false');
  }

  // Real-time validation on input
  Object.entries(validators).forEach(([fieldName, validator]) => {
    validator.element.addEventListener('blur', () => {
      const value = fieldName === 'privacy' 
        ? validator.element.checked 
        : validator.element.value;
      const error = validator.validate(value);
      
      if (error) {
        showError(validator, error);
      } else {
        clearError(validator);
      }
    });

    validator.element.addEventListener('input', () => {
      clearError(validator);
    });
  });

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Hide previous success message
    formSuccess.style.display = 'none';

    let isValid = true;

    // Validate all fields
    Object.entries(validators).forEach(([fieldName, validator]) => {
      const value = fieldName === 'privacy' 
        ? validator.element.checked 
        : validator.element.value;
      const error = validator.validate(value);
      
      if (error) {
        showError(validator, error);
        isValid = false;
      } else {
        clearError(validator);
      }
    });

    if (isValid) {
      // Show success message
      formSuccess.style.display = 'block';
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Reset form
      form.reset();

      // Hide success message after 5 seconds
      setTimeout(() => {
        formSuccess.style.display = 'none';
      }, 5000);

      console.log('Form submitted successfully:', {
        name: nameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        subject: subjectSelect.value,
        message: messageInput.value
      });
    } else {
      // Focus on first error
      const firstError = Object.values(validators).find(v => 
        v.errorEl && v.errorEl.classList.contains('show')
      );
      if (firstError) {
        firstError.element.focus();
      }
    }
  });

  // Reset form button
  const resetButton = form.querySelector('button[type="reset"]');
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      // Clear all errors
      Object.values(validators).forEach(validator => {
        clearError(validator);
      });
    });
  }
});
