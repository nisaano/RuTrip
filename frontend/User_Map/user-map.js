// user-map.js - логика страницы "Моя карта путешествий"

// ========== ДАННЫЕ ==========
let regionsData = {};
let totalRegionsCount = 0;

// Уровни и достижения
const levelRanks = [
    { min: 0, name: 'Начинающий' },
    { min: 1, name: 'Первые шаги' },
    { min: 3, name: 'Любознательный' },
    { min: 6, name: 'Искатель приключений' },
    { min: 10, name: 'Опытный путешественник' },
    { min: 15, name: 'Знаток регионов' },
    { min: 20, name: 'Эксперт-картограф' },
    { min: 30, name: 'Мастер маршрутов' },
    { min: 40, name: 'Легенда туризма' },
    { min: 50, name: 'Покоритель России' }
];

const achievementsList = [
    { id: 'start', name: 'Первое открытие', desc: 'Отметить первый регион', condition: (v) => v >= 1, icon: 'fa-flag-checkered' },
    { id: 'traveler', name: 'Исследователь', desc: 'Отметить 5 регионов', condition: (v) => v >= 5, icon: 'fa-compass' },
    { id: 'explorer', name: 'Картограф', desc: 'Отметить 10 регионов', condition: (v) => v >= 10, icon: 'fa-map' },
    { id: 'master', name: 'Мастер', desc: 'Отметить 20 регионов', condition: (v) => v >= 20, icon: 'fa-crown' },
    { id: 'legend', name: 'Легенда', desc: 'Отметить 50 регионов', condition: (v) => v >= 50, icon: 'fa-star-of-life' }
];

let currentModal = null;
let currentDeleteRegion = null;
let selectedRegionName = null;
let selectedRegionData = null;
let reviewData = { visited: null, sights: [], rating: 0, text: '' };

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function saveCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function getVisitedRegions() {
    const saved = localStorage.getItem('visitedRegions');
    return saved ? JSON.parse(saved) : {};
}

function saveVisitedRegions(visited) {
    localStorage.setItem('visitedRegions', JSON.stringify(visited));
    updateStats();
    updateAchievements();
    updateMapColors();
}

function getFriends() {
    const saved = localStorage.getItem('friendsList');
    if (saved) return JSON.parse(saved);
    const defaultFriends = [
        { id: 'friend1', name: 'Алексей Петров', avatar: 'А', visitedRegions: {}, rating: 4.7 },
        { id: 'friend2', name: 'Мария Иванова', avatar: 'М', visitedRegions: {}, rating: 4.9 },
        { id: 'friend3', name: 'Дмитрий Соколов', avatar: 'Д', visitedRegions: {}, rating: 4.5 }
    ];
    localStorage.setItem('friendsList', JSON.stringify(defaultFriends));
    return defaultFriends;
}

