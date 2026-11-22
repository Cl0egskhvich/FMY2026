
// Третья звезда — поиск 8 предметов в комнате.
// Координаты и размеры взяты из исходного PSD (холст 1280 × 508).

const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 508;
const TOTAL_OBJECTS = 8;
const HINT_DELAY = 20; // секунд без новой находки

const objects = [
    { id: "object_01", file: "object_01.png", x: 301, y: 165, width: 87, height: 106 },
    { id: "object_02", file: "object_02.png", x: 782, y: 74, width: 35, height: 44 },
    { id: "object_03", file: "object_03.png", x: 802, y: 254, width: 31, height: 47 },
    { id: "object_04", file: "object_04.png", x: 75, y: 219, width: 191, height: 82 },
    { id: "object_05", file: "object_05.png", x: 464, y: 463, width: 71, height: 28 },
    { id: "object_07", file: "object_07.png", x: -53, y: 477, width: 224, height: 29 },
    { id: "object_08", file: "object_08.png", x: 1207, y: 28, width: 35, height: 22 },
    { id: "object_10", file: "object_10.png", x: 1051, y: 175, width: 20, height: 206 }
];

const scene = document.getElementById("gameScene");
const hotspotsLayer = document.getElementById("hotspotsLayer");
const foundGrid = document.getElementById("foundGrid");
const foundCount = document.getElementById("foundCount");
const timerElement = document.getElementById("timer");
const hintCard = document.getElementById("hintCard");
const hintImage = document.getElementById("hintImage");
const completionScreen = document.getElementById("completionScreen");
const backButton = document.getElementById("backButton");

const foundObjects = new Set();

let elapsedSeconds = 0;
let timerInterval = null;
let hintTimeout = null;
let gameFinished = false;

// ========================================
// СОХРАНЕНИЕ ПРОГРЕССА ТРЕТЬЕЙ ЗВЕЗДЫ
// ========================================

const GAME_STORAGE_KEY = "star3GameState";

function saveGameState() {
    const state = {
        foundObjects: [...foundObjects],
        elapsedSeconds: elapsedSeconds
    };

    localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(state));
}

function loadGameState() {
    try {
        const saved = localStorage.getItem(GAME_STORAGE_KEY);

        if (!saved) return null;

        const state = JSON.parse(saved);

        if (
            !state ||
            !Array.isArray(state.foundObjects) ||
            !Number.isFinite(state.elapsedSeconds)
        ) {
            return null;
        }

        return state;

    } catch (error) {
        console.error("Не удалось загрузить прогресс третьей звезды:", error);
        return null;
    }
}
// Создаём восемь пустых ячеек в столбике.
objects.forEach((object) => {
    const slot = document.createElement("div");
    slot.className = "found-slot";
    slot.dataset.objectId = object.id;
    slot.setAttribute("aria-label", "Пока пусто");

    const icon = document.createElement("img");
    icon.alt = "";
    icon.src = `images/icons/${object.file}`;

    slot.appendChild(icon);
    foundGrid.appendChild(slot);
});

// Создаём кликабельные изображения поверх фона.
objects.forEach((object) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hotspot";
    button.dataset.objectId = object.id;
    button.setAttribute("aria-label", `Найти предмет ${object.id.replace("_", " ")}`);

    button.style.left = `${(object.x / CANVAS_WIDTH) * 100}%`;
    button.style.top = `${(object.y / CANVAS_HEIGHT) * 100}%`;
    button.style.width = `${(object.width / CANVAS_WIDTH) * 100}%`;
    button.style.height = `${(object.height / CANVAS_HEIGHT) * 100}%`;

    const image = document.createElement("img");
    image.src = `images/room/${object.file}`;
    image.alt = "";
    image.draggable = false;

    button.appendChild(image);
    button.addEventListener("click", () => findObject(object.id));
    hotspotsLayer.appendChild(button);
});

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateTimer() {
    elapsedSeconds += 1;
    timerElement.textContent = formatTime(elapsedSeconds);

    saveGameState();
}

