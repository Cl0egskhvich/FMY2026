// ЭЛЕМЕНТЫ СТРАНИЦЫ

const typingInput = document.getElementById("typingInput");

const textPreview = document.getElementById("textPreview");

const timer = document.getElementById("timer");
const timerFill = document.getElementById("timerFill");

const gameFeedback = document.getElementById("gameFeedback");
const retryButton = document.getElementById("retryButton");

/*----------------------------------------------*/
const typingArea = document.querySelector(".typing-area");
const secondGame = document.getElementById("secondGame");
const gameTitle = document.getElementById("gameTitle");
const gameSubtitle = document.getElementById("gameSubtitle");

// ЭЛЕМЕНТЫ ВТОРОЙ ИГРЫ

const drawingCanvas = document.getElementById("heartCanvas");
const drawingContext = drawingCanvas.getContext("2d");

const drawingTimer = document.getElementById("drawingTimer");
const drawingTimerFill = document.getElementById("drawingTimerFill");

const drawingFeedback = document.getElementById("drawingFeedback");
const drawingRetry = document.getElementById("drawingRetry");

// Элементы третьей игры
const thirdGame = document.getElementById("thirdGame");

const heartHuntTimer = document.getElementById("heartHuntTimer");
const heartHuntTimerFill = document.getElementById("heartHuntTimerFill");
const heartHuntFeedback = document.getElementById("heartHuntFeedback");
const heartHuntRetry = document.getElementById("heartHuntRetry");
const heartTarget = document.getElementById("heartTarget");

// Элементы четвёртой игры

const fourthGame = document.getElementById("fourthGame");

// НАСТРОЙКИ ИГРЫ

const targetText = "Я тебя люблю";
const gameDuration = 8000;


// СОСТОЯНИЕ ИГРЫ

let startTime = null;
let timerInterval = null;

let gameStarted = false;
let gameFinished = false;


// ОБНОВЛЕНИЕ ПОДСКАЗКИ


function updateTextPreview() {

    const enteredText = typingInput.value;

    const typedSpan = textPreview.querySelector(".typed-text");
    const hintSpan = textPreview.querySelector(".hint-text");

    // Очищаем предыдущий предпросмотр
    typedSpan.replaceChildren();

    // Создаём отдельный элемент для каждой введённой буквы
    [...enteredText].forEach((character, index) => {

        const letter = document.createElement("span");

        letter.textContent = character;

        // Проверяем, совпадает ли буква с нужной позицией
        if (
            character.toLowerCase() !==
            targetText[index].toLowerCase()
        ) {
            letter.classList.add("wrong-character");
        }

        typedSpan.appendChild(letter);

    });

    // Оставляем подсказку с невведённой частью текста
    hintSpan.textContent = targetText.substring(enteredText.length);

    const inputLine = document.querySelector(".input-line");

    inputLine.style.width = textPreview.scrollWidth + "px";

}



// ЗАПУСК ТАЙМЕРА

function startGame() {

    if (gameStarted || gameFinished) return;

    gameStarted = true;

    gameFeedback.className = "game-feedback";

    startTime = Date.now();

    timerInterval = setInterval(updateTimer, 50);

}


// ОБНОВЛЕНИЕ ТАЙМЕРА

function updateTimer() {

    const elapsed = Date.now() - startTime;

    const remaining = Math.max(0, gameDuration - elapsed);

    const seconds = remaining / 1000;

    timer.textContent = seconds.toFixed(1);

    timerFill.style.width =
        `${(remaining / gameDuration) * 100}%`;

    if (remaining <= 0) {
        finishGame(false);
    }

}


// ПРОВЕРКА ВВЕДЁННОГО ТЕКСТА

function checkText() {

    if (gameFinished) return;

    const enteredText = typingInput.value;

    updateTextPreview();

    if (enteredText.toLowerCase() === targetText.toLowerCase()) {
        finishGame(true);
    }

}


// ЗАВЕРШЕНИЕ ИГРЫ

function finishGame(success) {

    if (gameFinished) return;

    gameFinished = true;

    clearInterval(timerInterval);

    typingInput.disabled = true;

    if (success) {

        timer.textContent = "Успех!";
        timerFill.style.width = "100%";

        gameFeedback.textContent = "У тебя получилось! ❤️";
        gameFeedback.className = "game-feedback success";

        retryButton.style.display = "none";

        startNextGameCountdown();

    } else {

        timer.textContent = "0.0";
        timerFill.style.width = "0%";

        gameFeedback.textContent = "Время вышло! Попробуй ещё раз";
        gameFeedback.className = "game-feedback failure";

        retryButton.style.display = "block";

    }

}


// ПЕРВОЕ НАЖАТИЕ НА ПОЛЕ

typingInput.addEventListener("focus", function() {

    startGame();

});


// ВВОД ТЕКСТА

typingInput.addEventListener("input", function() {

    if (!gameStarted && !gameFinished) {
        startGame();
    }

    checkText();

});


