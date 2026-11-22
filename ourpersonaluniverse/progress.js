
// ========================================
// ОБЩАЯ СИСТЕМА ПРОГРЕССА И СЕРДЕЦ
// ========================================

const OPSProgress = (function () {

    // Ключ, под которым прогресс хранится в браузере
    const STORAGE_KEY = "ourPersonalUniverseProgress";

    // Все задания, за которые можно получить сердце
    const TASKS = [
        "rebus",
        "star1",
        "star2",
        "star3",
        "star4"
    ];

    // ========================================
    // ПОЛУЧЕНИЕ СОХРАНЁННЫХ ДАННЫХ
    // ========================================

    function getProgress() {

        try {

            const saved = localStorage.getItem(STORAGE_KEY);

            if (!saved) {
                return { completed: {} };
            }

            const data = JSON.parse(saved);

            if (!data || typeof data.completed !== "object") {
                return { completed: {} };
            }

            return data;

        } catch (error) {

            console.error("Не удалось загрузить прогресс:", error);

            return { completed: {} };
        }
    }

    // ========================================
    // СОХРАНЕНИЕ ДАННЫХ
    // ========================================

    function saveProgress(data) {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(data)
            );

            // Сообщаем страницам об изменении прогресса
            window.dispatchEvent(
                new Event("ops-progress-change")
            );

            return true;

        } catch (error) {

            console.error("Не удалось сохранить прогресс:", error);

            return false;
        }
    }

    // ========================================
    // ПОЛУЧЕНИЕ КОЛИЧЕСТВА СЕРДЕЦ
    // ========================================

    function getHearts() {

        const progress = getProgress();

        return TASKS.filter(function (task) {
            return Boolean(progress.completed[task]);
        }).length;
    }

    // ========================================
    // ПРОВЕРКА ПРОХОЖДЕНИЯ ЗАДАНИЯ
    // ========================================

    function isCompleted(task) {

        if (!TASKS.includes(task)) {
            return false;
        }

        const progress = getProgress();

        return Boolean(progress.completed[task]);
    }

    // ========================================
    // ПОКАЗ АНИМАЦИИ ПОЛУЧЕНИЯ СЕРДЦА
    // ========================================

    function showHeartReward() {

        const reward = document.createElement("div");

        reward.className = "ops-heart-reward";

        reward.setAttribute("role", "status");
        reward.setAttribute("aria-live", "polite");

        reward.innerHTML = `
            <div class="ops-heart-reward-text">
                <span class="ops-heart-reward-number">+1</span>
                <span class="ops-heart-reward-label">
                    Новое сердечко!
                </span>
            </div>

            <span class="ops-heart-reward-icon">💖</span>
        `;

        document.body.appendChild(reward);

        // Запускаем появление
        requestAnimationFrame(function () {
            reward.classList.add("show");
        });

        // Начинаем исчезновение
        setTimeout(function () {
            reward.classList.remove("show");
        }, 2200);

        // Удаляем элемент после анимации
        setTimeout(function () {
            reward.remove();
        }, 2700);
    }

    // ========================================
    // ЗАВЕРШЕНИЕ ЗАДАНИЯ И НАЧИСЛЕНИЕ СЕРДЦА
    // ========================================


    function completeTask(task, extraData = {}, showReward = true) {

        if (!TASKS.includes(task)) {
            console.error("Неизвестное задание:", task);
            return false;
        }

        const progress = getProgress();

        // Не начисляем сердце повторно
        if (progress.completed[task]) {
            return false;
        }

        progress.completed[task] = {
            completedAt: Date.now(),
            ...extraData
        };

        const saved = saveProgress(progress);

        if (saved && showReward) {
            showHeartReward();
        }

        return saved;
    }


    // ========================================
    // ПОЛУЧЕНИЕ ВРЕМЕНИ ПРОХОЖДЕНИЯ 3 ИГРЫ
    // ========================================

    function getStar3Time() {

        const progress = getProgress();

        if (!progress.completed.star3) {
            return null;
        }

        return progress.completed.star3.completedAt;
    }

    // ========================================
    // СБРОС ВСЕГО ПРОГРЕССА
    // ========================================

    function resetProgress() {

        try {

            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem("star3GameState");

            window.dispatchEvent(
                new Event("ops-progress-change")
            );

            return true;

        } catch (error) {

            console.error("Не удалось сбросить прогресс:", error);

            return false;
        }
    }

    // ========================================
    // ПУБЛИЧНЫЕ ФУНКЦИИ
    // ========================================

    return {
        getProgress,
        getHearts,
        isCompleted,
        completeTask,
        showHeartReward,
        getStar3Time,
        resetProgress
    };

})();
