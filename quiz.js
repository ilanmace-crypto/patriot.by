document.addEventListener('DOMContentLoaded', function() {
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options-container');
    const nextButton = document.getElementById('next-btn');
    const restartButton = document.getElementById('restart-btn');
    const progressText = document.getElementById('progress-text');
    const progressFill = document.getElementById('progress-fill');
    const timerElement = document.getElementById('timer');
    const resultContainer = document.getElementById('result-container');
    const scoreElement = document.getElementById('score');
    const shareButton = document.getElementById('share-btn');

    let currentQuestion = 0;
    let score = 0;
    let selectedOption = null;
    let timeLeft = 30;
    let timerInterval;
    let quizCompleted = false;
    let quizStarted = false;
    let resultsDisplayed = false;

    let currentLang = localStorage.getItem('site-lang') || 'ru';

    const quizTexts = () => LOCALIZATION_DICTIONARY.quiz[currentLang];

    document.addEventListener('languagechange', (e) => {
        currentLang = e.detail.lang;
        if (quizStarted) {
            showQuestion();
        } else if (resultsDisplayed) {
            showResults();
        } else {
            resetStaticTexts();
        }
    });

    function initQuiz() {
        currentQuestion = 0;
        score = 0;
        quizCompleted = false;
        selectedOption = null;
        quizStarted = true;
        resultsDisplayed = false;
        
        resultContainer.classList.add('hidden');
        restartButton.classList.add('hidden');
        nextButton.classList.remove('hidden');
        
        showQuestion();
    }

    function showQuestion() {
        const texts = quizTexts();
        if (currentQuestion >= texts.questions.length) {
            endQuiz();
            return;
        }

        resetStaticTexts();

        const question = texts.questions[currentQuestion];
        questionElement.textContent = question.question;
        progressText.textContent = texts['progress.label']
            .replace('{current}', currentQuestion + 1)
            .replace('{total}', texts.questions.length);
        progressFill.style.width = `${(currentQuestion / texts.questions.length) * 100}%`;

        optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.setAttribute('data-index', index);
            button.addEventListener('click', () => selectOption(index));
            optionsContainer.appendChild(button);
        });

        selectedOption = null;
        nextButton.disabled = true;
        nextButton.textContent = texts.next;
        startTimer();
    }

    function selectOption(index) {
        if (quizCompleted) return;

        const texts = quizTexts();
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('selected', 'correct', 'wrong');
        });

        const selectedBtn = document.querySelector(`.option-btn[data-index="${index}"]`);
        selectedOption = index;
        selectedBtn.classList.add('selected');

        const isCorrect = selectedOption === texts.questions[currentQuestion].answer;
        if (isCorrect) {
            selectedBtn.classList.add('correct');
            score++;
        } else {
            selectedBtn.classList.add('wrong');
            document.querySelectorAll('.option-btn')[texts.questions[currentQuestion].answer].classList.add('correct');
        }

        nextButton.disabled = false;
        nextButton.textContent = texts.next;
        clearInterval(timerInterval);

        showFact(texts.questions[currentQuestion].fact);
    }

    function showFact(fact) {
        const factElement = document.createElement('div');
        factElement.className = 'quiz-fact';
        factElement.innerHTML = `<strong>${quizTexts()['fact.label']}</strong> ${fact}`;
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
        timerElement.textContent = quizTexts()['timer.label']
            .replace('{seconds}', timeLeft);
        timerElement.className = timeLeft <= 5 ? 'timer-warning' : '';
    }

    function autoNextQuestion() {
        const texts = quizTexts();
        if (selectedOption === null) {
            document.querySelectorAll('.option-btn')[texts.questions[currentQuestion].answer].classList.add('correct');
            showFact(texts.questions[currentQuestion].fact);
        }
        nextButton.disabled = false;
        nextButton.textContent = texts.next;
    }

    nextButton.addEventListener('click', () => {
        if (nextButton.disabled) return;
        
        currentQuestion++;
        if (currentQuestion < quizTexts().questions.length) {
            showQuestion();
        } else {
            endQuiz();
        }
    });

    function endQuiz() {
        const texts = quizTexts();
        quizCompleted = true;
        clearInterval(timerInterval);
        quizStarted = false;
        resultsDisplayed = true;
        
        questionElement.textContent = texts['completed.title'];
        optionsContainer.innerHTML = '';
        nextButton.classList.add('hidden');
        restartButton.classList.remove('hidden');
        resultContainer.classList.remove('hidden');
        
        progressFill.style.width = '100%';
        scoreElement.textContent = `${score} / ${texts.questions.length}`;

        showResults();
    }

    function showResults() {
        const texts = quizTexts();
        const percentage = (score / texts.questions.length) * 100;

        let summary;
        if (percentage >= 90) {
            summary = texts['results.excellent'];
        } else if (percentage >= 70) {
            summary = texts['results.good'];
        } else if (percentage >= 50) {
            summary = texts['results.average'];
        } else {
            summary = texts['results.poor'];
        }

        const resultMessageEl = document.getElementById('result-message');
        const resultsTitleEl = document.getElementById('results-title');
        
        if (resultMessageEl) {
            const correctLabel = `${texts['results.correct']} ${score}/${texts.questions.length}.`;
            resultMessageEl.textContent = `${correctLabel} ${summary}`;
        }
        if (resultsTitleEl) {
            resultsTitleEl.textContent = texts['results.title'];
        }
        restartButton.textContent = texts['results.restart'];
    }

    restartButton.addEventListener('click', initQuiz);

    shareButton.addEventListener('click', function() {
        const texts = quizTexts();
        const shareText = texts['share.message']
            .replace('{score}', score)
            .replace('{total}', texts.questions.length);
        
        if (navigator.share) {
            navigator.share({
                title: 'Результат квиза',
                text: shareText,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                alert(texts['share.copied']);
            });
        }
    });

    function resetStaticTexts() {
        const texts = quizTexts();
        nextButton.textContent = texts.next;
        restartButton.textContent = texts['results.restart'];
        const headerTitle = document.querySelector('[data-i18n="header.title"]');
        const headerSubtitle = document.querySelector('[data-i18n="header.subtitle"]');
        const resultsTitle = document.querySelector('[data-i18n="quiz.results.title"]');
        const resultsCorrect = document.querySelector('[data-i18n="quiz.results.correct"]');
        const pageTitle = document.querySelector('[data-i18n="page.title"]');
        const shareBtn = document.getElementById('share-btn');
        
        if (headerTitle) headerTitle.textContent = texts['header.title'];
        if (headerSubtitle) headerSubtitle.textContent = texts['header.subtitle'];
        if (resultsTitle) resultsTitle.textContent = texts['results.title'];
        if (resultsCorrect) resultsCorrect.textContent = texts['results.correct'];
        if (pageTitle) pageTitle.textContent = texts['page.title'];
        if (shareBtn) shareBtn.textContent = texts['share.button'];
    }

    initQuiz();
    resetStaticTexts();
});