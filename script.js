function initApp() {
    document.body.classList.add('has-site-nav');
    new ThemeManager();
    optimizeImages();
    addPreconnectLinks();
    injectAnalytics();
    new ParticleSystem();
    new SiteNavigation();
    new ImageLoader();
    initScrollAnimations();
    initParallaxEffect();
    initTypewriterEffect();
    initNotifications();
    initScrollProgress();
    initBackToTop();
    init3DCards();
    initSmoothScrolling();
    const lm = new LocalizationManager();
    lm.bindEvents();
    lm.toggleActiveButtons();
    
    initSliderGuaranteed();
    
    window.addEventListener('load', () => {
        if (window.localizationManager) {
            window.localizationManager.bindEvents();
            window.localizationManager.toggleActiveButtons();
        }
        initSliderGuaranteed();
    });
}

function initSliderGuaranteed() {
    const slider = document.querySelector('.main-slider');
    if (!slider) {
        console.warn('Слайдер .main-slider не найден');
        return;
    }
    
    if (slider.dataset.sliderInitialized === 'true') {
        return;
    }
    
    const container = slider.querySelector('.slider-container');
    const images = slider.querySelector('.slider-images');
    const slides = images ? images.querySelectorAll('.slide-img') : [];
    const dotsContainer = slider.querySelector('.slider-dots');
    
    if (!container || !images || !dotsContainer || !slides.length) {
        console.warn('Отсутствуют элементы слайдера, повторная попытка через 100мс');
        setTimeout(initSliderGuaranteed, 100);
        return;
    }
    
    new ModernSlider();
    slider.dataset.sliderInitialized = 'true';
    console.log('Слайдер успешно инициализирован');
}

let fallbackAttempts = 0;
const fallbackInterval = setInterval(() => {
    fallbackAttempts++;
    const slider = document.querySelector('.main-slider');
    
    if (slider && slider.dataset.sliderInitialized !== 'true') {
        console.log(`Фоллбэк попытка ${fallbackAttempts}`);
        initSliderGuaranteed();
    }
    
    if (fallbackAttempts >= 10 || (slider && slider.dataset.sliderInitialized === 'true')) {
        clearInterval(fallbackInterval);
    }
}, 1000);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

if (!window.localizationManager) {
    document.addEventListener('DOMContentLoaded', () => {
        const lm = new LocalizationManager();
        lm.bindEvents();
        lm.toggleActiveButtons();
    });
}

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 100;
        this.mouse = { x: null, y: null, radius: 150 };
        
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.init());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
    }
    
    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.particles = [];
        
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, i) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(139, 0, 0, ${particle.opacity})`;
            this.ctx.fill();
            
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[j].x - particle.x;
                const dy = this.particles[j].y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(139, 0, 0, ${0.1 * (1 - distance / 100)})`;
                    this.ctx.stroke();
                }
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

class ImageLoader {
    constructor() {
        this.init();
    }

    init() {
        const images = document.querySelectorAll('img:not(.slide-img)');
        images.forEach(img => this.loadImage(img));
    }

    loadImage(img) {
        if (img.complete && img.naturalHeight !== 0) {
            img.classList.add('img-loaded');
            return;
        }
        
        img.classList.add('img-loading');

        const handleLoad = () => {
            img.classList.remove('img-loading');
            img.classList.add('img-loaded');
        };
        
        const handleError = () => {
            img.classList.remove('img-loading');
            img.style.display = 'none';
            console.warn('Failed to load image:', img.src);
        };
        
        img.addEventListener('load', handleLoad, { once: true });
        img.addEventListener('error', handleError, { once: true });
    }
}

class ThemeManager {
    constructor() {
        this.storageKey = 'site-theme';
        this.root = document.documentElement;
        this.current = this.getInitialTheme();
        this.apply(this.current);
        this.renderToggle();
        this.bind();
    }

    getInitialTheme() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved === 'dark' || saved === 'light') return saved;
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light';
    }

    apply(theme) {
        this.current = theme;
        this.root.setAttribute('data-theme', theme);
        localStorage.setItem(this.storageKey, theme);
        const btn = document.querySelector('.theme-toggle');
        if (btn) btn.setAttribute('aria-pressed', String(theme === 'dark'));
    }

    toggle = () => this.apply(this.current === 'dark' ? 'light' : 'dark');

    renderToggle() {
        const existing = document.querySelector('.theme-toggle.theme-toggle--nav');
        if (!existing) {
            console.warn('Theme toggle button not found in HTML');
        }
    }

    bind() {
        const btns = document.querySelectorAll('.theme-toggle');
        if (!btns.length) {
            console.warn('No theme toggle buttons found');
            return;
        }
        btns.forEach(b => b.addEventListener('click', this.toggle));
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                const saved = localStorage.getItem(this.storageKey);
                if (!saved) this.apply(e.matches ? 'dark' : 'light');
            });
        }
    }
}

