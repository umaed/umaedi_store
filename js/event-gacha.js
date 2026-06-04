// event-gacha.js - UMADIGI STORE Gacha Event

const FREE_PM_REWARDS = [
  { name: 'Fahira', url: 'https://whatsapp.com/channel/0029Vb8KKJnATRSuitlS2F3W' },
  { name: 'Rara', url: 'https://whatsapp.com/channel/0029VbCXhJKD38Caijovz33t' },
  { name: 'Erine', url: 'https://whatsapp.com/channel/0029VascxOT7DAX70BP6pP1z' },
  { name: 'Trisha', url: 'https://whatsapp.com/channel/0029Vb8BieOADTOKQKhqTP1O' },
  { name: 'Bella', url: 'https://whatsapp.com/channel/0029VbCkY8f8qIzpKIjWQG3o' },
  { name: 'Oline', url: 'https://whatsapp.com/channel/0029VbCe2vMInlqVd5uSMo3V' },
  { name: 'Fera', url: 'https://whatsapp.com/channel/0029Vb7xUSsCRs1mwf8GyP3L' },
  { name: 'Carissa', url: 'https://whatsapp.com/channel/0029VbCiewvE50UdlC6KAo2h' },
  { name: 'Oniel', url: 'https://whatsapp.com/channel/0029VbCkO7EId7nLGOfSG61E' },
  { name: 'Ribka', url: 'https://whatsapp.com/channel/0029Vb8Ca56CMY0CpmDrEl0U' },
  { name: 'Lily', url: 'https://whatsapp.com/channel/0029VbCByd20bIddeK59pc2Y' },
  { name: 'Delyn', url: 'https://whatsapp.com/channel/0029Vb7rgja5fM5YEQCRqQ0t' },
  { name: 'Maxine', url: 'https://whatsapp.com/channel/0029VbCvS6g2975Ju0Szyx1I' },
  { name: 'Ralyne', url: 'https://whatsapp.com/channel/0029Vb7IC5796H4NQRgleI1J' },
  { name: 'Jazzy', url: 'https://whatsapp.com/channel/0029VbCRR2L23n3cD9Qabt09' },
  { name: 'Sona', url: 'https://whatsapp.com/channel/0029Vb7e8Kc7Noa2zPuKsN1s' },
  { name: 'Heidi', url: 'https://whatsapp.com/channel/0029Vb7xjNqHwXb8Ogixsv1T' },
  { name: 'Kimy', url: 'https://whatsapp.com/channel/0029Vb7jrYV4dTnMyU0rVh1i' }
];
const ULTRA_RARE_TARGET = 5;
const RANDOM_PM_ULTRA_RARE_COST = 5;
const RANDOM_PM_POINT_COST = 2300;
const CHOICE_PM_ULTRA_RARE_COST = 10;
const CHOICE_PM_POINT_COST = 5000;
const CARDS_PER_PACK = 5;
const PACKS_BEFORE_COOLDOWN = 10;
const TOTAL_PACK_CHOICES = 10;
const PACK_COOLDOWN_MS = 60 * 60 * 1000;
const EVENT_STORAGE_KEY = 'umadigi_gacha_event';
const JKT48_MEMBER_FRAME = 'https://jkt48.com/images/member/bg-member-item-frame-transparent.png';
const CARD_POINT_VALUES = {
  common: 8,
  uncommon: 18,
  rare: 45,
  ultraRare: 0
};
const COLLECTION_COMPLETE_BONUS = 2500;
const VOUCHER_SHOP = [
  { id: 'DISKON5K', name: 'Voucher Diskon Rp5.000', cost: 1200 },
  { id: 'DISKON10K', name: 'Voucher Diskon Rp10.000', cost: 2200 },
  { id: 'DISKONPM', name: 'Voucher PM Member Hemat', cost: 3500 }
];
const SPECIAL_ULTRA_RARE_MEMBERS = {
  marsha: 'Marsha Lenathea',
  christy: 'Angelina Christy',
  oline: 'Oline Manuel',
  erine: 'Catherina Vallencia',
  lily: 'Lily',
  kimy: 'Kimy',
  feni: 'Feni Fitriyanti',
  freya: 'Freya Jayawardana',
  fiony: 'Fiony Alveria',
  catherina: 'Catherina Vallencia',
  anindya: 'Anindya Ramadhani'
};
const SPECIAL_ULTRA_RARE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];

const rarityConfig = {
  common: { rank: 'Common', level: 'C', weight: 48, order: 1 },
  uncommon: { rank: 'Uncommon', level: 'UC', weight: 28, order: 2 },
  rare: { rank: 'Rare', level: 'R', weight: 16, order: 3 },
  ultraRare: { rank: 'Ultra Rare', level: 'UR', weight: 5, order: 4 }
};

function memberCard(name, slug, rarity, imageUrl) {
  const localImage = `../assets/img/member/${slug}.png`;
  return {
    name,
    image: imageUrl || localImage,
    fallbackImage: localImage,
    rarity
  };
}

function specialUltraRareCard(name, slug) {
  const image = `../assets/img/member/${slug}.png`;
  return {
    name,
    image,
    fallbackImage: image,
    rarity: 'ultraRare',
    specialUltraRare: true,
    slug
  };
}

