document.addEventListener('DOMContentLoaded', function() {
    animateContent();

    addInteractivity();
});

function animateContent() {
    const elements = document.querySelectorAll('.fact-item, .tragedy-card, .righteous-person, .survivor-name');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

function addInteractivity() {
    const victimStats = document.querySelectorAll('.tragedy-card');
    victimStats.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.borderLeftColor = '#dc3545';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.borderLeftColor = '#8B0000';
        });
    });
   
    const righteousPersons = document.querySelectorAll('.righteous-person');
    righteousPersons.forEach(person => {
        person.addEventListener('click', function() {
            const name = this.querySelector('h4').textContent;
            showRighteousDetails(name);
        });
    });
}

function lightMemorialCandle() {
    const candle = document.createElement('div');
    candle.innerHTML = '🕯️';
    candle.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 5em;
        z-index: 1000;
        animation: candleFlicker 3s ease-out;
        pointer-events: none;
    `;
    
    document.body.appendChild(candle);

    createSparks();
    
    setTimeout(() => {
        const message = `Вечная память 2000+ жертвам Ошмянского гетто

Мы помним каждого погибшего:
• 1000-1200 человек в 1941 году
• 700 человек в Углеево
• 700 человек в ноябре 1942 года
• Сотни других невинных жертв

Их память будет жить вечно в наших сердцах.`;
        
        alert(message);
        candle.remove();
    }, 3000);
}

function createSparks() {
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const spark = document.createElement('div');
            spark.innerHTML = '✨';
            spark.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                font-size: 1.5em;
                z-index: 999;
                animation: sparkFloat 2s ease-out forwards;
                pointer-events: none;
            `;
        
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 100;
            
            document.body.appendChild(spark);
          
            setTimeout(() => spark.remove(), 2000);
        }, i * 200);
    }
}

function showRighteousDetails(name) {
    const righteousData = {
        'Зофия Залинская и Данута Тешнер': {
            details: 'Сёстры Залинские спасли Владимира Залкинда, пряча его в своём доме в Ошмянах. Рискуя собственной жизнью, они укрывали его от нацистов в течение нескольких месяцев.',
            risk: 'Высокий риск - расстрел за укрывательство евреев'
        },
        'Антон и Станислава Кондратовичи': {
            details: 'Семья Кондратовичей спасла семью Делион, предоставив им убежище и помогая выживать в условиях оккупации. Они делились с ними едой и обеспечивали безопасность.',
            risk: 'Высокий риск - угроза всей семье'
        }
    };
    
    const data = righteousData[name];
    if (data) {
        const message = `${name}

${data.details}

⚡ Уровень риска: ${data.risk}

Эти люди проявили невероятное мужество и человечность в самые тёмные времена.`;
        
        alert(message);
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes candleFlicker {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
        20% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        40% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.9; }
        60% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
        80% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.95; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
    }
    
    @keyframes sparkFloat {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        20% { transform: translate(-50%, -50%) scale(1) translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(0) translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px); opacity: 0; }
    }
`;
document.head.appendChild(style);