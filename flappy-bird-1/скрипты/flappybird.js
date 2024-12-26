let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

let initialVelocityX = -2.5;
let velocityX = initialVelocityX;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

let dieSound = new Audio('../звуки/sfx_die.wav');
let hitSound = new Audio('../звуки/sfx_hit.wav');
let pointSound = new Audio('../звуки/sfx_point.wav');
let swooshingSound = new Audio('../звуки/sfx_swooshing.wav');
let wingSound = new Audio('../звуки/sfx_wing.wav');
let backgroundMusic = new Audio('../звуки/bgm_mario.mp3');
backgroundMusic.loop = true;

let dieSoundPlayed = false;

let pipeInterval;
let isPipeIntervalSet = false;

let musicCurrentTime = 0;

let savedState = {};

let isPaused = false;
let savedTime = 0;
let pauseButton = {
    x: boardWidth - 90,
    y: 10,
    width: 80,
    height: 30,
    text: "Пауза"
};

let lastTime = performance.now();

let gameStarted = false;

let isGameOverMenuActive = false; // Новый флаг для отслеживания состояния меню поражения

function update() {
    if (!birdImg.complete || !topPipeImg.complete || !bottomPipeImg.complete) {
        console.error('Images not fully loaded during update.');
        return;
    }
    context.clearRect(0, 0, board.width, board.height);
    if (gameOver) {
        pipeArray.forEach(pipe => pipe.velocityX = 0);
        context.fillStyle = "white";
        context.font="bold 45px Arial";
        context.textAlign = 'center';
        context.fillText("GAME OVER", boardWidth / 2, boardHeight / 2 - 100);
        context.fillText(`Score: ${score}`, boardWidth / 2, boardHeight / 2 - 50);
        return;
    }
    if (!isPaused) {
        velocityY += gravity;
        bird.y = Math.max(bird.y + velocityY, 0);
        if (birdImg) {
            context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
        }

        if (bird.y > board.height) {
            gameOver = true;
            if (!dieSoundPlayed) {
                stopAllSounds();
                playSound(dieSound);
                dieSoundPlayed = true;
            }
            backgroundMusic.pause();
        }

        for (let i = 0; i < pipeArray.length; i++) {
            let pipe = pipeArray[i];
            pipe.x += velocityX;
            if (pipe.img && pipe.img.complete) {
                context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
            } else {
                console.error('Pipe image not loaded or undefined:', pipe);
            }

            if (!pipe.passed && bird.x > pipe.x + pipe.width) {
                score += 0.5;
                pipe.passed = true;
                playSound(pointSound);
            }

            if (detectCollision(bird, pipe)) {
                gameOver = true;
                if (!dieSoundPlayed) {
                    stopAllSounds();
                    playSound(dieSound);
                    dieSoundPlayed = true;
                }
                backgroundMusic.pause();
                playSound(hitSound);
            }
        }

        while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
            pipeArray.shift();
        }

        context.fillStyle = "white";
        context.font="bold 45px Arial";
        context.textAlign = 'center';
        context.fillText(score, boardWidth / 2, 40);

        if (score % 100 === 0 && score !== 0) {
            velocityX -= 0.1;
        }

        if (gameOver) {
            context.fillStyle = "white";
            context.font="bold 45px Arial";
            context.textAlign = 'center';
            context.fillText("GAME OVER", boardWidth / 2, boardHeight / 2 - 100);
            context.fillText(`Score: ${score}`, boardWidth / 2, boardHeight / 2 - 50);
            Namerequest(score);
            showGameOverMenu();
        }
    }
    drawPauseButton();
    if (!isPaused) {
        requestAnimationFrame(update);
    }
}

function startGame() {
    if (!birdImg.complete || !topPipeImg.complete || !bottomPipeImg.complete) {
        console.error('Images not fully loaded.');
        return;
    }
    if (pipeInterval) {
        clearInterval(pipeInterval);
    }
    requestAnimationFrame(update);
    pipeInterval = setInterval(placePipes, 1500);
    console.log('startGame called successfully.');
    gameStarted = true;
}