const defaultGachaMembers = [
  specialUltraRareCard('Marsha Lenathea', 'marsha'),
  specialUltraRareCard('Angelina Christy', 'christy'),
  specialUltraRareCard('Oline Manuel', 'oline'),
  specialUltraRareCard('Catherina Vallencia', 'erine'),
  specialUltraRareCard('Lily', 'lily'),
  specialUltraRareCard('Kimy', 'kimy'),
  specialUltraRareCard('Feni Fitriyanti', 'feni'),
  specialUltraRareCard('Freya Jayawardana', 'freya'),
  memberCard('Christabella Bonita', 'christabella-bonita', 'rare'),
  memberCard('Freya Jayawardana', 'freya-jayawardana', 'rare'),
  memberCard('Fiony Alveria', 'fiony-alveria', 'rare'),
  memberCard('Angelina Christy', 'angelina-christy', 'rare'),
  memberCard('Marsha Lenathea', 'marsha-lenathea', 'rare'),
  memberCard('Catherina Vallencia', 'catherina-vallencia', 'rare'),
  memberCard('Anindya Ramadhani', 'anindya-ramadhani', 'rare'),
  memberCard('Gita Sekar Andarini', 'gita-sekar-andarini', 'rare'),
  memberCard('Kathrina Irene', 'kathrina-irene', 'rare'),
  memberCard('Raisha Syifa', 'raisha-syifa', 'rare'),
  memberCard('Aurellia', 'aurellia', 'rare'),
  memberCard('Alya Amanda', 'alya-amanda', 'rare'),
  memberCard('Oline Manuel', 'oline-manuel', 'rare'),
  memberCard('Nayla Suji', 'nayla-suji', 'rare'),
  memberCard('Greesella Adhalia', 'greesella-adhalia', 'uncommon'),
  memberCard('Gabriela Abigail', 'gabriela-abigail', 'uncommon'),
  memberCard('Febriola Sinambela', 'febriola-sinambela', 'uncommon'),
  memberCard('Indah Cahya', 'indah-cahya', 'uncommon'),
  memberCard('Afera Thalia', 'afera-thalia', 'uncommon'),
  memberCard('Adeline Wijaya', 'adeline-wijaya', 'uncommon'),
  memberCard('Aurhel Alana', 'aurhel-alana', 'uncommon'),
  memberCard('Cathleen Nixie', 'cathleen-nixie', 'uncommon'),
  memberCard('Celline Thefani', 'celline-thefani', 'uncommon'),
  memberCard('Cornelia Vanisa', 'cornelia-vanisa', 'uncommon'),
  memberCard('Cynthia Yaputera', 'cynthia-yaputera', 'uncommon'),
  memberCard('Dena Natalia', 'dena-natalia', 'uncommon'),
  memberCard('Desy Natalia', 'desy-natalia', 'uncommon'),
  memberCard('Feni Fitriyanti', 'feni-fitriyanti', 'uncommon'),
  memberCard('Fritzy Rosmerian', 'fritzy-rosmerian', 'uncommon'),
  memberCard('Grace Octaviani', 'grace-octaviani', 'uncommon'),
  memberCard('Hillary Abigail', 'hillary-abigail', 'uncommon'),
  memberCard('Jazzlyn Trisha', 'jazzlyn-trisha', 'uncommon'),
  memberCard('Jessica Chandra', 'jessica-chandra', 'uncommon'),
  memberCard('Jesslyn Elly', 'jesslyn-elly', 'uncommon'),
  memberCard('Lulu Salsabila', 'lulu-salsabila', 'uncommon'),
  memberCard('Michelle Alexandra', 'michelle-alexandra', 'uncommon'),
  memberCard('Michelle Levia', 'michelle-levia', 'uncommon'),
  memberCard('Mutiara Azzahra', 'mutiara-azzahra', 'uncommon'),
  memberCard('Nina Tutachia', 'nina-tutachia', 'uncommon'),
  memberCard('Ribka Budiman', 'ribka-budiman', 'uncommon'),
  memberCard('Shabilqis Naila', 'shabilqis-naila', 'uncommon'),
  memberCard('Victoria Kimberly', 'victoria-kimberly', 'uncommon'),
  memberCard('Fahira Putri', 'fahira-putri', 'common'),
  memberCard('Carissa Dini', 'carissa-dini', 'common'),
  memberCard('Heidi Suyangga', 'heidi-suyangga', 'common'),
  memberCard('Putry Jazyta', 'putry-jazyta', 'common'),
  memberCard('Sona Kalyana', 'sona-kalyana', 'common'),
  memberCard('Abigail Rachel', 'abigail-rachel', 'common'),
  memberCard('Astrella Virgiananda', 'astrella-virgiananda', 'common'),
  memberCard('Aulia Riza', 'aulia-riza', 'common'),
  memberCard('Bong Aprilli', 'bong-aprilli', 'common'),
  memberCard('Fatimah Azzahra', 'fatimah-azzahra', 'common'),
  memberCard('Gendis Mayrannisa', 'gendis-mayrannisa', 'common'),
  memberCard('Hagia Sopia', 'hagia-sopia', 'common'),
  memberCard('Helisma Putri', 'helisma-putri', 'common'),
  memberCard('Humaira Ramadhani', 'humaira-ramadhani', 'common'),
  memberCard('Jacqueline Immanuela', 'jacqueline-immanuela', 'common'),
  memberCard('Jemima Evodie', 'jemima-evodie', 'common'),
  memberCard('Maxine Faye', 'maxine-faye', 'common'),
  memberCard('Mikaela Kusjanto', 'mikaela-kusjanto', 'common'),
  memberCard('Nur Intan', 'nur-intan', 'common'),
  memberCard('Ralyne Van Irwan', 'ralyne-van-irwan', 'common')
];

function dedupeMembers(members) {
  const unique = new Map();
  members.forEach(member => {
    if (!unique.has(member.name) || member.rarity === 'ultraRare') {
      unique.set(member.name, member);
    }
  });
  return [...unique.values()];
}

let gachaMembers = dedupeMembers(defaultGachaMembers);
let gachaCatalogReady = false;

function createDefaultState() {
  return {
    ultraRare: [],
    collection: [],
    inventory: {},
    jktPoints: 0,
    vouchers: [],
    rewardHistory: [],
    collectionCompleteBonusClaimed: false,
    last: null,
    rewardMember: null,
    rewardUrl: null,
    totalPulls: 0,
    packRemaining: 0,
    packNumber: 0,
    activePack: null,
    openedPacks: [],
    cooldownUntil: 0
  };
}

function normalizeState(state) {
  const fallback = createDefaultState();
  const hasInventory = state?.inventory && typeof state.inventory === 'object' && !Array.isArray(state.inventory);
  const inventory = hasInventory ? state.inventory : {};
  if (!hasInventory && Array.isArray(state?.collection)) {
    state.collection.forEach(item => {
      if (!item?.name) return;
      inventory[item.name] = (inventory[item.name] || 0) + 1;
    });
  }
  Object.keys(inventory).forEach(name => {
    inventory[name] = Math.max(Number(inventory[name] || 0), 0);
    if (inventory[name] <= 0) delete inventory[name];
  });
  const rewardHistory = Array.isArray(state?.rewardHistory) ? state.rewardHistory : [];
  if (!rewardHistory.length && state?.rewardMember && state?.rewardUrl) {
    rewardHistory.push({
      name: state.rewardMember,
      url: state.rewardUrl,
      date: new Date().toISOString(),
      mode: 'legacy'
    });
  }

  return {
    ...fallback,
    ...state,
    ultraRare: Array.isArray(state?.ultraRare) ? state.ultraRare : [],
    collection: Array.isArray(state?.collection) ? state.collection : [],
    inventory,
    jktPoints: Number.isFinite(Number(state?.jktPoints)) ? Number(state.jktPoints) : 0,
    vouchers: Array.isArray(state?.vouchers) ? state.vouchers : [],
    rewardHistory,
    collectionCompleteBonusClaimed: Boolean(state?.collectionCompleteBonusClaimed),
    openedPacks: Array.isArray(state?.openedPacks) ? state.openedPacks : []
  };
}

function getCollectedNames(state) {
  return [...new Set((state.collection || []).map(item => item.name).filter(Boolean))];
}

function getMemberByName(name) {
  return gachaMembers.find(member => member.name === name);
}

function getInventoryCount(state, name) {
  return Math.max(Number(state.inventory?.[name] || 0), 0);
}

