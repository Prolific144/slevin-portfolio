// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS for scroll animations
    AOS.init({ duration: 800, once: true });

    // Custom Cursor: Follow mouse movement
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
    }

    // Mobile Menu: Toggle navigation menu for mobile devices
    const menuToggle = document.querySelector('.menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && closeMenu && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.add('active');
            navLinks.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        });

        closeMenu.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navLinks.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = 'auto';
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navLinks.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // Sticky Header: Add 'scrolled' class when scrolling past 100px
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 100);
        }
    });

    // Typing Animation: Cycle through roles in hero section
    const typedTextSpan = document.querySelector('.typed-text');
    const cursorSpan = document.querySelector('.cursor');
    const textArray = ['Statistician', 'Web Developer', 'Data Storyteller', 'Analytical Strategist', 'Tax Consultant'];
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
            textArrayIndex = (textArrayIndex + 1) % textArray.length;
            setTimeout(type, typingDelay + 1100);
        }
    }

    if (typedTextSpan && cursorSpan && textArray.length) {
        setTimeout(type, newTextDelay + 250);
    }

    // Profile Image Animation: Alternate images with fade, shake, and glass effect
    const profileImage = document.querySelector('.hero-image img');
    const imageWrapper = document.querySelector('.image-wrapper');
    const fallbackImage = 'static/images/profile.jpg'; // Fallback image
    if (profileImage && imageWrapper) {
        let currentImage = 1;
        profileImage.onerror = () => {
            console.warn(`Failed to load image: ${profileImage.src}`);
            profileImage.src = fallbackImage;
        };
        profileImage.onload = () => {
            console.log(`Successfully loaded hero image: ${profileImage.src}`);
        };
        setInterval(() => {
            // Apply glass effect and fade-out
            imageWrapper.classList.add('glass-effect', 'fade-out');
            setTimeout(() => {
                // Change image source
                profileImage.src = currentImage === 1 
                    ? 'static/images/profile2.jpg' 
                    : 'static/images/profile.jpg';
                currentImage = currentImage === 1 ? 2 : 1;
                // Remove fade-out and apply shake
                imageWrapper.classList.remove('fade-out');
                imageWrapper.classList.add('shake');
                setTimeout(() => {
                    // Remove glass effect and shake
                    imageWrapper.classList.remove('glass-effect', 'shake');
                }, 500);
            }, 500);
        }, 8000);
    }

    // Lazy Loading Images: Add 'loaded' class when images enter viewport (excluding portfolio)
    const lazyImages = document.querySelectorAll('img.lazy-load:not(.portfolio-item img)');
    if (lazyImages.length) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, { threshold: 0.3, rootMargin: '50px' });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Contact Modal: Handle all contact buttons to show/hide modal
    const contactModal = document.getElementById('contactModal');
    const contactButtons = document.querySelectorAll('.contact-btn');
    const closeContactModal = contactModal?.querySelector('.close-modal');

    if (contactButtons && contactModal && closeContactModal) {
        contactButtons.forEach(button => {
            button.addEventListener('click', () => {
                contactModal.classList.add('show');
                document.body.style.overflow = 'hidden';
                contactModal.focus();
            });
        });

        closeContactModal.addEventListener('click', () => {
            contactModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });

        window.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                contactModal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Dynamic Email: Construct email to prevent spam
    const aboutEmailLink = document.getElementById('about-email');
    if (aboutEmailLink) {
        const emailUser = 'nekoslevin';
        const emailDomain = 'gmail.com';
        const email = `${emailUser}@${emailDomain}`;
        aboutEmailLink.href = `mailto:${email}`;
        aboutEmailLink.textContent = email;
    }

    // Portfolio Filter and Modal: Load projects and handle interactions
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioGrid = document.querySelector('.portfolio-grid');
    const projectModal = document.getElementById('projectModal');
    const closeProjectModal = projectModal?.querySelector('.close-modal');
    let projectsData = [];

    // Fallback project data with known working image for testing
    const fallbackProjects = [
        {
            id: "revenuetrend",
            title: "Revenue Trend Analysis",
            description: "Developed interactive Tableau dashboards to visualize revenue trends, improving decision-making by 30% during KRA internship.",
            image: "static/images/data_visualization.jpg",
            category: "data",
            technologies: ["Tableau", "Excel", "SQL", "Streamlit", "React"],
            liveLink: "https://app-sales-dashboard-dy7t3qgwckyxpxfvc4rmrc.streamlit.app",
            codeLink: "https://github.com/Prolific144/streamlit-sales-dashboard"
        },
        {
            id: "financialforecast",
            title: "Financial Forecasting Model",
            description: "Built a Python-based predictive model to forecast financial trends, enhancing budget planning accuracy.",
            image: "static/images/financial_dashboard.jpg",
            category: "financial",
            technologies: ["Python", "Pandas", "Scikit-learn", "Flask", "Streamlit"],
            liveLink: "#",
            codeLink: "#"
        },
        {
            id: "taxcompliance",
            title: "Tax Compliance System",
            description: "Streamlined tax filing processes using iTax System, reducing compliance errors by 25% at KRA.",
            image: "static/images/tax_compliance.jpg",
            category: "tax",
            technologies: ["iTax System", "Excel", "SQL", "JavaScript"],
            liveLink: "#",
            codeLink: "#"
        },
        {
            id: "statisticalsurvey",
            title: "Statistical Survey Analysis",
            description: "Conducted survey analysis with R, providing actionable insights for client satisfaction strategies.",
            image: "static/images/statistical_analysis.jpg",
            category: "data",
            technologies: ["R", "Excel", "SPSS", "Google Forms"],
            liveLink: "#",
            codeLink: "#"
        },
        {
            id: "costoptimization",
            title: "Cost Optimization Dashboard",
            description: "Created an Excel-based dashboard for cost tracking, saving 15% in operational expenses.",
            image: "static/images/cost_optimization.jpg",
            category: "financial",
            technologies: ["Excel", "VBA", "Power BI", "Streamlit"],
            liveLink: "#",
            codeLink: "#"
        },
        {
            id: "taxaudit",
            title: "Tax Audit Workflow",
            description: "Designed an SQL-driven audit workflow, improving audit efficiency by 20% during KRA internship.",
            image: "static/images/tax_audit.jpg",
            category: "tax",
            technologies: ["SQL", "Excel", "Power BI"],
            liveLink: "https://pinaccleadvisorygroup.my.canva.site/",
            codeLink: "#"
        }
    ];

    // Render projects to the portfolio grid
    function renderProjects(projects) {
        console.log('Rendering projects:', projects);
        if (!portfolioGrid) {
            console.error('Portfolio grid not found');
            return;
        }
        portfolioGrid.innerHTML = '';
        const fallbackImage = 'static/images/profile.jpg';

        projects.forEach(project => {
            console.log(`Attempting to load image for ${project.title}: ${project.image}`);
            const portfolioItem = document.createElement('div');
            portfolioItem.className = 'portfolio-item';
            portfolioItem.setAttribute('data-category', project.category);
            portfolioItem.setAttribute('data-project-id', project.id);
            portfolioItem.innerHTML = `
                <img src="${project.image}" alt="${project.title}" class="portfolio-img">
                <div class="portfolio-overlay">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="portfolio-link">
                        <a href="${project.liveLink}" target="_blank" style="display: ${project.liveLink !== '#' ? 'inline-block' : 'none'}" aria-label="View live project ${project.title}"><i class="fas fa-external-link-alt"></i></a>
                        <a href="${project.codeLink}" target="_blank" style="display: ${project.codeLink !== '#' ? 'inline-block' : 'none'}" aria-label="View source code for ${project.title}"><i class="fas fa-code"></i></a>
                        <button class="view-details-btn" aria-label="View details for ${project.title}">View Details</button>
                    </div>
                </div>
            `;
            portfolioGrid.appendChild(portfolioItem);

            const img = portfolioItem.querySelector('img');
            img.onerror = () => {
                console.warn(`Failed to load image for ${project.title}: ${project.image}`);
                img.src = fallbackImage;
                img.onerror = () => {
                    console.warn(`Failed to load fallback image: ${fallbackImage}`);
                    img.src = 'https://via.placeholder.com/300x250?text=Image+Not+Found';
                };
            };
            img.onload = () => {
                console.log(`Successfully loaded image for ${project.title}: ${img.src}`);
            };
        });

        // Add event listeners for project modal
        document.querySelectorAll('.view-details-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const projectId = e.target.closest('.portfolio-item').getAttribute('data-project-id');
                const project = projectsData.find(p => p.id === projectId);
                if (project && projectModal) {
                    console.log(`Opening modal for project: ${project.title}`);
                    const modalImage = document.getElementById('projectModalImage');
                    modalImage.src = project.image || fallbackImage;
                    modalImage.onerror = () => {
                        console.warn(`Failed to load modal image for ${project.title}: ${project.image}`);
                        modalImage.src = fallbackImage;
                        modalImage.onerror = () => {
                            console.warn(`Failed to load modal fallback image: ${fallbackImage}`);
                            modalImage.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                        };
                    };
                    modalImage.onload = () => {
                        console.log(`Successfully loaded modal image for ${project.title}: ${modalImage.src}`);
                    };
                    document.getElementById('projectModalTitle').textContent = project.title;
                    document.getElementById('projectModalDescription').textContent = project.description;
                    const techList = document.getElementById('projectModalTechnologies');
                    techList.innerHTML = project.technologies.map(tech => `<li>${tech}</li>`).join('');
                    const liveLink = document.getElementById('projectModalLiveLink');
                    liveLink.href = project.liveLink;
                    liveLink.style.display = project.liveLink !== '#' ? 'inline-block' : 'none';
                    const codeLink = document.getElementById('projectModalCodeLink');
                    codeLink.href = project.codeLink;
                    codeLink.style.display = project.codeLink !== '#' ? 'inline-block' : 'none';

                    projectModal.classList.add('show');
                    document.body.style.overflow = 'hidden';
                    projectModal.focus();
                }
            });
        });
    }

    // Initialize portfolio filters
    function initializeFilters() {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');
                const portfolioItems = document.querySelectorAll('.portfolio-item');
                portfolioItems.forEach(item => {
                    item.style.display = (filterValue === 'all' || item.getAttribute('data-category') === filterValue)
                        ? 'block' : 'none';
                });
            });
        });
    }

    // Load projects from JSON or fallback
    fetch('projects.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(projects => {
            console.log('Loaded projects from JSON:', projects);
            projectsData = projects;
            renderProjects(projects);
            initializeFilters();
        })
        .catch(error => {
            console.error('Error loading projects.json:', error);
            portfolioGrid.innerHTML = '<p class="error-message">Unable to load projects. Displaying fallback projects.</p>';
            projectsData = fallbackProjects;
            renderProjects(fallbackProjects);
            initializeFilters();
        });

    // Project Modal: Handle closing
    if (closeProjectModal && projectModal) {
        closeProjectModal.addEventListener('click', () => {
            projectModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });

        window.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                projectModal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Back to Top: Show/hide button and scroll to top
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            backToTopButton.classList.toggle('active', window.pageYOffset > 300);
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Skill Bars Animation: Animate linear progress bars on scroll
    const skillBars = document.querySelectorAll('.progress-line span');
    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection && skillBars.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillBars.forEach(bar => {
                        const width = bar.parentElement.classList.contains('design') ? '95%' :
                                      bar.parentElement.classList.contains('frontend') ? '90%' : '85%';
                        bar.style.width = width;
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        observer.observe(skillsSection);
    }

    // Skills Section: Circular Progress Animation and Modal
    const skillItems = document.querySelectorAll('.skill-item');
    const skillModal = document.getElementById('skill-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalPercentage = document.getElementById('modal-percentage');
    const modalDetails = document.getElementById('modal-details');
    const closeSkillModal = skillModal?.querySelector('.close-modal');

    // Initialize Intersection Observer for circular progress bars
    const circularObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                const percentage = parseInt(item.getAttribute('data-percentage'));
                const progressCircle = item.querySelector('.progress-circle');
                const percentageText = item.querySelector('.percentage-text');
                const circumference = 226.2; // 2 * π * radius (36)
                const offset = circumference * (1 - percentage / 100);

                // Set progress bar offset
                progressCircle.style.strokeDashoffset = offset;
                progressCircle.setAttribute('aria-valuenow', percentage);

                // Animate percentage text
                let currentPercentage = 0;
                const interval = setInterval(() => {
                    if (currentPercentage <= percentage) {
                        percentageText.textContent = `${currentPercentage}%`;
                        item.setAttribute('data-current-percentage', currentPercentage);
                        currentPercentage++;
                    } else {
                        clearInterval(interval);
                    }
                }, 15);

                circularObserver.unobserve(item);
            }
        });
    }, { threshold: 0.5 });

    // Setup skill items for animation and modal interaction
    skillItems.forEach(item => {
        const percentage = parseInt(item.getAttribute('data-percentage'));
        const skillName = item.querySelector('span').textContent;
        const details = item.getAttribute('data-details');

        // Make skill item focusable for accessibility
        item.setAttribute('tabindex', '0');

        // Observe for lazy loading
        circularObserver.observe(item);

        // Click event for modal
        item.addEventListener('click', () => {
            if (modalTitle && modalPercentage && modalDetails && skillModal) {
                modalTitle.textContent = skillName;
                modalPercentage.textContent = `${item.getAttribute('data-current-percentage') || percentage}% Proficiency`;
                modalDetails.textContent = details;
                skillModal.classList.add('show');
                document.body.style.overflow = 'hidden';
                skillModal.focus();
            }
        });

        // Keyboard support for accessibility
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (modalTitle && modalPercentage && modalDetails && skillModal) {
                    modalTitle.textContent = skillName;
                    modalPercentage.textContent = `${item.getAttribute('data-current-percentage') || percentage}% Proficiency`;
                    modalDetails.textContent = details;
                    skillModal.classList.add('show');
                    document.body.style.overflow = 'hidden';
                    skillModal.focus();
                }
            }
        });
    });

    // Close skill modal
    if (closeSkillModal && skillModal) {
        closeSkillModal.addEventListener('click', () => {
            skillModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });

        window.addEventListener('click', (e) => {
            if (e.target === skillModal) {
                skillModal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && skillModal.classList.contains('show')) {
                skillModal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Dark Mode: Toggle and persist theme
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (darkModeToggle) {
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }

        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            darkModeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
        });
    }

    // Smooth Scrolling: For anchor links
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

    // Track CV Downloads: Log with Cloudflare Analytics
    window.trackCVDownload = function() {
        if (typeof window.cfAnalytics !== 'undefined' && window.cfAnalytics.logEvent) {
            window.cfAnalytics.logEvent({
                name: 'cv_download',
                properties: { file: 'Slevin_Resume.pdf' }
            });
        } else {
            console.warn('Cloudflare Web Analytics not initialized');
        }
    };
});