function loadImages() {
    topPipeImg = new Image();
    topPipeImg.src = '../изображения/toppipe.png';
    topPipeImg.onload = function() {
        console.log('Top pipe image loaded successfully.');
    };
    topPipeImg.onerror = function() {
        console.error('Failed to load top pipe image.');
    };

    bottomPipeImg = new Image();
    bottomPipeImg.src = '../изображения/bottompipe.png';
    bottomPipeImg.onload = function() {
        console.log('Bottom pipe image loaded successfully.');
    };
    bottomPipeImg.onerror = function() {
        console.error('Failed to load bottom pipe image.');
    };

    birdImg = new Image();
    birdImg.src = '../изображения/flappybird.png';
    birdImg.onload = function() {
        console.log('Bird image loaded successfully.');
    };
    birdImg.onerror = function() {
        console.error('Failed to load flappybird image.');
    };
}

function placePipes() {
    if (gameOver || isPaused) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = boardHeight/4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
        velocityX: -2
    };

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
        velocityX: -2
    };

    pipeArray.push(topPipe);
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code === "Space") {
        velocityY = -6;
        playSound(wingSound);
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function stopAllSounds() {
    pointSound.pause();
    hitSound.pause();
    dieSound.pause();
    wingSound.pause();
    pointSound.currentTime = 0;
    hitSound.currentTime = 0;
    dieSound.currentTime = 0;
    wingSound.currentTime = 0;
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}

function resetGame() {
    bird.x = birdX;
    bird.y = birdY;
    pipeArray = [];
    score = 0;
    dieSoundPlayed = false;
    gameOver = false;
    velocityY = 0;
    velocityX = initialVelocityX;
    stopAllSounds();
    startGame();
}

function drawPauseButton() {
    context.fillStyle = isPaused ? 'rgba(173, 216, 230, 0.8)' : 'rgba(211, 211, 211, 0.8)';
    context.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    context.lineWidth = 2;
    context.roundRect(pauseButton.x, pauseButton.y, pauseButton.width, pauseButton.height, 10);
    context.fill();
    context.stroke();

    context.fillStyle = 'black';
    context.font = 'bold 16px Arial';
    context.textAlign = 'center';
    context.fillText(pauseButton.text, pauseButton.x + pauseButton.width / 2, pauseButton.y + pauseButton.height / 2 + 6);
}

function playSound(sound) {
    if (!isPaused && !gameOver) {
        sound.play();
    }
}

if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
        if (typeof radius === 'number') {
            radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } else {
            var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
            for (var side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        this.beginPath();
        this.moveTo(x + radius.tl, y);
        this.lineTo(x + width - radius.tr, y);
        this.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        this.lineTo(x + width, y + height - radius.br);
        this.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        this.lineTo(x + radius.bl, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        this.lineTo(x, y + radius.tl);
        this.quadraticCurveTo(x, y, x + radius.tl, y);
        this.closePath();
        return this;
    };
}

function togglePauseMenu(show) {
    if (gameOver || isGameOverMenuActive) {
        return; // Не показывать меню паузы, если игра окончена или активно меню поражения
    }
    const pauseMenu = document.getElementById('pause-menu');
    if (show) {
        pauseMenu.style.display = 'block';
    } else {
        pauseMenu.style.display = 'none';
    }
}

function pauseGame() {
    if (gameOver) {
        return; // Не вызывать паузу, если игра окончена
    }
    isPaused = true;
    savedTime = backgroundMusic.currentTime;
    backgroundMusic.pause();
    pauseButton.text = "Продолжить";
    stopAllSounds();
    togglePauseMenu(true);
}

function resumeGame() {
    isPaused = false;
    backgroundMusic.play();
    backgroundMusic.currentTime = savedTime;
    pauseButton.text = "Пауза";
    lastTime = performance.now();
    requestAnimationFrame(update);
    togglePauseMenu(false);
}

function hideStartMenu() {
    const startMenu = document.getElementById('startMenu');
    if (startMenu) {
        startMenu.style.display = 'none';
    }
}

function showGameOverMenu() {
    const gameOverMenu = document.getElementById('gameOverMenu');
    if (gameOverMenu) {
        gameOverMenu.style.display = 'block';
        isGameOverMenuActive = true; // Устанавливаем флаг, когда меню поражения активно
    }
}

function hideGameOverMenu() {
    const gameOverMenu = document.getElementById('gameOverMenu');
    if (gameOverMenu) {
        gameOverMenu.style.display = 'none';
        isGameOverMenuActive = false; // Сбрасываем флаг, когда меню поражения скрыто
    }
}

console.log('Script loaded, waiting for DOMContentLoaded');
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');
    board = document.getElementById('board');
    if (!board) {
        console.error('Canvas element not found!');
        return;
    }
    context = board.getContext('2d');
    if (!context) {
        console.error('Failed to get canvas context!');
        return;
    }
    console.log('Canvas and context initialized');
    board.height = boardHeight;
    board.width = boardWidth;
    loadImages();
    console.log('Images loading initiated');
});

