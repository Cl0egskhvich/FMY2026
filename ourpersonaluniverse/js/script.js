

const startButton = document.getElementById("startButton");

startButton.addEventListener("click", function() {
    document.getElementById("memories").scrollIntoView({
        behavior: "smooth"
    });
});

/*------------------------------------------------*/
// УВЕЛИЧЕНИЕ ФОТОГРАФИЙ

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeLightbox = document.getElementById("closeLightbox");

const photos = document.querySelectorAll(".photo-card img");

// Открытие фотографии
photos.forEach(function(photo) {
    photo.addEventListener("click", function() {
        lightboxImage.src = photo.src;
        lightbox.classList.add("active");
    });
});

// Закрытие фотографии
closeLightbox.addEventListener("click", function() {
    lightbox.classList.remove("active");
});

// Закрытие при нажатии на затемнённую область
lightbox.addEventListener("click", function(event) {
    if (event.target === lightbox) {
        lightbox.classList.remove("active");
    }
});

// Закрытие клавишей Escape
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        lightbox.classList.remove("active");
    }
});

/*------------------------------------------------*/
// СЧЁТЧИК ВРЕМЕНИ ВМЕСТЕ

const startDate = new Date(2024, 9, 27, 0, 0, 0);

// Определяем следующую годовщину или полугодовщину
function getNextAnniversary(now) {

    let monthsPassed =
        (now.getFullYear() - startDate.getFullYear()) * 12 +
        (now.getMonth() - startDate.getMonth());

    const candidate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + monthsPassed,
        startDate.getDate()
    );

    if (candidate > now) {
        monthsPassed--;
    }

    // Следующая значимая дата — через 6 месяцев
    const nextMonths =
        Math.floor(monthsPassed / 6) * 6 + 6;

    const nextDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + nextMonths,
        startDate.getDate()
    );

    const years = Math.floor(nextMonths / 12);
    const remainingMonths = nextMonths % 12;

    let name;

    if (nextMonths === 6) {
        name = "полугодия";
    } else if (remainingMonths === 0 && years === 1) {
        name = "первой годовщины";
    } else if (remainingMonths === 0) {
        name = years + "-летия";
    } else {
        name = years + ",5-летия";
    }

    return {
        date: nextDate,
        name: name
    };
}

// HTML-элементы
const counterCard = document.getElementById("counterCard");

const daysElement = document.getElementById("days");
const monthsElement = document.getElementById("months");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");

const mainLabel = document.getElementById("mainLabel");
const monthsItem = document.getElementById("monthsItem");
const counterHint = document.getElementById("counterHint");
const counterDetails = document.querySelector(".counter-details");

// 0 — время вместе
// 1 — обратный отсчёт
let counterMode = 0;

// Защита от повторных нажатий во время анимации
let isSwitching = false;

// Переключение счётчика
function switchCounter() {

    if (isSwitching) {
        return;
    }

    isSwitching = true;

    counterCard.classList.add("switching");

    setTimeout(function() {

        counterMode = counterMode === 0 ? 1 : 0;

        updateCounter();

        counterCard.classList.remove("switching");

        isSwitching = false;

    }, 300);
}

// Обновление счётчика
function updateCounter() {

    const now = new Date();

    if (counterMode === 0) {

        // ОБЫЧНЫЙ СЧЁТЧИК

        const difference = now - startDate;

        const totalDays = Math.floor(
            difference / (1000 * 60 * 60 * 24)
        );

        let months =
            (now.getFullYear() - startDate.getFullYear()) * 12 +
            (now.getMonth() - startDate.getMonth());

        if (now.getDate() < startDate.getDate()) {
            months--;
        }

        const hours = Math.floor(
            (difference / (1000 * 60 * 60)) % 24
        );

        const minutes = Math.floor(
            (difference / (1000 * 60)) % 60
        );

        const seconds = Math.floor(
            (difference / 1000) % 60
        );

        daysElement.textContent = totalDays;
        monthsElement.textContent = months;
        hoursElement.textContent = hours;
        minutesElement.textContent = minutes;
        secondsElement.textContent = seconds;

        mainLabel.textContent = "дней вместе";

        monthsItem.style.display = "";
        counterDetails.classList.remove("three-items");

        counterHint.textContent =
            "Нажми, чтобы узнать, сколько осталось до следующей годовщины";

    } else {

        // ОБРАТНЫЙ СЧЁТЧИК

        const target = getNextAnniversary(now);

        const difference = target.date - now;

        const totalDays = Math.floor(
            difference / (1000 * 60 * 60 * 24)
        );

        const hours = Math.floor(
            (difference / (1000 * 60 * 60)) % 24
        );

        const minutes = Math.floor(
            (difference / (1000 * 60)) % 60
        );

        const seconds = Math.floor(
            (difference / 1000) % 60
        );

        daysElement.textContent = totalDays;
        hoursElement.textContent = hours;
        minutesElement.textContent = minutes;
        secondsElement.textContent = seconds;

        mainLabel.textContent = "дней до " + target.name;

        monthsItem.style.display = "none";
        counterDetails.classList.add("three-items");

        counterHint.textContent =
            "Нажми, чтобы вернуться к нашей истории";
    }
}

