// Inicializar EmailJS
(function () {
  emailjs.init("At0IrYXlGCKyPby5y");
})();

// Function to sanitize input
function sanitizeInput(input) {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
}

// Function to validate the contact form
function validateForm() {
  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let message = document.getElementById("message").value.trim();

  // Sanitizar inputs
  name = sanitizeInput(name);
  email = sanitizeInput(email);
  message = sanitizeInput(message);

  let valid = true;
  clearErrorStates();

  if (name === "") {
    showError("name", "Name is required.");
    valid = false;
  } else if (name.length > 100) {
    showError("name", "Name is too long (max 100 characters).");
    valid = false;
  }

  if (email === "") {
    showError("email", "Email is required.");
    valid = false;
  } else if (!validateEmail(email)) {
    showError("email", "Please enter a valid email address.");
    valid = false;
  }

  if (message === "") {
    showError("message", "Message is required.");
    valid = false;
  } else if (message.length > 1000) {
    showError("message", "Message is too long (max 1000 characters).");
    valid = false;
  }

  return { valid, name, email, message };
}

// Improved email validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = re.test(String(email).toLowerCase());
  const isReasonableLength = email.length <= 254;
  const hasValidDomain = email.split("@")[1] && email.split("@")[1].includes(".");

  return isValid && isReasonableLength && hasValidDomain;
}

// Function to show error states
function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  field.classList.add("is-invalid");

  // Create or update error message
  let errorDiv = field.parentNode.querySelector(".invalid-feedback");
  if (!errorDiv) {
    errorDiv = document.createElement("div");
    errorDiv.className = "invalid-feedback";
    field.parentNode.appendChild(errorDiv);
  }
  errorDiv.textContent = message;
}

// Function to clear error states
function clearErrorStates() {
  const fields = ["name", "email", "message"];
  fields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    field.classList.remove("is-invalid");
    const errorDiv = field.parentNode.querySelector(".invalid-feedback");
    if (errorDiv) {
      errorDiv.remove();
    }
  });
}

// Function to show success message
function showSuccessMessage() {
  const form = document.getElementById("contact-form");
  const successDiv = document.createElement("div");
  successDiv.className = "alert alert-success mt-3";
  successDiv.innerHTML =
    '<i class="bi bi-check-circle"></i> Message sent successfully! I\'ll get back to you soon.';

  // Remove existing success message if any
  const existingSuccess = form.parentNode.querySelector(".alert-success");
  if (existingSuccess) {
    existingSuccess.remove();
  }

  form.parentNode.appendChild(successDiv);

  // Remove success message after 5 seconds
  setTimeout(() => {
    successDiv.remove();
  }, 5000);
}

// Function to show error message
function showErrorMessage(customMessage) {
  const form = document.getElementById("contact-form");
  const errorDiv = document.createElement("div");
  errorDiv.className = "alert alert-danger mt-3";
  errorDiv.innerHTML =
    '<i class="bi bi-exclamation-triangle"></i> ' +
    (customMessage || "Sorry, there was an error sending your message. Please try again.");

  // Remove existing error message if any
  const existingError = form.parentNode.querySelector(".alert-danger");
  if (existingError) {
    existingError.remove();
  }

  form.parentNode.appendChild(errorDiv);

  // Remove error message after 5 seconds
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

// Simple rate limiting
let lastSubmissionTime = 0;
const RATE_LIMIT_MS = 60000; // 1 minuto entre envíos

function checkRateLimit() {
  const now = Date.now();
  if (now - lastSubmissionTime < RATE_LIMIT_MS) {
    const remainingTime = Math.ceil((RATE_LIMIT_MS - (now - lastSubmissionTime)) / 1000);
    showErrorMessage(`Please wait ${remainingTime} seconds before sending another message.`);
    return false;
  }
  lastSubmissionTime = now;
  return true;
}

// Function to send email using EmailJS
function sendEmail(formData) {
  const submitBtn = document.querySelector(
    '#contact-form button[type="submit"]'
  );
  const originalText = submitBtn.innerHTML;

  // Show loading state
  submitBtn.innerHTML =
    '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
  submitBtn.disabled = true;

  // EmailJS send function
  emailjs
    .send("service_9k4hlz9", "template_jzvisik", {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
      to_email: "leodiaz225@outlook.com", // Tu email
    })
    .then(function (response) {
      console.log("SUCCESS!", response.status, response.text);
      showSuccessMessage();
      document.getElementById("contact-form").reset();
    })
    .catch(function (error) {
      console.log("FAILED...", error);
      showErrorMessage();
    })
    .finally(function () {
      // Restore button state
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    });
}

// Updated form submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Check rate limit
            if (!checkRateLimit()) {
                return;
            }
            
            const validationResult = validateForm();
            if (validationResult.valid) {
                const formData = {
                    name: validationResult.name,
                    email: validationResult.email,
                    message: validationResult.message
                };
                
                sendEmail(formData);
            }
        });
    }

    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});