document.addEventListener('keydown', function(event) {
    if (isPaused) {
        event.preventDefault(); // Предотвращаем любые действия при паузе
        return;
    }
    if (event.code === 'Space' && !gameStarted) {
        startGame();
        hideStartMenu();
    }
});

document.addEventListener('click', function(event) {
    const rect = board.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (mouseX >= pauseButton.x && mouseX <= pauseButton.x + pauseButton.width &&
        mouseY >= pauseButton.y && mouseY <= pauseButton.y + pauseButton.height) {
        if (!isPaused) {
            pauseGame();
        } else {
            resumeGame();
        }
    } else if (!gameOver) {
        moveBird(event);
    } else {
        resetGame();
        hideGameOverMenu();
    }
});

document.addEventListener("keydown", function(e) {
    if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        if (!gameOver) {
            backgroundMusic.play().catch(error => console.error('Error playing background music:', error));
            moveBird(e);
        } else {
            resetGame();
            hideGameOverMenu();
        }
    }
});

document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden' && !gameOver) {
        pauseGame();
    } else if (document.visibilityState === 'visible' && isGameOverMenuActive) {
        showGameOverMenu();
    }
});

window.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        if (!gameOver && !isPaused) {
            backgroundMusic.pause();
        }
    } else {
        if (!gameOver && !isPaused) {
            backgroundMusic.play();
        }
    }
});

const pauseMenuHtml = `
<div id="pause-menu" style="display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: rgba(255, 255, 255, 0.9); padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);">
    <h3>Пауза</h3>
    <a href="../index.php" target="_blank">Главная</a><br>
    <a href="register.php" target="_blank">Регистрация</a><br>
    <a href="login.php" target="_blank">Логин</a><br>
    <a href="lider_bord.php" target="_blank">Таблица лидеров</a>
</div>
`;
document.body.insertAdjacentHTML('beforeend', pauseMenuHtml);

const startMenuHtml = `
<div id="startMenu" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: rgba(255, 255, 255, 0.9); padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);">
    <h3>Начать игру</h3>
    <p>Нажмите пробел, чтобы начать игру.</p>
</div>
`;
document.body.insertAdjacentHTML('beforeend', startMenuHtml);

const gameOverMenuHtml = `
<div id="gameOverMenu" style="display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: rgba(255, 255, 255, 0.9); padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);">
    <h3>Игра окончена</h3>
    <p>Нажмите пробел, чтобы начать игру заново.</p>
    <a href="./login.php" target="_blank">Авторизация</a><br>
    <a href="./register.php" target="_blank">Регистрация</a><br>
    <a href="../index.php" target="_blank">Главная страница</a><br>
    <a href="./lider_bord.php" target="_blank">Таблица лидеров</a>
</div>
`;
document.body.insertAdjacentHTML('beforeend', gameOverMenuHtml);

document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden' && !gameOver) {
        pauseGame();
    } else if (document.visibilityState === 'visible' && isGameOverMenuActive) {
        showGameOverMenu();
    }
});

// Проверка на ссылки в меню поражения
const gameOverLinks = document.querySelectorAll('#gameOverMenu a');
gameOverLinks.forEach(link => {
    link.addEventListener('click', function() {
        if (gameOver) {
            showGameOverMenu();
        }
    });
});

function Namerequest(score) {
    const formData = new FormData();
    formData.append('score', score);
    console.log(formData);

    fetch('../php/update_score.php', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
    })
    .then(response => response.text())
    .then(data => {
        console.log('Score update response:', data);
    })
    .catch(error => {
        console.error('Error updating score:', error);
    });
}