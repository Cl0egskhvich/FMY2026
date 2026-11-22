
const questionTitle = document.getElementById("questionTitle");
const questionCounter = document.getElementById("questionCounter");
const progressFill = document.getElementById("progressFill");

const answersContainer = document.getElementById("answers");
const specialAnswers = document.getElementById("specialAnswers");

const feedback = document.getElementById("feedback");
const nextButton = document.getElementById("nextButton");

const quizCard = document.getElementById("quizCard");
const finishScreen = document.getElementById("finishScreen");

const answerMe = document.getElementById("answerMe");
const answerMom = document.getElementById("answerMom");
const backButton = document.getElementById("backButton");
const questionContent = document.getElementById("questionContent");

let currentQuestion = 0;
let answered = false;
let specialCompleted = false;

// ВОПРОСЫ И ОТВЕТЫ

const questions = [

    {
        title: "Какой мой любимый цвет?",
        answers: [
            "Голубой",
            "Зелёный",
            "Фиолетовый",
            "Оранжевый"
        ],
        correct: 3,
        message: "За два с небольшим года ты уж должна была это запомнить)"
    },

    {
        title: "Дата начала наших отношений?",
        answers: [
            "17 апреля 2024 г.",
            "7 ноября 2025 г.",
            "27 октября 2024 г.",
            "20 сентября 2025 г."
        ],
        correct: 2,
        message: "Я бы крайне удивился если бы ты ответила неверно"
    },

    {
        title: "Насколько сильно я тебя люблю?)",
        answers: [
            "Вообще нет",
            "Не очень то и сильно",
            "Очень-очень сильно",
            "∞"
        ],
        correct: 3,
        message: "Сколько бы я ни делал и ни говорил, а всё равно не передать насколько сильно ты мне дорога"
    },

    {
        title: "Самый ненавистный нам человек?",
        answers: [
            "Илья",
            "Маруся",
            "Артём",
            "Кирилл"
        ],
        correct: 2,
        message: "Он нам обоим принёс много бед, зато есть кого пообсуждать"
    },

    {
        title: "На какой праздник я НЕ дарю тебе цветы?",
        answers: [
            "14 февраля",
            "Годовщина",
            "Новый год",
            "День рождения"
        ],
        correct: 2,
        message: "Не самый подходящий праздник для цветов 👀"
    },

    {
        title: "Какой плейс в Roblox НАМ больше всего нравится?",
        answers: [
            "Мёртвые рельсы",
            "Гиперстрельба",
            "99 ночей",
            "Dress to impress"
        ],
        correct: 1,
        message: "Чувствую мы в нём засядем ещё надолго)"
    },

    {
        title: "Какое моё любимое дерево в Майнкрафте?",
        answers: [
            "Хвоя",
            "Берёза",
            "Вишнёвое",
            "Мангровое"
        ],
        correct: 1,
        message: "Патриот слушает 🫡"
    },

    {
        title: "Что я смотрю на Ютубе чаще всего без тебя?",
        answers: [
            "Стримеров",
            "Летсплеи",
            "Научпоп",
            "Гайды"
        ],
        correct: 0,
        message: "Думаю этот вопрос дался тебе не так просто как остальные)"
    },

    {
        title: "Я или Мама?",
        special: true,
        message: "Мы все тебя любим ❤️"
    },

    {
        title: "Кто самая лучшая девочка на свете?)",
        answers: [
            "Аня",
            "Кирилл Жильцов",
            "Артём",
            "Ты"
        ],
        correct: 3,
        message: "Ну конечно ты, моя радость <3"
    }

];


// ЗАГРУЗКА ВОПРОСА