class SiteNavigation {
    constructor() {
        this.nav = document.querySelector('.site-nav');
        this.menu = document.querySelector('.nav-menu');
        this.toggle = document.querySelector('.nav-toggle');
        this.links = document.querySelectorAll('.nav-link');

        this.bindEvents();
        this.highlightActiveLink();
        this.handleScroll();
    }

    renderToggle() {
        const nav = document.querySelector('.site-nav');
        if (!nav) return;
        const langSwitch = nav.querySelector('.lang-switch');
        if (langSwitch && !langSwitch.parentElement.querySelector('.theme-toggle.theme-toggle--nav')) {
            const btn = document.createElement('button');
            btn.className = 'theme-toggle theme-toggle--nav';
            btn.type = 'button';
            btn.title = 'Toggle theme';
            btn.setAttribute('aria-label', 'Toggle theme');
            btn.innerHTML = '<span class="sun">☀️</span><span class="moon">🌙</span>';
            langSwitch.insertAdjacentElement('afterend', btn);
            return;
        }
        let utils = nav.querySelector('.nav-utilities');
        if (!utils) {
            const inner = nav.querySelector('.nav-inner') || nav;
            utils = document.createElement('div');
            utils.className = 'nav-utilities';
            inner.appendChild(utils);
        }
        if (!utils.querySelector('.theme-toggle.theme-toggle--nav')) {
            const btn2 = document.createElement('button');
            btn2.className = 'theme-toggle theme-toggle--nav';
            btn2.type = 'button';
            btn2.title = 'Toggle theme';
            btn2.setAttribute('aria-label', 'Toggle theme');
            btn2.innerHTML = '<span class="sun">☀️</span><span class="moon">🌙</span>';
            utils.appendChild(btn2);
        }
    }