function addCardToInventory(state, item) {
  state.inventory[item.name] = getInventoryCount(state, item.name) + 1;
}

function addCardToCollection(state, item) {
  if (!state.collection.some(card => card.name === item.name)) {
    state.collection.unshift(item);
    return true;
  }
  return false;
}

function getInventoryEntries(state) {
  return Object.entries(state.inventory || {})
    .map(([name, count]) => ({ member: getMemberByName(name), name, count: Math.max(Number(count || 0), 0) }))
    .filter(entry => entry.member && entry.count > 0);
}

function getInventoryCountByRarity(state, rarity) {
  return getInventoryEntries(state)
    .filter(entry => entry.member.rarity === rarity)
    .reduce((total, entry) => total + entry.count, 0);
}

function hasCompleteRareCollection(state) {
  const collectedNames = new Set(getCollectedNames(state));
  const rareMembers = gachaMembers.filter(member => member.rarity === 'rare');
  return rareMembers.length > 0 && rareMembers.every(member => collectedNames.has(member.name));
}

function hasCompleteCollection(state) {
  const collectedNames = new Set(getCollectedNames(state));
  return gachaMembers.length > 0 && gachaMembers.every(member => collectedNames.has(member.name));
}

function applyCollectionCompleteBonus(state) {
  if (!gachaCatalogReady) return false;
  if (state.collectionCompleteBonusClaimed || !hasCompleteCollection(state)) return false;
  state.jktPoints += COLLECTION_COMPLETE_BONUS;
  state.collectionCompleteBonusClaimed = true;
  saveEventState(state);
  if (window.toast) {
    window.toast.success(`Koleksi lengkap! Bonus ${COLLECTION_COMPLETE_BONUS} JKT Point masuk.`, 3200);
  }
  return true;
}

function removeCardsFromInventoryByRarity(state, rarity, amount) {
  let remaining = amount;
  const entries = getInventoryEntries(state)
    .filter(entry => entry.member.rarity === rarity)
    .sort((a, b) => a.name.localeCompare(b.name));

  entries.forEach(entry => {
    if (remaining <= 0) return;
    const removed = Math.min(entry.count, remaining);
    state.inventory[entry.name] = entry.count - removed;
    if (state.inventory[entry.name] <= 0) delete state.inventory[entry.name];
    remaining -= removed;
  });

  return remaining === 0;
}

function getCooldownRemaining(state = getEventState()) {
  return Math.max((state.cooldownUntil || 0) - Date.now(), 0);
}

function isPackCooldownActive(state = getEventState()) {
  return getCooldownRemaining(state) > 0 && state.packRemaining <= 0;
}