// ========== АНИМАЦИЯ ПЛАВАЮЩИХ ИКОНОК ==========
function initFloatingIcons() {
    // Иконки для героя
    const heroBg = document.getElementById('mapHeroBg');
    if (heroBg) {
        const heroIcons = ['fa-tree', 'fa-mountain', 'fa-water', 'fa-leaf', 'fa-seedling', 'fa-hiking', 'fa-campground'];
        
        for (let i = 0; i < 16; i++) {
            const icon = document.createElement('div');
            icon.className = 'floating-icon-hero';
            const iconType = heroIcons[i % heroIcons.length];
            icon.innerHTML = `<i class="fas ${iconType}"></i>`;
            
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            icon.style.left = `${left}%`;
            icon.style.top = `${top}%`;
            icon.style.fontSize = `${20 + Math.random() * 30}px`;
            icon.style.opacity = '0';
            
            const floatDuration = 10 + Math.random() * 8;
            const driftDuration = 20 + Math.random() * 15;
            const moveLeft = Math.random() > 0.5;
            const driftAnimation = moveLeft ? 'driftLeftHero' : 'driftHorizontalHero';
            
            icon.style.animation = `floatIconHero ${floatDuration}s ease-in-out infinite, ${driftAnimation} ${driftDuration}s linear infinite`;
            icon.style.animationDelay = `${Math.random() * 3}s, ${Math.random() * 5}s`;
            
            heroBg.appendChild(icon);
            
            setTimeout(() => { icon.style.opacity = '0.25'; }, Math.random() * 1000);
        }
    }
    
    // Иконки для фона карты
    const mapBg = document.getElementById('mapBgAnimation');
    if (mapBg) {
        const mapIcons = ['fa-tree', 'fa-mountain', 'fa-water', 'fa-leaf', 'fa-seedling'];
        
        for (let i = 0; i < 24; i++) {
            const icon = document.createElement('div');
            icon.className = 'floating-icon-map';
            const iconType = mapIcons[i % mapIcons.length];
            icon.innerHTML = `<i class="fas ${iconType}"></i>`;
            
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            icon.style.left = `${left}%`;
            icon.style.top = `${top}%`;
            icon.style.fontSize = `${16 + Math.random() * 24}px`;
            icon.style.opacity = '0';
            
            const floatDuration = 12 + Math.random() * 10;
            const driftDuration = 25 + Math.random() * 20;
            const moveLeft = Math.random() > 0.5;
            const driftAnimation = moveLeft ? 'driftLeftMap' : 'driftHorizontalMap';
            
            icon.style.animation = `floatIconMap ${floatDuration}s ease-in-out infinite, ${driftAnimation} ${driftDuration}s linear infinite`;
            icon.style.animationDelay = `${Math.random() * 4}s, ${Math.random() * 6}s`;
            
            mapBg.appendChild(icon);
            
            setTimeout(() => { icon.style.opacity = '0.15'; }, Math.random() * 1500);
        }
    }
}

