/**
 * RuTrip - Карта путешествий
 * Версия с авторизацией, без localStorage для друзей
 */

// ==================== КОНФИГУРАЦИЯ ====================
const API_BASE = '/api';

function getAuthHeaders() {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

    return token
        ? { Authorization: `Bearer ${token}` }
        : {};
}
// ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================
let regionsData = {};
let totalRegionsCount = 0;
let currentModal = null;
let currentStepData = null;
let currentUser = null;
let visitedRegions = {};
let friendsList = [];
let uploadedPhotos = [];

// ==================== УРОВНИ И ДОСТИЖЕНИЯ ====================
const levelRanks = [
    { min: 0, name: 'Начинающий' },
    { min: 1, name: 'Первые шаги' },
    { min: 3, name: 'Любознательный' },
    { min: 6, name: 'Искатель' },
    { min: 10, name: 'Опытный' }
];

const achievementsList = [
    { id: 'start', name: 'Первое открытие', desc: 'Отметить первый регион', condition: (v) => v >= 1, icon: 'fa-flag-checkered' },
    { id: 'traveler', name: 'Исследователь', desc: 'Отметить 5 регионов', condition: (v) => v >= 5, icon: 'fa-compass' },
    { id: 'explorer', name: 'Открывающий земли', desc: 'Отметить 10 регионов', condition: (v) => v >= 10, icon: 'fa-map' }
];

// ==================== API ВЫЗОВЫ ====================

