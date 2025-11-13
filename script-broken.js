// Современный JavaScript с частицами и 3D-эффектами
// Инициализация всех компонентов
document.addEventListener('DOMContentLoaded', () => {
            window.addEventListener('resize', () => this.init());
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
                    radius: Math.random() * 3 + 1,
                    opacity: Math.random() * 0.5 + 0.2
                });
            }
        }
        
        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
                
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(139, 0, 0, ${particle.opacity})`;
                this.ctx.fill();
            });
            
            // Соединяем близкие частицы
            this.particles.forEach((p1, i) => {
                this.particles.slice(i + 1).forEach(p2 => {
                    const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
                    if (distance < 100) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(p1.x, p1.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.strokeStyle = `rgba(139, 0, 0, ${0.1 * (1 - distance / 100)})`;
                        this.ctx.stroke();
                    }
                });
            });
            
            requestAnimationFrame(() => this.animate());
        }
    }
    
    // Инициализация системы частиц
    new ParticleSystem();
    
    // Прогрузка изображений с эффектом
    class ImageLoader {
        constructor() {
            this.init();
        }

        init() {
            const images = document.querySelectorAll('img');
            images.forEach(img => this.loadImage(img));
        }

        loadImage(img) {
            // Добавляем класс загрузки
            img.classList.add('img-loading');
            
            // Создаем лоадер
            const loader = document.createElement('div');
            loader.className = 'image-loader';
            img.parentNode.insertBefore(loader, img);
            
            // Когда изображение загружено
            img.onload = () => {
                img.classList.remove('img-loading');
                img.classList.add('img-loaded');
                if (loader.parentNode) {
                    loader.remove();
                }
            };
            
            // Если изображение уже загружено
            if (img.complete) {
                img.classList.remove('img-loading');
                img.classList.add('img-loaded');
                if (loader.parentNode) {
                    loader.remove();
                }
            }
        }
    }
    
    new ImageLoader();
    
    // Современная навигация
    const nav = document.querySelector('.modern-nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Показываем навигацию при прокрутке
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Мобильное меню
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Закрываем меню при клике на ссылку
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Современный слайдер
    const modernSliders = document.querySelectorAll('.modern-slider');
    modernSliders.forEach(slider => {
        const images = slider.querySelector('.slider-images');
        const prevBtn = slider.querySelector('.prev-btn');
        const nextBtn = slider.querySelector('.next-btn');
        const dotsContainer = slider.querySelector('.slider-dots');
        let currentIndex = 0;
        let autoSlideInterval;
        
        if (images && images.children.length > 0) {
            // Создаем точки
            for (let i = 0; i < images.children.length; i++) {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
            
            function updateSlider() {
                images.style.transform = `translateX(-${currentIndex * 100}%)`;
                
                // Обновляем точки
                const dots = dotsContainer.querySelectorAll('.dot');
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
            }
            
            function goToSlide(index) {
                currentIndex = index;
                updateSlider();
                resetAutoSlide();
            }
            
            function nextSlide() {
                currentIndex = (currentIndex + 1) % images.children.length;
                updateSlider();
            }
            
            function prevSlide() {
                currentIndex = (currentIndex - 1 + images.children.length) % images.children.length;
                updateSlider();
            }
            
            function startAutoSlide() {
                autoSlideInterval = setInterval(nextSlide, 5000);
            }
            
            function resetAutoSlide() {
                clearInterval(autoSlideInterval);
                startAutoSlide();
            }
            
            // Обработчики событий
            nextBtn?.addEventListener('click', () => {
                nextSlide();
                resetAutoSlide();
            });
            
            prevBtn?.addEventListener('click', () => {
                prevSlide();
                resetAutoSlide();
            });
            
            // Пауза при наведении
            slider.addEventListener('mouseenter', () => {
                clearInterval(autoSlideInterval);
            });
            
            slider.addEventListener('mouseleave', () => {
                startAutoSlide();
            });
            
            // Клик свайпы для мобильных
            let startX = 0;
            let endX = 0;
            
            slider.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });
            
            slider.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                if (startX - endX > 50) {
                    nextSlide();
                    resetAutoSlide();
                } else if (endX - startX > 50) {
                    prevSlide();
                    resetAutoSlide();
                }
            });
            
            startAutoSlide();
        }
    });
    
    // 3D эффекты для карточек
    const cards3D = document.querySelectorAll('.feature-card');
    cards3D.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
    
    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
    
    // Анимации при прокрутке (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Добавляем 3D эффект при появлении
                if (entry.target.classList.contains('feature-card')) {
                    setTimeout(() => {
                        entry.target.style.transform = 'perspective(1000px) rotateX(5deg) rotateY(5deg)';
                        setTimeout(() => {
                            entry.target.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
                        }, 300);
                    }, 200);
                }
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами
    document.querySelectorAll('.hero-section, .about-section, .feature-card').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Параллакс эффект для hero секции
    const heroHeader = document.querySelector('.hero-header');
    const heroBg = document.querySelector('.hero-bg');
    
    if (heroHeader && heroBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            heroBg.style.transform = `translateY(${scrolled * parallaxSpeed}px) scale(${1 + scrolled * 0.0005})`;
        });
    }
    
    // Эффект печатной машинки для заголовков
    const typewriterElements = document.querySelectorAll('.section-title');
    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.opacity = '1';
        
        let index = 0;
        const typeSpeed = 50;
        
        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, typeSpeed);
            }
        }
        
        // Запускаем анимацию когда элемент виден
        const titleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !element.classList.contains('typed')) {
                    element.classList.add('typed');
                    type();
                }
            });
        });
        
        titleObserver.observe(element);
    });
    
    // Современные уведомления
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <strong>${type === 'success' ? '✓' : '⚠'}</strong> ${message}
        `;
        
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
    }
    
    // Прогресс бар для прокрутки страницы
    function createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #8B0000, #006400);
            z-index: 9999;
            transition: width 0.3s ease;
        `;
        
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
    
    createProgressBar();
    
    // Кнопка "Наверх"
    function createBackToTop() {
        const backToTop = document.createElement('button');
        backToTop.innerHTML = '↑';
        backToTop.className = 'back-to-top';
        backToTop.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #8B0000, #006400);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
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
        card.addEventListener('mouseleave', () => {
            document.body.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
        });
    });
    
    // Обработка старого слайдера для обратной совместимости
    const oldSliders = document.querySelectorAll('.slider');
    oldSliders.forEach(slider => {
        const images = slider.querySelector('.slider-images');
        const prevBtn = slider.querySelector('.slider-prev');
        const nextBtn = slider.querySelector('.slider-next');
        let currentIndex = 0;
        let autoSlideInterval;
        
        if (images && images.children.length > 0) {
            function initSlider() {
                updateSlider();
                
                autoSlideInterval = setInterval(() => {
                    currentIndex = (currentIndex + 1) % images.children.length;
                    updateSlider();
                }, 5000);
            }
            
            function updateSlider() {
                images.style.transform = `translateX(-${currentIndex * 100}%)`;
                
                const indicators = slider.querySelectorAll('.slider-indicator');
                indicators.forEach((indicator, index) => {
                    indicator.classList.toggle('active', index === currentIndex);
                });
            }
        
            nextBtn?.addEventListener('click', () => {
                clearInterval(autoSlideInterval);
                currentIndex = (currentIndex + 1) % images.children.length;
                updateSlider();
                initSlider();
            });
            
            prevBtn?.addEventListener('click', () => {
                clearInterval(autoSlideInterval);
                currentIndex = (currentIndex - 1 + images.children.length) % images.children.length;
                updateSlider();
                initSlider();
            });

            slider.addEventListener('mouseenter', () => {
                clearInterval(autoSlideInterval);
            });
            
            slider.addEventListener('mouseleave', () => {
                initSlider();
            });
            
            initSlider();
        }
    });

    // Функционал для квиза (если на странице квиза)
    if (window.location.pathname.endsWith("quiz.html")) {
        const questions = [
            {
                question: "Когда началась Великая Отечественная война?",
                options: ["22 июня 1941", "1 сентября 1939", "7 декабря 1941", "9 мая 1945"],
                answer: 0,
                fact: "22 июня 1941 года Германия напала на Советский Союз без объявления войны."
            },
            {
                question: "Сколько примерно партизан действовало в Беларуси во время войны?",
                options: ["100 тыс.", "374 тыс.", "1 млн", "50 тыс."],
                answer: 1,
                fact: "В Беларуси действовало 374 тысячи партизан, что составляло мощное сопротивление оккупантам."
            },
            {
                question: "Как звали операцию по освобождению Беларуси в 1944 году?",
                options: ["Барбаросса", "Багратион", "Тайфун", "Цитадель"],
                answer: 1,
                fact: "Операция «Багратион» стала одной из крупнейших военных операций в истории."
            },
            {
                question: "Когда была освобождена Ошмяны?",
                options: ["3 июля 1944", "7 июля 1944", "9 мая 1945", "22 июня 1941"],
                answer: 1,
                fact: "Ошмяны были освобождены 7 июля 1944 года войсками 3-го Белорусского фронта."
            },
            {
                question: "Сколько белорусов сражалось на фронтах Великой Отечественной?",
                options: ["Около 1,3 млн", "500 тыс.", "2 млн", "800 тыс."],
                answer: 0,
                fact: "Примерно 1,3 миллиона белорусов сражалось на фронтах войны."
            },
            {
                question: "Какой мемориал символизирует уничтоженные деревни в Беларуси?",
                options: ["Брестская крепость", "Хатынь", "Курган Славы", "Линия Сталина"],
                answer: 1,
                fact: "Хатынь - символ сотен белорусских деревень, уничтоженных нацистами."
            },
            {
                question: "Когда закончилась Великая Отечественная война?",
                options: ["9 мая 1945", "2 сентября 1945", "8 мая 1945", "7 мая 1945"],
                answer: 0,
                fact: "Акт о безоговорочной капитуляции Германии был подписан 8 мая, а в СССР об этом объявили 9 мая."
            },
            {
                question: "Какова доля потерь населения Беларуси в годы войны?",
                options: ["Каждый пятый", "Каждый третий", "Каждый второй", "Каждый четвёртый"],
                answer: 1,
                fact: "Беларусь потеряла каждого третьего жителя - самый высокий показатель среди всех стран-участниц."
            },
            {
                question: "Кто совершил огненный таран в первые дни войны в Беларуси?",
                options: ["Пётр Машеров", "Николай Гастелло", "Вера Хоружая", "Марат Казей"],
                answer: 1,
                fact: "Николай Гастелло направил горящий самолёт на колонну вражеской техники."
            },
            {
                question: "Что такое 'рельсовая война' в партизанском движении?",
                options: ["Партизанские диверсии на ж/д", "Битва за Минск", "Оборона Бреста", "Штурм Берлина"],
                answer: 0,
                fact: "Партизаны взрывали железные дороги, disrupting немецкие поставки."
            }
        ];

        const questionElement = document.getElementById('question');
        const optionsContainer = document.getElementById('options-container');
        const nextButton = document.getElementById('next-btn');
        const restartButton = document.getElementById('restart-btn');
        const progressText = document.getElementById('progress-text');
        const progressFill = document.getElementById('progress-fill');
        const timerElement = document.getElementById('timer');
        const resultContainer = document.getElementById('result-container');
        const scoreElement = document.getElementById('score');
        const resultMessage = document.getElementById('result-message');

        let currentQuestion = 0;
        let score = 0;
        let selectedOption = null;
        let timeLeft = 30;
        let timerInterval;
        let quizCompleted = false;

        function initQuiz() {
            currentQuestion = 0;
            score = 0;
            quizCompleted = false;
            showQuestion();
            resultContainer.classList.add('hidden');
            restartButton.classList.add('hidden');
            nextButton.classList.remove('hidden');
        }

        function showQuestion() {
            if (currentQuestion >= questions.length) {
                endQuiz();
                return;
            }

            const question = questions[currentQuestion];
            questionElement.textContent = question.question;
            progressText.textContent = `Вопрос ${currentQuestion + 1} из ${questions.length}`;
            progressFill.style.width = `${((currentQuestion) / questions.length) * 100}%`;

            optionsContainer.innerHTML = '';
            question.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'option-btn';
                button.textContent = option;
                button.setAttribute('data-index', index);
                button.addEventListener('click', selectOption);
                optionsContainer.appendChild(button);
            });

            selectedOption = null;
            nextButton.disabled = true;
            nextButton.textContent = 'Выберите ответ';
            startTimer();
        }

        function selectOption(e) {
            if (quizCompleted) return;

            document.querySelectorAll('.option-btn').forEach(btn => {
                btn.classList.remove('selected', 'correct', 'wrong');
            });

            const selectedBtn = e.target;
            selectedOption = parseInt(selectedBtn.getAttribute('data-index'));
            selectedBtn.classList.add('selected');

            const isCorrect = selectedOption === questions[currentQuestion].answer;
            if (isCorrect) {
                selectedBtn.classList.add('correct');
                score++;
                showNotification('Правильно!', 'success');
            } else {
                selectedBtn.classList.add('wrong');
                document.querySelectorAll('.option-btn')[questions[currentQuestion].answer].classList.add('correct');
                showNotification('Неправильно', 'error');
            }

            nextButton.disabled = false;
            nextButton.textContent = 'Далее';
            clearInterval(timerInterval);

            showFact(questions[currentQuestion].fact);
        }

        function showFact(fact) {
            const factElement = document.createElement('div');
            factElement.className = 'quiz-fact';
            factElement.innerHTML = `<strong>Интересный факт:</strong> ${fact}`;
            optionsContainer.appendChild(factElement);
        }

        function startTimer() {
            timeLeft = 30;
            updateTimer();
            clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                timeLeft--;
                updateTimer();
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    autoNextQuestion();
                }
            }, 1000);
        }

        function updateTimer() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `⏱️ ${seconds} сек`;
            timerElement.className = timeLeft <= 5 ? 'timer-warning' : '';
        }

        function autoNextQuestion() {
            if (selectedOption === null) {
                document.querySelectorAll('.option-btn')[questions[currentQuestion].answer].classList.add('correct');
                showFact(questions[currentQuestion].fact);
            }
            nextButton.disabled = false;
            nextButton.textContent = 'Далее';
        }

        nextButton.addEventListener('click', () => {
            if (nextButton.disabled) return;
            
            currentQuestion++;
            if (currentQuestion < questions.length) {
                showQuestion();
            } else {
                endQuiz();
            }
        });

        function endQuiz() {
            quizCompleted = true;
            clearInterval(timerInterval);
            
            questionElement.textContent = 'Квиз завершён!';
            optionsContainer.innerHTML = '';
            nextButton.classList.add('hidden');
            restartButton.classList.remove('hidden');
            resultContainer.classList.remove('hidden');
            
            progressFill.style.width = '100%';
            scoreElement.textContent = `${score} из ${questions.length}`;
            
            const percentage = (score / questions.length) * 100;
            if (percentage >= 90) {
                resultMessage.textContent = 'Отличный результат! Вы прекрасно знаете историю Великой Отечественной войны.';
                showNotification('Поздравляем! Отличный результат!', 'success');
            } else if (percentage >= 70) {
                resultMessage.textContent = 'Хороший результат! Вы хорошо ориентируетесь в истории войны.';
                showNotification('Хороший результат!', 'success');
            } else if (percentage >= 50) {
                resultMessage.textContent = 'Неплохой результат! Есть что повторить.';
                showNotification('Неплохо, но можно лучше!', 'error');
            } else {
                resultMessage.textContent = 'Рекомендуем изучить материалы сайта для улучшения знаний.';
                showNotification('Изучите материалы сайта', 'error');
            }
        }

        restartButton.addEventListener('click', initQuiz);

        initQuiz();
    }
});

// Дополнительные стили для динамических элементов
document.head.insertAdjacentHTML('beforeend', `
<style>
    .fade-in {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .hidden {
        display: none !important;
    }
    
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #8B0000, #006400);
        z-index: 9999;
        transition: width 0.3s ease;
    }
    
    .back-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #8B0000, #006400);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .back-to-top:hover {
        transform: scale(1.1);
    }
    
    .quiz-fact {
        margin-top: 15px;
        padding: 15px;
        background: #f8f9fa;
        border-left: 4px solid #006400;
        border-radius: 5px;
        font-size: 0.9rem;
        animation: fadeIn 0.3s ease;
    }
    
    .option-btn {
        width: 100%;
        padding: 15px 20px;
        margin-bottom: 10px;
        background: #f8f9fa;
        border: 2px solid #e1e8ed;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1rem;
        text-align: left;
    }
    
    .option-btn:hover {
        background: #e9ecef;
        border-color: #006400;
    }
    
    .option-btn.selected {
        border-color: #8B0000;
        background: #fff5f5;
    }
    
    .option-btn.correct {
        background: #d4edda;
        border-color: #28a745;
        color: #155724;
    }
    
    .option-btn.wrong {
        background: #f8d7da;
        border-color: #dc3545;
        color: #721c24;
    }
    
    .timer-warning {
        color: #dc3545 !important;
        animation: pulse 1s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
</style>
`);