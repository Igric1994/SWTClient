document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabIndicator = document.querySelector('.tab-indicator');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Удаляем активный класс у всех кнопок
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            button.classList.add('active');
            
            // Получаем имя вкладки из атрибута data-tab
            const tabName = button.getAttribute('data-tab');
            
            // Скрываем все контенты
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Показываем соответствующий контент
            document.getElementById(tabName).classList.add('active');
            
            // Анимируем индикатор
            if (tabName === 'search') {
                tabIndicator.classList.add('move-right');
            } else {
                tabIndicator.classList.remove('move-right');
            }
        });
    });

    document.querySelector('.clear-results').addEventListener('click', function() {
        document.querySelector('.search-results').innerHTML = '';
    });

    const searchInput = document.querySelector('.search-input');
    const clearInputButton = document.querySelector('.clear-input');
    
    // Показываем/скрываем крестик при вводе текста
    searchInput.addEventListener('input', function() {
        if (this.value.length > 0) {
            clearInputButton.style.display = 'block';
        } else {
            clearInputButton.style.display = 'none';
        }
    });
    
    // Очищаем поле при клике на крестик
    clearInputButton.addEventListener('click', function() {
        searchInput.value = '';
        this.style.display = 'none';
        searchInput.focus();
    });

    const clearFiltersButton = document.querySelector('.clear-filters');
    const checkboxes = document.querySelectorAll('.filters-dropdown input[type="checkbox"]');
    
    // Очищаем все чекбоксы при клике на кнопку
    clearFiltersButton.addEventListener('click', function() {
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    });
    
});

// ... (предыдущий код остаётся) ...

// Показ/скрытие фильтров
document.querySelector('.filters-toggle').addEventListener('click', function() {
    const dropdown = document.querySelector('.filters-dropdown');
    dropdown.classList.toggle('active');
    this.textContent = dropdown.classList.contains('active') ? 'Фильтры ▲' : 'Фильтры ▼';
});

// Пример функции для отображения результатов
function displayResults(results) {
    const container = document.querySelector('.search-results');
    container.innerHTML = '';
    
    results.forEach(torrent => {
        const item = document.createElement('div');
        item.className = 'torrent-item';
        item.innerHTML = `
            <div class="torrent-header">
                <h3 class="torrent-title">${torrent.name}</h3>
                <span class="torrent-tracker">${torrent.tracker}</span>
            </div>
            <p class="torrent-description">${torrent.description || 'Описание отсутствует'}</p>
            <div class="torrent-stats">
                <span class="torrent-stat"><strong>Пиры:</strong> ${torrent.peers}</span>
                <span class="torrent-stat"><strong>Сиды:</strong> ${torrent.seeds}</span>
                <span class="torrent-stat"><strong>Личи:</strong> ${torrent.leeches}</span>
                <span class="torrent-stat"><strong>Размер:</strong> ${torrent.size}</span>
                <span class="torrent-stat"><strong>Дата:</strong> ${torrent.date}</span>
            </div>
            
        `;

        const dowButton = document.createElement('button');
        dowButton.className = 'torrent-download';
        dowButton.setAttribute('data-magnet', torrent.magnet);
        dowButton.setAttribute('data-torrent-name', torrent.name);
        dowButton.innerText = 'Скачать';
        dowButton.addEventListener('click', () => {
            addDownload(dowButton.dataset.torrentName, dowButton.dataset.magnet);
            document.getElementById('but-window-switch-download').click();
        })
        item.append(dowButton);

        container.appendChild(item);

    });
    
    // Добавляем обработчики для кнопок скачивания
    document.querySelectorAll('.torrent-download').forEach(btn => {
        btn.addEventListener('click', function() {
            const magnet = this.getAttribute('data-magnet');
            // Здесь будет логика обработки скачивания
            console.log('Инициировано скачивание:', magnet);
        });
    });
}

// Пример использования (замените на реальный запрос к API)
document.querySelector('.search-button').addEventListener('click', function() {
    // Заглушка для демонстрации
    const mockResults = [
        {
            name: "Пример торрента 1",
            tracker: "Rutracker",
            description: "Фильм в хорошем качестве 1080p с русской озвучкой",
            seeds: 145,
            leeches: 32,
            size: "1.45 GB",
            date: "2024-03-15",
            magnet: "magnet:?xt=urn:btih:EXAMPLEHASH1",
            peers : 177
        },
        {
            name: "Пример торрента 2",
            tracker: "Nnm-club",
            description: "Игра для PC с всеми DLC",
            seeds: 89,
            leeches: 12,
            size: "24.7 GB",
            date: "2024-02-28",
            magnet: "magnet:?xt=urn:btih:EXAMPLEHASH2",
            peers : 101
        }
    ];
    
    displayResults(mockResults);
});


// Пример функции для обновления загрузок
function updateDownload(downloadId, progress, speed, peers, seeds, leechers, timeLeft) {
    const item = document.querySelector(`#download-${downloadId}`);
    if (item) {
        // Обновляем прогресс
        item.querySelector('.progress-bar').style.width = `${progress}%`;
        item.querySelector('.progress-text').textContent = `${progress}%`;
        
        // Обновляем статистику
        item.querySelector('.stat-value:nth-child(1)').textContent = speed;
        item.querySelector('.stat-value:nth-child(2)').textContent = timeLeft;
        item.querySelector('.stat-value:nth-child(3)').textContent = seeds;
        item.querySelector('.stat-value:nth-child(4)').textContent = peers;
        item.querySelector('.stat-value:nth-child(5)').textContent = leechers;
    }
}

// Пример добавления новой загрузки
function addDownload(torrentName, magnet,  status = 'searching') {
    const container = document.querySelector('.downloads-container');

    const downloadId = generateDownloadId(torrentName);
    
    // Проверяем, нет ли уже такой загрузки
    if (document.getElementById(`download-${downloadId}`)) {
        console.warn(`Загрузка "${torrentName}" уже существует!`);
        return null;
    }

    console.log(`Start downloading torrent with magnet link ${magnet}`);

    const newItem = document.createElement('div');
    newItem.className = 'download-item';
    newItem.id = `downloadId`;
    newItem.innerHTML = `
        <div class="download-header">
            <h3 class="download-title">${torrentName}</h3>
            <span class="download-status ${status}">${getStatusText(status)}</span>
        </div>
        <div class="progress-container">
            <div class="progress-bar" style="width: 0%"></div>
            <span class="progress-text">0%</span>
        </div>
        <div class="download-stats">
            <div class="stat-item">
                <span class="stat-label">Скорость:</span>
                <span class="stat-value">0 KB/s</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Осталось:</span>
                <span class="stat-value">-</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Сиды:</span>
                <span class="stat-value">0</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Пиры:</span>
                <span class="stat-value">0</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Личи:</span>
                <span class="stat-value">0</span>
            </div>
        </div>
        <button class="pause-button">Пауза</button>
    `;
    container.prepend(newItem);
}

function generateDownloadId(torrentName) {
    // Удаляем спецсимволы и приводим к нижнему регистру
    const cleanName = torrentName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    // Добавляем временную метку и случайное число
    return `${cleanName}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function getStatusText(status) {
    const statusMap = {
        'searching': 'Поиск пиров',
        'downloading': 'Скачивание',
        'seeding': 'Раздача'
    };
    return statusMap[status] || status;
}