function formatCooldown(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${String(seconds).padStart(2, '0')}d`;
}

function buildSpecialUltraRareCard(slug, imageUrl) {
  const displayName = SPECIAL_ULTRA_RARE_MEMBERS[slug];
  if (!displayName) return null;

  return {
    name: displayName,
    image: imageUrl,
    fallbackImage: imageUrl,
    rarity: 'ultraRare',
    specialUltraRare: true,
    slug
  };
}

function imageExists(src) {
  return new Promise(resolve => {
    const img = new Image();
    const timeout = setTimeout(() => resolve(false), 650);
    img.onload = () => {
      clearTimeout(timeout);
      resolve(true);
    };
    img.onerror = () => {
      clearTimeout(timeout);
      resolve(false);
    };
    img.src = src;
  });
}

async function scanSpecialUltraRareImages() {
  const candidates = [];
  Object.keys(SPECIAL_ULTRA_RARE_MEMBERS).forEach(slug => {
    SPECIAL_ULTRA_RARE_EXTENSIONS.forEach(extension => {
      candidates.push({
        slug,
        imageUrl: `../assets/img/member/${slug}.${extension}`
      });
    });
  });

  const results = await Promise.all(candidates.map(async candidate => {
    const exists = await imageExists(candidate.imageUrl);
    return exists ? buildSpecialUltraRareCard(candidate.slug, candidate.imageUrl) : null;
  }));

  return results.filter(Boolean);
}

function buildSpecialUltraRareFromListedImage(image) {
  const match = image.file.match(/^([a-z0-9-]+)\.(png|jpe?g|webp)$/i);
  if (!match) return null;

  const slug = match[1].toLowerCase();
  return buildSpecialUltraRareCard(slug, image.url);
}

async function loadSpecialUltraRareImages() {
  const specialCards = [];

  try {
    const response = await fetch('/api/member-images');
    if (response.ok) {
      const data = await response.json();
      specialCards.push(...(data.images || []).map(buildSpecialUltraRareFromListedImage).filter(Boolean));
    }
  } catch (error) {
    // Fallback scan below still works when the API is unavailable.
  }

  specialCards.push(...await scanSpecialUltraRareImages());

  const specialByName = new Map();
  specialCards.forEach(card => specialByName.set(card.name, card));

  const mergedDefaultCards = defaultGachaMembers.map(member => {
    const specialCard = specialByName.get(member.name);
    if (!specialCard) return member;
    specialByName.delete(member.name);
    return {
      ...member,
      rarity: 'ultraRare',
      image: specialCard.image,
      fallbackImage: specialCard.fallbackImage,
      specialUltraRare: true
    };
  });

  gachaMembers = dedupeMembers([...mergedDefaultCards, ...specialByName.values()]);
}

function getEventState() {
  try {
    return normalizeState(JSON.parse(localStorage.getItem(EVENT_STORAGE_KEY) || '{}'));
  } catch (error) {
    return createDefaultState();
  }
}

function saveEventState(state) {
  localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(normalizeState(state)));
}

function syncUltraRareState() {
  const state = getEventState();
  const validUltraRareNames = new Set(gachaMembers
    .filter(member => member.rarity === 'ultraRare')
    .map(member => member.name));

  const cleanedUltraRare = state.ultraRare.filter(name => validUltraRareNames.has(name));
  if (cleanedUltraRare.length !== state.ultraRare.length) {
    state.ultraRare = cleanedUltraRare;
    saveEventState(state);
  }
}

function pickRarity() {
  const entries = Object.entries(rarityConfig);
  const totalWeight = entries.reduce((sum, [, config]) => sum + config.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const [rarity, config] of entries) {
    roll -= config.weight;
    if (roll <= 0) return rarity;
  }

  return 'common';
}

function pickGachaItem() {
  const state = getEventState();
  let rarity = pickRarity();
  let members = gachaMembers.filter(member => member.rarity === rarity);

  if (rarity === 'ultraRare') {
    if (members.length === 0) {
      rarity = 'rare';
      members = gachaMembers.filter(member => member.rarity === rarity);
    }
  }

  const member = members[Math.floor(Math.random() * members.length)] || gachaMembers[0];
  return {
    ...member,
    ...rarityConfig[member.rarity],
    id: `${member.name}-${Date.now()}-${Math.floor(Math.random() * 9999)}`
  };
}

function normalizeGachaItem(item) {
  const matchedMember = gachaMembers.find(member => member.name === item?.name) || gachaMembers[0];
  const rarity = item?.rarity || matchedMember.rarity || 'common';
  return {
    ...matchedMember,
    ...item,
    ...rarityConfig[rarity],
    rarity,
    image: item?.image || matchedMember.image,
    fallbackImage: item?.fallbackImage || matchedMember.fallbackImage || '../assets/img/pmjkt48.png'
  };
}

function renderPackIdle() {
  const result = document.getElementById('gacha-result');
  if (!result) return;
  const state = getEventState();
  const cooldownRemaining = getCooldownRemaining(state);

  result.innerHTML = `
    <div class="gacha-pack is-sealed ${cooldownRemaining > 0 ? 'is-cooldown' : ''}">
      <div class="pack-grip pack-grip-left"></div>
      <div class="pack-grip pack-grip-right"></div>
      <div class="pack-plastic-glare"></div>
      <div class="pack-card-stack stack-1"></div>
      <div class="pack-card-stack stack-2"></div>
      <div class="pack-top"></div>
      <div class="pack-body">
        <span>${cooldownRemaining > 0 ? 'COOLDOWN' : state.activePack ? `PACK #${state.activePack}` : 'PILIH PACK'}</span>
        <strong>${cooldownRemaining > 0 ? 'TUNGGU SEBENTAR' : 'JKT48 PM PACK'}</strong>
        <small>${cooldownRemaining > 0 ? formatCooldown(cooldownRemaining) : state.activePack ? 'Tap untuk buka' : 'Pilih 1 dari 10 pack'}</small>
      </div>
    </div>
  `;
}

function renderCard(item) {
  const safeItem = normalizeGachaItem(item);
  return `
    <article class="gacha-card card-${safeItem.rarity} tilt-card">
      <div class="card-shine"></div>
      ${safeItem.rarity === 'ultraRare' ? '<span class="ur-crown" aria-hidden="true">&#9819;</span>' : ''}
      <span class="rank-badge">${safeItem.rank}</span>
      <span class="card-code">${safeItem.level}-PM</span>
      <div class="member-card-photo">
        <img class="member-photo" src="${safeItem.image}" alt="${safeItem.name}" onerror="this.src='${safeItem.fallbackImage}'">
        ${safeItem.rarity === 'ultraRare' ? '' : `<img class="member-frame" src="${JKT48_MEMBER_FRAME}" alt="" aria-hidden="true">`}
      </div>
      <div class="card-info">
        <strong>${safeItem.name}</strong>
        <span>Level ${safeItem.level}</span>
      </div>
    </article>
  `;
}

function renderResult(item) {
  const result = document.getElementById('gacha-result');
  if (!result) return;
  result.innerHTML = renderCard(item);
  bindTiltCards(result);
}

function bindTapGachaArea() {
  const result = document.getElementById('gacha-result');
  if (!result || result.dataset.tapReady) return;
  result.dataset.tapReady = 'true';

  result.addEventListener('click', () => {
    const button = document.getElementById('gacha-button');
    if (!button || button.disabled) return;
    runGacha();
  });
}

function showEventTab(tabName) {
  const activeTab = tabName || 'gacha';
  localStorage.setItem('umadigi_gacha_active_tab', activeTab);
  document.querySelectorAll('[data-event-tab]').forEach(button => {
    const isActive = button.dataset.eventTab === activeTab;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  document.querySelectorAll('[data-event-panel]').forEach(panel => {
    const shouldBeActive = panel.dataset.eventPanel === activeTab;
    if (shouldBeActive) {
      panel.classList.remove('is-leaving');
      panel.classList.add('is-active');
      return;
    }

    if (panel.classList.contains('is-active')) {
      panel.classList.add('is-leaving');
      panel.classList.remove('is-active');
      window.setTimeout(() => panel.classList.remove('is-leaving'), 210);
    } else {
      panel.classList.remove('is-leaving');
    }
  });

  bindTiltCards();
}

function bindEventTabs() {
  document.querySelectorAll('[data-event-tab]').forEach(button => {
    if (button.dataset.ready) return;
    button.dataset.ready = 'true';
    button.addEventListener('click', () => showEventTab(button.dataset.eventTab));
  });
}

function updateEventView() {
  syncUltraRareState();
  const state = getEventState();
  applyCollectionCompleteBonus(state);
  const collectedNames = getCollectedNames(state);
  const inventoryUltraRareCount = getInventoryCountByRarity(state, 'ultraRare');
  const progress = document.getElementById('ur-progress');
  const packRemaining = document.getElementById('pack-remaining');
  const packBoard = document.getElementById('pack-board');
  const gachaButton = document.getElementById('gacha-button');
  const collection = document.getElementById('ultra-collection');
  const collectionProgress = document.getElementById('collection-progress');
  const overallProgressText = document.getElementById('overall-progress-text');
  const overallProgressBar = document.getElementById('overall-progress-bar');

  if (progress) {
    progress.textContent = `${Math.min(inventoryUltraRareCount, ULTRA_RARE_TARGET)} / ${ULTRA_RARE_TARGET}`;
  }

  if (packRemaining) {
    const cooldownRemaining = getCooldownRemaining(state);
    packRemaining.textContent = cooldownRemaining > 0 && state.packRemaining <= 0
      ? `Cooldown ${formatCooldown(cooldownRemaining)}`
      : state.packRemaining > 0
      ? `Tap kartu untuk ambil - ${state.packRemaining}/${CARDS_PER_PACK} tersisa`
      : state.activePack
        ? `Tap pack #${state.activePack} untuk buka`
        : 'Pilih salah satu dari 10 pack';
  }

  if (packBoard) {
    packBoard.innerHTML = renderPackBoard(state);
    bindPackBoard();
  }

  if (gachaButton && gachaButton.dataset.busy !== 'true') {
    const cooldownRemaining = getCooldownRemaining(state);
    const cooldownActive = cooldownRemaining > 0 && state.packRemaining <= 0;
    gachaButton.disabled = cooldownActive;
    gachaButton.textContent = cooldownActive
      ? `Cooldown ${formatCooldown(cooldownRemaining)}`
      : state.packRemaining > 0
        ? `Ambil Kartu (${state.packRemaining}/${CARDS_PER_PACK})`
        : state.activePack ? `Buka Pack #${state.activePack}` : 'Pilih Pack';
  }

  if (collection) {
    collection.innerHTML = renderCollectionAlbum(collectedNames, state);
    bindTiltCards(collection);
    bindCollectionPreview(collection);
  }

  if (collectionProgress) {
    collectionProgress.textContent = `${collectedNames.length}/${gachaMembers.length} cards`;
  }

  if (overallProgressText) {
    overallProgressText.textContent = `${collectedNames.length}/${gachaMembers.length} cards`;
  }

  if (overallProgressBar) {
    overallProgressBar.style.width = `${Math.round((collectedNames.length / gachaMembers.length) * 100)}%`;
  }

  renderExchangePanel(state);
}