async function fetchCurrentUser() {
    try {
        console.log('TOKEN:', localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken'));

        const response = await fetch(`${API_BASE}/auth/me`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        console.log('AUTH ME STATUS:', response.status);

        if (response.ok) {
            currentUser = await response.json();
            console.log('Пользователь:', currentUser.name);
            return currentUser;
        }
    } catch (e) {
        console.log('Пользователь не авторизован');
    }

    return null;
}

async function fetchRegions() {
    try {
        const response = await fetch(`${API_BASE}/regions`, { credentials: 'include' });
        if (response.ok) return await response.json();
    } catch (e) {}
    return [];
}

async function fetchVisitedRegions() {
    if (!currentUser) return {};
    try {
        const response = await fetch(`${API_BASE}/users/${currentUser.id}/visited`, { headers: getAuthHeaders() });
        if (response.ok) return await response.json();
    } catch (e) {}
    return {};
}

async function saveVisitedRegion(regionId, reviewData) {
    if (!currentUser) {
        showToast('Сначала войдите в аккаунт', 'info');
        return false;
    }

    try {
        const response = await fetch(`${API_BASE}/users/${currentUser.id}/visited`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify({ regionId, ...reviewData })
        });

        if (response.ok) {
            const saved = await response.json();
            visitedRegions[regionId] = saved;
            updateAllStats();
            updateAchievements();
            updateMapColors();
            return true;
        }
    } catch (e) {
        showToast('Ошибка сохранения', 'error');
    }

    return false;
}

async function deleteVisitedRegion(regionId) {
    if (!currentUser) return false;
    try {
        const response = await fetch(`${API_BASE}/users/${currentUser.id}/visited/${regionId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (response.ok) {
            delete visitedRegions[regionId];
            updateAllStats();
            updateAchievements();
            updateMapColors();
            return true;
        }
    } catch (e) {}
    return false;
}

async function fetchFriends() {
    if (!currentUser) return [];
    try {
        const response = await fetch(`${API_BASE}/users/${currentUser.id}/friends`, { headers: getAuthHeaders() });
        if (response.ok) return await response.json();
    } catch (e) {}
    return [];
}

async function updateUserProfile(name, email) {
    if (!currentUser) return false;

    try {
        const response = await fetch(`${API_BASE}/users/${currentUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify({ name, email })
        });

        if (response.ok) {
            currentUser = await response.json();
            document.getElementById('userNameDisplay').textContent = currentUser.name;
            document.getElementById('profileName').textContent = currentUser.name;
            showToast('Профиль обновлён', 'success');
            return true;
        }
    } catch (e) {}

    return false;
}

async function logout() {
    try {
        await fetch(`${API_BASE}/auth/logout`, { method: 'POST', headers: getAuthHeaders() });
    } catch (e) {}
    currentUser = null;
    visitedRegions = {};
    friendsList = [];
    checkAuth();
    window.location.href = 'index.html';
}

// ==================== АНИМАЦИЯ ПЛАВАЮЩИХ ИКОНОК ====================

function initFloatingIcons() {
    const heroBg = document.getElementById('mapHeroBg');
    if (heroBg) {
        const heroIcons = ['fa-tree', 'fa-mountain', 'fa-water', 'fa-leaf', 'fa-seedling', 'fa-hiking', 'fa-campground', 'fa-sun'];
        
        for (let i = 0; i < 35; i++) {
            const icon = document.createElement('div');
            icon.className = 'floating-icon-hero';
            icon.innerHTML = `<i class="fas ${heroIcons[i % heroIcons.length]}"></i>`;
            
            icon.style.left = `${Math.random() * 100}%`;
            icon.style.top = `${Math.random() * 35}%`;
            icon.style.fontSize = `${22 + Math.random() * 35}px`;
            icon.style.opacity = '0';
            
            const floatDuration = 10 + Math.random() * 10;
            const driftDuration = 18 + Math.random() * 20;
            const moveLeft = Math.random() > 0.5;
            const driftAnimation = moveLeft ? 'driftLeftHero' : 'driftHorizontalHero';
            
            icon.style.animation = `floatIconHero ${floatDuration}s ease-in-out infinite, ${driftAnimation} ${driftDuration}s linear infinite`;
            icon.style.animationDelay = `${Math.random() * 4}s, ${Math.random() * 6}s`;
            
            heroBg.appendChild(icon);
            setTimeout(() => { icon.style.opacity = '0.5'; }, Math.random() * 1500);
        }
    }
    
    const mapBg = document.getElementById('mapBgAnimation');
    if (mapBg) {
        const mapIcons = ['fa-tree', 'fa-mountain', 'fa-water', 'fa-leaf', 'fa-seedling'];
        
        for (let i = 0; i < 25; i++) {
            const icon = document.createElement('div');
            icon.className = 'floating-icon-map';
            icon.innerHTML = `<i class="fas ${mapIcons[i % mapIcons.length]}"></i>`;
            
            icon.style.left = `${Math.random() * 100}%`;
            icon.style.top = `${Math.random() * 100}%`;
            icon.style.fontSize = `${18 + Math.random() * 28}px`;
            icon.style.opacity = '0';
            
            const floatDuration = 12 + Math.random() * 12;
            const driftDuration = 22 + Math.random() * 25;
            const moveLeft = Math.random() > 0.5;
            const driftAnimation = moveLeft ? 'driftLeftMap' : 'driftHorizontalMap';
            
            icon.style.animation = `floatIconMap ${floatDuration}s ease-in-out infinite, ${driftAnimation} ${driftDuration}s linear infinite`;
            icon.style.animationDelay = `${Math.random() * 5}s, ${Math.random() * 7}s`;
            
            mapBg.appendChild(icon);
            setTimeout(() => { icon.style.opacity = '0.35'; }, Math.random() * 2000);
        }
    }
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

function autoFillRegionsData() {
    const paths = document.querySelectorAll('#regionMap path[data-title]');
    paths.forEach(path => {
        const title = path.getAttribute('data-title');
        if (title && !regionsData[title]) {
            const id = title.toLowerCase().replace(/[^а-яёa-z]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
            regionsData[title] = { id: id, sights: [] };
        }
    });
    totalRegionsCount = Object.keys(regionsData).length;
    document.getElementById('totalRegionsCount').textContent = totalRegionsCount;
    updateAllStats();
    updateAchievements();
    updateMapColors();
}

function updateAllStats() {
    const visitedCount = Object.keys(visitedRegions).length;
    const percent = totalRegionsCount > 0 ? Math.round((visitedCount / totalRegionsCount) * 100) : 0;
    
    document.getElementById('progressPercent').textContent = percent + '%';
    document.getElementById('progressBarFill').style.width = percent + '%';
    document.getElementById('compactVisited').textContent = visitedCount;
    document.getElementById('compactPercent').textContent = percent + '%';
    document.getElementById('visitedCount').textContent = visitedCount;
    
    let currentLevel = levelRanks[0];
    for (let i = levelRanks.length - 1; i >= 0; i--) {
        if (visitedCount >= levelRanks[i].min) {
            currentLevel = levelRanks[i];
            break;
        }
    }
    document.getElementById('userLevelBadge').innerHTML = currentLevel.name;
    
    let nextAchievement = achievementsList.find(a => !a.condition(visitedCount));
    const nextSpan = document.getElementById('nextAchievement');
    if (nextSpan) {
        if (nextAchievement) {
            let needed = nextAchievement.id === 'start' ? 1 : nextAchievement.id === 'traveler' ? 5 : 10;
            nextSpan.innerHTML = `До "${nextAchievement.name}" осталось ${needed - visitedCount} регионов`;
        } else {
            nextSpan.innerHTML = 'Все достижения получены!';
        }
    }
    
    const unlockedCount = achievementsList.filter(a => a.condition(visitedCount)).length;
    document.getElementById('compactAchievements').textContent = unlockedCount;
}

function updateAchievements() {
    const visitedCount = Object.keys(visitedRegions).length;
    const unlockedCount = achievementsList.filter(a => a.condition(visitedCount)).length;
    document.getElementById('achievementsCount').textContent = `${unlockedCount}/${achievementsList.length}`;
    
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
                    <div class="achievement-status">${unlocked ? '✓' : ''}</div>
                </div>
            `;
        }).join('');
    }
}

function updateFriends() {
    const grid = document.getElementById('friendsGrid');
    if (!grid) return;
    
    // Очищаем друзей - они будут загружены из бэкенда
    if (!friendsList || friendsList.length === 0) {
        grid.innerHTML = `<div class="no-friends" style="grid-column:1/-1;text-align:center;padding:40px;">
            <i class="fas fa-users" style="font-size:48px;margin-bottom:16px;display:block;"></i>
            <p>У вас пока нет друзей</p>
            <p style="font-size:14px;">Пригласите друзей в RuTrip!</p>
        </div>`;
        return;
    }
    
    grid.innerHTML = friendsList.map(friend => `
        <div class="friend-card">
            <div class="friend-avatar">${friend.avatar || friend.name.charAt(0)}</div>
            <div class="friend-name">${friend.name}</div>
            <div class="friend-stats"><i class="fas fa-map-marker-alt"></i> ${friend.visitedCount || 0} регионов</div>
            <button class="view-friend-map" onclick="viewFriendMap('${friend.id}')"><i class="fas fa-map"></i> Карта друга</button>
        </div>
    `).join('');
}

function updateMapColors() {
    const paths = document.querySelectorAll('#regionMap path[data-title]');
    paths.forEach(path => {
        const title = path.getAttribute('data-title');
        if (title && regionsData[title]) {
            const isVisited = !!visitedRegions[regionsData[title].id];
            path.style.fill = isVisited ? '#4CAF50' : '#ffffff';
            path.style.stroke = isVisited ? '#2E7D32' : '#333333';
            path.style.strokeWidth = isVisited ? '1.2' : '0.8';
        }
    });
}

function showToast(message, type = 'success') {
    const oldToasts = document.querySelectorAll('.custom-toast');
    oldToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    toast.innerHTML = `<i class="fas ${icon}" style="margin-right:8px;"></i> ${message}`;
    toast.style.cssText = `
        position: fixed; bottom: 100px; right: 30px; background: white; padding: 12px 24px;
        border-radius: 40px; z-index: 10000; animation: slideInRight 0.3s ease;
        font-size: 14px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); color: #333;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ==================== МОДАЛЬНЫЕ ОКНА ====================

function startRegionAdd(regionName) {
    currentStepData = {
        regionName: regionName,
        visitedByRoute: null,
        selectedSights: [],
        reviewText: '',
        rating: 5,
        photos: [],
        suggestion: null
    };
    
    const modalHtml = `
        <div class="modal-overlay" id="stepModal">
            <div class="modal-container">
                <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
                <div class="region-name-large">${regionName}</div>
                <div class="modal-buttons">
                    <button class="modal-btn primary" onclick="nextStep()">Далее →</button>
                </div>
            </div>
        </div>
    `;
    closeModal();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    currentModal = document.getElementById('stepModal');
}

function nextStep() {
    closeModal();
    
    const modalHtml = `
        <div class="modal-overlay" id="stepModal">
            <div class="modal-container">
                <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
                <div class="region-name-large">${currentStepData.regionName}</div>
                <h3 style="text-align:center;margin-bottom:20px;">Вы посетили регион по нашему предложенному маршруту?</h3>
                <div class="modal-buttons">
                    <button class="modal-btn primary" onclick="setVisitedByRoute(true)">Да</button>
                    <button class="modal-btn secondary" onclick="setVisitedByRoute(false)">Нет</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    currentModal = document.getElementById('stepModal');
}

function setVisitedByRoute(value) {
    currentStepData.visitedByRoute = value;
    closeModal();
    
    if (value) {
        showSightsStep();
    } else {
        showSuggestionStep();
    }
}

function showSightsStep() {
    const modalHtml = `
        <div class="modal-overlay" id="stepModal">
            <div class="modal-container">
                <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
                <div class="region-name-large">${currentStepData.regionName}</div>
                <div class="form-group">
                    <label>Что вы посетили?</label>
                    <div class="checkbox-group" id="sightsCheckboxes">
                        <label><input type="checkbox" value="Достопримечательность 1" class="sight-checkbox"> Достопримечательность 1</label>
                        <label><input type="checkbox" value="Достопримечательность 2" class="sight-checkbox"> Достопримечательность 2</label>
                        <label><input type="checkbox" value="Достопримечательность 3" class="sight-checkbox"> Достопримечательность 3</label>
                    </div>
                </div>
                <div class="modal-buttons">
                    <button class="modal-btn secondary" onclick="setVisitedByRoute(false)">← Назад</button>
                    <button class="modal-btn primary" onclick="showReviewStep()">Далее →</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    currentModal = document.getElementById('stepModal');
}

function showSuggestionStep() {
    const modalHtml = `
        <div class="modal-overlay" id="stepModal">
            <div class="modal-container">
                <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
                <div class="region-name-large">${currentStepData.regionName}</div>
                <div class="form-group">
                    <label>Что бы вы посоветовали посетить в этом регионе?</label>
                    <textarea id="suggestionText" class="form-input" rows="4" placeholder="Поделитесь вашими идеями..."></textarea>
                </div>
                <div class="modal-buttons">
                    <button class="modal-btn secondary" onclick="nextStep()">← Назад</button>
                    <button class="modal-btn primary" onclick="submitSuggestion()">Отправить</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    currentModal = document.getElementById('stepModal');
}

function submitSuggestion() {
    const suggestion = document.getElementById('suggestionText')?.value || '';
    currentStepData.suggestion = suggestion;
    closeModal();
    saveRegionData();
}

function showReviewStep() {
    const selectedSights = Array.from(document.querySelectorAll('.sight-checkbox:checked')).map(cb => cb.value);
    currentStepData.selectedSights = selectedSights;
    closeModal();
    
    const modalHtml = `
        <div class="modal-overlay" id="stepModal">
            <div class="modal-container">
                <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
                <div class="region-name-large">${currentStepData.regionName}</div>
                <div class="form-group">
                    <label>Ваш отзыв</label>
                    <textarea id="reviewText" class="form-input" rows="4" placeholder="Поделитесь впечатлениями..."></textarea>
                </div>
                <div class="form-group">
                    <label>Оценка</label>
                    <div class="star-rating" id="starRating">
                        <span data-value="1">☆</span><span data-value="2">☆</span><span data-value="3">☆</span><span data-value="4">☆</span><span data-value="5">☆</span>
                    </div>
                </div>
                <div class="modal-buttons">
                    <button class="modal-btn secondary" onclick="showSightsStep()">← Назад</button>
                    <button class="modal-btn primary" onclick="submitReview()">Отправить</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    currentModal = document.getElementById('stepModal');
    
    let currentRating = 5;
    const stars = document.querySelectorAll('#starRating span');
    stars.forEach((star, i) => {
        if (i < currentRating) { star.textContent = '★'; star.classList.add('active'); }
        star.addEventListener('click', () => {
            currentRating = parseInt(star.dataset.value);
            stars.forEach((s, idx) => {
                if (idx < currentRating) { s.textContent = '★'; s.classList.add('active'); }
                else { s.textContent = '☆'; s.classList.remove('active'); }
            });
        });
    });
}

function submitReview() {
    const reviewText = document.getElementById('reviewText')?.value || '';
    let rating = 0;
    const stars = document.querySelectorAll('#starRating span');
    stars.forEach((star, i) => { if (star.textContent === '★') rating = i + 1; });
    
    currentStepData.reviewText = reviewText;
    currentStepData.rating = rating;
    closeModal();
    saveRegionData();
}

async function saveRegionData() {
    const regionId = regionsData[currentStepData.regionName]?.id;
    if (!regionId) {
        showToast('Ошибка: регион не найден', 'error');
        return;
    }
    
    const reviewData = {
        visitedByRoute: currentStepData.visitedByRoute,
        selectedSights: currentStepData.selectedSights,
        reviewText: currentStepData.reviewText,
        rating: currentStepData.rating,
        photos: currentStepData.photos,
        suggestion: currentStepData.suggestion
    };
    
    const success = await saveVisitedRegion(regionId, reviewData);
    if (success) {
        const modalHtml = `
            <div class="modal-overlay" id="congratModal">
                <div class="modal-container" style="text-align:center;">
                    <div class="mascot" style="width:80px;height:80px;margin:0 auto 20px;animation:bounce 0.5s ease infinite;">
                        <div class="mascot-ear left"></div><div class="mascot-ear right"></div>
                        <div class="mascot-face">
                            <div class="mascot-eye left"></div><div class="mascot-eye right"></div>
                            <div class="mascot-nose"></div>
                        </div>
                    </div>
                    <h2>Поздравляем!</h2>
                    <div class="region-name-large" style="font-size:24px;">${currentStepData.regionName}</div>
                    <p style="margin:20px 0;">Новое приключение добавлено в вашу коллекцию!</p>
                    <button class="modal-btn primary" onclick="closeModal()">Продолжить</button>
                </div>
            </div>
            <style>@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}</style>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        currentModal = document.getElementById('congratModal');
    }
    
    currentStepData = null;
    uploadedPhotos = [];
}

// ==================== ИНТЕРАКТИВНОСТЬ КАРТЫ ====================

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
            const isVisited = visitedRegions[regionsData[title]?.id];
            path.style.fill = isVisited ? '#4CAF50' : '#ffffff';
            tooltip.classList.remove('active');
        });
        
        path.addEventListener('click', () => {
            const regionId = regionsData[title]?.id;
            if (regionId && visitedRegions[regionId]) {
                showRegionInfo(title, visitedRegions[regionId]);
            } else {
                startRegionAdd(title);
            }
        });
    });
}

function showRegionInfo(regionName, data) {
    const modalHtml = `
        <div class="modal-overlay" id="regionInfoModal">
            <div class="modal-container">
                <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
                <div class="modal-icon"><i class="fas fa-map-marker-alt"></i></div>
                <h2>${regionName}</h2>
                <div style="background:rgba(76,175,80,0.1);border-radius:16px;padding:16px;margin:16px 0;">
                    <p><i class="fas fa-calendar-check"></i> Посещён: ${new Date(data.visitedAt).toLocaleDateString('ru-RU')}</p>
                    <p><i class="fas fa-star"></i> Оценка: ${'★'.repeat(data.rating || 5)}${'☆'.repeat(5 - (data.rating || 5))}</p>
                    ${data.reviewText ? `<p><i class="fas fa-comment"></i> "${data.reviewText}"</p>` : ''}
                </div>
                <div class="modal-buttons">
                    <button class="modal-btn secondary" onclick="showDeleteConfirm('${regionName}', '${regionsData[regionName]?.id}')">
                        <i class="fas fa-trash"></i> Удалить
                    </button>
                    <button class="modal-btn primary" onclick="closeModal()">Закрыть</button>
                </div>
            </div>
        </div>
    `;
    closeModal();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    currentModal = document.getElementById('regionInfoModal');
}

function showDeleteConfirm(regionName, regionId) {
    closeModal();
    const modalHtml = `
        <div class="modal-overlay" id="deleteModal">
            <div class="modal-container" style="text-align:center;">
                <div class="modal-icon"><i class="fas fa-exclamation-triangle" style="color:#ff6b6b;"></i></div>
                <h2>Удалить отметку?</h2>
                <p>Вы уверены, что хотите удалить отметку о посещении <strong>${regionName}</strong>?</p>
                <div class="modal-buttons">
                    <button class="modal-btn secondary" onclick="closeModal()">Отмена</button>
                    <button class="modal-btn primary" onclick="confirmDelete('${regionId}')">Удалить</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    currentModal = document.getElementById('deleteModal');
}

async function confirmDelete(regionId) {
    if (regionId) {
        const success = await deleteVisitedRegion(regionId);
        closeModal();
        showToast(success ? 'Отметка удалена' : 'Ошибка при удалении', success ? 'info' : 'error');
    }
}

// ==================== ПРОФИЛЬ И АВТОРИЗАЦИЯ ====================

function openEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    document.getElementById('editName').value = currentUser?.name || '';
    document.getElementById('editEmail').value = currentUser?.email || '';
    modal.style.display = 'flex';
}

function closeEditProfileModal() {
    document.getElementById('editProfileModal').style.display = 'none';
}

async function saveProfile() {
    const name = document.getElementById('editName').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    if (!name) { showToast('Введите имя', 'info'); return; }
    const success = await updateUserProfile(name, email);
    if (success) closeEditProfileModal();
}

function checkAuth() {
    const authButtons = document.getElementById('authButtons');
    const profileMenu = document.getElementById('profileMenu');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const profileName = document.getElementById('profileName');
    
    if (currentUser) {
        if (authButtons) authButtons.style.display = 'none';
        if (profileMenu) profileMenu.style.display = 'block';
        if (userNameDisplay) userNameDisplay.textContent = currentUser.name;
        if (profileName) profileName.textContent = currentUser.name;
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
        profileBtn.addEventListener('click', (e) => { e.stopPropagation(); dropdown.classList.toggle('show'); });
        document.addEventListener('click', () => { dropdown.classList.remove('show'); });
    }
    document.getElementById('editProfileLink')?.addEventListener('click', (e) => {
        e.preventDefault(); openEditProfileModal(); dropdown.classList.remove('show');
    });
}

// ==================== МАСКОТ ====================

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
        
        const visitedCount = Object.keys(visitedRegions).length;
        const messages = [
            "Привет! Я Миша, твой гид по России!",
            "Нажми на любой регион, чтобы отметить его!",
            `Ты уже отметил ${visitedCount} регионов!`,
            "Каждый новый регион — новое приключение!"
        ];
        alert(messages[Math.floor(Math.random() * messages.length)]);
    });
}

