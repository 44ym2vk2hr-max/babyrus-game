const STORAGE_KEY = "kriptoSkufSaveV1";

const baseItems = [
  { id: "phone", name: "Phone", baseCost: 50, growth: 1.12, tapBonus: 0.5, passiveBonus: 0.2, level: 0, skins: [
    { level: 0, name: "Бомж-кнопка", desc: "Старый кнопочный телефон" },
    { level: 10, name: "Nokia 3310", desc: "Классическая нокия" },
    { level: 20, name: "Раскладушка", desc: "Телефон 2000-х" },
    { level: 30, name: "Смартфон", desc: "Базовый смартфон" },
    { level: 50, name: "Флагман", desc: "Мощный смартфон" },
    { level: 100, name: "Эпический смартфон", desc: "Символ статуса" }
  ]},
  { id: "clothes", name: "Clothes", baseCost: 200, growth: 1.13, tapBonus: 1.5, passiveBonus: 0.8, level: 0, skins: [
    { level: 0, name: "Мешковина", desc: "Одежда с рынка" },
    { level: 10, name: "Пуховик", desc: "Тепло и солидно" },
    { level: 30, name: "Классика", desc: "Нормальный стиль" },
    { level: 60, name: "Дизайнер", desc: "Стильно и дорого" },
    { level: 100, name: "Имидж-монстр", desc: "Стиль и уверенность" }
  ]},
  { id: "tv", name: "TV", baseCost: 600, growth: 1.14, tapBonus: 4, passiveBonus: 2, level: 0, skins: [
    { level: 0, name: "Плазма 2000", desc: "Старый телевизор" },
    { level: 20, name: "HD ТВ", desc: "Чёткая картинка" },
    { level: 50, name: "4K панель", desc: "Очень чётко" },
    { level: 100, name: "Кинотеатр", desc: "Крутая панель" }
  ]},
  { id: "pc", name: "PC", baseCost: 2500, growth: 1.15, tapBonus: 15, passiveBonus: 8, level: 0, skins: [
    { level: 0, name: "Пыльный системник", desc: "Старый ПК" },
    { level: 30, name: "Игровой ПК", desc: "Шумно и мощно" },
    { level: 70, name: "Премиум машина", desc: "Очень мощно" },
    { level: 100, name: "Королевская станция", desc: "Штаб и гордость" }
  ]},
  { id: "internet", name: "Internet", baseCost: 9000, growth: 1.16, tapBonus: 50, passiveBonus: 30, level: 0, skins: [
    { level: 0, name: "Модем", desc: "Медленный интернет" },
    { level: 40, name: "Fast Fiber", desc: "Очень быстро" },
    { level: 100, name: "Интернет-империя", desc: "Глобальная сеть" }
  ]},
  { id: "miner", name: "Miner", baseCost: 35000, growth: 1.17, tapBonus: 200, passiveBonus: 120, level: 0, skins: [
    { level: 0, name: "USB-майнер", desc: "Пытается заработать" },
    { level: 50, name: "Майнер-ферма", desc: "Фабрика монет" },
    { level: 100, name: "Крипто-империя", desc: "Проект уровня империи" }
  ]},
  { id: "office", name: "Office", baseCost: 150000, growth: 1.18, tapBonus: 900, passiveBonus: 600, level: 0, skins: [
    { level: 0, name: "Гараж", desc: "Три стула и мечты" },
    { level: 50, name: "Коворкинг", desc: "Рост команды" },
    { level: 100, name: "Корпоративная столица", desc: "Рабочие процессы на уровне государства" }
  ]},
  { id: "company", name: "CryptoCompany", baseCost: 800000, growth: 1.19, tapBonus: 5000, passiveBonus: 3500, level: 0, skins: [
    { level: 0, name: "Лавка", desc: "Первые шаги" },
    { level: 50, name: "Крипто-фонд", desc: "Серьёзный проект" },
    { level: 100, name: "Крипто-империя", desc: "Доход, власть и масштаб" }
  ]}
];

const state = { balance: 0, items: loadState() };

