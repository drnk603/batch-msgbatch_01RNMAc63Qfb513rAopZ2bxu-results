(function() {
  'use strict';

  window.__app = window.__app || {};

  function throttle(func, limit) {
    var inThrottle;
    return function() {
      var args = arguments;
      var context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(function() { inThrottle = false; }, limit);
      }
    };
  }

  function debounce(func, wait) {
    var timeout;
    return function() {
      var context = this;
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    };
  }

  function initLazyLoading() {
    if (window.__app.lazyInitialized) return;
    window.__app.lazyInitialized = true;

    var images = document.querySelectorAll('img:not([loading])');
    var videos = document.querySelectorAll('video:not([loading])');

    for (var i = 0; i < images.length; i++) {
      if (!images[i].classList.contains('c-logo__img')) {
        images[i].setAttribute('loading', 'lazy');
      }
    }

    for (var j = 0; j < videos.length; j++) {
      videos[j].setAttribute('loading', 'lazy');
    }
  }

  function initScrollAnimations() {
    if (window.__app.scrollAnimInitialized) return;
    window.__app.scrollAnimInitialized = true;

    var animatedElements = document.querySelectorAll('.card, .c-card, .c-button, .btn, h1, h2, h3, .lead, p, .alert, .accordion-item');
    
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '0';
          entry.target.style.transform = 'translateY(30px)';
          entry.target.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
          
          requestAnimationFrame(function() {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    for (var i = 0; i < animatedElements.length; i++) {
      observer.observe(animatedElements[i]);
    }
  }

  function initImageAnimations() {
    if (window.__app.imageAnimInitialized) return;
    window.__app.imageAnimInitialized = true;

    var images = document.querySelectorAll('img');
    
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          img.style.opacity = '0';
          img.style.transform = 'scale(0.95)';
          img.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
          
          requestAnimationFrame(function() {
            img.style.opacity = '1';
            img.style.transform = 'scale(1)';
          });
          
          observer.unobserve(img);
        }
      });
    }, {
      threshold: 0.1
    });

    for (var i = 0; i < images.length; i++) {
      if (!images[i].classList.contains('c-logo__img')) {
        observer.observe(images[i]);
      }
    }
  }

  function initButtonInteractions() {
    if (window.__app.buttonInteractionsInitialized) return;
    window.__app.buttonInteractionsInitialized = true;

    var buttons = document.querySelectorAll('.btn, .c-button, .nav-link, a:not(.navbar-brand)');

    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease-out';
        if (this.classList.contains('btn') || this.classList.contains('c-button')) {
          this.style.transform = 'translateY(-2px)';
          this.style.boxShadow = '0 10px 25px rgba(15, 23, 42, 0.2)';
        }
      });

      buttons[i].addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.boxShadow = '';
      });

      buttons[i].addEventListener('mousedown', function(e) {
        var ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.width = ripple.style.height = '100px';
        ripple.style.marginLeft = '-50px';
        ripple.style.marginTop = '-50px';
        ripple.style.left = e.pageX - this.getBoundingClientRect().left + 'px';
        ripple.style.top = e.pageY - this.getBoundingClientRect().top + 'px';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(function() {
          if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
          }
        }, 600);
      });
    }

    var style = document.createElement('style');
    style.textContent = '@keyframes ripple { from { transform: scale(0); opacity: 1; } to { transform: scale(2); opacity: 0; } }';
    document.head.appendChild(style);
  }

  function initCardHoverEffects() {
    if (window.__app.cardHoverInitialized) return;
    window.__app.cardHoverInitialized = true;

    var cards = document.querySelectorAll('.card, .c-card, .accordion-item');

    for (var i = 0; i < cards.length; i++) {
      cards[i].addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.4s ease-out';
        this.style.transform = 'translateY(-8px) scale(1.02)';
        this.style.boxShadow = '0 20px 40px rgba(15, 23, 42, 0.15)';
      });

      cards[i].addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.boxShadow = '';
      });
    }
  }

  function initBurgerMenu() {
    if (window.__app.burgerInitialized) return;
    window.__app.burgerInitialized = true;

    var toggle = document.querySelector('.navbar-toggler');
    var collapse = document.querySelector('.navbar-collapse, #navbarNav');
    var body = document.body;
    var navLinks = document.querySelectorAll('.nav-link');

    if (!toggle || !collapse) return;

    var isOpen = false;

    collapse.style.height = 'calc(100vh - var(--header-h))';
    collapse.style.maxHeight = 'calc(100vh - var(--header-h))';

    function openMenu() {
      isOpen = true;
      collapse.classList.add('show');
      toggle.setAttribute('aria-expanded', 'true');
      body.classList.add('u-no-scroll');
      collapse.style.transition = 'transform 0.4s ease-out';
    }

    function closeMenu() {
      isOpen = false;
      collapse.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
      body.classList.remove('u-no-scroll');
    }

    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    });

    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener('click', function() {
        if (window.innerWidth < 1024) {
          closeMenu();
        }
      });
    }

    window.addEventListener('resize', throttle(function() {
      if (window.innerWidth >= 1024 && isOpen) {
        closeMenu();
      }
    }, 250));
  }

  function initSmoothScroll() {
    if (window.__app.smoothScrollInitialized) return;
    window.__app.smoothScrollInitialized = true;

    document.addEventListener('click', function(e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var href = link.getAttribute('href');
      if (href === '#' || href === '#!') return;

      var targetId = href.substring(1);
      var targetElement = document.getElementById(targetId);

      if (!targetElement) return;

      e.preventDefault();

      var header = document.querySelector('.l-header');
      var headerHeight = header ? header.offsetHeight : 80;
      var targetTop = targetElement.offsetTop - headerHeight;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: 'smooth'
      });
    });
  }

  function initScrollSpy() {
    if (window.__app.scrollSpyInitialized) return;
    window.__app.scrollSpyInitialized = true;

    var sections = document.querySelectorAll('[id^="section-"]');
    var navLinks = document.querySelectorAll('.nav-link[href^="#section-"]');

    if (sections.length === 0 || navLinks.length === 0) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          
          for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].classList.remove('active');
            navLinks[i].removeAttribute('aria-current');
          }

          var activeLink = document.querySelector('.nav-link[href="#' + id + '"]');
          if (activeLink) {
            activeLink.classList.add('active');
            activeLink.setAttribute('aria-current', 'page');
          }
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-80px 0px -50% 0px'
    });

    for (var i = 0; i < sections.length; i++) {
      observer.observe(sections[i]);
    }
  }

  function initFormValidation() {
    if (window.__app.formValidationInitialized) return;
    window.__app.formValidationInitialized = true;

    var forms = document.querySelectorAll('form, .c-form');

    var validationRules = {
      email: /^[^s@]+@[^s@]+.[^s@]+$/,
      phone: /^[ds+-()]{10,20}$/,
      name: /^[a-zA-ZÀ-ÿs-']{2,50}$/,
      date: /^d{4}-d{2}-d{2}$/
    };

    var errorMessages = {
      required: 'Dieses Feld ist erforderlich',
      email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
      phone: 'Bitte geben Sie eine gültige Telefonnummer ein',
      name: 'Bitte geben Sie einen gültigen Namen ein (2-50 Zeichen, nur Buchstaben)',
      date: 'Bitte wählen Sie ein gültiges Datum',
      message: 'Ihre Nachricht muss mindestens 10 Zeichen enthalten',
      privacy: 'Sie müssen die Datenschutzbestimmungen akzeptieren'
    };

    function showError(field, message) {
      field.classList.add('is-invalid');
      var feedback = field.parentNode.querySelector('.invalid-feedback');
      if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        field.parentNode.appendChild(feedback);
      }
      feedback.textContent = message;
      feedback.style.display = 'block';
    }

    function clearError(field) {
      field.classList.remove('is-invalid');
      var feedback = field.parentNode.querySelector('.invalid-feedback');
      if (feedback) {
        feedback.style.display = 'none';
      }
    }

    function validateField(field) {
      var value = field.value.trim();
      var type = field.type;
      var id = field.id;
      var isValid = true;

      clearError(field);

      if (field.hasAttribute('required') && !value) {
        showError(field, errorMessages.required);
        return false;
      }

      if (type === 'email' && value) {
        if (!validationRules.email.test(value)) {
          showError(field, errorMessages.email);
          return false;
        }
      }

      if (type === 'tel' && value) {
        if (!validationRules.phone.test(value)) {
          showError(field, errorMessages.phone);
          return false;
        }
      }

      if ((id === 'firstName' || id === 'lastName' || id === 'contact-name') && value) {
        if (!validationRules.name.test(value)) {
          showError(field, errorMessages.name);
          return false;
        }
      }

      if (type === 'date' && value) {
        if (!validationRules.date.test(value)) {
          showError(field, errorMessages.date);
          return false;
        }
      }

      if (field.tagName === 'TEXTAREA' && value) {
        if (value.length < 10) {
          showError(field, errorMessages.message);
          return false;
        }
      }

      if (type === 'checkbox' && field.hasAttribute('required')) {
        if (!field.checked) {
          showError(field, errorMessages.privacy);
          return false;
        }
      }

      return isValid;
    }

    for (var i = 0; i < forms.length; i++) {
      var form = forms[i];
      var fields = form.querySelectorAll('input, textarea, select');

      for (var j = 0; j < fields.length; j++) {
        fields[j].addEventListener('blur', function() {
          validateField(this);
        });

        fields[j].addEventListener('input', function() {
          if (this.classList.contains('is-invalid')) {
            validateField(this);
          }
        });
      }

      form.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var currentForm = this;
        var formFields = currentForm.querySelectorAll('input, textarea, select');
        var isFormValid = true;

        for (var k = 0; k < formFields.length; k++) {
          if (!validateField(formFields[k])) {
            isFormValid = false;
          }
        }

        if (!isFormValid) {
          var firstInvalid = currentForm.querySelector('.is-invalid');
          if (firstInvalid) {
            firstInvalid.focus();
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
        }

        var submitBtn = currentForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Wird gesendet...';
        }

        setTimeout(function() {
          window.location.href = 'thank_you.html';
        }, 800);
      });
    }
  }

  function initCountUp() {
    if (window.__app.countUpInitialized) return;
    window.__app.countUpInitialized = true;

    var counters = document.querySelectorAll('[data-count]');
    
    function animateCounter(element) {
      var target = parseInt(element.getAttribute('data-count'));
      var duration = 2000;
      var start = 0;
      var increment = target / (duration / 16);
      var current = start;

      function updateCounter() {
        current += increment;
        if (current < target) {
          element.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target;
        }
      }

      updateCounter();
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    for (var i = 0; i < counters.length; i++) {
      observer.observe(counters[i]);
    }
  }

  function initScrollToTop() {
    if (window.__app.scrollToTopInitialized) return;
    window.__app.scrollToTopInitialized = true;

    var scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.setAttribute('aria-label', 'Nach oben scrollen');
    scrollBtn.style.cssText = 'position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; border-radius: 50%; background: var(--color-primary); color: white; border: none; cursor: pointer; font-size: 24px; display: none; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.3s ease-out;';
    
    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', throttle(function() {
      if (window.pageYOffset > 300) {
        scrollBtn.style.display = 'block';
        scrollBtn.style.opacity = '1';
      } else {
        scrollBtn.style.opacity = '0';
        setTimeout(function() {
          if (window.pageYOffset <= 300) {
            scrollBtn.style.display = 'none';
          }
        }, 300);
      }
    }, 100));

    scrollBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    scrollBtn.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px) scale(1.1)';
      this.style.boxShadow = '0 8px 20px rgba(0,0,0,0.25)';
    });

    scrollBtn.addEventListener('mouseleave', function() {
      this.style.transform = '';
      this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    });
  }

  function initAccordionAnimations() {
    if (window.__app.accordionInitialized) return;
    window.__app.accordionInitialized = true;

    var accordionButtons = document.querySelectorAll('.accordion-button');

    for (var i = 0; i < accordionButtons.length; i++) {
      accordionButtons[i].addEventListener('click', function() {
        this.style.transition = 'all 0.3s ease-out';
      });
    }
  }

  function initPrivacyModal() {
    if (window.__app.privacyModalInitialized) return;
    window.__app.privacyModalInitialized = true;

    var privacyLinks = document.querySelectorAll('a[href*="privacy"]');
    
    for (var i = 0; i < privacyLinks.length; i++) {
      privacyLinks[i].addEventListener('click', function(e) {
        if (this.getAttribute('href') === '#privacy' || this.getAttribute('href') === 'privacy.html') {
          e.preventDefault();
          
          var modal = document.createElement('div');
          modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease-out;';
          
          var modalContent = document.createElement('div');
          modalContent.style.cssText = 'background: white; padding: 40px; border-radius: 16px; max-width: 600px; max-height: 80vh; overflow-y: auto; transform: scale(0.9); transition: transform 0.3s ease-out;';
          modalContent.innerHTML = '<h2>Datenschutzerklärung</h2><p>Für vollständige Informationen besuchen Sie bitte unsere Datenschutzseite.</p><button class="btn btn-primary" style="margin-top: 20px;">Schließen</button>';
          
          modal.appendChild(modalContent);
          document.body.appendChild(modal);
          
          requestAnimationFrame(function() {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
          });
          
          modal.querySelector('button').addEventListener('click', function() {
            modal.style.opacity = '0';
            modalContent.style.transform = 'scale(0.9)';
            setTimeout(function() {
              document.body.removeChild(modal);
            }, 300);
          });
          
          modal.addEventListener('click', function(e) {
            if (e.target === modal) {
              modal.querySelector('button').click();
            }
          });
        }
      });
    }
  }

  function initActiveMenuState() {
    if (window.__app.activeMenuInitialized) return;
    window.__app.activeMenuInitialized = true;

    var navLinks = document.querySelectorAll('.nav-link');
    var currentPath = location.pathname;

    if (currentPath === '/index.html') currentPath = '/';

    for (var i = 0; i < navLinks.length; i++) {
      var link = navLinks[i];
      var linkPath = link.getAttribute('href');

      link.removeAttribute('aria-current');
      link.classList.remove('active');

      if (linkPath === '/index.html') linkPath = '/';

      if (linkPath === currentPath || (currentPath === '/' && linkPath === '/')) {
        link.setAttribute('aria-current', 'page');
        link.classList.add('active');
      }
    }
  }

  function initHeaderShadow() {
    if (window.__app.headerShadowInitialized) return;
    window.__app.headerShadowInitialized = true;

    var header = document.querySelector('.l-header');
    if (!header) return;

    window.addEventListener('scroll', throttle(function() {
      if (window.pageYOffset > 10) {
        header.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.1)';
      } else {
        header.style.boxShadow = '0 1px 3px rgba(15, 23, 42, 0.1)';
      }
    }, 100));
  }

  window.__app.init = function() {
    initLazyLoading();
    initScrollAnimations();
    initImageAnimations();
    initButtonInteractions();
    initCardHoverEffects();
    initBurgerMenu();
    initSmoothScroll();
    initScrollSpy();
    initFormValidation();
    initCountUp();
    initScrollToTop();
    initAccordionAnimations();
    initPrivacyModal();
    initActiveMenuState();
    initHeaderShadow();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.__app.init);
  } else {
    window.__app.init();
  }

})();