function startHintCountdown() {
    clearTimeout(hintTimeout);
    hintCard.hidden = true;

    hintTimeout = setTimeout(() => {
        showRandomHint();
    }, HINT_DELAY * 1000);
}

function showRandomHint() {
    if (gameFinished) return;

    const remainingObjects = objects.filter((object) => !foundObjects.has(object.id));
    if (remainingObjects.length === 0) return;

    const randomObject = remainingObjects[
        Math.floor(Math.random() * remainingObjects.length)
    ];

    // Используются отдельные иконки из images/icons/.
    hintImage.src = `images/icons/${randomObject.file}`;
    hintImage.alt = "Изображение предмета, который ещё нужно найти";
    hintCard.hidden = false;
}

function findObject(objectId) {
    if (gameFinished || foundObjects.has(objectId)) return;

    foundObjects.add(objectId);

    const hotspot = hotspotsLayer.querySelector(`[data-object-id="${objectId}"]`);
    if (hotspot) {
        hotspot.classList.add("found");
        hotspot.disabled = true;
        hotspot.setAttribute("aria-hidden", "true");
    }

    const slot = foundGrid.querySelector(`[data-object-id="${objectId}"]`);
    if (slot) {
        slot.classList.add("filled");
        slot.setAttribute("aria-label", "Предмет найден");
    }

    foundCount.textContent = `${foundObjects.size} / ${TOTAL_OBJECTS}`;
    saveGameState();

    if (foundObjects.size === TOTAL_OBJECTS) {
        finishGame();
        return;
    }

    // После каждой находки запускаем новый отсчёт подсказки.
    startHintCountdown();
}

function finishGame() {
    if (gameFinished) return;

    gameFinished = true;

    clearInterval(timerInterval);
    clearTimeout(hintTimeout);

    hintCard.hidden = true;

    saveGameState();

    // Выдаём сердечко за прохождение
    OPSProgress.completeTask("star3", {
        elapsedSeconds: elapsedSeconds
    });

    completionScreen.classList.add("visible");
    completionScreen.setAttribute("aria-hidden", "false");
}

// ========================================
// ВОССТАНОВЛЕНИЕ СОХРАНЁННОГО ПРОГРЕССА
// ========================================

function restoreGame() {

    const savedState = loadGameState();

    if (savedState) {

        elapsedSeconds = savedState.elapsedSeconds;

        // Восстанавливаем найденные предметы
        savedState.foundObjects.forEach(objectId => {

            const objectExists = objects.some(
                object => object.id === objectId
            );

            if (!objectExists) return;

            foundObjects.add(objectId);

            const hotspot = hotspotsLayer.querySelector(
                `[data-object-id="${objectId}"]`
            );

            if (hotspot) {
                hotspot.classList.add("found");
                hotspot.disabled = true;
                hotspot.setAttribute("aria-hidden", "true");
            }

            const slot = foundGrid.querySelector(
                `[data-object-id="${objectId}"]`
            );

            if (slot) {
                slot.classList.add("filled");
                slot.setAttribute("aria-label", "Предмет найден");
            }

        });

    }

    // Обновляем счётчик и таймер
    foundCount.textContent = `${foundObjects.size} / ${TOTAL_OBJECTS}`;
    timerElement.textContent = formatTime(elapsedSeconds);

    // Проверяем завершение
    if (
        foundObjects.size === TOTAL_OBJECTS ||
        OPSProgress.isCompleted("star3")
    ) {

        // Если старая версия уже отметила игру пройденной,
        // не выдаём сердечко повторно.
        finishGame();
        return;

    }

    // Продолжаем игру с сохранённого места
    timerInterval = setInterval(updateTimer, 1000);

    startHintCountdown();
}

restoreGame();

// ========================================
// ВОЗВРАТ К СОЗВЕЗДИЮ
// ========================================

backButton.addEventListener("click", () => {
    window.location.href = "../../constellation.html";
});