function renderExchangePanel(state) {
  const inventorySummary = document.getElementById('inventory-summary');
  const pointBalance = document.getElementById('jkt-point-balance');
  const pmRewardSelect = document.getElementById('pm-reward-select');
  const exchangeRandomPmButton = document.getElementById('exchange-random-pm-button');
  const exchangeChoicePmButton = document.getElementById('exchange-choice-pm-button');
  const sellCardsButton = document.getElementById('sell-cards-button');
  const voucherShop = document.getElementById('voucher-shop');
  const voucherList = document.getElementById('voucher-list');
  const rewardPanel = document.getElementById('reward-panel');
  const rewardMember = document.getElementById('reward-member');
  const rewardLink = document.getElementById('reward-link');

  const ultraCount = getInventoryCountByRarity(state, 'ultraRare');
  const nonUltraCount = ['common', 'uncommon', 'rare']
    .reduce((total, rarity) => total + getInventoryCountByRarity(state, rarity), 0);

  if (pointBalance) pointBalance.textContent = `${state.jktPoints || 0} JP`;

  if (inventorySummary) {
    inventorySummary.innerHTML = ['ultraRare', 'rare', 'uncommon', 'common'].map(rarity => `
      <div>
        <span>${rarityConfig[rarity].rank}</span>
        <strong>${getInventoryCountByRarity(state, rarity)}</strong>
      </div>
    `).join('') + `
      <div class="collection-bonus ${state.collectionCompleteBonusClaimed ? 'is-claimed' : ''}">
        <span>Bonus Koleksi</span>
        <strong>${state.collectionCompleteBonusClaimed ? 'Claimed' : `+${COLLECTION_COMPLETE_BONUS} JP`}</strong>
      </div>
    `;
  }

  if (pmRewardSelect) {
    pmRewardSelect.innerHTML = FREE_PM_REWARDS
      .map(reward => `<option value="${reward.name}">PM ${reward.name}</option>`)
      .join('');
  }

  if (exchangeRandomPmButton) {
    const enoughRandom = ultraCount >= RANDOM_PM_ULTRA_RARE_COST && state.jktPoints >= RANDOM_PM_POINT_COST;
    exchangeRandomPmButton.disabled = !enoughRandom;
    exchangeRandomPmButton.textContent = enoughRandom
      ? 'Tukar PM Random'
      : `Butuh ${Math.max(RANDOM_PM_ULTRA_RARE_COST - ultraCount, 0)} UR + ${Math.max(RANDOM_PM_POINT_COST - state.jktPoints, 0)} JP`;
  }

  if (exchangeChoicePmButton) {
    const enoughChoice = ultraCount >= CHOICE_PM_ULTRA_RARE_COST && state.jktPoints >= CHOICE_PM_POINT_COST;
    exchangeChoicePmButton.disabled = !enoughChoice;
    exchangeChoicePmButton.textContent = enoughChoice
      ? 'Tukar PM Pilihan'
      : `Butuh ${Math.max(CHOICE_PM_ULTRA_RARE_COST - ultraCount, 0)} UR + ${Math.max(CHOICE_PM_POINT_COST - state.jktPoints, 0)} JP`;
  }

  if (sellCardsButton) {
    sellCardsButton.disabled = nonUltraCount <= 0;
    sellCardsButton.textContent = nonUltraCount > 0
      ? `Jual ${nonUltraCount} Kartu Non-UR`
      : 'Tidak Ada Kartu Non-UR';
  }

  if (voucherShop) {
    voucherShop.innerHTML = VOUCHER_SHOP.map(voucher => `
      <button class="voucher-button" data-voucher-id="${voucher.id}" type="button" ${state.jktPoints < voucher.cost ? 'disabled' : ''}>
        <span>${voucher.name}</span>
        <strong>${voucher.cost} JP</strong>
      </button>
    `).join('');
    bindVoucherShop();
  }

  if (voucherList) {
    voucherList.innerHTML = state.vouchers.length
      ? state.vouchers.map(voucher => `<span>${voucher.name} - ${voucher.code || voucher.id}</span>`).join('')
      : '<small>Belum ada voucher. Jual kartu dulu untuk kumpulkan JKT Point.</small>';
  }

  if (rewardPanel && rewardMember && rewardLink) {
    const latestReward = state.rewardHistory[0];
    rewardPanel.hidden = !latestReward;
    if (latestReward) {
      rewardMember.textContent = `Reward terakhir: PM ${latestReward.name}`;
      rewardLink.href = latestReward.url;
      rewardLink.textContent = `Buka PM ${latestReward.name}`;
    }
  }
}

function exchangePmReward(mode = 'random') {
  const state = getEventState();
  const ultraCount = getInventoryCountByRarity(state, 'ultraRare');
  const isChoice = mode === 'choice';
  const ultraCost = isChoice ? CHOICE_PM_ULTRA_RARE_COST : RANDOM_PM_ULTRA_RARE_COST;
  const pointCost = isChoice ? CHOICE_PM_POINT_COST : RANDOM_PM_POINT_COST;

  if (ultraCount < ultraCost || state.jktPoints < pointCost) {
    if (window.toast) {
      window.toast.info(`Syarat belum cukup: butuh ${Math.max(ultraCost - ultraCount, 0)} UR dan ${Math.max(pointCost - state.jktPoints, 0)} JP lagi.`, 2600);
    }
    return;
  }

  const select = document.getElementById('pm-reward-select');
  const selectedReward = isChoice && select?.value
    ? FREE_PM_REWARDS.find(reward => reward.name === select.value)
    : null;
  const reward = selectedReward || FREE_PM_REWARDS[Math.floor(Math.random() * FREE_PM_REWARDS.length)];

  removeCardsFromInventoryByRarity(state, 'ultraRare', ultraCost);
  state.jktPoints -= pointCost;
  state.rewardMember = reward.name;
  state.rewardUrl = reward.url;
  state.rewardHistory.unshift({
    name: reward.name,
    url: reward.url,
    date: new Date().toISOString(),
    mode: isChoice ? 'chosen' : 'random',
    ultraCost,
    pointCost
  });
  state.rewardHistory = state.rewardHistory.slice(0, 10);
  saveEventState(state);
  updateEventView();

  if (window.toast) {
    window.toast.success(isChoice ? `PM ${reward.name} berhasil dipilih.` : `PM random terbuka: ${reward.name}.`, 2600);
  }
}