    bind() {
        const btns = document.querySelectorAll('.theme-toggle');
        if (!btns.length) return;
        btns.forEach(b => b.addEventListener('click', this.toggle));
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                const saved = localStorage.getItem(this.storageKey);
                if (!saved) this.apply(e.matches ? 'dark' : 'light');
            });
        }
    }

    bindEvents() {
        if (this.toggle && this.menu) {
            this.toggle.addEventListener('click', () => this.toggleMenu());
        }

        this.links.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        window.addEventListener('scroll', () => this.handleScroll());

        document.addEventListener('click', (event) => {
            if (!this.nav || !this.menu) return;

            const clickedInsideNav = this.nav.contains(event.target);
            if (!clickedInsideNav) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        if (!this.menu || !this.toggle) return;
        this.menu.classList.toggle('open');
        this.toggle.classList.toggle('active');
    }

    closeMenu() {
        if (!this.menu || !this.toggle) return;
        this.menu.classList.remove('open');
        this.toggle.classList.remove('active');
    }

    highlightActiveLink() {
        if (!this.links.length) return;

        const currentPath = window.location.pathname.replace(/\/index\.html$/, '/');
        this.links.forEach(link => {
            const linkPath = link.getAttribute('href');
            const absoluteLinkPath = new URL(linkPath, window.location.origin).pathname;
            const linkMatches = absoluteLinkPath === window.location.pathname ||
                (absoluteLinkPath.endsWith('/index.html') && currentPath === '/');

            if (linkMatches) {
                this.links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    }

    handleScroll() {
        if (!this.nav) return;
        const scrolled = window.scrollY > 40;
        this.nav.classList.toggle('scrolled', scrolled);
    }
}

class LocalizationManager {
    constructor() {
        this.pageKey = document.documentElement.dataset.page || 'index';
        this.currentLang = localStorage.getItem('site-lang') || 'ru';
        this.langButtons = document.querySelectorAll('.lang-btn');
        this.handlers = new Map();

        window.localizationManager = this;

        this.applyLanguage(this.currentLang);
        this.bindEvents();
    }

    bindEvents() {
        const langSwitch = document.querySelector('.lang-switch');
        if (langSwitch) {
            langSwitch.addEventListener('click', (e) => {
                const button = e.target.closest('.lang-btn');
                if (button) {
                    e.preventDefault();
                    e.stopPropagation();
                    const lang = button.dataset.lang;
                    console.log('Language button clicked via delegation:', lang);
                    if (lang && lang !== this.currentLang) {
                        this.applyLanguage(lang);
                    }
                }
            });
        }
        if (!this._globalClickBound) {
            document.addEventListener('click', (e) => {
                const button = e.target.closest && e.target.closest('.lang-btn');
                if (!button) return;
                const lang = button.dataset && button.dataset.lang;
                if (!lang) return;
                e.preventDefault();
                e.stopPropagation();
                console.log('Language button clicked via document listener:', lang);
                if (lang !== this.currentLang) {
                    this.applyLanguage(lang);
                }
            }, true);
            this._globalClickBound = true;
        }
        this.langButtons = document.querySelectorAll('.lang-btn');
        this.langButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const lang = button.dataset.lang;
                console.log('Language button clicked directly:', lang);
                if (lang && lang !== this.currentLang) {
                    this.applyLanguage(lang);
                }
            });
            button.style.cursor = 'pointer';
            button.style.pointerEvents = 'auto';
            button.setAttribute('tabindex', '0');
        });
        console.log('Language buttons bound:', this.langButtons.length);
    }

    applyLanguage(lang) {
        console.log('=== APPLYING LANGUAGE ===', lang);
        this.currentLang = lang;
        localStorage.setItem('site-lang', lang);
        document.documentElement.lang = lang === 'be' ? 'be' : 'ru';
        this.toggleActiveButtons();
        this.updateTextContent();
        const event = new CustomEvent('languagechange', {
            detail: { lang },
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(event);
        console.log('Language change event dispatched, lang:', lang);
    }

    toggleActiveButtons() {
        this.langButtons = document.querySelectorAll('.lang-btn');
        this.langButtons.forEach(button => {
            const isActive = button.dataset.lang === this.currentLang;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', isActive);
        });
    }

    updateTextContent() {
        const dict = window.LOCALIZATION_DICTIONARY || LOCALIZATION_DICTIONARY;
        const dictionary = dict[this.pageKey];
        if (!dictionary) return;

        const translations = dictionary[this.currentLang];
        if (!translations) return;

        document.querySelectorAll('[data-i18n]').forEach(node => {
            const key = node.dataset.i18n;
            const value = translations[key];
            if (typeof value === 'undefined') return;

            const attrName = node.getAttribute('data-i18n-attr');
            if (attrName) {
                node.setAttribute(attrName, value);
            } else if (node.dataset.i18nType === 'html') {
                node.innerHTML = value;
            } else {
                node.textContent = value;
            }
        });
    }
}

class ModernSlider {
    constructor() {
        this.sliders = document.querySelectorAll('.main-slider');
        this.sliders.forEach((slider, index) => {
            this.initSlider(slider);
        });
    }

    initSlider(slider) {
        const container = slider.querySelector('.slider-container');
        const images = slider.querySelector('.slider-images');
        const slides = images ? images.querySelectorAll('.slide-img') : [];
        const dotsContainer = slider.querySelector('.slider-dots');

        if (!container || !images || !dotsContainer || !slides.length) {
            return;
        }
        
        slider.currentSlide = 0;
        let autoSlideInterval;

        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'dot' + (index === 0 ? ' active' : '');
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        const goToSlide = (index) => {
            slider.currentSlide = index;
            images.style.transform = `translateX(-${index * 100}%)`;
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });

        const nextSlide = () => {
            slider.currentSlide = (slider.currentSlide + 1) % slides.length;
            goToSlide(slider.currentSlide);
        };

        const prevSlide = () => {
            slider.currentSlide = (slider.currentSlide - 1 + slides.length) % slides.length;
            goToSlide(slider.currentSlide);
        };

        const startAutoSlide = () => {
            if (slides.length <= 1) return;
            autoSlideInterval = setInterval(nextSlide, 5000);
        };

        const stopAutoSlide = () => {
            clearInterval(autoSlideInterval);
        };

        const nextButton = slider.querySelector('.next-btn');
        const prevButton = slider.querySelector('.prev-btn');

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                nextSlide();
                stopAutoSlide();
                startAutoSlide();
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                prevSlide();
                stopAutoSlide();
                startAutoSlide();
            });
        }

        container.addEventListener('mouseenter', stopAutoSlide);
        container.addEventListener('mouseleave', startAutoSlide);

        let touchStartX = 0;
        let touchEndX = 0;

        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        });

        goToSlide(slider.currentSlide);
        startAutoSlide();
    }
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

function initParallaxEffect() {
    const heroBg = document.querySelector('.hero-bg');
    if (!heroBg) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        heroBg.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    });
}

function initTypewriterEffect() {
    const titles = document.querySelectorAll('.section-title');

    titles.forEach(title => {
        title.style.opacity = '1';

        let isTyping = false;

        const typeWriter = (text, index = 0) => {
            if (index < text.length) {
                title.textContent += text.charAt(index);
                setTimeout(() => typeWriter(text, index + 1), 50);
            }
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isTyping) {
                    isTyping = true;
                    const currentText = title.textContent || '';
                    title.textContent = '';
                    typeWriter(currentText, 0);
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(title);
    });
}

function initNotifications() {
    window.showNotification = function(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    };
}

function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    document.body.appendChild(progressBar);
    
    const progressFill = progressBar.querySelector('.progress-fill');
    
    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = (window.scrollY / scrollHeight) * 100;
        
        progressFill.style.width = `${scrollProgress}%`;
    });
}

function initBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', 'Наверх страницы');
    document.body.appendChild(backToTop);
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
}

function init3DCards() {
    const cards = document.querySelectorAll('.feature-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}