// ========== АВТОМАТИЧЕСКОЕ ЗАПОЛНЕНИЕ РЕГИОНОВ ==========
function autoFillRegionsData() {
    const paths = document.querySelectorAll('#regionMap path[data-title]');
    paths.forEach(path => {
        const title = path.getAttribute('data-title');
        if (title && !regionsData[title]) {
            let id = title.toLowerCase()
                .replace(/[а-яё]/g, function(char) {
                    const map = {
                        'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z',
                        'и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r',
                        'с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'sch',
                        'ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya'
                    };
                    return map[char] || char;
                })
                .replace(/[^a-z0-9-]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
            
            regionsData[title] = { id: id, sights: [] };
        }
    });
    totalRegionsCount = Object.keys(regionsData).length;
    document.getElementById('totalRegionsCount').textContent = totalRegionsCount;
    updateStats();
    updateAchievements();
    updateMapColors();
}

// ========== ОБНОВЛЕНИЕ СТАТИСТИКИ ==========
function updateStats() {
    const visitedRegions = getVisitedRegions();
    const visitedCount = Object.keys(visitedRegions).length;
    const percent = totalRegionsCount > 0 ? Math.round((visitedCount / totalRegionsCount) * 100) : 0;
    
    document.getElementById('progressPercent').textContent = percent + '%';
    document.getElementById('progressBarFill').style.width = percent + '%';
    document.getElementById('compactVisited').textContent = visitedCount;
    document.getElementById('compactPercent').textContent = percent + '%';
    document.getElementById('visitedCount').textContent = visitedCount;
    
    let level = levelRanks[0].name;
    for (let i = levelRanks.length - 1; i >= 0; i--) {
        if (visitedCount >= levelRanks[i].min) {
            level = levelRanks[i].name;
            break;
        }
    }
    document.getElementById('userLevelBadge').innerHTML = level;
    
    let nextAchievement = achievementsList.find(a => !a.condition(visitedCount));
    if (nextAchievement) {
        let needed = 0;
        if (nextAchievement.id === 'start') needed = 1;
        else if (nextAchievement.id === 'traveler') needed = 5;
        else if (nextAchievement.id === 'explorer') needed = 10;
        else if (nextAchievement.id === 'master') needed = 20;
        else if (nextAchievement.id === 'legend') needed = 50;
        document.getElementById('nextAchievement').innerHTML = `До "${nextAchievement.name}" осталось ${needed - visitedCount} регионов`;
    } else {
        document.getElementById('nextAchievement').innerHTML = 'Все достижения получены! 🎉';
    }
    
    const unlockedCount = achievementsList.filter(a => a.condition(visitedCount)).length;
    document.getElementById('compactAchievements').textContent = unlockedCount;
}

// ========== ОБНОВЛЕНИЕ ДОСТИЖЕНИЙ ==========
function updateAchievements() {
    const visitedCount = Object.keys(getVisitedRegions()).length;
    const unlockedCount = achievementsList.filter(a => a.condition(visitedCount)).length;
    document.getElementById('achievementsCount').textContent = unlockedCount;
    
    const grid = document.getElementById('achievementsGrid');
    if (grid) {
        grid.innerHTML = achievementsList.map(ach => {
            const unlocked = ach.condition(visitedCount);
            return `
                <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon"><i class="fas ${ach.icon}"></i></div>
                    <div class="achievement-info">
                        <div class="achievement-title">${ach.name}</div>
                        <div class="achievement-desc">${ach.desc}</div>
                    </div>
                    <div class="achievement-status">
                        ${unlocked ? '✓' : '🔒'}
                    </div>
                </div>
            `;
        }).join('');
    }
}

// ========== ОБНОВЛЕНИЕ ДРУЗЕЙ ==========
function updateFriends() {
    const friends = getFriends();
    const grid = document.getElementById('friendsGrid');
    if (grid) {
        grid.innerHTML = friends.map(friend => `
            <div class="friend-card">
                <div class="friend-avatar">${friend.avatar}</div>
                <div class="friend-name">${friend.name}</div>
                <div class="friend-stats">Посетил(а): ${Object.keys(friend.visitedRegions).length} регионов</div>
                <button class="view-friend-map" onclick="viewFriendMap('${friend.id}')">Посмотреть карту</button>
            </div>
        `).join('');
    }
}

// ========== ОБНОВЛЕНИЕ ЦВЕТОВ КАРТЫ ==========
function updateMapColors() {
    const visitedRegions = getVisitedRegions();
    const paths = document.querySelectorAll('#regionMap path[data-title]');
    paths.forEach(path => {
        const title = path.getAttribute('data-title');
        if (title && regionsData[title]) {
            const isVisited = !!visitedRegions[regionsData[title].id];
            path.setAttribute('fill', isVisited ? '#4CAF50' : '#ffffff');
        } else if (title) {
            path.setAttribute('fill', '#ffffff');
        }
    });
}

// ========== УДАЛЕНИЕ РЕГИОНА ==========
function showDeleteConfirm(regionName, regionId) {
    currentDeleteRegion = { name: regionName, id: regionId };
    const modalHtml = `
        <div class="modal-overlay" id="deleteModal">
            <div class="modal-container" style="text-align: center;">
                <div class="region-name-large">Удалить отметку?</div>
                <p style="margin-bottom: 20px;">Вы уверены, что хотите удалить отметку о посещении региона <strong>${regionName}</strong>?</p>
                <div class="modal-buttons">
                    <button class="modal-btn secondary" onclick="closeDeleteModal()">Отмена</button>
                    <button class="modal-btn primary" onclick="confirmDelete()">Удалить</button>
                </div>
            </div>
        </div>
    `;
    closeModal();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    currentModal = document.getElementById('deleteModal');
}

function closeDeleteModal() {
    if (currentModal) {
        currentModal.remove();
        currentModal = null;
    }
    currentDeleteRegion = null;
}

function confirmDelete() {
    if (currentDeleteRegion) {
        const visitedRegions = getVisitedRegions();
        delete visitedRegions[currentDeleteRegion.id];
        saveVisitedRegions(visitedRegions);
        closeDeleteModal();
        alert(`Отметка о посещении ${currentDeleteRegion.name} удалена`);
    }
}

// ========== ИНТЕРАКТИВНОСТЬ КАРТЫ ==========
function setupMapInteractivity() {
    const tooltip = document.createElement('div');
    tooltip.className = 'map-tooltip';
    document.body.appendChild(tooltip);
    
    const paths = document.querySelectorAll('#regionMap path[data-title]');
    
    paths.forEach(path => {
        const title = path.getAttribute('data-title');
        if (!title) return;
        
        path.addEventListener('mouseenter', (e) => {
            path.style.fill = '#a5d6a5';
            tooltip.textContent = title;
            tooltip.style.left = (e.clientX + 15) + 'px';
            tooltip.style.top = (e.clientY - 40) + 'px';
            tooltip.classList.add('active');
        });
        
        path.addEventListener('mousemove', (e) => {
            tooltip.style.left = (e.clientX + 15) + 'px';
            tooltip.style.top = (e.clientY - 40) + 'px';
        });
        
        path.addEventListener('mouseleave', () => {
            const visitedRegions = getVisitedRegions();
            const isVisited = regionsData[title] && !!visitedRegions[regionsData[title].id];
            path.style.fill = isVisited ? '#4CAF50' : '#ffffff';
            tooltip.classList.remove('active');
        });
        
        path.addEventListener('click', () => {
            const visitedRegions = getVisitedRegions();
            const regionId = regionsData[title]?.id;
            
            if (!regionId) {
                alert(`Регион "${title}" будет добавлен автоматически при следующем обновлении`);
                return;
            }
            
            if (visitedRegions[regionId]) {
                showDeleteConfirm(title, regionId);
            } else {
                showModal(title);
            }
        });
    });
}

// ========== МОДАЛЬНЫЕ ОКНА ==========
function showModal(regionName) {
    selectedRegionName = regionName;
    selectedRegionData = regionsData[regionName];
    reviewData = { visited: null, sights: [], rating: 0, text: '' };
    
    const modalHtml = `
        <div class="modal-overlay" id="reviewModal">
            <div class="modal-container">
                <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
                <div class="region-name-large">${selectedRegionName}</div>
                <div class="modal-buttons">
                    <button class="modal-btn primary" onclick="nextStep()">Далее →</button>
                </div>
            </div>
        </div>
    `;
    closeModal();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    currentModal = document.getElementById('reviewModal');
}

function nextStep() {
    closeModal();
    const modalHtml = `
        <div class="modal-overlay" id="reviewModal">
            <div class="modal-container">
                <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
                <div class="region-name-large">${selectedRegionName}</div>
                <h3 style="text-align: center; margin-bottom: 20px;">Вы посещали ${selectedRegionName}?</h3>
                <div class="modal-buttons">
                    <button class="modal-btn primary" onclick="openVisitedStep(true)">Да</button>
                    <button class="modal-btn secondary" onclick="openVisitedStep(false)">Нет</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    currentModal = document.getElementById('reviewModal');
}

function openVisitedStep(visited) {
    reviewData.visited = visited;
    closeModal();
    if (visited) { showSightsStep(); } else { showReviewStep(false); }
}

function showSightsStep() {
    const sights = selectedRegionData?.sights || [];
    const modalHtml = `
        <div class="modal-overlay" id="reviewModal">
            <div class="modal-container">
                <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
                <div class="region-name-large">${selectedRegionName}</div>
                <div class="form-group">
                    <label>Что вы посетили?</label>
                    <div class="checkbox-group" id="sightsCheckboxes">
                        ${sights.map(sight => `<label><input type="checkbox" value="${sight}" class="sight-checkbox"> ${sight}</label>`).join('')}
                    </div>
                </div>
                <div class="modal-buttons">
                    <button class="modal-btn primary" onclick="showReviewStep(true)">Далее →</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    currentModal = document.getElementById('reviewModal');
}

function showReviewStep(withSights) {
    if (withSights) {
        const checkboxes = document.querySelectorAll('.sight-checkbox:checked');
        reviewData.sights = Array.from(checkboxes).map(cb => cb.value);
    }
    closeModal();
    
    const question = reviewData.visited 
        ? 'Напишите отзыв о путешествии по нашему маршруту' 
        : `Напишите отзыв о ${selectedRegionName} и что посоветуете посетить`;
    
    const modalHtml = `
        <div class="modal-overlay" id="reviewModal">
            <div class="modal-container">
                <div class="mascot-small">
                    <div class="mascot">
                        <div class="mascot-ear left"></div>
                        <div class="mascot-ear right"></div>
                        <div class="mascot-face">
                            <div class="mascot-eye left"></div>
                            <div class="mascot-eye right"></div>
                            <div class="mascot-nose"></div>
                        </div>
                    </div>
                </div>
                <div class="region-name-large">${selectedRegionName}</div>
                <h3 style="text-align: center; margin-bottom: 20px;">${question}</h3>
                <div class="form-group">
                    <textarea id="reviewText" class="form-input" rows="4" placeholder="Поделитесь впечатлениями..."></textarea>
                </div>
                <div class="form-group">
                    <label>Оценка</label>
                    <div class="star-rating" id="starRating">
                        <span data-value="1">☆</span><span data-value="2">☆</span><span data-value="3">☆</span><span data-value="4">☆</span><span data-value="5">☆</span>
                    </div>
                </div>
                <div class="modal-buttons">
                    <button class="modal-btn primary" onclick="submitFinal()">Отправить</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    currentModal = document.getElementById('reviewModal');
    
    let currentRating = 0;
    const stars = document.querySelectorAll('#starRating span');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            currentRating = parseInt(star.dataset.value);
            stars.forEach((s, i) => {
                if (i < currentRating) {
                    s.textContent = '★';
                    s.classList.add('active');
                } else {
                    s.textContent = '☆';
                    s.classList.remove('active');
                }
            });
        });
    });
}

function submitFinal() {
    const reviewText = document.getElementById('reviewText')?.value || '';
    let rating = 0;
    const stars = document.querySelectorAll('#starRating span');
    stars.forEach((star, i) => { if (star.textContent === '★') rating = i + 1; });
    
    const regionId = regionsData[selectedRegionName]?.id;
    if (regionId) {
        const review = {
            userId: getCurrentUser()?.email || 'anonymous',
            userName: getCurrentUser()?.name || 'Гость',
            visitedAt: new Date().toISOString(),
            visited: reviewData.visited,
            visitedSights: reviewData.sights,
            reviewText: reviewText,
            rating: rating || 5
        };
        
        const visitedRegions = getVisitedRegions();
        visitedRegions[regionId] = review;
        saveVisitedRegions(visitedRegions);
        closeModal();
        
        const modalHtml = `
            <div class="modal-overlay" id="congratModal">
                <div class="modal-container" style="text-align: center;">
                    <div class="mascot-small">
                        <div class="mascot" style="animation: bounce 0.5s ease infinite;">
                            <div class="mascot-ear left"></div>
                            <div class="mascot-ear right"></div>
                            <div class="mascot-face">
                                <div class="mascot-eye left"></div>
                                <div class="mascot-eye right"></div>
                                <div class="mascot-nose"></div>
                            </div>
                        </div>
                    </div>
                    <h2>Поздравляем!</h2>
                    <div class="region-name-large">${selectedRegionName}</div>
                    <p style="margin: 20px 0;">Новое приключение добавлено в вашу коллекцию!</p>
                    <button class="modal-btn primary" onclick="closeModal()">Продолжить</button>
                </div>
            </div>
            <style>@keyframes bounce {0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}</style>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        currentModal = document.getElementById('congratModal');
        updateMapColors();
    } else {
        closeModal();
        alert('Регион не найден в базе. Обновите страницу.');
    }
}

