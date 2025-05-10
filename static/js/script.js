document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle: Handles opening and closing the mobile navigation menu
    const menuToggle = document.querySelector('.menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.add('active');
    });

    closeMenu.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Sticky Header: Adds 'scrolled' class to header when scrolling past 100px
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 100);
    });

    // Typing Animation: Creates a typing effect for the hero section's role descriptions
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

    // Portfolio Filter: Filters portfolio items based on category buttons
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

    // Testimonial Slider: Manages the testimonial carousel with next/prev controls
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.slider-prev');
    const nextButton = document.querySelector('.slider-next');
    let currentSlide = 0;

    function showSlide(index) {
        testimonialSlides.forEach(slide => slide.classList.remove('active'));
        testimonialSlides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonialSlides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
        showSlide(currentSlide);
    }

    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);

    setInterval(nextSlide, 5000);

    // Back to Top Button: Shows/hides button based on scroll position and scrolls to top
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

    // Skill Bars Animation: Animates skill progress bars when About section is in view
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

    // Smooth Scrolling: Enables smooth scrolling for anchor links
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

    // Form Submission: Displays a confirmation alert on form submit (placeholder)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        });
    }

    // Dark Mode Toggle: Toggles dark mode and persists setting in localStorage
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

    // Project Modal: Displays project details in a modal when portfolio item is clicked
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

        // View Code Alert: Shows pop-up when "View Code" is clicked
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
});