function sellNonUltraCards() {
  const state = getEventState();
  let earnedPoints = 0;
  let soldCards = 0;

  getInventoryEntries(state).forEach(entry => {
    if (entry.member.rarity === 'ultraRare') return;
    earnedPoints += (CARD_POINT_VALUES[entry.member.rarity] || 0) * entry.count;
    soldCards += entry.count;
    delete state.inventory[entry.name];
  });

  if (soldCards <= 0) {
    if (window.toast) window.toast.info('Belum ada kartu non-UR di inventori.', 1800);
    return;
  }

  state.jktPoints += earnedPoints;
  saveEventState(state);
  updateEventView();
  if (window.toast) window.toast.success(`${soldCards} kartu dijual menjadi ${earnedPoints} JKT Point.`, 2400);
}

function buyVoucher(voucherId) {
  const voucher = VOUCHER_SHOP.find(item => item.id === voucherId);
  if (!voucher) return;

  const state = getEventState();
  if (state.jktPoints < voucher.cost) {
    if (window.toast) window.toast.info('JKT Point belum cukup untuk voucher ini.', 1800);
    return;
  }

  state.jktPoints -= voucher.cost;
  state.vouchers.unshift({
    ...voucher,
    code: `${voucher.id}-${Date.now().toString(36).toUpperCase()}`
  });
  saveEventState(state);
  updateEventView();
  if (window.toast) window.toast.success(`${voucher.name} berhasil dibeli.`, 2200);
}

function bindVoucherShop() {
  document.querySelectorAll('[data-voucher-id]').forEach(button => {
    if (button.dataset.ready) return;
    button.dataset.ready = 'true';
    button.addEventListener('click', () => buyVoucher(button.dataset.voucherId));
  });
}

function getEventTickerNames() {
  const names = [
    'User23',
    'User1',
    'User4',
    'User5',
    'Andri',
    'Meldan Kece',
    'Anggi Kiut',
    'Rehan Punya Lily',
    'Rakha',
    'Rikynya Oline',
    'Farhan',
    'Kamunanya',
    'Ikynya Delyn',
    'Rehanmanuel',
    'Devi Gablie',
    'Gk Tau',
    'Umaedi',
    'Reva',
    'Naufal',
    'Raka'
  ];
  const currentName = window.getUmadigiUserName?.();
  if (currentName && !names.some(name => name.toLowerCase() === currentName.toLowerCase())) {
    names.unshift(currentName);
  }
  return names;
}

window.renderEventLiveTicker = function renderEventLiveTicker() {
  const ticker = document.getElementById('event-live-track');
  if (!ticker) return;

  const names = getEventTickerNames();
  const members = [
    ['Oline Manuel', 'Uncommon'],
    ['Catherina Vallencia', 'Rare'],
    ['Lily', 'Ultra Rare'],
    ['Delyn', 'Common'],
    ['Feni Fitriyanti', 'Rare'],
    ['Erine', 'Ultra Rare'],
    ['Greesella', 'Uncommon'],
    ['Kimy', 'Rare']
  ];
  const actions = [
    index => `${names[index % names.length]} mendapatkan kartu ${members[index % members.length][0]} ${members[index % members.length][1]}`,
    index => `${names[index % names.length]} menukar JP ke voucher diskon`,
    index => `${names[index % names.length]} membuka pack JKT48 PM`,
    index => `${names[index % names.length]} menukar 5 UR untuk PM random`,
    index => `${names[index % names.length]} membeli Voucher PM Member Hemat`
  ];
  const items = Array.from({ length: 18 }, (_, index) => `<span>${actions[index % actions.length](index)}</span>`);
  ticker.innerHTML = [...items, ...items].join('');
};

function renderCollectionAlbum(collectedNames, state) {
  const rarityOrder = ['ultraRare', 'rare', 'uncommon', 'common'];
  return rarityOrder.map(rarity => {
    const items = gachaMembers
      .filter(member => member.rarity === rarity)
      .sort((a, b) => a.name.localeCompare(b.name));

    const ownedCount = items.filter(member => collectedNames.includes(member.name)).length;

    return `
      <div class="collection-rarity-group">
        <div class="rarity-title">
          <span class="rarity-dot rarity-${rarity}"></span>
          <strong>${rarityConfig[rarity].rank}</strong>
          <em>${ownedCount}/${items.length} collected</em>
        </div>
        <div class="collection-grid">
          ${items.map(member => renderCollectionCard(member, collectedNames.includes(member.name), getInventoryCount(state, member.name))).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function renderPackBoard(state) {
  const cooldownActive = isPackCooldownActive(state);
  return Array.from({ length: TOTAL_PACK_CHOICES }, (_, index) => {
    const packNumber = index + 1;
    const opened = state.openedPacks.includes(packNumber);
    const active = state.activePack === packNumber && state.packRemaining > 0;
    const selected = state.activePack === packNumber && state.packRemaining <= 0;
    const locked = cooldownActive || state.packRemaining > 0 || opened;
    const label = opened ? 'Opened' : active ? `${state.packRemaining}/5` : selected ? 'Ready' : 'Tap';
    return `
      <button class="pack-slot ${opened ? 'is-opened' : ''} ${active ? 'is-active' : ''} ${selected ? 'is-selected' : ''}" data-pack="${packNumber}" ${locked ? 'disabled' : ''}>
        <span>Pack ${packNumber}</span>
        <strong>${label}</strong>
      </button>
    `;
  }).join('');
}

function selectPack(packNumber) {
  const state = getEventState();
  if (isPackCooldownActive(state) || state.packRemaining > 0 || state.openedPacks.includes(packNumber)) return;

  state.activePack = packNumber;
  saveEventState(state);
  renderPackIdle();
  updateEventView();
}

function bindPackBoard() {
  document.querySelectorAll('.pack-slot:not([disabled])').forEach(button => {
    if (button.dataset.ready) return;
    button.dataset.ready = 'true';
    button.addEventListener('click', () => {
      selectPack(Number(button.dataset.pack));
    });
  });
}

function renderCollectionCard(member, isOwned, inventoryCount = 0) {
  const config = rarityConfig[member.rarity];
  if (!isOwned) {
    return `
      <article class="collection-card collection-card-locked">
        <div class="locked-question">?</div>
        <span>???</span>
      </article>
    `;
  }

  return `
    <article class="collection-card card-${member.rarity} tilt-card ${inventoryCount > 0 ? 'has-stock' : 'is-archive-only'}" data-preview-card="true" data-card-name="${member.name}">
      ${inventoryCount > 0 ? `<span class="inventory-bubble">${inventoryCount}</span>` : ''}
      ${member.rarity === 'ultraRare' ? '<span class="ur-crown mini-crown" aria-hidden="true">&#9819;</span>' : ''}
      <span class="mini-rank">${config.rank}</span>
      <div class="collection-photo">
        <img class="member-photo" src="${member.image}" alt="${member.name}" onerror="this.src='${member.fallbackImage}'">
        ${member.rarity === 'ultraRare' ? '' : `<img class="member-frame" src="${JKT48_MEMBER_FRAME}" alt="" aria-hidden="true">`}
      </div>
      <strong>${member.name}</strong>
      <small>${config.level} Card</small>
    </article>
  `;
}

function openCollectionPreview(cardElement) {
  const cardName = cardElement.dataset.cardName;
  const member = gachaMembers.find(item => item.name === cardName);
  if (!member) return;

  closeCollectionPreview();

  const overlay = document.createElement('div');
  overlay.className = 'card-preview-overlay';
  overlay.innerHTML = `
    <div class="card-preview-stage">
      <button class="card-preview-close" type="button" aria-label="Tutup preview kartu">&times;</button>
      ${renderCard(member)}
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.classList.add('card-preview-open');
  bindTiltCards(overlay);

  overlay.addEventListener('click', event => {
    if (event.target === overlay || event.target.closest('.card-preview-close')) {
      closeCollectionPreview();
    }
  });
}

function closeCollectionPreview() {
  document.querySelector('.card-preview-overlay')?.remove();
  document.body.classList.remove('card-preview-open');
}

function bindCollectionPreview(scope = document) {
  scope.querySelectorAll('[data-preview-card="true"]').forEach(card => {
    if (card.dataset.previewReady) return;
    card.dataset.previewReady = 'true';
    card.addEventListener('click', event => {
      event.stopPropagation();
      openCollectionPreview(card);
    });
  });
}

function openPackAnimation() {
  const result = document.getElementById('gacha-result');
  if (!result) return;

  result.innerHTML = `
    <div class="gacha-pack is-opening">
      <div class="pack-tear"></div>
      <div class="pack-shred shred-1"></div>
      <div class="pack-shred shred-2"></div>
      <div class="pack-shred shred-3"></div>
      <div class="pack-grip pack-grip-left"></div>
      <div class="pack-grip pack-grip-right"></div>
      <div class="pack-plastic-glare"></div>
      <div class="pack-card-stack stack-1"></div>
      <div class="pack-card-stack stack-2"></div>
      <div class="pack-top"></div>
      <div class="pack-body">
        <span>OPENING</span>
        <strong>JKT48 PM PACK</strong>
        <small>5 cards inside</small>
      </div>
    </div>
  `;
}

function playTearSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const context = new AudioContext();
    const duration = 0.42;
    const buffer = context.createBuffer(1, context.sampleRate * duration, context.sampleRate);
    const channel = buffer.getChannelData(0);

    for (let index = 0; index < channel.length; index += 1) {
      const progress = index / channel.length;
      const roughNoise = (Math.random() * 2 - 1) * (1 - progress);
      const crackle = Math.sin(index * 0.34) * 0.16 * (1 - progress);
      channel[index] = (roughNoise + crackle) * 0.48;
    }

    const noise = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();

    noise.buffer = buffer;
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(900, context.currentTime);
    filter.frequency.exponentialRampToValueAtTime(3600, context.currentTime + duration);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.42, context.currentTime + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    noise.start();
    noise.stop(context.currentTime + duration);
    setTimeout(() => context.close(), 700);
  } catch (error) {
    // Sound is optional; the gacha still works if the browser blocks audio.
  }
}

