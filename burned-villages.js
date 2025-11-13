function createSparks() {
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const spark = document.createElement('div');
            spark.className = 'spark';
            spark.style.left = Math.random() * 100 + 'vw';
            spark.style.animationDelay = Math.random() * 2 + 's';
            document.body.appendChild(spark);
            setTimeout(() => spark.remove(), 3000);
        }, i * 200);
    }
}
setInterval(createSparks, 3000);
createSparks();
function lightCandle() {
    const candle = document.createElement('div');
    candle.innerHTML = '🕯️';
    candle.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 4em;
        z-index: 1000;
        animation: candleFlicker 2s ease-out;
    `;
    document.body.appendChild(candle);
    setTimeout(() => {
        const lang = window.localizationManager?.currentLang || 'ru';
        const dict = LOCALIZATION_DICTIONARY?.villages?.[lang];
        const message = dict?.['villages.memory.candleMessage'] || 'Вечная память жителям сожжённых деревень Ошмянского района\nМы помним! Мы скорбим!';

        alert(message);
        candle.remove();
    }, 2000);
}
function showAllVictims() {
    const lang = window.localizationManager?.currentLang || 'ru';
    const dict = LOCALIZATION_DICTIONARY?.villages?.[lang];
    const cards = dict?.['villages.cardsData'];
    const labels = dict?.['villages.memory'];

    if (!Array.isArray(cards)) {
        alert('');
        return;
    }

    let totalVictims = 0;
    const lines = [];

    cards.forEach(card => {
        const value = dict?.[card.victimsKey] ?? '';
        const numeric = Number(value);
        if (!Number.isNaN(numeric)) {
            totalVictims += numeric;
        }
        const name = dict?.[card.nameKey] || card.nameKey;
        lines.push(`${name}: ${value}`);
    });

    const prefix = labels?.totalPrefix || 'Всего погибло мирных жителей:';
    const suffix = labels?.totalSuffix || 'человек';
    const listTitle = labels?.listTitle || 'По деревням:';
    const footer = labels?.footer || '\n\nВечная память!';

    const message = `${prefix} ${totalVictims} ${suffix}\n\n${listTitle}\n${lines.join('\n')}${footer}`;
    alert(message);
}
const style = document.createElement('style');
style.textContent = `
    @keyframes candleFlicker {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
        20% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
        40% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.9; }
        60% { transform: translate(-50%, -50%) scale(1.05); opacity: 1; }
        80% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.95; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
    }
`;
document.head.appendChild(style);
