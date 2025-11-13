'use strict';

(function() {
    let isInitialized = false;
    
    function initChronologyPage() {
        if (isInitialized) return;
        
        console.log('=== INIT CHRONOLOGY PAGE ===');
        console.log('LOCALIZATION_DICTIONARY exists:', !!window.LOCALIZATION_DICTIONARY);
        console.log('localizationManager exists:', !!window.localizationManager);
        
        const metricsContainer = document.querySelector('[data-chronology-metrics]');
        const timelineContainer = document.querySelector('[data-chronology-timeline]');
        const modalElement = document.getElementById('modal');
        
        if (!metricsContainer || !timelineContainer || !modalElement) {
            console.error('Required elements not found:', {
                metricsContainer: !!metricsContainer,
                timelineContainer: !!timelineContainer,
                modalElement: !!modalElement
            });
            return;
        }

        let currentItems = [];

        function getDictionary(lang) {
            if (!window.LOCALIZATION_DICTIONARY) {
                console.error('LOCALIZATION_DICTIONARY not found in window');
                return null;
            }
            
            const pageDictionary = window.LOCALIZATION_DICTIONARY.chronology;
            if (!pageDictionary) {
                console.error('Chronology dictionary not found');
                return null;
            }

            const result = pageDictionary[lang] || pageDictionary.ru || null;
            console.log('Getting dictionary for lang:', lang, 'Found:', !!result);
            return result;
        }

        function clearContainer(node) {
            while (node.firstChild) {
                node.removeChild(node.firstChild);
            }
        }

        function buildMetrics(dictionary) {
            clearContainer(metricsContainer);

            const metrics = dictionary['chronology.metrics'];
            if (!Array.isArray(metrics)) {
                console.warn('Metrics not found or not an array:', metrics);
                return;
            }

            console.log('Building metrics, count:', metrics.length);
            metrics.forEach((metric, index) => {
                const metricCard = document.createElement('div');
                metricCard.className = 'chronology-metric fade-in';
                metricCard.style.animationDelay = `${0.1 * (index + 1)}s`;

                const valueElement = document.createElement('div');
                valueElement.className = 'chronology-metric-value';
                valueElement.textContent = metric.value;

                const labelElement = document.createElement('div');
                labelElement.className = 'chronology-metric-label';
                labelElement.textContent = metric.label;

                metricCard.append(valueElement, labelElement);
                metricsContainer.appendChild(metricCard);
            });
        }

        function buildTimeline(dictionary) {
            clearContainer(timelineContainer);

            const items = dictionary['chronology.timeline.items'];
            if (!Array.isArray(items)) {
                console.warn('Timeline items not found or not an array:', items);
                currentItems = [];
                return;
            }

            if (items.length === 0) {
                console.warn('Timeline items array is empty');
                currentItems = [];
                return;
            }

            console.log('Building timeline, items count:', items.length);
            currentItems = items;
            const ctaText = dictionary['chronology.timeline.cta'] || 'Подробнее';

            items.forEach((item, index) => {
                const timelineItem = document.createElement('div');
                timelineItem.className = 'timeline-item fade-in';
                timelineItem.style.animationDelay = `${0.1 * (index + 1)}s`;
                timelineItem.dataset.index = String(index);

                if (item.highlight) {
                    timelineItem.classList.add('highlight');
                }

                const dateElement = document.createElement('div');
                dateElement.className = 'timeline-date';
                dateElement.textContent = item.date;

                const contentElement = document.createElement('div');
                contentElement.className = 'timeline-content';

                const titleElement = document.createElement('h3');
                titleElement.textContent = item.title;

                const summaryElement = document.createElement('p');
                summaryElement.textContent = item.summary;

                const buttonElement = document.createElement('button');
                buttonElement.className = 'read-more-btn';
                buttonElement.type = 'button';
                buttonElement.textContent = ctaText;
                buttonElement.dataset.index = String(index);

                contentElement.append(titleElement, summaryElement, buttonElement);
                timelineItem.append(dateElement, contentElement);
                timelineContainer.appendChild(timelineItem);
            });
        }

        function render(lang) {
            console.log('Rendering chronology for lang:', lang);
            const dictionary = getDictionary(lang);
            if (!dictionary) {
                console.error('Dictionary not found for language:', lang);
                return;
            }

            try {
                buildMetrics(dictionary);
                buildTimeline(dictionary);
                console.log('Chronology rendered successfully!');
                isInitialized = true;
            } catch (error) {
                console.error('Error rendering chronology:', error);
            }
        }

        function openModal(index) {
            const item = currentItems[index];
            if (!item) {
                return;
            }

            const modalTitle = document.getElementById('modalTitle');
            const modalDate = document.getElementById('modalDate');
            const modalBody = document.getElementById('modalBody');

            modalTitle.textContent = item.title;
            modalDate.textContent = item.date;

            const fragment = document.createDocumentFragment();

            if (item.image) {
                const img = document.createElement('img');
                img.className = 'modal-image';
                img.src = item.image;
                img.alt = item.title;
                img.onerror = () => {
                    img.style.display = 'none';
                };
                fragment.appendChild(img);

                if (item.caption) {
                    const caption = document.createElement('div');
                    caption.className = 'image-caption';
                    caption.textContent = item.caption;
                    fragment.appendChild(caption);
                }
            }

            if (Array.isArray(item.paragraphs)) {
                item.paragraphs.forEach(text => {
                    const paragraph = document.createElement('p');
                    paragraph.textContent = text;
                    fragment.appendChild(paragraph);
                });
            }

            clearContainer(modalBody);
            modalBody.appendChild(fragment);

            modalElement.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modalElement.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        function handleTimelineClick(event) {
            const target = event.target;
            if (!(target instanceof HTMLElement)) {
                return;
            }

            const indexAttr = target.dataset.index || target.closest('.timeline-item')?.dataset.index;
            if (typeof indexAttr === 'undefined') {
                return;
            }

            const index = Number.parseInt(indexAttr, 10);
            if (Number.isNaN(index)) {
                return;
            }

            openModal(index);
        }

        timelineContainer.addEventListener('click', handleTimelineClick);

        const closeButton = modalElement.querySelector('.close-modal');
        if (closeButton) {
            closeButton.addEventListener('click', closeModal);
        }

        modalElement.addEventListener('click', (event) => {
            if (event.target === modalElement) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modalElement.style.display === 'block') {
                closeModal();
            }
        });

        function getCurrentLang() {
            if (window.localizationManager && window.localizationManager.currentLang) {
                return window.localizationManager.currentLang;
            }
            return localStorage.getItem('site-lang') || 'ru';
        }

        function handleLanguageChange(event) {
            const lang = event && event.detail && event.detail.lang ? event.detail.lang : getCurrentLang();
            console.log('Language change event received, lang:', lang);
            render(lang);
        }

        document.addEventListener('languagechange', handleLanguageChange);

        function tryInit() {
            const lang = getCurrentLang();
            console.log('Trying to init chronology, lang:', lang);
            
            const dict = getDictionary(lang);
            if (dict) {
                console.log('Dictionary found! Rendering...');
                render(lang);
            } else {
                console.error('Dictionary not found, will retry...');
            }
        }

        tryInit();

        if (!isInitialized) {
            let attempts = 0;
            const maxAttempts = 20;
            const checkInterval = setInterval(() => {
                attempts++;
                const dict = getDictionary(getCurrentLang());
                if (dict) {
                    clearInterval(checkInterval);
                    tryInit();
                } else if (attempts >= maxAttempts) {
                    clearInterval(checkInterval);
                    console.error('Failed to initialize chronology after', maxAttempts, 'attempts');
                }
            }, 200);
        }
    }

    function start() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(initChronologyPage, 500);
            });
        } else {
            setTimeout(initChronologyPage, 500);
        }
    }

    window.addEventListener('load', () => {
        setTimeout(initChronologyPage, 300);
    });

    start();
})();
