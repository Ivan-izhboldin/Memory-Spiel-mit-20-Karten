const gameBoard = document.querySelector('.memory-spiel');
const movesSpan = document.querySelector('#moves');
const resetButton = document.querySelector('#resetButton');


const cardImageNames = [
    'battleship',
    'building',
    'car',
    'Cavalerie',
    'deserter',
    'industry',
    'locomotive',
    'robot',
    'submarine',
    'war'
];

// Переменные для отслеживания состояния игры
let hasFlippedCard = false; // Перевернута ли уже одна карта?
let firstCard, secondCard;  // Ссылки на первую и вторую перевернутые карты
let lockBoard = false;      // Блокировка доски (чтобы нельзя было кликнуть 3+ карт)
let moves = 0;              // Счетчик ходов
let matchedPairs = 0;       // Счетчик найденных пар



//Функция для создания игровой доски
function createBoard() {
    // Сброс всех переменных состояния
    gameBoard.innerHTML = ''; // Очищаем доску от старых карт
    moves = 0;
    movesSpan.textContent = moves;
    matchedPairs = 0;
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;

    //Создаем массив из 20 карт (10 пар)
    const gameCards = [...cardImageNames, ...cardImageNames];

    //Перемешиваем массив карт (алгоритм Фишера-Йейтса)
    for (let i = gameCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }

    //Создаем HTML для каждой карты и добавляем на доску
    gameCards.forEach(name => {
        const card = document.createElement('div');
        card.classList.add('memory-karte');
        card.dataset.name = name; // Сохраняем имя картинки в data-атрибуте для проверки

        // Создаем лицевую и обратную стороны карты
        
        card.innerHTML = `
            <img class="vorderseite" src="images/background.png" alt="Kartenvorderseite">
            <img class="rueckseite" src="images/${name}.png" alt="${name}">
        `;

        // Добавляем обработчик клика
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

//Основная функция обработки клика по карте
function flipCard() {
    // Если доска заблокирована или карта уже перевернута (или совпала), игнорируем клик
    if (lockBoard) return;
    // (ВАЖНО) Проверяем 'matched', а не 'magic-disappear'
    if (this === firstCard || this.classList.contains('matched')) return; 

    this.classList.add('flip'); // Добавляем класс, который запускает CSS-анимацию

    if (!hasFlippedCard) {
        // Это первая карта, которую кликнули в этом ходу
        hasFlippedCard = true;
        firstCard = this;
    } else {
        // Это вторая карта
        secondCard = this;
        lockBoard = true; // Блокируем доску на время проверки
        moves++; // Увеличиваем счетчик ходов
        movesSpan.textContent = moves;

        // Проверяем на совпадение
        checkForMatch();
    }
}

// Функция проверки совпадения двух карт
function checkForMatch() {
    // Сравниваем data-атрибуты
    const isMatch = firstCard.dataset.name === secondCard.dataset.name;

    if (isMatch) {
        // Карты совпали
        disableCards();
    } else {
        // Карты не совпали
        unflipCards();
    }
}

// Функция для "отключения" совпавших карт (с новой анимацией)
function disableCards() {
    // Сразу помечаем карты как "совпавшие",
    // чтобы на них нельзя было кликнуть снова (проверка в 'flipCard')
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    // Добавляем класс для "магической" анимации
    // с небольшой задержкой (800мс), чтобы игрок успел увидеть вторую карту
    // (которая переворачивается 600мс).
    setTimeout(() => {
        firstCard.classList.add('magic-disappear');
        secondCard.classList.add('magic-disappear');
    }, 800);

    matchedPairs++;
    
    // Проверка на победу
    if (matchedPairs === cardImageNames.length) {
        // Увеличиваем задержку для alert,
        // чтобы он появлялся ПОСЛЕ последней анимации.
        setTimeout(() => {
            alert('Glückwunsch! Du hast das Spiel gewonnen!');
        }, 1700); // (800мс задержка + 800мс анимация = ~1600мс)
    }

    resetBoardState(); // Сбрасываем переменные для следующего хода (это можно делать сразу)
}

// Русский комментарий: Функция для переворачивания несовпавших карт обратно
function unflipCards() {
    // Даем игроку время (1.5с) увидеть вторую карту
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        
        resetBoardState(); // Сбрасываем переменные для следующего хода
    }, 1500);
}

// Русский комментарий: Вспомогательная функция для сброса переменных хода
function resetBoardState() {
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
}

// --- Запуск игры ---

// Русский комментарий: Привязываем функцию сброса к кнопке "Neu starten"
resetButton.addEventListener('click', createBoard);

// Русский комментарий: Создаем доску при первой загрузке страницы
createBoard();