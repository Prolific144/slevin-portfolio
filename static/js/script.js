document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.add('active');
    });

    closeMenu.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Sticky Header
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 100);
    });

    // Typing Animation
    const typedTextSpan = document.querySelector('.typed-text');
    const cursorSpan = document.querySelector('.cursor');

    const textArray = ['Statistician', 'Web Developer', 'Data Storyteller', 'Analytical Strategist', 'Tax Consultant', 'Freelancer'];
    const typingDelay = 200;
    const erasingDelay = 100;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            if (!cursorSpan.classList.contains('typing')) cursorSpan.classList.add('typing');
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            cursorSpan.classList.remove('typing');
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            if (!cursorSpan.classList.contains('typing')) cursorSpan.classList.add('typing');
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            cursorSpan.classList.remove('typing');
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    if (textArray.length) setTimeout(type, newTextDelay + 250);

    // Services Slider
    const sliderWrapper = document.querySelector('.services-slider-wrapper');
    const serviceSlides = document.querySelectorAll('.service-slide');
    const servicesPrev = document.querySelector('.slider-prev');
    const servicesNext = document.querySelector('.slider-next');
    const servicesPause = document.querySelector('.slider-pause');
    const servicesSlider = document.querySelector('.services-slider');
    let currentSlide = 0;
    let isPaused = false;
    let autoSlideInterval = null;
    let isAnimating = false;

    function startAutoSlide() {
        if (!isPaused && !autoSlideInterval) {
            autoSlideInterval = setInterval(nextSlide, 6000);
        }
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    function updateSlider() {
        if (isAnimating) return;
        isAnimating = true;

        // Update active class and opacity
        serviceSlides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });

        // Update transform
        const offset = -currentSlide * 100;
        sliderWrapper.style.transform = `translateX(${offset}%)`;

        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }

    function nextSlide() {
        if (isAnimating) return;
        currentSlide = (currentSlide + 1) % serviceSlides.length;
        updateSlider();
        if (!isPaused) {
            stopAutoSlide();
            startAutoSlide();
        }
    }

    function prevSlide() {
        if (isAnimating) return;
        currentSlide = (currentSlide - 1 + serviceSlides.length) % serviceSlides.length;
        updateSlider();
        if (!isPaused) {
            stopAutoSlide();
            startAutoSlide();
        }
    }

    function togglePause() {
        isPaused = !isPaused;
        servicesPause.innerHTML = isPaused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
        if (isPaused) {
            stopAutoSlide();
        } else {
            startAutoSlide();
        }
    }

    // Initialize slider
    function initSlider() {
        updateSlider();
        startAutoSlide();
    }

    if (servicesNext && servicesPrev) {
        servicesNext.addEventListener('click', nextSlide);
        servicesPrev.addEventListener('click', prevSlide);
    }

    if (servicesPause) {
        servicesPause.addEventListener('click', togglePause);
    }

    // Pause auto-slide on hover
    if (servicesSlider) {
        servicesSlider.addEventListener('mouseenter', () => {
            if (!isPaused) stopAutoSlide();
        });

        servicesSlider.addEventListener('mouseleave', () => {
            if (!isPaused) startAutoSlide();
        });
    }

    // Swipe support for touch devices
    let touchStartX = 0;
    let touchEndX = 0;

    if (servicesSlider) {
        servicesSlider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        servicesSlider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) {
                nextSlide();
            } else if (touchEndX - touchStartX > 50) {
                prevSlide();
            }
        });
    }

    // Initialize slider
    initSlider();

    // Form Submission with Formspree
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    alert('Thank you for your message! I will get back to you soon.');
                    contactForm.reset();
                } else {
                    alert('There was an error sending your message. Please try again.');
                }
            })
            .catch(error => {
                alert('There was an error sending your message. Please try again.');
                console.error('Form submission error:', error);
            });
        });
    }

    // Dynamic Email Construction
    const aboutEmailLink = document.getElementById('about-email');
    const contactEmailLink = document.getElementById('contact-email');
    const emailUser = 'nekoslevin';
    const emailDomain = 'gmail.com';
    const email = emailUser + '@' + emailDomain;

    if (aboutEmailLink) {
        aboutEmailLink.href = 'mailto:' + email;
        aboutEmailLink.textContent = email;
    }

    if (contactEmailLink) {
        contactEmailLink.href = 'mailto:' + email;
        contactEmailLink.textContent = email;
    }

    // Portfolio Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Back to Top Button
    const backToTopButton = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    });

    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Skill Bars Animation
    const skillBars = document.querySelectorAll('.progress-line span');

    function animateSkillBars() {
        skillBars.forEach(bar => {
            const width = bar.parentElement.classList.contains('design') ? '95%' :
                          bar.parentElement.classList.contains('frontend') ? '90%' :
                          bar.parentElement.classList.contains('backend') ? '85%' : '80%';
            bar.style.width = width;
        });
    }

    const aboutSection = document.querySelector('.about');
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    observer.observe(aboutSection);

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Dark Mode Toggle
    const darkModeToggle = document.createElement('div');
    darkModeToggle.innerHTML = `
        <button id="darkModeToggle" class="btn" style="position: fixed; bottom: 30px; left: 30px; z-index: 999; padding: 10px 15px;">
            <i class="fas fa-moon"></i>
        </button>
    `;
    document.body.appendChild(darkModeToggle);

    const toggleBtn = document.getElementById('darkModeToggle');
    if (toggleBtn) {
        let darkMode = localStorage.getItem('darkMode') === 'true';

        function enableDarkMode() {
            document.body.classList.add('dark-mode');
            toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('darkMode', 'true');
        }

        function disableDarkMode() {
            document.body.classList.remove('dark-mode');
            toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('darkMode', 'false');
        }

        if (darkMode) {
            enableDarkMode();
        }

        toggleBtn.addEventListener('click', () => {
            darkMode = !darkMode;
            darkMode ? enableDarkMode() : disableDarkMode();
        });
    }

    // Project Modal
    const portfolioItemsModal = document.querySelectorAll('.portfolio-item');
    const modal = document.getElementById('projectModal');
    const closeModal = document.querySelector('.close-modal');
    const modalImage = document.getElementById('modalProjectImage');
    const modalTitle = document.getElementById('modalProjectTitle');
    const modalDescription = document.getElementById('modalProjectDescription');
    const modalTech = document.getElementById('modalProjectTech');
    const modalProjectLink = document.getElementById('modalProjectLink');
    const modalProjectCode = document.getElementById('modalProjectCode');

    if (modal && closeModal && modalImage && modalTitle && modalDescription && modalTech) {
        const projects = {
            "Revenue Trend Analysis": {
                description: "Developed interactive Tableau dashboards to visualize revenue trends, improving decision-making by 30% during KRA internship.",
                technologies: ["Tableau", "Excel", "SQL"],
                liveLink: "#",
                codeLink: "#"
            },
            "Financial Forecasting Model": {
                description: "Built a Python-based predictive model to forecast financial trends, enhancing budget planning accuracy.",
                technologies: ["Python", "Pandas", "Scikit-learn"],
                liveLink: "#",
                codeLink: "#"
            },
            "Tax Compliance System": {
                description: "Streamlined tax filing processes using iTax System, reducing compliance errors by 25% at KRA.",
                technologies: ["iTax System", "Excel", "SQL"],
                liveLink: "#",
                codeLink: "#"
            },
            "Statistical Survey Analysis": {
                description: "Conducted survey analysis with R, providing actionable insights for client satisfaction strategies.",
                technologies: ["R", "Excel", "SPSS"],
                liveLink: "#",
                codeLink: "#"
            },
            "Cost Optimization Dashboard": {
                description: "Created an Excel-based dashboard for cost tracking, saving 15% in operational expenses.",
                technologies: ["Excel", "VBA", "Power BI"],
                liveLink: "#",
                codeLink: "#"
            },
            "Tax Audit Workflow": {
                description: "Designed an SQL-driven audit workflow, improving audit efficiency by 20% during KRA internship.",
                technologies: ["SQL", "Excel", "Power BI"],
                liveLink: "#",
                codeLink: "#"
            }
        };

        portfolioItemsModal.forEach(item => {
            item.addEventListener('click', () => {
                const projectTitle = item.querySelector('.portfolio-overlay h3')?.textContent;
                const projectImage = item.querySelector('img')?.src;

                if (projectTitle && projectImage) {
                    modalImage.src = projectImage || 'static/images/placeholder.jpg';
                    modalTitle.textContent = projectTitle;
                    modalDescription.textContent = projects[projectTitle]?.description || "No description available.";

                    modalTech.innerHTML = '';
                    if (projects[projectTitle]?.technologies) {
                        projects[projectTitle].technologies.forEach(tech => {
                            const li = document.createElement('li');
                            li.textContent = tech;
                            modalTech.appendChild(li);
                        });
                    } else {
                        const li = document.createElement('li');
                        li.textContent = "No technologies listed.";
                        modalTech.appendChild(li);
                    }

                    modalProjectLink.href = projects[projectTitle]?.liveLink || "#";
                    modalProjectCode.href = projects[projectTitle]?.codeLink || "#";

                    modal.classList.add('show');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        modalProjectCode.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Please contact Mr. Slevin to get started!');
        });

        closeModal.addEventListener('click', () => {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    }
    // Track CV Downloads
    function trackCVDownload() {
        if (typeof window.cfAnalytics !== 'undefined' && window.cfAnalytics.logEvent) {
            window.cfAnalytics.logEvent({
                name: 'cv_download',
                properties: { file: 'Slevin_Resume.pdf' }
            });
        } else {
            console.warn('Cloudflare Web Analytics not initialized');
        }
    }
});