// ПОВТОРНАЯ ПОПЫТКА

retryButton.addEventListener("click", function() {

    clearInterval(timerInterval);

    startTime = null;
    timerInterval = null;

    gameStarted = false;
    gameFinished = false;

    typingInput.disabled = false;
    typingInput.value = "";

    timer.textContent = "5.0";

    timerFill.style.width = "100%";

    gameFeedback.textContent =
        "Нажми на строку, чтобы начать";

    gameFeedback.className = "game-feedback";

    retryButton.style.display = "none";

    updateTextPreview();

    typingInput.focus();

});

// ЗАВЕРШЕНИЕ ВВОДА ПО ENTER

typingInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        if (gameStarted && !gameFinished) {
            checkText();
            finishGame(
                typingInput.value.toLowerCase() === targetText.toLowerCase()
            );
        }

    }

});

// НАЧАЛЬНОЕ СОСТОЯНИЕ

updateTextPreview();

/*----------------------------------------------*/

// ПЕРЕХОД КО ВТОРОЙ ИГРЕ

function startNextGameCountdown() {

    let countdown = 3;

    gameFeedback.innerHTML =
        `Следующая игра через <span id="nextCountdown">${countdown}</span>`;

    const countdownInterval = setInterval(() => {

        countdown--;

        const countdownElement =
            document.getElementById("nextCountdown");

        if (countdownElement) {
            countdownElement.textContent = countdown;
        }

        if (countdown <= 0) {

            clearInterval(countdownInterval);

            typingArea.classList.add("game-hidden");

            setTimeout(() => {

                secondGame.classList.add("game-visible");

                initializeSecondGame();

            }, 400);    

        }

    }, 1000);

}

// ========================================
// ВТОРАЯ ИГРА — САХАРНОЕ СЕРДЦЕ
// ========================================

const drawingDuration = 6000;

let heartPoints = [];

let drawingStarted = false;
let drawingActive = false;
let drawingFinished = false;

let drawingStartTime = null;
let drawingInterval = null;

let nextHeartPoint = 1;
let lastPointerPosition = null;


// СОЗДАНИЕ КОНТУРА СЕРДЦА

function createHeartPoints() {

    const points = [];

    const centerX = 210;
    const centerY = 150;
    const scale = 8.2;

    const totalPoints = 180;

    for (let i = 0; i <= totalPoints; i++) {

        const t = Math.PI + (Math.PI * 2 * i / totalPoints);

        const x = 16 * Math.pow(Math.sin(t), 3);

        const y = -(
            13 * Math.cos(t)
            - 5 * Math.cos(2 * t)
            - 2 * Math.cos(3 * t)
            - Math.cos(4 * t)
        );

        points.push({
            x: centerX + x * scale,
            y: centerY + y * scale
        });

    }

    return points;

}


// ОТРИСОВКА СЕРДЦА

function drawHeart() {

    const ctx = drawingContext;

    ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);

    // ОСНОВНОЙ КОНТУР

    ctx.beginPath();

    heartPoints.forEach((point, index) => {

        if (index === 0) {
            ctx.moveTo(point.x, point.y);
        } else {
            ctx.lineTo(point.x, point.y);
        }

    });

    ctx.strokeStyle = "rgba(216, 180, 254, 0.65)";
    ctx.lineWidth = 3;

    ctx.shadowColor = "#c99aff";
    ctx.shadowBlur = 8;

    ctx.stroke();

    ctx.shadowBlur = 0;


    // УЖЕ ПРОЙДЕННАЯ ЧАСТЬ

    if (nextHeartPoint > 1) {

        ctx.beginPath();

        ctx.moveTo(
            heartPoints[0].x,
            heartPoints[0].y
        );

        for (let i = 1; i < nextHeartPoint; i++) {

            ctx.lineTo(
                heartPoints[i].x,
                heartPoints[i].y
            );

        }

        ctx.strokeStyle = "#ff477e";
        ctx.lineWidth = 4;
        ctx.shadowColor = "#ff174f";
        ctx.shadowBlur = 12;

        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.stroke();

        ctx.shadowBlur = 0;

    }


    // СТАРТОВАЯ ТОЧКА

    ctx.beginPath();

    ctx.arc(
        heartPoints[0].x,
        heartPoints[0].y,
        3,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ff477e";
    ctx.shadowColor = "#ff174f";
    ctx.shadowBlur = 12;

    ctx.fill();

    ctx.shadowBlur = 0;

}


// НАЧАЛО ВТОРОЙ ИГРЫ

function initializeSecondGame() {
    gameTitle.textContent = "Heart Attack!";
    gameSubtitle.style.display = "none";
    clearInterval(drawingInterval);

    heartPoints = createHeartPoints();

    drawingStarted = false;
    drawingActive = false;
    drawingFinished = false;

    drawingStartTime = null;

    nextHeartPoint = 1;
    lastPointerPosition = null;

    drawingTimer.textContent = "6.0";

    drawingTimerFill.style.width = "100%";

    drawingFeedback.textContent =
        "Начни с нижней точки сердца";

    drawingFeedback.className = "drawing-feedback";

    drawingRetry.style.display = "none";

    drawHeart();

}