// Обработка нажатий мышью
counterCard.addEventListener("click", switchCounter);

// Переключение клавишами Enter и Space
counterCard.addEventListener("keydown", function(event) {

    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        switchCounter();
    }

});

// Запуск счётчика
updateCounter();

// Обновление каждую секунду
setInterval(updateCounter, 1000);
/*------------------------------------------------*/
// ФИНАЛЬНЫЙ РЕБУС

const riddleCards = document.querySelectorAll(".riddle-card");

const riddleModal = document.getElementById("riddleModal");
const riddleModalImage = document.getElementById("riddleModalImage");
const riddleModalHint = document.getElementById("riddleModalHint");

const closeRiddleModal = document.getElementById("closeRiddleModal");

let modalClosing = false;


// ОТКРЫТИЕ КАРТОЧКИ

riddleCards.forEach(function(card) {

    card.addEventListener("click", function() {

        if (modalClosing) {
            return;
        }

        const image = card.querySelector("img");

        riddleModalImage.src = image.src;
        riddleModalHint.textContent = card.dataset.hint;

        riddleModal.hidden = false;

        // Запускаем анимацию после отображения окна
        requestAnimationFrame(function() {
            riddleModal.classList.add("active");
        });

    });

});


// ЗАКРЫТИЕ КАРТОЧКИ

function hideRiddleModal() {

    if (riddleModal.hidden || modalClosing) {
        return;
    }

    modalClosing = true;

    riddleModal.classList.remove("active");

    setTimeout(function() {

        riddleModal.hidden = true;
        modalClosing = false;

    }, 350);

}


// Закрытие крестиком

closeRiddleModal.addEventListener("click", hideRiddleModal);


// Закрытие нажатием на затемнённую область

riddleModal.addEventListener("click", function(event) {

    if (event.target === riddleModal) {
        hideRiddleModal();
    }

});


// Закрытие клавишей Escape

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {
        hideRiddleModal();
    }

});


/*------------------------------------------------*/
// ПРОВЕРКА ОТВЕТА

const riddleInput = document.getElementById("riddleInput");
const checkRiddle = document.getElementById("checkRiddle");

const riddleMessage = document.getElementById("riddleMessage");
const secretButton = document.getElementById("secretButton");

const correctAnswer = "любовь";

let successTimer = null;

// ========================================
// ВОССТАНОВЛЕНИЕ ПРОГРЕССА РЕБУСА
// ========================================

if (OPSProgress.isCompleted("rebus")) {

    riddleInput.value = correctAnswer;

    riddleMessage.textContent =
        "Правильно! Ты разгадала загадку ❤️";

    secretButton.hidden = false;

    // Повторно разгадывать не нужно
    riddleInput.disabled = true;
    checkRiddle.disabled = true;
    checkRiddle.hidden = true;

}

// ПРОВЕРКА

function checkAnswer() {

    const userAnswer = riddleInput.value.trim().toLowerCase();

    // Сбрасываем предыдущую анимацию
    clearTimeout(successTimer);

    riddleInput.classList.remove("error", "success");

    secretButton.hidden = true;


    // НЕПРАВИЛЬНЫЙ ОТВЕТ

    if (userAnswer !== correctAnswer) {

        riddleInput.classList.add("error");

        riddleMessage.textContent =
            "Не совсем! Попробуй ещё раз ❤️";

        return;
    }


    // ПРАВИЛЬНЫЙ ОТВЕТ

    riddleInput.classList.add("success");
    checkRiddle.hidden = true;
    // Начисляем сердце за первое прохождение
    const heartEarned = OPSProgress.completeTask("rebus");

    if (heartEarned) {

        riddleMessage.textContent =
            "Правильно! Ты разгадала загадку ❤️";

    }

    // Повторно отвечать не потребуется
    riddleInput.disabled = true;
    checkRiddle.disabled = true;


    // Через 0,5 секунды убираем подсветку
    // и показываем кнопку

    successTimer = setTimeout(function() {

        riddleInput.classList.remove("success");

        secretButton.hidden = false;

    }, 500);

}


// Нажатие на кнопку проверки

checkRiddle.addEventListener("click", checkAnswer);


// Проверка по нажатию Enter

riddleInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        checkAnswer();
    }

});


// УБИРАЕМ КРАСНУЮ ПОДСВЕТКУ ПРИ ПОВТОРНОМ НАЖАТИИ

riddleInput.addEventListener("focus", function() {

    riddleInput.classList.remove("error");

});


// Если пользователь меняет ответ,
// скрываем кнопку перехода

riddleInput.addEventListener("input", function() {

    clearTimeout(successTimer);

    riddleInput.classList.remove("error", "success");

    secretButton.hidden = true;

    riddleMessage.textContent = "";

});


/*------------------------------------------------*/
// ПЕРЕХОД НА СЕКРЕТНУЮ СТРАНИЦУ

secretButton.addEventListener("click", function() {

    window.location.href = "constellation/constellation.html";

});