function createAudioContext() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  return AudioContext ? new AudioContext() : null;
}

function playCardSlideSound() {
  try {
    const context = createAudioContext();
    if (!context) return;
    const duration = 0.22;
    const buffer = context.createBuffer(1, context.sampleRate * duration, context.sampleRate);
    const channel = buffer.getChannelData(0);

    for (let index = 0; index < channel.length; index += 1) {
      const progress = index / channel.length;
      const paper = (Math.random() * 2 - 1) * Math.sin(progress * Math.PI) * 0.34;
      channel[index] = paper;
    }

    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1500, context.currentTime);
    filter.Q.setValueAtTime(0.75, context.currentTime);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.16, context.currentTime + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    source.start();
    source.stop(context.currentTime + duration);
    setTimeout(() => context.close(), 420);
  } catch (error) {
    // Audio is optional.
  }
}

function playNewCollectionSound() {
  try {
    const context = createAudioContext();
    if (!context) return;
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.42);
    gain.connect(context.destination);
    [880, 1174, 1568].forEach((frequency, index) => {
      const osc = context.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, context.currentTime + index * 0.07);
      osc.connect(gain);
      osc.start(context.currentTime + index * 0.07);
      osc.stop(context.currentTime + 0.28 + index * 0.06);
    });
    setTimeout(() => context.close(), 620);
  } catch (error) {
    // Audio is optional.
  }
}

function playUltraRareSound() {
  try {
    const context = createAudioContext();
    if (!context) return;
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.16, context.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.75);
    gain.connect(context.destination);
    [523, 784, 1046, 1568].forEach((frequency, index) => {
      const osc = context.createOscillator();
      osc.type = index === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(frequency, context.currentTime + index * 0.08);
      osc.connect(gain);
      osc.start(context.currentTime + index * 0.08);
      osc.stop(context.currentTime + 0.42 + index * 0.08);
    });
    setTimeout(() => context.close(), 900);
  } catch (error) {
    // Audio is optional.
  }
}

function showCardSparkles(isUltraRare = false) {
  const result = document.getElementById('gacha-result');
  if (!result) return;
  const sparkle = document.createElement('div');
  sparkle.className = `card-sparkle-burst ${isUltraRare ? 'is-ultra' : ''}`;
  sparkle.innerHTML = Array.from({ length: isUltraRare ? 18 : 10 }, (_, index) => `<i style="--i:${index}"></i>`).join('');
  result.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 1100);
}