// ПОЛУЧЕНИЕ КООРДИНАТ УКАЗАТЕЛЯ

function getPointerPosition(event) {

    const rect = drawingCanvas.getBoundingClientRect();

    return {
        x: (event.clientX - rect.left) *
            (drawingCanvas.width / rect.width),

        y: (event.clientY - rect.top) *
            (drawingCanvas.height / rect.height)
    };

}


// РАССТОЯНИЕ ОТ ТОЧКИ ДО ОТРЕЗКА

function distanceToSegment(point, start, end) {

    const dx = end.x - start.x;
    const dy = end.y - start.y;

    const lengthSquared = dx * dx + dy * dy;

    if (lengthSquared === 0) {

        return Math.hypot(
            point.x - start.x,
            point.y - start.y
        );

    }

    let t = (
        (point.x - start.x) * dx +
        (point.y - start.y) * dy
    ) / lengthSquared;

    t = Math.max(0, Math.min(1, t));

    const closestX = start.x + t * dx;
    const closestY = start.y + t * dy;

    return Math.hypot(
        point.x - closestX,
        point.y - closestY
    );

}


// ЗАПУСК ТАЙМЕРА РИСОВАНИЯ

function startDrawingTimer() {

    if (drawingStarted) return;

    drawingStarted = true;
    drawingStartTime = Date.now();

    drawingFeedback.textContent = "Обведи до конца";

    drawingInterval = setInterval(() => {

        const elapsed = Date.now() - drawingStartTime;

        const remaining = Math.max(
            0,
            drawingDuration - elapsed
        );

        drawingTimer.textContent =
            (remaining / 1000).toFixed(1);

        drawingTimerFill.style.width =
            `${remaining / drawingDuration * 100}%`;

        if (remaining <= 0) {
            finishDrawing(false);
        }

    }, 30);

}


// ПРОВЕРКА ПРОЙДЕННЫХ ТОЧЕК

function checkHeartPoints(start, end) {

    while (nextHeartPoint < heartPoints.length) {

        const point = heartPoints[nextHeartPoint];

        const distance = distanceToSegment(
            point,
            start,
            end
        );

        if (distance <= 19) {

            nextHeartPoint++;

        } else {

            break;

        }

    }

    drawHeart();

    if (nextHeartPoint >= heartPoints.length) {

        finishDrawing(true);

    }

}


// НАЧАЛО РИСОВАНИЯ

drawingCanvas.addEventListener("pointerdown", function(event) {

    if (drawingFinished) return;

    event.preventDefault();

    const position = getPointerPosition(event);

    // ПЕРВЫЙ СТАРТ

    if (!drawingStarted) {

        const startPoint = heartPoints[0];

        const distance = Math.hypot(
            position.x - startPoint.x,
            position.y - startPoint.y
        );

        if (distance > 30) {

            drawingFeedback.textContent =
                "Начни с нижней точки сердца";

            return;

        }

        startDrawingTimer();

    } else {

        // ПРОДОЛЖЕНИЕ ПОСЛЕ ОТПУСКАНИЯ МЫШИ ИЛИ ПАЛЬЦА

        const previousPoint = heartPoints[nextHeartPoint - 1];

        const distance = Math.hypot(
            position.x - previousPoint.x,
            position.y - previousPoint.y
        );

        if (distance > 25) return;

    }

    drawingActive = true;
    lastPointerPosition = position;

    drawingCanvas.setPointerCapture(event.pointerId);

});


// ДВИЖЕНИЕ МЫШИ ИЛИ ПАЛЬЦА

drawingCanvas.addEventListener("pointermove", function(event) {

    if (!drawingActive || drawingFinished) return;

    event.preventDefault();

    const position = getPointerPosition(event);

    checkHeartPoints(
        lastPointerPosition,
        position
    );

    lastPointerPosition = position;

});


// ОКОНЧАНИЕ ДВИЖЕНИЯ

drawingCanvas.addEventListener("pointerup", function() {

    drawingActive = false;
    lastPointerPosition = null;

});

drawingCanvas.addEventListener("pointercancel", function() {

    drawingActive = false;
    lastPointerPosition = null;

});


// ЗАВЕРШЕНИЕ ИГРЫ

