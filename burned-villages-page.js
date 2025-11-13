'use strict';

(function () {
    const STATUS_CLASS_MAP = {
        recovered: 'status-recovered',
        partial: 'status-partial',
        destroyed: 'status-destroyed'
    };

    document.addEventListener('DOMContentLoaded', () => {
        const statsContainer = document.querySelector('[data-village-stats]');
        const villagesGrid = document.querySelector('[data-villages-grid]');

        if (!statsContainer || !villagesGrid) {
            return;
        }

        const clearContainer = (node) => {
            while (node.firstChild) {
                node.removeChild(node.firstChild);
            }
        };

        const getDictionary = (lang) => {
            const pageDictionary = LOCALIZATION_DICTIONARY?.villages;
            if (!pageDictionary) {
                return null;
            }

            return pageDictionary[lang] || pageDictionary.ru || null;
        };

        const buildStats = (dictionary) => {
            clearContainer(statsContainer);

            const stats = dictionary['villages.stats.items'];
            if (!Array.isArray(stats)) {
                return;
            }

            stats.forEach((item, index) => {
                const statElement = document.createElement('div');
                statElement.className = 'total-stat fade-in';
                statElement.style.animationDelay = `${0.1 * (index + 1)}s`;

                const numberElement = document.createElement('span');
                numberElement.className = 'number';
                numberElement.textContent = item.value;

                const labelElement = document.createElement('span');
                labelElement.className = 'label';
                labelElement.textContent = item.label;

                statElement.append(numberElement, labelElement);
                statsContainer.appendChild(statElement);
            });
        };

        const buildVillages = (dictionary) => {
            clearContainer(villagesGrid);

            const cards = dictionary['villages.cards'];
            const labels = dictionary['villages.labels'] || {};

            if (!Array.isArray(cards)) {
                return;
            }

            cards.forEach((card, index) => {
                const cardElement = document.createElement('article');
                cardElement.className = 'village-card fade-in';
                cardElement.style.animationDelay = `${0.1 * (index + 1)}s`;

                const headerElement = document.createElement('div');
                headerElement.className = 'village-header';

                const titleElement = document.createElement('h3');
                titleElement.textContent = card.name;

                const badgeElement = document.createElement('span');
                badgeElement.className = `status-badge ${STATUS_CLASS_MAP[card.status] || ''}`;
                badgeElement.textContent = dictionary[`villages.status.${card.status}`] || card.status;

                headerElement.append(titleElement, badgeElement);

                const statsElement = document.createElement('div');
                statsElement.className = 'village-stats';

                const appendStatItem = (labelKey, valueKey) => {
                    const statItem = document.createElement('div');
                    statItem.className = 'stat-item';

                    const labelElement = document.createElement('span');
                    labelElement.className = 'stat-label';
                    labelElement.textContent = labels[labelKey] || labelKey;

                    const valueElement = document.createElement('span');
                    valueElement.className = 'stat-value';
                    let valueText = card.stats[valueKey];

                    if (valueKey === 'victims') {
                        statItem.classList.add('victims');
                        if (!valueText || valueText === labels.noData) {
                            valueText = labels.noData || valueText;
                        }
                    }

                    valueElement.textContent = valueText;

                    statItem.append(labelElement, valueElement);
                    statsElement.appendChild(statItem);
                };

                appendStatItem('date', 'date');
                appendStatItem('housesBefore', 'housesBefore');
                appendStatItem('housesAfter', 'housesAfter');
                appendStatItem('victims', 'victims');
                appendStatItem('residentsBefore', 'residentsBefore');

                const descriptionElement = document.createElement('div');
                descriptionElement.className = 'village-description';

                const paragraphElement = document.createElement('p');
                paragraphElement.textContent = card.description;

                descriptionElement.appendChild(paragraphElement);

                cardElement.append(headerElement, statsElement, descriptionElement);
                villagesGrid.appendChild(cardElement);
            });
        };

        const render = (lang) => {
            const dictionary = getDictionary(lang);
            if (!dictionary) {
                return;
            }

            buildStats(dictionary);
            buildVillages(dictionary);
        };

        document.addEventListener('languagechange', (event) => {
            const lang = event.detail?.lang || (window.localizationManager?.currentLang ?? 'ru');
            render(lang);
        });

        const initialLang = window.localizationManager?.currentLang || 'ru';
        render(initialLang);
    });
})();
