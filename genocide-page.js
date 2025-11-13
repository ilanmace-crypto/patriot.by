'use strict';

(function () {
    document.addEventListener('DOMContentLoaded', () => {
        const overviewContainer = document.querySelector('[data-genocide-overview]');
        const stagesContainer = document.querySelector('[data-genocide-stages]');
        const righteousContainer = document.querySelector('[data-genocide-righteous]');
        const survivorsContainer = document.querySelector('[data-genocide-survivors]');

        if (!overviewContainer || !stagesContainer || !righteousContainer || !survivorsContainer) {
            return;
        }

        const getDictionary = (lang) => {
            const pageDictionary = LOCALIZATION_DICTIONARY?.genocide;
            if (!pageDictionary) {
                return null;
            }

            return pageDictionary[lang] || pageDictionary.ru || null;
        };

        const clearContainer = (node) => {
            while (node.firstChild) {
                node.removeChild(node.firstChild);
            }
        };

        const buildOverview = (dictionary) => {
            clearContainer(overviewContainer);

            const title = dictionary['genocide.overview.title'];
            const lead = dictionary['genocide.overview.lead'];
            const facts = dictionary['genocide.overview.facts'];

            const heading = document.createElement('h2');
            heading.textContent = title;

            const paragraph = document.createElement('p');
            paragraph.textContent = lead;

            overviewContainer.append(heading, paragraph);

            if (Array.isArray(facts)) {
                const factsWrapper = document.createElement('div');
                factsWrapper.className = 'ghetto-facts';

                facts.forEach((fact, index) => {
                    const factItem = document.createElement('div');
                    factItem.className = 'fact-item fade-in';
                    factItem.style.animationDelay = `${0.1 * (index + 1)}s`;

                    const icon = document.createElement('div');
                    icon.className = 'fact-icon';
                    icon.textContent = fact.icon;

                    const titleElement = document.createElement('h4');
                    titleElement.textContent = fact.title;

                    const valueElement = document.createElement('p');
                    valueElement.textContent = fact.value;

                    factItem.append(icon, titleElement, valueElement);
                    factsWrapper.appendChild(factItem);
                });

                overviewContainer.appendChild(factsWrapper);
            }
        };

        const buildStages = (dictionary) => {
            clearContainer(stagesContainer);

            const title = dictionary['genocide.stages.title'];
            const items = dictionary['genocide.stages.items'];

            const heading = document.createElement('h2');
            heading.textContent = title;

            stagesContainer.appendChild(heading);

            if (!Array.isArray(items)) {
                return;
            }

            items.forEach((item, index) => {
                const card = document.createElement('article');
                card.className = 'tragedy-card fade-in';
                card.style.animationDelay = `${0.1 * (index + 1)}s`;

                const icon = document.createElement('div');
                icon.className = 'tragedy-icon';
                icon.textContent = item.icon;

                const content = document.createElement('div');

                const titleElement = document.createElement('h3');
                titleElement.textContent = item.title;

                const descriptionElement = document.createElement('p');
                descriptionElement.textContent = item.description;

                content.append(titleElement, descriptionElement);
                card.append(icon, content);
                stagesContainer.appendChild(card);
            });
        };

        const buildRighteous = (dictionary) => {
            clearContainer(righteousContainer);

            const title = dictionary['genocide.righteous.title'];
            const description = dictionary['genocide.righteous.description'];
            const list = dictionary['genocide.righteous.list'];

            const heading = document.createElement('h2');
            heading.textContent = title;

            const paragraph = document.createElement('p');
            paragraph.textContent = description;

            righteousContainer.append(heading, paragraph);

            if (!Array.isArray(list)) {
                return;
            }

            const listWrapper = document.createElement('div');
            listWrapper.className = 'righteous-list';

            list.forEach((person, index) => {
                const personCard = document.createElement('article');
                personCard.className = 'righteous-person fade-in';
                personCard.dataset.righteousId = person.id || '';
                personCard.style.animationDelay = `${0.1 * (index + 1)}s`;

                const icon = document.createElement('div');
                icon.className = 'righteous-icon';
                icon.textContent = person.icon;

                const content = document.createElement('div');

                const nameElement = document.createElement('h4');
                nameElement.textContent = person.name;

                const actionElement = document.createElement('p');
                actionElement.textContent = person.action;

                content.append(nameElement, actionElement);
                personCard.append(icon, content);
                listWrapper.appendChild(personCard);
            });

            righteousContainer.appendChild(listWrapper);
        };

        const buildSurvivors = (dictionary) => {
            clearContainer(survivorsContainer);

            const title = dictionary['genocide.survivors.title'];
            const description = dictionary['genocide.survivors.description'];
            const list = dictionary['genocide.survivors.list'];

            const heading = document.createElement('h2');
            heading.textContent = title;

            const paragraph = document.createElement('p');
            paragraph.textContent = description;

            survivorsContainer.append(heading, paragraph);

            if (!Array.isArray(list)) {
                return;
            }

            const listWrapper = document.createElement('div');
            listWrapper.className = 'survivors-list';

            list.forEach((name, index) => {
                const item = document.createElement('span');
                item.className = 'survivor-name fade-in';
                item.style.animationDelay = `${0.1 * (index + 1)}s`;
                item.textContent = name;
                listWrapper.appendChild(item);
            });

            survivorsContainer.appendChild(listWrapper);
        };

        const render = (lang) => {
            const dictionary = getDictionary(lang);
            if (!dictionary) {
                return;
            }

            buildOverview(dictionary);
            buildStages(dictionary);
            buildRighteous(dictionary);
            buildSurvivors(dictionary);
        };

        document.addEventListener('languagechange', (event) => {
            const lang = event.detail?.lang || (window.localizationManager?.currentLang ?? 'ru');
            render(lang);
        });

        const initialLang = window.localizationManager?.currentLang || 'ru';
        render(initialLang);
    });
})();
