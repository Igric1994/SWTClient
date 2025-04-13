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
            <button class="torrent-download" data-magnet="${torrent.magnet}">Скачать</button>
        `;
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