function closeModal() {
    if (currentModal) {
        currentModal.remove();
        currentModal = null;
    }
}

function closePanel(panelId) {
    document.getElementById(panelId).classList.remove('show');
}

function viewFriendMap(friendId) {
    const friends = getFriends();
    const friend = friends.find(f => f.id === friendId);
    if (!friend) return;
    alert(`Карта друга ${friend.name} в разработке.`);
}

// ========== ПРОФИЛЬ ==========
function openEditProfileModal() {
    const user = getCurrentUser();
    const modal = document.getElementById('editProfileModal');
    const nameInput = document.getElementById('editName');
    const emailInput = document.getElementById('editEmail');
    
    if (user) {
        nameInput.value = user.name || '';
        emailInput.value = user.email || '';
    } else {
        nameInput.value = '';
        emailInput.value = '';
    }
    
    modal.style.display = 'flex';
}

function closeEditProfileModal() {
    document.getElementById('editProfileModal').style.display = 'none';
}

function saveProfile() {
    const name = document.getElementById('editName').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    
    if (!name) {
        alert('Введите имя');
        return;
    }
    
    let user = getCurrentUser();
    if (user) {
        user.name = name;
        user.email = email;
        saveCurrentUser(user);
        document.getElementById('userNameDisplay').textContent = name;
        closeEditProfileModal();
        alert('Профиль обновлён!');
    } else {
        // Создаём нового пользователя если не авторизован
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            avatar: null
        };
        saveCurrentUser(newUser);
        localStorage.setItem('isAuthenticated', 'true');
        document.getElementById('userNameDisplay').textContent = name;
        closeEditProfileModal();
        alert('Профиль создан!');
        checkAuth();
    }
}

