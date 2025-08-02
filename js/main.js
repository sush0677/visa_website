// ===================================
// M&H ASSOCIATES FZE LLC - Main JavaScript
// ===================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('M&H Associates website loaded successfully');
    
    // Initialize all functionality
    initNavigation();
    initSmoothScroll();
    initScrollAnimations();
    initContactForm();
    initServiceCards();
    initPageTransitions();
    initAccessibility();
});

// ===================================
// Navigation Functionality
// ===================================

function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.navbar-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            
            // Update aria-expanded for accessibility
            const isExpanded = navMenu.classList.contains('active');
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Active navigation link highlighting
    highlightActiveNavLink();
}

function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===================================
// Smooth Scrolling
// ===================================

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update URL without page jump
                history.pushState(null, null, targetId);
            }
        });
    });
}

// ===================================
// Scroll Animations
// ===================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll(
        '.fade-in-on-scroll, .slide-in-left, .slide-in-right, .scale-in-on-scroll'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Animate service cards on scroll
    animateServiceCards();
}

function animateServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    if (serviceCards.length > 0) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.2 });
        
        serviceCards.forEach(card => {
            observer.observe(card);
        });
    }
}

// ===================================
// Contact Form Functionality
// ===================================

function initContactForm() {
    const contactForm = document.querySelector('#contact-form');
    
    if (contactForm) {
        // Animate form groups on load
        const formGroups = contactForm.querySelectorAll('.form-group');
        formGroups.forEach((group, index) => {
            setTimeout(() => {
                group.classList.add('animate');
            }, index * 100);
        });
        
        // Form submission handling
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!validateForm(data)) {
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="spinner spinner-sm"></span> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        showFormSuccess(form);
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function validateForm(data) {
    let isValid = true;
    
    // Required field validation
    if (!data.name || data.name.trim().length < 2) {
        showFieldError('name', 'Name must be at least 2 characters long');
        isValid = false;
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (data.phone && !isValidPhone(data.phone)) {
        showFieldError('phone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Clear previous errors
    clearFieldError(e);
    
    // Validate based on field type
    switch (fieldName) {
        case 'name':
            if (!value || value.length < 2) {
                showFieldError(fieldName, 'Name must be at least 2 characters long');
            }
            break;
        case 'email':
            if (!value || !isValidEmail(value)) {
                showFieldError(fieldName, 'Please enter a valid email address');
            }
            break;
        case 'phone':
            if (value && !isValidPhone(value)) {
                showFieldError(fieldName, 'Please enter a valid phone number');
            }
            break;
        case 'message':
            if (value && value.length < 10) {
                showFieldError(fieldName, 'Message must be at least 10 characters long');
            }
            break;
    }
}

function showFieldError(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    const errorDiv = document.querySelector(`[data-error="${fieldName}"]`) || createErrorElement(fieldName);
    
    if (field) {
        field.classList.add('error');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

function clearFieldError(e) {
    const field = e.target;
    const fieldName = field.name;
    const errorDiv = document.querySelector(`[data-error="${fieldName}"]`);
    
    if (field) {
        field.classList.remove('error');
    }
    
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

function createErrorElement(fieldName) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.setAttribute('data-error', fieldName);
    
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (field && field.parentNode) {
        field.parentNode.appendChild(errorDiv);
    }
    
    return errorDiv;
}

function showFormSuccess(form) {
    // Clear form
    form.reset();
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div class="alert alert-success">
            <i class="fas fa-check-circle"></i>
            Thank you! Your message has been sent successfully. We'll get back to you soon.
        </div>
    `;
    
    form.parentNode.insertBefore(successMessage, form);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

// ===================================
// Utility Functions
// ===================================

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// ===================================
// Service Cards Animation
// ===================================

function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ===================================
// Page Transitions
// ===================================

function initPageTransitions() {
    // Add page transition class to body
    document.body.classList.add('page-transition');
    
    // Remove transition class after page loads
    window.addEventListener('load', function() {
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);
    });
}

// ===================================
// Accessibility Features
// ===================================

function initAccessibility() {
    // Skip to main content link
    createSkipLink();
    
    // Keyboard navigation
    initKeyboardNavigation();
    
    // Focus management
    initFocusManagement();
}

function createSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link sr-only';
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

function initKeyboardNavigation() {
    // Handle keyboard navigation for mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.navbar-nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
    
    // Trap focus in mobile menu when open
    if (navMenu) {
        const focusableElements = navMenu.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        navMenu.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
}

function initFocusManagement() {
    // Add focus indicators
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.classList.add('focus-visible');
        });
        
        element.addEventListener('blur', function() {
            this.classList.remove('focus-visible');
        });
    });
}

// ===================================
// Performance Optimizations
// ===================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optimize scroll events
const optimizedScrollHandler = throttle(function() {
    // Scroll-based animations and effects
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// ===================================
// Error Handling
// ===================================

window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You can add error reporting here
});

// ===================================
// Analytics and Tracking
// ===================================

function trackEvent(eventName, eventData = {}) {
    // Google Analytics 4 event tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    // Custom event tracking
    console.log('Event tracked:', eventName, eventData);
}

// Track form submissions
function trackFormSubmission(formType) {
    trackEvent('form_submit', {
        form_type: formType,
        page: window.location.pathname
    });
}

// Track service clicks
function trackServiceClick(serviceName) {
    trackEvent('service_click', {
        service_name: serviceName,
        page: window.location.pathname
    });
}

// ===================================
// Export functions for external use
// ===================================

window.MHAssociates = {
    trackEvent,
    trackFormSubmission,
    trackServiceClick,
    initNavigation,
    initSmoothScroll,
    initScrollAnimations,
    initContactForm
}; 