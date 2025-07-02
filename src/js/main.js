import { emailConfig } from './config.js';

// Initialize EmailJS
emailjs.init(emailConfig.publicKey);

// Contact form handling
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form elements
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Validate form
    if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
    }
    
    // Show loading state
    submitButton.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Sending...';
    submitButton.disabled = true;
    
    // Prepare template parameters
    const templateParams = {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
    
    // Send email
    emailjs.send(emailConfig.serviceId, emailConfig.templateId, templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            
            // Show success message
            const successAlert = document.createElement('div');
            successAlert.className = 'alert alert-success alert-dismissible fade show mt-3';
            successAlert.innerHTML = `
                <strong>¡Éxito!</strong> Tu mensaje ha sido enviado correctamente. ¡Te responderé pronto!
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            form.appendChild(successAlert);
            
            // Reset form
            form.reset();
            form.classList.remove('was-validated');
            
            // Auto-dismiss alert after 5 seconds
            setTimeout(() => {
                if (successAlert.parentNode) {
                    successAlert.remove();
                }
            }, 5000);
        })
        .catch(function(error) {
            console.log('FAILED...', error);
            
            // Show error message
            const errorAlert = document.createElement('div');
            errorAlert.className = 'alert alert-danger alert-dismissible fade show mt-3';
            errorAlert.innerHTML = `
                <strong>Error!</strong> No se pudo enviar el mensaje. Inténtalo de nuevo o contáctame directamente a leodiaz225@outlook.com
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            form.appendChild(errorAlert);
            
            // Auto-dismiss alert after 5 seconds
            setTimeout(() => {
                if (errorAlert.parentNode) {
                    errorAlert.remove();
                }
            }, 5000);
        })
        .finally(function() {
            // Restore button state
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        });
});

// Initialize tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

// Smooth scrolling for navigation links ONLY (excluding form elements)
document
  .querySelectorAll('nav a[href^="#"], .btn[href^="#"]')
  .forEach((anchor) => {
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
