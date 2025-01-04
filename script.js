const bird = document.getElementById("bird");
const timerElement = document.getElementById("timer");
const gameArea = document.getElementById("gameArea"); 
let timer;
let birdTop = 200;
let isAlive = true;

startTimer(0);

// Функция для обновления времени
function startTimer(sec) {
    timer = setInterval(() => {
        sec++;
        timerElement.innerText = sec; 
    }, 1000);
}

// Функция для прыжка
function flap() {
    if (isAlive) {
        birdTop -= 20; 
        bird.style.top = birdTop + "px";
    }
}

// Функция для падения
function fall() {
    if (isAlive) {
        birdTop += 20; 
        bird.style.top = birdTop + "px";
    }
}

// Добавляем обработчик событий
document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowUp") {
        flap(); 
    } else if (event.key === "ArrowDown") {
        fall(); 
    }
});

// Генерация труб
function generatePipe() {
    const pipeHeight = Math.floor(Math.random() * 200) + 50; // Случайная высота трубы (от 50 до 250)
    const pipeGap = 150; // Промежуток между верхней и нижней трубами

    const topPipe = document.createElement("div");
    topPipe.classList.add("pipe");
    topPipe.style.height = pipeHeight + "px";
    topPipe.style.top = "0"; 
    topPipe.style.right = "0"; 

    const bottomPipe = document.createElement("div");
    bottomPipe.classList.add("pipe");
    bottomPipe.style.height = (400 - pipeHeight - pipeGap) + "px"; // Высота нижней трубы
    bottomPipe.style.bottom = "0"; 
    bottomPipe.style.right = "0"; 

    gameArea.appendChild(topPipe);
    gameArea.appendChild(bottomPipe);

    movePipes(topPipe, bottomPipe);
}

// Движение труб
function movePipes(topPipe, bottomPipe) {
    let moveInterval = setInterval(() => {
        const topPipeRect = topPipe.getBoundingClientRect();
        const bottomPipeRect = bottomPipe.getBoundingClientRect();

        console.log(topPipeRect.right)
        // Проверяем, вышли ли трубы за пределы игрового поля
        if (parseInt(topPipeRect.right) < 520) {
            clearInterval(moveInterval);
            topPipe.remove();
            bottomPipe.remove();
        } else {
            // Двигаем трубы влево
            topPipe.style.right = (parseInt(topPipe.style.right) + 5) + "px"; 
            bottomPipe.style.right = (parseInt(bottomPipe.style.right) + 5) + "px"; 
            
            // Проверяем столкновение
            let birdRect = bird.getBoundingClientRect();
            if (
                birdRect.left < topPipeRect.right &&
                birdRect.right > topPipeRect.left &&
                birdRect.top < topPipeRect.bottom &&
                birdRect.bottom > topPipeRect.top
            ) {
                clearInterval(moveInterval);
                topPipe.remove();
                bottomPipe.remove();
                endGame();
            }

            if (
                birdRect.left < bottomPipeRect.right &&
                birdRect.right > bottomPipeRect.left &&
                birdRect.top < bottomPipeRect.bottom &&
                birdRect.bottom > bottomPipeRect.top
            ) {
                topPipe.remove();
                bottomPipe.remove();
                endGame();
            }
        }
    }, 20); 
}

setInterval(generatePipe, 1300);

// Проверяем падение птицы
let checkFall = setInterval(function () {
    if (birdTop < 0 || birdTop > gameArea.offsetHeight - bird.offsetHeight) { // Проверяем, если птица упала
        endGame();
    }
}, 10);


// Функция для завершения игры
function endGame() {
    clearInterval(timer);
    clearInterval(checkFall);
    alert("Игра окончена! Счет: " + Math.floor(timerElement.innerText));
    location.reload(); 
}
