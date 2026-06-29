// Apply persisted direction layout immediately to prevent layout flash on refresh
document.documentElement.dir = localStorage.getItem('dir') || 'ltr';

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initRTL();
    initNavbar();
    initScrollReveal();
    initBackToTop();
    initCursorBlob();
});

/* --- Theme Persistence --- */
function initTheme() {
    const themeBtns = document.querySelectorAll('.theme-toggle');
    const storedTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', storedTheme);
    updateThemeIcon(storedTheme);

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const target = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', target);
            localStorage.setItem('theme', target);
            updateThemeIcon(target);
        });
    });
}

function updateThemeIcon(theme) {
    const icons = document.querySelectorAll('.theme-toggle i');
    icons.forEach(icon => {
        icon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
    });
}

/* --- Floating Navbar Scroll Effect --- */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Close offcanvas on link click
    const offcanvas = document.querySelector('.offcanvas');
    if (offcanvas) {
        const links = offcanvas.querySelectorAll('.nav-link:not([data-bs-toggle="collapse"]), .btn:not([data-bs-toggle="collapse"])');
        links.forEach(link => {
            link.addEventListener('click', () => {
                const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
                if (bsOffcanvas) bsOffcanvas.hide();
            });
        });

        // Prevent body scroll when offcanvas is open
        let scrollPosition = 0;
        offcanvas.addEventListener('show.bs.offcanvas', () => {
            scrollPosition = window.scrollY || window.pageYOffset;
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollPosition}px`;
            document.body.style.width = '100%';
        });
        offcanvas.addEventListener('hide.bs.offcanvas', () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, scrollPosition);
        });
    }
}

/* --- RTL Direction Persistence --- */
function initRTL() {
    const rtlBtns = document.querySelectorAll('.rtl-toggle');
    rtlBtns.forEach(btn => {
        btn.removeAttribute('onclick');
        btn.addEventListener('click', () => {
            const current = document.documentElement.dir;
            const target = current === 'rtl' ? 'ltr' : 'rtl';
            document.documentElement.dir = target;
            localStorage.setItem('dir', target);
        });
    });
}

/* --- Dynamic Cursor Blob --- */
function initCursorBlob() {
    const blob = document.querySelector('.cursor-blob');
    if (!blob) return;

    window.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        blob.style.left = `${x - 200}px`;
        blob.style.top = `${y - 200}px`;
    });
}

/* --- Intersection Observer for Bento & Reveal --- */
function initScrollReveal() {
    const options = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, options);

    const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-up, .reveal-left, .reveal-right, .scale-up, .bento-card');
    revealElements.forEach(el => observer.observe(el));
}


function staggerItems(container) {
    const items = container.querySelectorAll('.stagger-item');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
            item.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1)`;
        }, index * 150);
    });
}

/* --- Back To Top --- */
function initBackToTop() {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    btn.className = 'back-to-top btn-accent';
    document.body.appendChild(btn);

    // Styling logic via JS to avoid extra CSS rules for a simple fixed button
    Object.assign(btn.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        zIndex: '1000',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.style.display = 'flex';
        } else {
            btn.style.display = 'none';
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* --- Unique Page Animations (Special Triggers) --- */
function initHeroAnimations() {
    const hero = document.querySelector('.hero-wrapper');
    if (!hero || window.innerWidth < 992) return;

    // Index Parallax (Desktop Only)
    if (document.title.includes('Home')) {
        window.addEventListener('scroll', () => {
            const scroll = window.scrollY;
            const bg = hero.querySelector('.hero-bg');
            if (bg) {
                bg.style.transform = `translateY(${scroll * 0.4}px)`;
            }
        });
    }
}

/* --- Counter Animations (home-2.html) --- */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.counter-val');
    if (counters.length === 0) return;

    const options = { threshold: 1.0 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.getAttribute('data-target'));
                let count = 0;
                const speed = 2000 / countTo;
                
                const updateCount = () => {
                    const inc = Math.ceil(countTo / 100);
                    if (count < countTo) {
                        count += inc;
                        target.innerText = count > countTo ? countTo : count;
                        setTimeout(updateCount, speed);
                    }
                };
                updateCount();
                observer.unobserve(target);
            }
        });
    }, options);

    counters.forEach(counter => observer.observe(counter));
}
