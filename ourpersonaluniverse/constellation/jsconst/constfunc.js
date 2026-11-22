// ========================================
// СИСТЕМА ОТОБРАЖЕНИЯ СЕРДЕЦ
// ========================================

(function initializeHearts() {

    const hearts = document.querySelectorAll(".heart");
    const heartsMessage = document.getElementById("heartsMessage");

    // ОБНОВЛЕНИЕ КОЛИЧЕСТВА СЕРДЕЦ

    function updateHearts() {

        const completedCount = OPSProgress.getHearts();

        hearts.forEach((heart, index) => {

            if (index < completedCount) {
                heart.classList.add("filled");
            } else {
                heart.classList.remove("filled");
            }

        });

        // ТЕКСТ ПОД СЕРДЦАМИ

        if (completedCount === 0) {
            heartsMessage.textContent =
                "Впереди ещё столько прекрасных моментов...";
        } 
        else if (completedCount === 5) {
            heartsMessage.textContent =
                "Невероятно! Все пять сердечек собраны! 💖";
        } 
        else {
            heartsMessage.textContent =
                `Смотри! У тебя уже целых ${completedCount} сердечка!`;
        }
    }

    // ПЕРВОНАЧАЛЬНОЕ ОБНОВЛЕНИЕ

    updateHearts();

    // ОБНОВЛЕНИЕ ПРИ ИЗМЕНЕНИИ ПРОГРЕССА

    window.addEventListener("ops-progress-change", updateHearts);
// ========================================
// СВЕЧЕНИЕ ПРОЙДЕННЫХ ЗВЁЗД
// ========================================

function updateStars() {

    const starTasks = [
        { element: "star1", task: "star1" },
        { element: "star2", task: "star2" },
        { element: "star3", task: "star3" },
        { element: "star4", task: "star4" }
    ];

    starTasks.forEach(({ element, task }) => {

        const star = document.getElementById(element);

        if (!star) return;

        if (OPSProgress.isCompleted(task)) {
            star.classList.add("completed");
        } else {
            star.classList.remove("completed");
        }

    });
}

// Первоначальная проверка
updateStars();

// Обновление при получении нового сердца
window.addEventListener("ops-progress-change", updateStars);  
// ========================================
// СВЕЧЕНИЕ ПРОЙДЕННЫХ ЗВЁЗД
// ========================================

function updateStars() {

    const starTasks = [
        { element: "star1", task: "star1" },
        { element: "star2", task: "star2" },
        { element: "star3", task: "star3" },
        { element: "star4", task: "star4" }
    ];

    starTasks.forEach(({ element, task }) => {

        const star = document.getElementById(element);

        if (!star) return;

        if (OPSProgress.isCompleted(task)) {
            star.classList.add("completed");
        } else {
            star.classList.remove("completed");
        }

    });
}

// Первоначальная проверка
updateStars();

// Обновление при получении нового сердца
window.addEventListener("ops-progress-change", updateStars);  
})();

// ========================================
// СБРОС ПРОГРЕССА
// ========================================

const resetButton = document.getElementById("resetProgressButton");

resetButton.addEventListener("click", function () {
    const confirmed = confirm(
        "Ты действительно хочешь сбросить весь прогресс? Все собранные сердечки и пройденные звёзды будут сброшены."
    );

    if (confirmed) {
        OPSProgress.resetProgress();
    }
});