function finishDrawing(success) {

    if (drawingFinished) return;

    drawingFinished = true;
    drawingActive = false;

    clearInterval(drawingInterval);

    if (success) {

        drawingTimer.textContent = "Успех!";

        drawingTimerFill.style.width = "100%";

        drawingFeedback.textContent =
            "Получилось! Ты справилась ❤️";

        drawingFeedback.className =
            "drawing-feedback success";

        drawingRetry.style.display = "none";
        setTimeout(startThirdGameCountdown, 1000);

    } else {

        drawingTimer.textContent = "0.0";

        drawingTimerFill.style.width = "0%";

        drawingFeedback.textContent =
            "Время вышло! Попробуй ещё раз";

        drawingFeedback.className =
            "drawing-feedback failure";

        drawingRetry.style.display = "block";

    }

}


// ПОВТОРНАЯ ПОПЫТКА

drawingRetry.addEventListener("click", function() {

    initializeSecondGame();

});

function startThirdGameCountdown() {
    let countdown = 3;

    drawingFeedback.innerHTML =
        `Следующая игра через <span id="thirdCountdown">${countdown}</span>`;

    const countdownInterval = setInterval(() => {
        countdown--;

        const countdownElement =
            document.getElementById("thirdCountdown");

        if (countdownElement) {
            countdownElement.textContent = countdown;
        }

        if (countdown <= 0) {
            clearInterval(countdownInterval);

            secondGame.classList.remove("game-visible");

            setTimeout(() => {
                thirdGame.classList.add("game-visible");
                initializeThirdGame();
            }, 400);
        }
    }, 1000);
}

// ========================================
// ТРЕТЬЯ ИГРА — НАЙДИ СЕРДЕЧКО
// ========================================

const heartHuntDuration = 40000;

const HEART_TARGET_X = 1032;
const HEART_TARGET_Y = 550;
const HEART_TARGET_SCALE = 1;
// Координаты левого верхнего угла PNG
// относительно исходной картинки 1280 × 960

let heartHuntStarted = false;
let heartHuntFinished = false;
let heartHuntStartTime = null;
let heartHuntInterval = null;
let fourthGameCountdown = null;


// Подгоняем положение сердца под исходное изображение
function positionHeartTarget() {
    heartTarget.style.left =
        `${HEART_TARGET_X / 1280 * 100}%`;

    heartTarget.style.top =
        `${HEART_TARGET_Y / 960 * 100}%`;

    heartTarget.style.width =
        `${9.375 * HEART_TARGET_SCALE}%`;

    heartTarget.style.height =
        `${13.125 * HEART_TARGET_SCALE}%`;
}


// Запуск третьей игры
function initializeThirdGame() {
    clearInterval(heartHuntInterval);
    clearInterval(fourthGameCountdown);

    heartHuntStarted = true;
    heartHuntFinished = false;
    heartHuntStartTime = Date.now();

    heartHuntTimer.textContent = "40.0";
    heartHuntTimerFill.style.width = "100%";

    heartHuntFeedback.textContent =
        "Внимательно присмотрись!";

    heartHuntFeedback.className =
        "heart-hunt-feedback";

    heartHuntRetry.style.display = "none";

    heartTarget.classList.remove("found");

    positionHeartTarget();

    updateHeartHuntTimer();

    heartHuntInterval = setInterval(
        updateHeartHuntTimer,
        50
    );
}


// Обновление таймера
function updateHeartHuntTimer() {
    if (!heartHuntStarted || heartHuntFinished) return;

    const elapsed = Date.now() - heartHuntStartTime;

    const remaining = Math.max(
        0,
        heartHuntDuration - elapsed
    );

    heartHuntTimer.textContent =
        (remaining / 1000).toFixed(1);

    heartHuntTimerFill.style.width =
        `${remaining / heartHuntDuration * 100}%`;

    if (remaining <= 0) {
        finishHeartHunt(false);
    }
}


// Нажатие на искомое сердце
heartTarget.addEventListener("click", function() {
    if (heartHuntFinished) return;

    finishHeartHunt(true);
});


// Завершение игры
function finishHeartHunt(success) {
    if (heartHuntFinished) return;

    heartHuntFinished = true;
    heartHuntStarted = false;

    clearInterval(heartHuntInterval);

    if (success) {
        heartHuntTimer.textContent = "Успех!";

        heartHuntTimerFill.style.width = "100%";

        heartHuntFeedback.textContent =
            "Нашла! Ты справилась ❤️";

        heartHuntFeedback.className =
            "heart-hunt-feedback success";

        heartTarget.classList.add("found");

        heartHuntRetry.style.display = "none";

        // Сохраняем прохождение
        localStorage.setItem(
            "star4Completed",
            "true"
        );

        setTimeout(startFourthGameCountdown, 1000);

    } else {
        heartHuntTimer.textContent = "0.0";

        heartHuntTimerFill.style.width = "0%";

        heartHuntFeedback.textContent =
            "Время вышло! Попробуй ещё раз";

        heartHuntFeedback.className =
            "heart-hunt-feedback failure";

        heartHuntRetry.style.display = "block";
    }
}