function showQuestion() {

    if (currentQuestion === 8) {
        questionHintTimer = setTimeout(() => {

            if (!specialCompleted && !answered) {
                if (specialHint) {
                    specialHint.classList.add("visible");
                }
            }

        }, 10000);
    }

    const question = questions[currentQuestion];

    answered = false;
    specialCompleted = false;

    questionTitle.textContent = question.title;

    questionCounter.textContent =
        `Вопрос ${currentQuestion + 1} из 10`;

    progressFill.style.width =
        `${(currentQuestion + 1) * 10}%`;

    feedback.style.display = "none";
    feedback.textContent = "";

    nextButton.style.display = "none";

    answersContainer.innerHTML = "";

    specialAnswers.style.display = "none";
    answersContainer.style.display = "grid";

    answerMe.classList.remove("active");
    answerMom.classList.remove("active");

    answerMe.disabled = false;
    answerMom.disabled = false;

    // ОБЫЧНЫЙ ВОПРОС

    if (!question.special) {

        question.answers.forEach((answer, index) => {

            const button = document.createElement("button");

            button.classList.add("answer-button");
            button.textContent = answer;

            button.addEventListener("click", function() {
                checkAnswer(index, button);
            });

            answersContainer.appendChild(button);

        });

    }

    // ОСОБЫЙ ДЕВЯТЫЙ ВОПРОС

    else {

        answersContainer.style.display = "none";
        specialAnswers.style.display = "grid";

    }

    // АНИМАЦИЯ ПОЯВЛЕНИЯ

    questionContentAnimation();

}


// АНИМАЦИЯ ВОПРОСА

function questionContentAnimation() {

    const content = document.getElementById("questionContent");

    content.style.animation = "none";

    void content.offsetHeight;

    content.style.animation = "questionAppear 0.6s ease";

}


// ПРОВЕРКА ОБЫЧНОГО ОТВЕТА

function checkAnswer(selectedIndex, button) {

    if (answered) return;

    const question = questions[currentQuestion];

    const allButtons =
        answersContainer.querySelectorAll(".answer-button");

    // НЕПРАВИЛЬНЫЙ ОТВЕТ

    if (selectedIndex !== question.correct) {

        button.classList.add("wrong");

        allButtons.forEach(item => {
            item.disabled = true;
        });

        setTimeout(() => {

            button.classList.remove("wrong");

            allButtons.forEach(item => {
                item.disabled = false;
            });

        }, 500);

        return;

    }

    // ПРАВИЛЬНЫЙ ОТВЕТ

    answered = true;

    button.classList.add("correct");

    allButtons.forEach(item => {
        item.disabled = true;
    });

    setTimeout(() => {

        button.classList.remove("correct");

        showFeedback();

    }, 500);

}


// ПОКАЗ ТЕКСТА ПОСЛЕ ОТВЕТА

function showFeedback() {

    const question = questions[currentQuestion];

    feedback.textContent = question.message;

    feedback.style.display = "block";

    if (currentQuestion === questions.length - 1) {
        nextButton.textContent = "Завершить квиз";
    } else {
        nextButton.textContent = "Следующий вопрос";
    }

    nextButton.style.display = "block";

}


// ПЕРЕХОД К СЛЕДУЮЩЕМУ ВОПРОСУ

nextButton.addEventListener("click", function() {

    if (currentQuestion === questions.length - 1) {

        finishQuiz();

        return;

    }

    currentQuestion++;

    showQuestion();

});


// ДЕВЯТЫЙ ВОПРОС — Я И МАМА

// ДЕВЯТЫЙ ВОПРОС — Я И МАМА

let mousePressed = false;
let mouseStartButton = null;

const activePointers = new Map();

let specialHintTimer = null;

const specialHint = document.querySelector(".special-hint");

// ПОКАЗ ПОДСКАЗКИ

function startSpecialHintTimer() {

    clearTimeout(specialHintTimer);

    if (specialHint) {
        specialHint.style.display = "none";
    }

    specialHintTimer = setTimeout(() => {

        if (!specialCompleted && !answered && currentQuestion === 8) {

            if (specialHint) {
                specialHint.style.display = "block";
            }

        }

    }, 10000);

}

// СКРЫТИЕ ПОДСКАЗКИ

function hideSpecialHint() {

    clearTimeout(specialHintTimer);

    if (specialHint) {
        specialHint.style.display = "none";
    }

}

// ЗАВЕРШЕНИЕ ОСОБОГО ВОПРОСА

function completeSpecialQuestion() {

    if (specialCompleted) return;

    specialCompleted = true;
    answered = true;

    hideSpecialHint();

    answerMe.classList.add("active");
    answerMom.classList.add("active");

    answerMe.disabled = true;
    answerMom.disabled = true;

    setTimeout(() => {
        showFeedback();
    }, 500);

}

// НАЖАТИЕ МЫШЬЮ ИЛИ ПАЛЬЦЕМ