// ========== МАСКОТ ==========
function initMascot() {
    const mascot = document.getElementById('mascot');
    if (!mascot) return;
    
    mascot.addEventListener('click', () => {
        mascot.style.animation = 'none';
        mascot.style.transform = 'scale(1.3) rotate(15deg)';
        
        setTimeout(() => {
            mascot.style.animation = 'float 6s ease-in-out infinite';
            mascot.style.transform = 'scale(1) rotate(0deg)';
        }, 500);
        
        const visitedCount = Object.keys(getVisitedRegions()).length;
        const total = totalRegionsCount;
        const messages = [
            "Привет! Я Миша, твой гид по России!",
            "Нажми на любой регион, чтобы отметить его",
            "Следи за прогрессом и открывай достижения!",
            `Ты уже отметил ${visitedCount} из ${total} регионов!`,
            "Поделись своей картой с друзьями!",
            "Каждый новый регион — новое приключение!"
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        alert(randomMessage);
    });
}

// ========== АВТОРИЗАЦИЯ ==========
function checkAuth() {
    const user = getCurrentUser();
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    const authButtons = document.getElementById('authButtons');
    const profileMenu = document.getElementById('profileMenu');
    const userNameDisplay = document.getElementById('userNameDisplay');
    
    if (isAuth && user) {
        if (authButtons) authButtons.style.display = 'none';
        if (profileMenu) profileMenu.style.display = 'block';
        if (userNameDisplay) userNameDisplay.textContent = user.name;
    } else {
        if (authButtons) authButtons.style.display = 'flex';
        if (profileMenu) profileMenu.style.display = 'none';
        if (userNameDisplay) userNameDisplay.textContent = 'Путешественник';
    }
}

function initProfileDropdown() {
    const profileBtn = document.getElementById('profileBtn');
    const dropdown = document.getElementById('profileDropdown');
    
    if (profileBtn) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });
        
        document.addEventListener('click', () => {
            dropdown.classList.remove('show');
        });
    }
    
    const editProfileLink = document.getElementById('editProfileLink');
    if (editProfileLink) {
        editProfileLink.addEventListener('click', (e) => {
            e.preventDefault();
            openEditProfileModal();
            dropdown.classList.remove('show');
        });
    }
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initProfileDropdown();
    initMascot();
    initFloatingIcons();
    
    setTimeout(() => {
        autoFillRegionsData();
        setupMapInteractivity();
        updateMapColors();
        updateStats();
        updateAchievements();
        updateFriends();
    }, 300);
    
    document.getElementById('friendsBtn')?.addEventListener('click', () => {
        document.getElementById('friendsPanel')?.classList.toggle('show');
        document.getElementById('achievementsPanel')?.classList.remove('show');
        updateFriends();
    });
    
    document.getElementById('achievementsBtn')?.addEventListener('click', () => {
        document.getElementById('achievementsPanel')?.classList.toggle('show');
        document.getElementById('friendsPanel')?.classList.remove('show');
        updateAchievements();
    });
    
    document.getElementById('friendsMenuLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('friendsPanel')?.classList.toggle('show');
        document.getElementById('achievementsPanel')?.classList.remove('show');
        updateFriends();
    });
    
    document.getElementById('achievementsMenuLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('achievementsPanel')?.classList.toggle('show');
        document.getElementById('friendsPanel')?.classList.remove('show');
        updateAchievements();
    });
    
    document.getElementById('logoutLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
    
    document.getElementById('logoutLinkSidebar')?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
});

// Экспортируем функции для глобального доступа
window.nextStep = nextStep;
window.openVisitedStep = openVisitedStep;
window.showReviewStep = showReviewStep;
window.submitFinal = submitFinal;
window.closeModal = closeModal;
window.closePanel = closePanel;
window.viewFriendMap = viewFriendMap;
window.closeDeleteModal = closeDeleteModal;
window.confirmDelete = confirmDelete;
window.closeEditProfileModal = closeEditProfileModal;
window.saveProfile = saveProfile;