// Отсчёт до четвёртой игры
function startFourthGameCountdown() {
    let countdown = 3;

    heartHuntFeedback.innerHTML =
        `Следующая игра через <span id="fourthCountdown">${countdown}</span>`;

    const countdownElement =
        document.getElementById("fourthCountdown");

    fourthGameCountdown = setInterval(() => {
        countdown--;

        if (countdownElement) {
            countdownElement.textContent = countdown;
        }

        if (countdown <= 0) {
            clearInterval(fourthGameCountdown);

            // Скрываем третью игру
            thirdGame.classList.remove("game-visible");

            // Показываем четвёртую
            setTimeout(() => {
                fourthGame.classList.add("game-visible");
            }, 400);
        }
    }, 1000);
}


// Повторная попытка
heartHuntRetry.addEventListener("click", function() {
    initializeThirdGame();
});

// ========================================
// ОСНОВА ЧЕТВЁРТОЙ ИГРЫ
// ========================================


// ========================================
// ЧЕТВЁРТАЯ ИГРА — СОБЕРИ СЕРДЦЕ
// ========================================

(function initializeTetrisBoard() {

    const heartGrid = document.getElementById("heartGrid");
    const tetrisPieces = document.getElementById("tetrisPieces");
    const tetrisFeedback = document.getElementById("tetrisFeedback");

    // ФОРМА СЕРДЦА

    const heartMask = [
            "0011000001100",
            "0111100011110",
            "1111110111111",
            "1110111110111",
            "1111111111111",
            "0111111111110",
            "0011111101100",
            "0001100011000",
            "0000111110000",
            "0000011100000",
            "0000001000000"
        ];

    const ROWS = 11;
    const COLS = 13;

    // ФОРМЫ ФИГУР

    const shapes = {
        square: [[0,0], [1,0], [0,1], [1,1]],

        L: [[0,0], [0,1], [0,2], [1,2]],

        "L-mirror": [[1,0], [1,1], [1,2], [0,2]],

        Z: [[0,0], [1,0], [1,1], [2,1]],

        "Z-mirror": [[1,0], [2,0], [0,1], [1,1]],

        I: [[0,0], [1,0], [2,0], [3,0]],

        T: [[0,0], [1,0], [2,0], [1,1]]
    };

    // ЦВЕТА

    const colors = {
        square: "#E89B55",
        L: "#62A9E8",
        "L-mirror": "#B57BE5",
        Z: "#65C9A4",
        "Z-mirror": "#E879A5",
        I: "#E8CE68",
        T: "#8D91EF"
    };

    // СОСТОЯНИЕ ИГРЫ

    let placedPieces = [];
    let nextPieceId = 1;

    let activeDrag = null;
    let dragElement = null;

    let gameCompleted = false;

    // СОЗДАНИЕ ИГРОВОГО ПОЛЯ

    heartMask.forEach((line, row) => {

        line.split("").forEach((cell, col) => {

            const square = document.createElement("div");

            square.classList.add("heart-cell");

            square.classList.add(
                cell === "1" ? "target-cell" : "outside-cell"
            );

            square.dataset.row = row;
            square.dataset.col = col;

            heartGrid.appendChild(square);

        });

    });

    // СЛОЙ ДЛЯ РАЗМЕЩЁННЫХ ФИГУР

    const pieceLayer = document.createElement("div");

    pieceLayer.className = "placed-piece-layer";

    heartGrid.appendChild(pieceLayer);

    // СЛОЙ ПРЕДПРОСМОТРА РАЗМЕЩЕНИЯ

    const placementPreviewLayer = document.createElement("div");

    placementPreviewLayer.className = "placement-preview-layer";

    heartGrid.appendChild(placementPreviewLayer);

    // ОТРИСОВКА ФИГУР В ПАНЕЛИ


    function renderOptionPreview(option) {

        const shapeName = option.dataset.shape;
        const preview = option.querySelector(".piece-preview");
        const shape = shapes[shapeName];

        const maxCol = Math.max(...shape.map(p => p[0]));
        const maxRow = Math.max(...shape.map(p => p[1]));

        preview.innerHTML = "";

        preview.style.gridTemplateColumns =
            `repeat(${maxCol + 1}, 14px)`;

        preview.style.gridTemplateRows =
            `repeat(${maxRow + 1}, 14px)`;

        shape.forEach(([col, row]) => {

            const block = document.createElement("span");

            block.style.gridColumn = col + 1;
            block.style.gridRow = row + 1;

            block.dataset.col = col;
            block.dataset.row = row;

            preview.appendChild(block);

        });

    }

    // Создаём кнопки вращения

    document.querySelectorAll(".piece-option").forEach(option => {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "piece-rotate";
        button.textContent = "↻";
        button.title = "Повернуть фигуру";

        option.insertBefore(button, option.firstChild);

        renderOptionPreview(option);

        button.addEventListener("click", function(event) {

            event.stopPropagation();

            const shapeName = option.dataset.shape;

            shapes[shapeName] = rotateShape(shapes[shapeName]);

            renderOptionPreview(option);

        });

    });


    // ПОЛУЧЕНИЕ РАЗМЕРОВ ФИГУРЫ

    function getShapeSize(shape) {

        return {
            width: Math.max(...shape.map(p => p[0])) + 1,
            height: Math.max(...shape.map(p => p[1])) + 1
        };

    }

    function rotateShape(shape) {

        // Поворачиваем координаты на 90 градусов
        const rotated = shape.map(([col, row]) => [
            -row,
            col
        ]);

        // Сдвигаем фигуру, чтобы координаты начинались с нуля
        const minCol = Math.min(...rotated.map(p => p[0]));
        const minRow = Math.min(...rotated.map(p => p[1]));

        return rotated.map(([col, row]) => [
            col - minCol,
            row - minRow
        ]);
    }

    // ПРОВЕРКА ДОПУСТИМОСТИ РАЗМЕЩЕНИЯ

    function canPlace(
        shapeName,
        anchorCol,
        anchorRow,
        customShape = null
    ) {

        const shape = customShape || shapes[shapeName];
        for (const [col, row] of shape) {

            const targetCol = anchorCol + col;
            const targetRow = anchorRow + row;

            // Проверка границ поля

            if (
                targetCol < 0 ||
                targetCol >= COLS ||
                targetRow < 0 ||
                targetRow >= ROWS
            ) {
                return false;
            }

            // Проверка формы сердца

            if (heartMask[targetRow][targetCol] !== "1") {
                return false;
            }

            // Проверка занятых клеток

            const occupied = placedPieces.some(piece => {

                return piece.blocks.some(([pieceCol, pieceRow]) => {

                    return (
                        piece.col + pieceCol === targetCol &&
                        piece.row + pieceRow === targetRow
                    );

                });

            });

            if (occupied) return false;

        }

        return true;

    }


    function renderPlacementPreview(anchorCol, anchorRow) {

        placementPreviewLayer.innerHTML = "";

        if (!activeDrag) return;

        const shape = activeDrag.shape || shapes[activeDrag.shapeName];

        const valid = canPlace(
            activeDrag.shapeName,
            anchorCol,
            anchorRow,
            shape
        );

        shape.forEach(([col, row]) => {

            const targetCol = anchorCol + col;
            const targetRow = anchorRow + row;

            // Не рисуем клетки за пределами поля
            if (
                targetCol < 0 || targetCol >= COLS ||
                targetRow < 0 || targetRow >= ROWS
            ) return;

            const cell = document.createElement("div");

            cell.className = "placement-preview-cell";

            cell.style.gridColumn = targetCol + 1;
            cell.style.gridRow = targetRow + 1;

            cell.style.background = valid
                ? colors[activeDrag.shapeName] + "99"
                : "#ff454599";

            cell.style.border = valid
                ? "2px solid #ffffffaa"
                : "2px solid #ff4545";

            placementPreviewLayer.appendChild(cell);

        });

    }


    // ОТРИСОВКА РАЗМЕЩЁННЫХ ФИГУР

    function renderPlacedPieces() {

        pieceLayer.innerHTML = "";

        placedPieces.forEach(piece => {

            const wrapper = document.createElement("div");

            wrapper.className = "placed-piece";

            wrapper.dataset.pieceId = piece.id;

            piece.blocks.forEach(([col, row]) => {

                const block = document.createElement("div");

                block.className = "placed-block";

                block.style.gridColumn =
                    piece.col + col + 1;

                block.style.gridRow =
                    piece.row + row + 1;

                block.style.backgroundColor = piece.color;

                block.dataset.pieceId = piece.id;
                block.dataset.col = col;
                block.dataset.row = row;

                wrapper.appendChild(block);

            });

            pieceLayer.appendChild(wrapper);

        });

    }

    // СОЗДАНИЕ ПРЕДПРОСМОТРА ПРИ ПЕРЕТАСКИВАНИИ


    function getCellMetrics() {

        const rect = heartGrid.getBoundingClientRect();
        const style = getComputedStyle(heartGrid);

        const gapX = parseFloat(style.columnGap) || 0;
        const gapY = parseFloat(style.rowGap) || 0;

        return {
            width: (rect.width - gapX * (COLS - 1)) / COLS,
            height: (rect.height - gapY * (ROWS - 1)) / ROWS,
            gapX,
            gapY
        };
    }

    function createDragPreview(shapeName) {

        const shape = arguments[1] || shapes[shapeName];
        const size = getShapeSize(shape);
        const metrics = getCellMetrics();

        const preview = document.createElement("div");

        preview.className = "drag-preview";

        preview.style.gap = `${metrics.gapX}px`;

        preview.style.gridTemplateColumns =
            `repeat(${size.width}, ${metrics.width}px)`;

        preview.style.gridTemplateRows =
            `repeat(${size.height}, ${metrics.height}px)`;

        shape.forEach(([col, row]) => {

            const block = document.createElement("span");

            block.style.gridColumn = col + 1;
            block.style.gridRow = row + 1;

            block.style.width = metrics.width + "px";
            block.style.height = metrics.height + "px";

            block.style.background = colors[shapeName];

            preview.appendChild(block);

        });

        document.body.appendChild(preview);

        return preview;
    }


    // ПЕРЕМЕЩЕНИЕ ПРЕДПРОСМОТРА


    function moveDragPreview(x, y) {

        if (!dragElement || !activeDrag) return;

        const metrics = getCellMetrics();

        const left = x -
            activeDrag.grabCol * (metrics.width + metrics.gapX) -
            activeDrag.offsetX;

        const top = y -
            activeDrag.grabRow * (metrics.height + metrics.gapY) -
            activeDrag.offsetY;

        dragElement.style.left = left + "px";
        dragElement.style.top = top + "px";

        dragElement.style.transform = "none";
        const cell = getGridCell(x, y);

        if (cell) {

            const anchorCol = cell.col - activeDrag.grabCol;
            const anchorRow = cell.row - activeDrag.grabRow;

            renderPlacementPreview(anchorCol, anchorRow);

        } else {

            placementPreviewLayer.innerHTML = "";

        }
    }


    // ПОЛУЧЕНИЕ КООРДИНАТ КЛЕТКИ

    function getGridCell(x, y) {

        const rect = heartGrid.getBoundingClientRect();

        if (
            x < rect.left ||
            x > rect.right ||
            y < rect.top ||
            y > rect.bottom
        ) {
            return null;
        }

        const style = getComputedStyle(heartGrid);

        const gap = parseFloat(style.columnGap) || 0;

        const cellWidth =
            (rect.width - gap * (COLS - 1)) / COLS;

        const cellHeight =
            (rect.height - gap * (ROWS - 1)) / ROWS;

        const col = Math.floor(
            (x - rect.left) / (cellWidth + gap)
        );

        const row = Math.floor(
            (y - rect.top) / (cellHeight + gap)
        );

        if (
            col < 0 || col >= COLS ||
            row < 0 || row >= ROWS
        ) {
            return null;
        }

        return { col, row };

    }

    // НАЧАЛО ПЕРЕТАСКИВАНИЯ


    function startDrag(
        shapeName,
        event,
        existingPiece = null,
        grabCol = 0,
        grabRow = 0,
        offsetX = 0,
        offsetY = 0
    ) {

        if (gameCompleted) return;

        event.preventDefault();

        if (existingPiece) {

            placedPieces = placedPieces.filter(
                piece => piece.id !== existingPiece.id
            );

            renderPlacedPieces();

        }

        activeDrag = {
            shapeName,
            originalPiece: existingPiece,
            grabCol,
            grabRow,
            offsetX,
            offsetY,

            shape: existingPiece
                ? existingPiece.blocks.map(block => [...block])
                : shapes[shapeName].map(block => [...block])
        };

        dragElement = createDragPreview(shapeName, activeDrag.shape);

        moveDragPreview(event.clientX, event.clientY);
    }


    // ЗАХВАТ ФИГУР ИЗ НИЖНЕЙ ПАНЕЛИ

    tetrisPieces.addEventListener("pointerdown", function(event) {

        // Не начинаем перетаскивание при нажатии на вращение
        if (event.target.closest(".piece-rotate")) return;

        const option = event.target.closest(".piece-option");

        if (!option) return;

        const shapeName = option.dataset.shape;
        const shape = shapes[shapeName];

        // Получаем размеры фигуры
        const size = getShapeSize(shape);

        // Определяем, куда именно нажали внутри карточки
        const rect = option.getBoundingClientRect();

        const relativeX = event.clientX - rect.left;
        const relativeY = event.clientY - rect.top;

        // Учитываем область, отведённую под кнопку вращения
        const preview = option.querySelector(".piece-preview");
        const previewRect = preview.getBoundingClientRect();

        const x = Math.max(0, Math.min(
            previewRect.width - 1,
            event.clientX - previewRect.left
        ));

        const y = Math.max(0, Math.min(
            previewRect.height - 1,
            event.clientY - previewRect.top
        ));

        const metrics = {
            width: previewRect.width / size.width,
            height: previewRect.height / size.height
        };

        // Определяем клетку фигуры, за которую её захватили
        const grabCol = Math.min(
            size.width - 1,
            Math.floor(x / metrics.width)
        );

        const grabRow = Math.min(
            size.height - 1,
            Math.floor(y / metrics.height)
        );

        // Смещение точки захвата внутри клетки
        const offsetX = x - grabCol * metrics.width;
        const offsetY = y - grabRow * metrics.height;

        startDrag(
            shapeName,
            event,
            null,
            grabCol,
            grabRow,
            offsetX,
            offsetY
        );

    });


    // ЗАХВАТ УЖЕ РАЗМЕЩЁННОЙ ФИГУРЫ


    heartGrid.addEventListener("pointerdown", function(event) {

        const block = event.target.closest(".placed-block");

        if (!block) return;

        const piece = placedPieces.find(
            item => item.id === Number(block.dataset.pieceId)
        );

        if (!piece) return;

        const rect = block.getBoundingClientRect();

        startDrag(
            piece.shapeName,
            event,
            piece,
            Number(block.dataset.col),
            Number(block.dataset.row),
            event.clientX - rect.left,
            event.clientY - rect.top
        );

    });


    // ДВИЖЕНИЕ ФИГУРЫ

    window.addEventListener("pointermove", function(event) {

        if (!activeDrag) return;

        event.preventDefault();

        moveDragPreview(event.clientX, event.clientY);

    });

    // ЗАВЕРШЕНИЕ ПЕРЕТАСКИВАНИЯ

    
    window.addEventListener("pointerup", function(event) {

        if (!activeDrag) return;

        const drag = activeDrag;

        // Получаем клетку под курсором
        const cell = getGridCell(event.clientX, event.clientY);

        // Убираем состояние перетаскивания
        activeDrag = null;

        // Удаляем плавающий предпросмотр
        if (dragElement) {
            dragElement.remove();
            dragElement = null;
        }

        // Убираем подсветку предполагаемого размещения
        placementPreviewLayer.innerHTML = "";

        // Если отпустили за пределами поля
        if (!cell) {

            if (drag.originalPiece) {
                renderPlacedPieces();
            }

            return;
        }

        // Используем ту же точку привязки,
        // что и при отображении предпросмотра
        const anchorCol = cell.col - drag.grabCol;
        const anchorRow = cell.row - drag.grabRow;

        // Проверяем возможность размещения
        if (
            canPlace(
                drag.shapeName,
                anchorCol,
                anchorRow,
                drag.shape
            )
        ) {

            placedPieces.push({

                id: nextPieceId++,

                shapeName: drag.shapeName,

                blocks: drag.shape,

                color: colors[drag.shapeName],

                col: anchorCol,
                row: anchorRow

            });

            renderPlacedPieces();

            checkWin();

        } else {

            // Если перемещали уже установленную фигуру,
            // возвращаем её на прежнее место
            if (drag.originalPiece) {

                placedPieces.push(drag.originalPiece);

                renderPlacedPieces();

            }

        }

    });


    // ОТМЕНА ПЕРЕТАСКИВАНИЯ

    window.addEventListener("pointercancel", function() {

        if (!activeDrag) return;

        const drag = activeDrag;

        activeDrag = null;
        placementPreviewLayer.innerHTML = "";

        if (dragElement) {
            dragElement.remove();
            dragElement = null;
        }

        if (drag.originalPiece) {

            placedPieces.push(drag.originalPiece);

            renderPlacedPieces();

        }

    });

    // ПРОВЕРКА ПОБЕДЫ

    // ПРОВЕРКА ПОБЕДЫ

    function checkWin() {
        const totalCells = heartMask.reduce(
            (sum, line) => sum + [...line].filter(c => c === "1").length, 0
        );

        const occupiedCells = placedPieces.reduce(
            (sum, piece) => sum + piece.blocks.length, 0
        );

        if (occupiedCells !== totalCells || gameCompleted) return;

        const blocks = pieceLayer.querySelectorAll(".placed-block");

        if (blocks.length === 0) return;

        gameCompleted = true;

        // СОХРАНЯЕМ ПРОХОЖДЕНИЕ ЧЕТВЁРТОЙ ЗВЕЗДЫ
        OPSProgress.completeTask("star4", {}, false);

        const retryButton = document.getElementById("tetrisRetry");
        if (retryButton) retryButton.style.display = "none";

        tetrisFeedback.textContent = "Ты собрала наше сердце! ❤️";
        tetrisFeedback.className = "tetris-feedback success";

        // Плавно перекрашиваем всё сердце
        requestAnimationFrame(() => {
            blocks.forEach(block => {
                block.style.backgroundColor = "#f53374";
            });

            // Ждём завершения перекрашивания — 1,8 секунды
            setTimeout(() => {
                // Ещё одна секунда перед появлением окна
                setTimeout(() => {
                    document.getElementById("tetrisModal").classList.add("show");
                    OPSProgress.showHeartReward();
                }, 1000);
            }, 1800);
        });
    }

})();

// Возвращение к созвездию
const backButton = document.getElementById("tetrisBackButton");

if (backButton) {
    backButton.addEventListener("click", () => {
        window.location.href = "../../constellation.html";
    });
}

// ========================================
// ВОССТАНОВЛЕНИЕ ПРОГРЕССА ВСЕЙ ЗВЕЗДЫ
// ========================================

if (OPSProgress.isCompleted("star4")) {

    document.querySelector(".typing-game").style.display = "none";

    document.getElementById("tetrisModal").classList.add("show");

    OPSProgress.showHeartReward();

}