function loadState() { const saved = localStorage.getItem(STORAGE_KEY); if (!saved) return structuredClone(baseItems); try { const parsed = JSON.parse(saved); if (!Array.isArray(parsed)) return structuredClone(baseItems); return baseItems.map((baseItem) => { const savedItem = parsed.find((entry) => entry.id === baseItem.id) || {}; return { ...baseItem, ...savedItem, level: Number(savedItem.level) || 0 }; }); } catch (error) { return structuredClone(baseItems); } }
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items.map((item) => ({ id: item.id, level: item.level })))); }
function getPrice(item) { return Math.round(item.baseCost * Math.pow(item.growth, item.level)); }
function getTapIncome() { const baseTap = 1; return baseTap + state.items.reduce((sum, item) => sum + item.level * item.tapBonus, 0); }
function getPassiveIncome() { const basePassive = 0.05; return basePassive + state.items.reduce((sum, item) => sum + item.level * item.passiveBonus, 0); }
function getCurrentSkin(item) { const tier = Math.min(100, Math.floor(item.level / 10) * 10); return item.skins.find((skin) => skin.level === tier) || item.skins[item.skins.length - 1]; }
function formatNumber(value) { const num = Number(value); if (Number.isNaN(num)) return "0.00"; if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + "B"; if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + "M"; if (num >= 1_000) return (num / 1_000).toFixed(2) + "K"; return num.toFixed(2); }
function updateCharacterOverlays() { const overlayBox = document.getElementById("character-overlays"); if (!overlayBox) return; const topItems = [...state.items].filter((item) => item.level >= 10).sort((a, b) => b.level - a.level).slice(0, 4); overlayBox.innerHTML = ""; topItems.forEach((item) => { const badge = document.createElement("div"); badge.className = "overlay-badge"; const tier = Math.floor(item.level / 10) * 10; const stage = tier < 30 ? 0 : tier < 60 ? 1 : tier < 90 ? 2 : 3; badge.dataset.tier = String(stage); badge.textContent = `${item.name.slice(0, 2).toUpperCase()}${tier}`; badge.title = `${item.name} — ${getCurrentSkin(item).name}`; overlayBox.appendChild(badge); }); }
function renderStats() { document.getElementById("balance").textContent = formatNumber(state.balance); document.getElementById("tap-income").textContent = formatNumber(getTapIncome()); document.getElementById("passive-income").textContent = formatNumber(getPassiveIncome()); document.getElementById("total-levels").textContent = String(state.items.reduce((sum, item) => sum + item.level, 0)); }
function buyItem(item, count = 1) { let totalCost = 0; for (let i = 0; i < count; i += 1) { totalCost += getPrice({ ...item, level: item.level + i }); } if (state.balance < totalCost) return; state.balance -= totalCost; item.level += count; saveState(); render(); }
function renderShop() { const shop = document.getElementById("shop"); if (!shop) return; shop.innerHTML = ""; state.items.forEach((item) => { const price = getPrice(item); const skin = getCurrentSkin(item); const card = document.createElement("article"); card.className = "shop-item"; const header = document.createElement("div"); header.className = "shop-item-header"; header.innerHTML = `<span>${item.name}</span><span>Lv ${item.level}</span>`; const skinInfo = document.createElement("div"); skinInfo.className = "shop-item-skin"; skinInfo.innerHTML = `<strong>${skin.name}</strong><div>${skin.desc}</div>`; const meta = document.createElement("div"); meta.className = "shop-item-meta"; meta.innerHTML = `<span>+${formatNumber(item.tapBonus)} / тап</span><span>+${formatNumber(item.passiveBonus)} / сек</span>`; const priceRow = document.createElement("div"); priceRow.className = "shop-item-meta"; priceRow.innerHTML = `<span>Цена: ${formatNumber(price)}</span><span>Tier: ${Math.floor(item.level / 10) * 10}</span>`; const actions = document.createElement("div"); actions.className = "shop-actions"; const buy1 = document.createElement("button"); buy1.type = "button"; buy1.className = "buy-btn"; buy1.textContent = "Купить x1"; buy1.disabled = state.balance < price; buy1.addEventListener("click", () => buyItem(item, 1)); const buy10 = document.createElement("button"); buy10.type = "button"; buy10.className = "buy-btn"; buy10.textContent = "Купить x10"; buy10.disabled = state.balance < getPrice({ ...item, level: item.level + 9 }); buy10.addEventListener("click", () => buyItem(item, 10)); const buyMax = document.createElement("button"); buyMax.type = "button"; buyMax.className = "buy-btn ghost"; buyMax.textContent = "Buy max"; buyMax.addEventListener("click", () => { let count = 0; while (state.balance >= getPrice({ ...item, level: item.level + count })) { count += 1; if (count > 200) break; } if (count > 0) buyItem(item, count); }); actions.append(buy1, buy10, buyMax); card.append(header, skinInfo, meta, priceRow, actions); shop.appendChild(card); }); }
function showFloatingText(value) { const character = document.getElementById("character"); const float = document.createElement("div"); float.className = "floating-text"; float.textContent = "+" + formatNumber(value); character.appendChild(float); setTimeout(() => float.remove(), 700); }
function handleTap() { const income = getTapIncome(); state.balance += income; showFloatingText(income); saveState(); renderStats(); updateCharacterOverlays(); }
function passiveLoop() { state.balance += getPassiveIncome(); renderStats(); saveState(); updateCharacterOverlays(); }
function resetGame() { state.balance = 0; state.items = structuredClone(baseItems); saveState(); render(); }
function render() { renderStats(); renderShop(); updateCharacterOverlays(); }
const characterButton = document.getElementById("character"); const resetButton = document.getElementById("reset-btn"); if (characterButton) { characterButton.addEventListener("click", handleTap); } if (resetButton) { resetButton.addEventListener("click", resetGame); } setInterval(passiveLoop, 1000); render();
