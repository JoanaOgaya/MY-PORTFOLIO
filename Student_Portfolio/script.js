document.addEventListener('DOMContentLoaded', () => {
  // =============== Theme Toggle ===============
  const themeBtn = document.getElementById('theme-btn');
  const body = document.body;
  const savedTheme = localStorage.getItem('theme') || 'dark';
  body.setAttribute('data-theme', savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = body.getAttribute('data-theme');
      const newTheme = current === 'dark' ? 'light' : 'dark';
      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // =============== Smooth Scroll Navigation ===============
  document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
      this.classList.add('active');
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // =============== Highlight Active Section on Scroll ===============
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') && link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // =============== Sliding Gallery (single, safe implementation) ===============
  document.querySelectorAll('.sliding-gallery').forEach(gallery => {
    const slidesContainer = gallery.querySelector('.slides');
    const slides = gallery.querySelectorAll('img');
    const prevBtn = gallery.querySelector('.prev');
    const nextBtn = gallery.querySelector('.next');
    
    let currentIndex = 0;
    const totalSlides = slides.length;

    function updateSlide() {
      slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateSlide();
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlide();
    });

    // Initialize first slide
    updateSlide();
  });

  
  // =============== Contact Button ===============
  const contactBtn = document.querySelector('.contact-btn');
  if (contactBtn) {
    contactBtn.addEventListener('click', () => {
      alert("Let's connect! You can email me at: zirus.morcilla@example.com");
    });
  }

  // =============== HOVER SKILLS: ANIMATE + RESET ON LEAVE ===============
  document.querySelectorAll('.skill-category').forEach(category => {
    let rafIds = [];

    function cancelRafs() {
      rafIds.forEach(id => cancelAnimationFrame(id));
      rafIds = [];
    }

    function animateNumberCancelable(el, target, duration) {
      let start = null;
      function step(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const value = Math.round(target * progress);
        el.textContent = `${value}%`;
        if (progress < 1) {
          const id = requestAnimationFrame(step);
          rafIds.push(id);
        } else {
          el.textContent = `${target}%`;
        }
      }
      const id = requestAnimationFrame(step);
      rafIds.push(id);
      return id;
    }

    category.addEventListener('mouseenter', () => {
      // cancel any previous animations
      cancelRafs();

      const bars = category.querySelectorAll('.skill-fill');
      const numbers = category.querySelectorAll('.percent-number');

      // Animate bars with CSS transition
      bars.forEach((bar) => {
        const percent = parseInt(bar.getAttribute('data-percent')) || 0;
        bar.style.transition = 'width 1.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
        // ensure transition is applied then set width
        requestAnimationFrame(() => {
          bar.style.width = `${percent}%`;
        });
      });

      // Animate numbers from 0 to percent (cancelable)
      numbers.forEach((number) => {
        const target = parseInt(number.getAttribute('data-percent')) || 0;
        number.textContent = '0%';
        animateNumberCancelable(number, target, 1400);
      });
    });

    category.addEventListener('mouseleave', () => {
      // cancel numeric animations
      cancelRafs();

      // reset bars instantly
      const bars = category.querySelectorAll('.skill-fill');
      bars.forEach(bar => {
        bar.style.transition = 'none';
        bar.style.width = '0';
      });

      // reset numbers to 0%
      const numbers = category.querySelectorAll('.percent-number');
      numbers.forEach(number => number.textContent = '0%');
    });
  });

  // =============== Resume/CV Download ===============
  document.querySelectorAll('.resume-btn, .cv-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      // Check if file exists
      fetch(button.href)
        .then(response => {
          if (!response.ok) {
            e.preventDefault();
            alert('Resume file not found. Please make sure to add your resume.pdf file.');
          }
        })
        .catch(error => {
          e.preventDefault();
          console.error('Error:', error);
          alert('There was an error downloading the resume.');
        });
    });
  });
});


document.addEventListener('DOMContentLoaded', function () {
  // Select ALL images inside sliding galleries
  // Adjust the selector to match your gallery images
  const galleryImages = document.querySelectorAll('.sliding-gallery img');

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');

  // Open lightbox
  galleryImages.forEach(img => {
    img.addEventListener('click', function (e) {
      e.preventDefault();
      lightboxImg.src = this.src;
      lightboxImg.alt = this.alt || '';
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // prevent background scroll
    });
  });

  // Close lightbox
  function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox(); // click outside image
  });

  // Optional: Close with Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.style.display === 'flex') {
      closeLightbox();
    }
  });
});

