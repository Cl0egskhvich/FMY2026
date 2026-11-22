
const photosList = document.getElementById("photosList");
const photoSlots = document.querySelectorAll(".photo-slot");
const successMessage = document.getElementById("successMessage");
const backButton = document.getElementById("backButton");

// ========================================
// ВОССТАНОВЛЕНИЕ ПРОГРЕССА
// ========================================

let gameCompleted = OPSProgress.isCompleted("star1");

// Если игра уже пройдена — показываем результат
if (gameCompleted) {

    document.querySelector(".sorting-area").style.display = "none";
    document.querySelector(".photos-container").style.display = "none";

    successMessage.style.display = "block";

}

// ФОТОГРАФИИ В ПРАВИЛЬНОМ ПОРЯДКЕ

const photos = [
    "photo1.jpg",
    "photo2.jpg",
    "photo3.jpg",
    "photo4.jpg",
    "photo5.jpg"
];

// ПЕРЕМЕШИВАНИЕ ФОТОГРАФИЙ

const shuffledPhotos = [...photos].sort(() => Math.random() - 0.5);

// СОЗДАНИЕ КАРТИНОК

shuffledPhotos.forEach(photo => {

    const img = document.createElement("img");

    img.src = `images/${photo}`;
    img.classList.add("photo");
    img.draggable = true;
    img.dataset.name = photo;

    photosList.appendChild(img);

});

// ПЕРЕТАСКИВАНИЕ


// ========================================
// ПЕРЕТАСКИВАНИЕ ФОТОГРАФИЙ
// МЫШЬ + СЕНСОРНЫЙ ЭКРАН
// ========================================

let draggedPhoto = null;
let dragState = null;
let activeSlot = null;

// НАЧАЛО ПЕРЕТАСКИВАНИЯ

document.addEventListener("pointerdown", function(event) {

    const photo = event.target.closest(".photo");

    if (!photo) return;

    // Игнорируем дополнительные кнопки мыши
    if (event.pointerType === "mouse" && event.button !== 0) return;

    event.preventDefault();

    draggedPhoto = photo;

    const rect = photo.getBoundingClientRect();

    dragState = {
        originalParent: photo.parentElement,
        originalNextSibling: photo.nextSibling,
        originalStyle: photo.style.cssText,

        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top
    };

    photo.classList.add("dragging");

    // Переводим фотографию в свободное положение
    photo.style.position = "fixed";
    photo.style.left = rect.left + "px";
    photo.style.top = rect.top + "px";
    photo.style.width = rect.width + "px";
    photo.style.height = rect.height + "px";
    photo.style.zIndex = "1000";
    photo.style.pointerEvents = "none";
    photo.style.margin = "0";
    photo.style.transition = "none";

});

// ДВИЖЕНИЕ ФОТОГРАФИИ

document.addEventListener("pointermove", function(event) {

    if (!draggedPhoto || !dragState) return;

    event.preventDefault();

    draggedPhoto.style.left =
        (event.clientX - dragState.offsetX) + "px";

    draggedPhoto.style.top =
        (event.clientY - dragState.offsetY) + "px";

    // Определяем ячейку под пальцем или курсором
    const element = document.elementFromPoint(
        event.clientX,
        event.clientY
    );

    const slot = element?.closest(".photo-slot");

    if (activeSlot && activeSlot !== slot) {
        activeSlot.classList.remove("drag-over");
    }

    activeSlot = slot || null;

    if (activeSlot) {
        activeSlot.classList.add("drag-over");
    }

});

// ЗАВЕРШЕНИЕ ПЕРЕТАСКИВАНИЯ

function finishPhotoDrag(event) {

    if (!draggedPhoto || !dragState) return;

    const photo = draggedPhoto;
    const state = dragState;

    const element = document.elementFromPoint(
        event.clientX,
        event.clientY
    );

    const targetSlot = element?.closest(".photo-slot");

    // Убираем подсветку
    if (activeSlot) {
        activeSlot.classList.remove("drag-over");
    }

    // Возвращаем исходные стили фотографии
    photo.style.cssText = state.originalStyle;
    photo.classList.remove("dragging");

    draggedPhoto = null;
    dragState = null;
    activeSlot = null;

    // Если отпустили фотографию над ячейкой
    if (targetSlot) {

        const existingPhoto = targetSlot.querySelector(".photo");

        // Если ячейка уже занята
        if (existingPhoto && existingPhoto !== photo) {
            photosList.appendChild(existingPhoto);
        }

        targetSlot.appendChild(photo);

        checkSorting();

    } else {

        // Если отпустили вне ячеек — возвращаем назад
        const parent = state.originalParent;
        const nextSibling = state.originalNextSibling;

        if (nextSibling && nextSibling.parentElement === parent) {
            parent.insertBefore(photo, nextSibling);
        } else {
            parent.appendChild(photo);
        }

    }

}

document.addEventListener("pointerup", finishPhotoDrag);
document.addEventListener("pointercancel", finishPhotoDrag);


// ПРОВЕРКА СОРТИРОВКИ

function checkSorting() {     
    // Игра уже пройдена
    if (gameCompleted) return;

    const filledSlots = [...photoSlots].filter(slot =>
        slot.querySelector(".photo")
    );

    if (filledSlots.length !== photos.length) return;

    const wrongPhotos = [];

    photoSlots.forEach((slot, index) => {

        const photo = slot.querySelector(".photo");

        if (photo.dataset.name !== photos[index]) {
            wrongPhotos.push(photo);
        }

    });

    // ЕСЛИ ВСЁ ПРАВИЛЬНО

    if (wrongPhotos.length === 0) {

        // Отмечаем игру как пройденную
        gameCompleted = true;

        // Начисляем сердце и сохраняем прогресс
        OPSProgress.completeTask("star1");

        photoSlots.forEach(slot => {
            slot.classList.add("correct");
        });

        successMessage.style.display = "block";

        return;

    }

    // ЕСЛИ ЕСТЬ ОШИБКИ

    wrongPhotos.forEach(photo => {
        photo.parentElement.classList.add("wrong");
    });

    setTimeout(() => {

        wrongPhotos.forEach(photo => {

            const slot = photo.parentElement;

            slot.classList.remove("wrong");

            photosList.appendChild(photo);

        });

    }, 500);

}

// ВОЗВРАТ К СОЗВЕЗДИЮ

backButton.addEventListener("click", function() {

    window.location.href = "/ourpersonaluniverse/constellation/constellation.html";

});