// ==================== САЙДБАР ====================

function initSidebar() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebarClose');
    const overlay = document.getElementById('overlay');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.add('open');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    if (sidebarClose) {
        sidebarClose.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
}

// ==================== ГЛОБАЛЬНЫЕ ФУНКЦИИ ====================

window.closeModal = function() { if (currentModal) { currentModal.remove(); currentModal = null; } };
window.closePanel = function(panelId) { document.getElementById(panelId)?.classList.remove('show'); };
window.viewFriendMap = function(friendId) { showToast('Карта друга в разработке', 'info'); };
window.nextStep = nextStep;
window.setVisitedByRoute = setVisitedByRoute;
window.showReviewStep = showReviewStep;
window.submitSuggestion = submitSuggestion;
window.submitReview = submitReview;
window.confirmDelete = confirmDelete;
window.showDeleteConfirm = showDeleteConfirm;
window.openEditProfileModal = openEditProfileModal;
window.closeEditProfileModal = closeEditProfileModal;
window.saveProfile = saveProfile;

// ==================== ИНИЦИАЛИЗАЦИЯ ====================

async function init() {
    console.log('Инициализация RuTrip...');
    
    currentUser = await fetchCurrentUser();
    
    const regionsFromBackend = await fetchRegions();
    if (regionsFromBackend && regionsFromBackend.length > 0) {
        regionsData = {};
        regionsFromBackend.forEach(r => { regionsData[r.name] = { id: r.id, sights: r.sights || [] }; });
        totalRegionsCount = Object.keys(regionsData).length;
        document.getElementById('totalRegionsCount').textContent = totalRegionsCount;
    } else {
        autoFillRegionsData();
    }
    
    if (currentUser) {
        visitedRegions = await fetchVisitedRegions();
        friendsList = await fetchFriends();
        updateFriends();
    }
    
    updateAllStats();
    updateAchievements();
    updateMapColors();
    
    setupMapInteractivity();
    initFloatingIcons();
    initMascot();
    initSidebar();
    initProfileDropdown();
    checkAuth();
    
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
    document.getElementById('shareBtn')?.addEventListener('click', () => {
        const visitedCount = Object.keys(visitedRegions).length;
        const text = `Я путешествую по России и уже посетил(а) ${visitedCount} регионов! Присоединяйся к RuTrip! 🗺️`;
        if (navigator.share) {
            navigator.share({ title: 'RuTrip', text, url: window.location.href }).catch(() => navigator.clipboard.writeText(text));
        } else {
            navigator.clipboard.writeText(text);
        }
        showToast('Текст скопирован!', 'success');
    });
    document.getElementById('logoutLink')?.addEventListener('click', (e) => { e.preventDefault(); logout(); });
    document.getElementById('logoutLinkSidebar')?.addEventListener('click', (e) => { e.preventDefault(); logout(); });
    
    console.log('RuTrip инициализирован');
}

document.addEventListener('DOMContentLoaded', init);