function specialPointerDown(event) {

    if (specialCompleted) return;

    event.preventDefault();

    const button = event.currentTarget;

    if (event.pointerType === "touch") {

        activePointers.set(event.pointerId, button);

        const touchedButtons = new Set(activePointers.values());

        if (
            touchedButtons.has(answerMe) &&
            touchedButtons.has(answerMom)
        ) {
            completeSpecialQuestion();
        }

    }

    if (event.pointerType === "mouse") {

        mousePressed = true;
        mouseStartButton = button;

    }

}

// ПРОВЕДЕНИЕ МЫШЬЮ НА ВТОРУЮ КНОПКУ

function specialPointerEnter(event) {

    if (specialCompleted) return;

    if (
        event.pointerType === "mouse" &&
        mousePressed &&
        mouseStartButton !== event.currentTarget
    ) {
        completeSpecialQuestion();
    }

}

// ОТПУСКАНИЕ ПАЛЬЦА ИЛИ МЫШИ

function specialPointerUp(event) {

    activePointers.delete(event.pointerId);

    if (event.pointerType === "mouse") {

        mousePressed = false;
        mouseStartButton = null;

    }

}

// ПОДКЛЮЧЕНИЕ СОБЫТИЙ

[answerMe, answerMom].forEach(button => {

    button.addEventListener("pointerdown", specialPointerDown);
    button.addEventListener("pointerenter", specialPointerEnter);
    button.addEventListener("pointerup", specialPointerUp);
    button.addEventListener("pointercancel", specialPointerUp);

});


// НАЖАТИЕ МЫШЬЮ ИЛИ ПАЛЬЦЕМ

function specialPointerDown(event) {

    if (specialCompleted) return;

    event.preventDefault();

    const button = event.currentTarget;

    // МОБИЛЬНЫЕ УСТРОЙСТВА

    if (event.pointerType === "touch") {

        activePointers.set(event.pointerId, button);

        const touchedButtons = new Set(activePointers.values());

        if (
            touchedButtons.has(answerMe) &&
            touchedButtons.has(answerMom)
        ) {
            completeSpecialQuestion();
        }

    }

    // КОМПЬЮТЕР

    if (event.pointerType === "mouse") {

        mousePressed = true;
        mouseStartButton = button;

    }

}


// ПРОВЕДЕНИЕ МЫШЬЮ НА ВТОРУЮ КНОПКУ

function specialPointerEnter(event) {

    if (specialCompleted) return;

    if (
        event.pointerType === "mouse" &&
        mousePressed &&
        mouseStartButton !== event.currentTarget
    ) {

        completeSpecialQuestion();

    }

}


// ОТПУСКАНИЕ ПАЛЬЦА ИЛИ МЫШИ

function specialPointerUp(event) {

    activePointers.delete(event.pointerId);

    if (event.pointerType === "mouse") {

        mousePressed = false;
        mouseStartButton = null;

    }

}


// ПОДКЛЮЧАЕМ СОБЫТИЯ К ОБЕИМ КНОПКАМ

[answerMe, answerMom].forEach(button => {

    button.addEventListener("pointerdown", specialPointerDown);

    button.addEventListener("pointerenter", specialPointerEnter);

    button.addEventListener("pointerup", specialPointerUp);

    button.addEventListener("pointercancel", specialPointerUp);

});


// ========================================
// ЗАВЕРШЕНИЕ КВИЗА
// ========================================

function finishQuiz() {

    OPSProgress.completeTask("star2");

    quizCard.style.display = "none";
    finishScreen.style.display = "block";

}


// ВОЗВРАТ К СОЗВЕЗДИЮ

backButton.addEventListener("click", function() {

    window.location.href = "../../constellation.html";

});

document.addEventListener("pointerup", function(event) {

    if (event.pointerType === "mouse") {
        mousePressed = false;
        mouseStartButton = null;
    }

});

// ЗАПУСК

// ========================================
// ВОССТАНОВЛЕНИЕ ПРОГРЕССА
// ========================================

// Перенос старого сохранения в общую систему
if (localStorage.getItem("star2Completed") === "true") {

    OPSProgress.completeTask("star2");

    localStorage.removeItem("star2Completed");

}

// Проверяем, пройдена ли викторина
if (OPSProgress.isCompleted("star2")) {

    quizCard.style.display = "none";
    finishScreen.style.display = "block";

} else {

    showQuestion();

}