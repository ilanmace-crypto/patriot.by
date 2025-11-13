document.addEventListener('DOMContentLoaded', function() {
    initMemorialSlider();
     
    animateMemorialCards();
});

function initMemorialSlider() {
    const slider = document.querySelector('.modern-slider');
    if (!slider) return;
    
    const images = slider.querySelector('.slider-images');
    const prevBtn = slider.querySelector('.prev-btn');
    const nextBtn = slider.querySelector('.next-btn');
    
    let currentIndex = 0;
    let autoSlideInterval;

    if (images && images.children.length > 0) {
        const totalSlides = images.children.length;
        const dotsContainer = slider.querySelector('.slider-dots');
        
        // Create dots
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateSlider();
                clearInterval(autoSlideInterval);
                startAutoSlide();
            });
            dotsContainer.appendChild(dot);
        }
        
        function updateSlider() {
            images.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update dots
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        function nextSlide() {
            if (currentIndex < totalSlides - 1) {
                currentIndex++;
                updateSlider();
            }
        }

        function prevSlide() {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        }

        function startAutoSlide() {
            autoSlideInterval = setInterval(() => {
                if (currentIndex < totalSlides - 1) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                updateSlider();
            }, 5000);
        }

        nextBtn.addEventListener('click', function() {
            clearInterval(autoSlideInterval);
            nextSlide();
            startAutoSlide();
        });

        prevBtn.addEventListener('click', function() {
            clearInterval(autoSlideInterval);
            prevSlide();
            startAutoSlide();
        });

        slider.addEventListener('mouseenter', function() {
            clearInterval(autoSlideInterval);
        });

        slider.addEventListener('mouseleave', function() {
            startAutoSlide();
        });

        updateSlider();
        startAutoSlide();
    }
}

function animateMemorialCards() {
    const cards = document.querySelectorAll('.memorial-card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

function showMemorialDetails(memorialId) {
    const memorialsData = {
        'ugleevo': {
            title: 'Урочище Углеево',
            victims: '700 человек',
            date: '21 октября 1942 года',
            description: 'Массовый расстрел 700 евреев из Ошмянского гетто. Среди жертв были в основном старики, больные и нетрудоспособные люди.',
            location: 'Около 1 км на юг от деревни Толминово',
            coordinates: '54.4167° N, 25.9333° E'
        },
        'lugovshina': {
            title: 'Урочище Люговщина',
            victims: '573 человека',
            date: '14 августа 1941 года',
            description: 'Один из первых массовых расстрелов еврейского населения Ошмянского района.',
            location: '1.5 км на восток от деревни Ягеловщина',
            coordinates: '54.4000° N, 25.9500° E'
        },
        'roista': {
            title: 'Урочище Ройста',
            victims: '353 человека',
            date: '1941-1942 годы',
            description: 'Памятник установлен в 1967 году с надписью «Жертвам фашизма».',
            location: '1 км на юго-восток от деревни Ягеловщина',
            coordinates: '54.3900° N, 25.9400° E'
        }
    };
    
    const memorial = memorialsData[memorialId];
    if (memorial) {
        const message = `
${memorial.title}

Жертвы: ${memorial.victims}
Дата: ${memorial.date}

${memorial.description}

📍 ${memorial.location}
🌐 ${memorial.coordinates}
        `;
        
        alert(message);
    }
}

document.querySelectorAll('.memorial-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function() {
        const memorialId = this.querySelector('img')?.alt.toLowerCase() || 'other';
        showMemorialDetails(memorialId);
    });
});