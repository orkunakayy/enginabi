document.addEventListener('DOMContentLoaded', () => {
  // 1. Header Scroll Effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Nav Toggle
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const mobileMenuPanel = document.getElementById('mobile-menu-panel');

  if (mobileNavToggle && mobileMenuPanel) {
    mobileNavToggle.addEventListener('click', () => {
      mobileNavToggle.classList.toggle('open');
      mobileMenuPanel.classList.toggle('open');
      document.body.style.overflow = mobileMenuPanel.classList.contains('open') ? 'hidden' : '';
    });

    // Close panel when clicking link
    const mobileLinks = mobileMenuPanel.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNavToggle.classList.remove('open');
        mobileMenuPanel.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // 3. FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-content').style.maxHeight = null;
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          content.style.maxHeight = null;
        } else {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    }
  });

  // 4. Before-After Slider Dragging
  const baSliders = document.querySelectorAll('.before-after-slider');
  baSliders.forEach(slider => {
    const handle = slider.querySelector('.ba-handle');
    const afterImg = slider.querySelector('.ba-after');
    let isDragging = false;

    function moveSlider(clientX) {
      const rect = slider.getBoundingClientRect();
      const position = clientX - rect.left;
      let percentage = (position / rect.width) * 100;

      // Contain percentage between 0 and 100
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;

      handle.style.left = `${percentage}%`;
      afterImg.style.width = `${percentage}%`;
    }

    // Mouse Events
    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      moveSlider(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      moveSlider(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch Events
    slider.addEventListener('touchstart', (e) => {
      isDragging = true;
      if (e.touches.length > 0) {
        moveSlider(e.touches[0].clientX);
      }
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      if (e.touches.length > 0) {
        moveSlider(e.touches[0].clientX);
      }
    });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  });

  // 5. Input Keyboard Focus Mobile fix (hides sticky bar on keyboard focus)
  const inputs = document.querySelectorAll('input, select, textarea');
  const stickyBar = document.querySelector('.mobile-sticky-bar');
  if (stickyBar) {
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        stickyBar.style.display = 'none';
      });
      input.addEventListener('blur', () => {
        stickyBar.style.display = '';
      });
    });
  }

  // 6. Form Submission Mocking
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Perform simple validation
      let isValid = true;
      const requiredInputs = form.querySelectorAll('[required]');
      
      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('error');
          input.style.borderColor = '#ff4444';
          input.style.boxShadow = '0 0 5px rgba(255, 68, 68, 0.3)';
        } else {
          input.classList.remove('error');
          input.style.borderColor = '';
          input.style.boxShadow = '';
        }
      });

      if (isValid) {
        const container = form.parentElement;
        const formHeight = form.offsetHeight;
        
        // Custom feedback layout
        container.innerHTML = `
          <div class="form-success-state" style="min-height: ${formHeight}px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem; animation: fadeIn 0.4s ease forwards;">
            <svg style="width: 64px; height: 64px; fill: #00E5FF; margin-bottom: 1.5rem;" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <h3 style="font-family: var(--font-headings); font-size: 1.5rem; margin-bottom: 0.5rem; color: #FFF;">Talebiniz Alındı!</h3>
            <p style="color: var(--text-secondary); max-width: 400px; font-size: 0.95rem; line-height: 1.5;">
              Engin Usta en kısa sürede sizinle iletişime geçecektir. Müşteri temsilcimiz kayıtlı numaranızdan dönüş yapacaktır.
            </p>
          </div>
        `;
      }
    });
  });
});