function runGacha() {
  const button = document.getElementById('gacha-button');
  const result = document.getElementById('gacha-result');
  if (!result || !button) return;

  const state = getEventState();
  const cooldownRemaining = getCooldownRemaining(state);
  if (cooldownRemaining > 0 && state.packRemaining <= 0) {
    if (window.toast) window.toast.info(`Cooldown aktif. Tunggu ${formatCooldown(cooldownRemaining)} lagi.`, 2400);
    renderPackIdle();
    updateEventView();
    return;
  }

  button.disabled = true;
  button.dataset.busy = 'true';
  result.classList.add('is-rolling');
  const openingNewPack = state.packRemaining <= 0;

  if (openingNewPack) {
    if (!state.activePack) {
      result.classList.remove('is-rolling');
      button.disabled = false;
      button.dataset.busy = 'false';
      if (window.toast) window.toast.info('Pilih salah satu pack dulu.', 1800);
      return;
    }

    if (state.openedPacks.length >= PACKS_BEFORE_COOLDOWN) {
      state.cooldownUntil = Date.now() + PACK_COOLDOWN_MS;
      state.openedPacks = [];
      state.activePack = null;
      saveEventState(state);
      result.classList.remove('is-rolling');
      button.disabled = false;
      button.dataset.busy = 'false';
      renderPackIdle();
      updateEventView();
      if (window.toast) window.toast.info('Cooldown aktif 1 jam setelah 10 pack.', 2600);
      return;
    }

    state.packRemaining = CARDS_PER_PACK;
    state.packNumber = state.openedPacks.length + 1;
    if (!state.openedPacks.includes(state.activePack)) state.openedPacks.push(state.activePack);
    state.cooldownUntil = 0;
    saveEventState(state);
    playTearSound();
    openPackAnimation();
  }

  setTimeout(() => {
    const item = pickGachaItem();
    const nextState = getEventState();
    nextState.last = item;
    nextState.totalPulls += 1;
    nextState.packRemaining = Math.max((nextState.packRemaining || CARDS_PER_PACK) - 1, 0);
    const isNewCollectionCard = addCardToCollection(nextState, item);
    addCardToInventory(nextState, item);

    if (item.rarity === 'ultraRare' && !nextState.ultraRare.includes(item.name)) {
      nextState.ultraRare.push(item.name);
      if (window.toast) window.toast.success(`Ultra Rare didapat: ${item.name}`, 2400);
    } else if (window.toast) {
      window.toast.info(`Kamu mendapatkan ${item.rank}: ${item.name}`, 1800);
    }
    if (window.showLiveActivity) {
      window.showLiveActivity(`${window.getUmadigiUserName?.() || 'User'} mendapatkan kartu ${item.name} ${item.rank}`, { priority: true });
    }

    saveEventState(nextState);
    playCardSlideSound();
    renderResult(item);
    if (isNewCollectionCard) {
      showCardSparkles(item.rarity === 'ultraRare');
      if (item.rarity === 'ultraRare') {
        playUltraRareSound();
      } else {
        playNewCollectionSound();
      }
    } else if (item.rarity === 'ultraRare') {
      playUltraRareSound();
      showCardSparkles(true);
    }
    updateEventView();
    result.classList.remove('is-rolling');
    button.disabled = false;
    button.dataset.busy = 'false';

    if (nextState.packRemaining <= 0) {
      nextState.activePack = null;

      if ((nextState.openedPacks || []).length >= PACKS_BEFORE_COOLDOWN) {
        nextState.cooldownUntil = Date.now() + PACK_COOLDOWN_MS;
        nextState.packNumber = 0;
        nextState.openedPacks = [];
      }

      saveEventState(nextState);

      setTimeout(() => {
        renderPackIdle();
        updateEventView();
        const cooldown = getCooldownRemaining();
        if (window.toast) {
          window.toast.info(
            cooldown > 0 ? `Cooldown aktif 1 jam. Tunggu ${formatCooldown(cooldown)}.` : 'Pack habis. Pack baru sudah siap dibuka.',
            2200
          );
        }
      }, 1500);
    }
  }, openingNewPack ? 1040 : 280);
}

function backupEventData() {
  const field = document.getElementById('gacha-backup-data');
  const data = btoa(unescape(encodeURIComponent(JSON.stringify(getEventState()))));
  if (field) {
    field.value = data;
    field.select();
  }
  if (window.toast) window.toast.success('Data event berhasil dibuat. Simpan kode backup ini.', 2400);
}

function bindTiltCards(scope = document) {
  scope.querySelectorAll('.tilt-card').forEach(card => {
    if (card.dataset.tiltReady) return;
    card.dataset.tiltReady = 'true';

    const updateTilt = event => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) - 0.5;
      const y = ((event.clientY - rect.top) / rect.height) - 0.5;
      const tiltScale = card.classList.contains('collection-card') ? 7 : 10;
      card.style.setProperty('--tilt-x', `${(-y * tiltScale).toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${(x * tiltScale).toFixed(2)}deg`);
      card.style.setProperty('--shine-x', `${Math.round(event.clientX - rect.left)}px`);
      card.style.setProperty('--shine-y', `${Math.round(event.clientY - rect.top)}px`);
      card.classList.add('is-tilting');
    };

    card.addEventListener('pointerenter', updateTilt);
    card.addEventListener('pointermove', updateTilt);
    card.addEventListener('pointerleave', () => {
      card.classList.remove('is-tilting');
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
      card.style.removeProperty('--shine-x');
      card.style.removeProperty('--shine-y');
    });
    card.addEventListener('pointerdown', updateTilt);
  });
}

function restoreEventData() {
  const field = document.getElementById('gacha-backup-data');
  const rawData = field?.value.trim();
  if (!rawData) {
    if (window.toast) window.toast.info('Tempel data backup dulu untuk restore.', 2200);
    return;
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(escape(atob(rawData))));
    const state = normalizeState(parsed);
    saveEventState(state);
    if (state.last && state.packRemaining > 0) {
      renderResult(state.last);
    } else {
      renderPackIdle();
    }
    updateEventView();
    bindTapGachaArea();
    if (window.toast) window.toast.success('Data event berhasil direstore.', 2200);
  } catch (error) {
    if (window.toast) {
      window.toast.info('Data backup tidak valid. Cek lagi kode yang ditempel.', 2600);
    } else {
      alert('Data backup tidak valid.');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const gachaButton = document.getElementById('gacha-button');
  const backupButton = document.getElementById('gacha-backup');
  const restoreButton = document.getElementById('gacha-restore');
  const exchangeRandomPmButton = document.getElementById('exchange-random-pm-button');
  const exchangeChoicePmButton = document.getElementById('exchange-choice-pm-button');
  const sellCardsButton = document.getElementById('sell-cards-button');
  const rewardLink = document.getElementById('reward-link');
  const state = getEventState();

  if (state.last && state.packRemaining > 0) {
    renderResult(state.last);
  } else {
    renderPackIdle();
  }

  updateEventView();
  window.renderEventLiveTicker?.();
  bindTiltCards();
  bindTapGachaArea();
  bindEventTabs();
  showEventTab(localStorage.getItem('umadigi_gacha_active_tab') || 'gacha');
  setInterval(() => {
    if (isPackCooldownActive()) {
      renderPackIdle();
      updateEventView();
    }
  }, 1000);

  loadSpecialUltraRareImages().then(() => {
    gachaCatalogReady = true;
    updateEventView();
    bindTiltCards();
  });

  gachaButton?.addEventListener('click', runGacha);
  backupButton?.addEventListener('click', backupEventData);
  restoreButton?.addEventListener('click', restoreEventData);
  exchangeRandomPmButton?.addEventListener('click', () => exchangePmReward('random'));
  exchangeChoicePmButton?.addEventListener('click', () => exchangePmReward('choice'));
  sellCardsButton?.addEventListener('click', sellNonUltraCards);
  rewardLink?.addEventListener('click', () => {
    if (window.toast) window.toast.success('Membuka channel PM gratis kamu.', 1800);
  });
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeCollectionPreview();
});
