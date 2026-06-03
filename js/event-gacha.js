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
const CARDS_PER_PACK = 5;
const PACKS_BEFORE_COOLDOWN = 50;
const PACK_COOLDOWN_MS = 60 * 60 * 1000;
const EVENT_STORAGE_KEY = 'umadigi_gacha_event';
const JKT48_MEMBER_FRAME = 'https://jkt48.com/images/member/bg-member-item-frame-transparent.png';
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

function createDefaultState() {
  return {
    ultraRare: [],
    collection: [],
    last: null,
    rewardMember: null,
    rewardUrl: null,
    totalPulls: 0,
    packRemaining: 0,
    packNumber: 0,
    cooldownUntil: 0
  };
}

function normalizeState(state) {
  const fallback = createDefaultState();
  return {
    ...fallback,
    ...state,
    ultraRare: Array.isArray(state?.ultraRare) ? state.ultraRare : [],
    collection: Array.isArray(state?.collection) ? state.collection : []
  };
}

function getCollectedNames(state) {
  return [...new Set((state.collection || []).map(item => item.name).filter(Boolean))];
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
  const rarity = pickRarity();
  const members = gachaMembers.filter(member => member.rarity === rarity);
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
        <span>${cooldownRemaining > 0 ? 'COOLDOWN' : `PACK #${(state.packNumber || 0) + 1}`}</span>
        <strong>${cooldownRemaining > 0 ? 'TUNGGU SEBENTAR' : 'JKT48 PM PACK'}</strong>
        <small>${cooldownRemaining > 0 ? formatCooldown(cooldownRemaining) : 'Tap untuk buka'}</small>
      </div>
    </div>
  `;
}

function renderCard(item) {
  const safeItem = normalizeGachaItem(item);
  return `
    <article class="gacha-card card-${safeItem.rarity} tilt-card">
      <div class="card-shine"></div>
      ${safeItem.rarity === 'ultraRare' ? '<span class="ur-crown" aria-hidden="true">♛</span>' : ''}
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

function updateEventView() {
  syncUltraRareState();
  const state = getEventState();
  const uniqueUltraRare = [...new Set(state.ultraRare)];
  const collectedNames = getCollectedNames(state);
  const progress = document.getElementById('ur-progress');
  const packRemaining = document.getElementById('pack-remaining');
  const gachaButton = document.getElementById('gacha-button');
  const collection = document.getElementById('ultra-collection');
  const collectionProgress = document.getElementById('collection-progress');
  const overallProgressText = document.getElementById('overall-progress-text');
  const overallProgressBar = document.getElementById('overall-progress-bar');
  const rewardPanel = document.getElementById('reward-panel');
  const rewardMember = document.getElementById('reward-member');
  const rewardLink = document.getElementById('reward-link');

  if (progress) {
    progress.textContent = `${Math.min(uniqueUltraRare.length, ULTRA_RARE_TARGET)} / ${ULTRA_RARE_TARGET}`;
  }

  if (packRemaining) {
    const cooldownRemaining = getCooldownRemaining(state);
    packRemaining.textContent = cooldownRemaining > 0 && state.packRemaining <= 0
      ? `Cooldown ${formatCooldown(cooldownRemaining)}`
      : state.packRemaining > 0
      ? `Tap kartu untuk ambil - ${state.packRemaining}/${CARDS_PER_PACK} tersisa`
      : 'Tap pack untuk buka';
  }

  if (gachaButton && !gachaButton.disabled) {
    const cooldownRemaining = getCooldownRemaining(state);
    const cooldownActive = cooldownRemaining > 0 && state.packRemaining <= 0;
    gachaButton.disabled = cooldownActive;
    gachaButton.textContent = cooldownActive
      ? `Cooldown ${formatCooldown(cooldownRemaining)}`
      : state.packRemaining > 0
        ? `Ambil Kartu (${state.packRemaining}/${CARDS_PER_PACK})`
        : 'Buka Pack Baru';
  }

  if (collection) {
    collection.innerHTML = renderCollectionAlbum(collectedNames);
    bindTiltCards(collection);
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

  if (rewardPanel && rewardMember && rewardLink) {
    const unlocked = uniqueUltraRare.length >= ULTRA_RARE_TARGET;
    rewardPanel.hidden = !unlocked;
    if (unlocked) {
      if (!state.rewardMember || !state.rewardUrl) {
        const reward = FREE_PM_REWARDS[Math.floor(Math.random() * FREE_PM_REWARDS.length)];
        state.rewardMember = reward.name;
        state.rewardUrl = reward.url;
        saveEventState(state);
      }

      rewardMember.textContent = `Selamat! Kamu membuka akses PM gratis random: PM ${state.rewardMember}. Masuk ke channel reward dan simpan linknya baik-baik.`;
      rewardLink.href = state.rewardUrl;
      rewardLink.textContent = `Buka PM ${state.rewardMember}`;
    }
  }
}

function renderCollectionAlbum(collectedNames) {
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
          ${items.map(member => renderCollectionCard(member, collectedNames.includes(member.name))).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function renderCollectionCard(member, isOwned) {
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
    <article class="collection-card card-${member.rarity} tilt-card">
      ${member.rarity === 'ultraRare' ? '<span class="ur-crown mini-crown" aria-hidden="true">♛</span>' : ''}
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
  result.classList.add('is-rolling');
  const openingNewPack = state.packRemaining <= 0;

  if (openingNewPack) {
    if ((state.packNumber || 0) >= PACKS_BEFORE_COOLDOWN) {
      state.cooldownUntil = Date.now() + PACK_COOLDOWN_MS;
      state.packNumber = 0;
      saveEventState(state);
      result.classList.remove('is-rolling');
      button.disabled = false;
      renderPackIdle();
      updateEventView();
      if (window.toast) window.toast.info('Cooldown aktif 1 jam setelah 50 pack.', 2600);
      return;
    }

    state.packRemaining = CARDS_PER_PACK;
    state.packNumber = (state.packNumber || 0) + 1;
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
    nextState.collection.unshift(item);
    nextState.collection = nextState.collection.slice(0, 80);

    if (item.rarity === 'ultraRare' && !nextState.ultraRare.includes(item.name)) {
      nextState.ultraRare.push(item.name);
      if (window.toast) window.toast.success(`Ultra Rare didapat: ${item.name}`, 2400);
    } else if (window.toast) {
      window.toast.info(`Kamu mendapatkan ${item.rank}: ${item.name}`, 1800);
    }

    saveEventState(nextState);
    renderResult(item);
    updateEventView();
    result.classList.remove('is-rolling');
    button.disabled = false;

    if (nextState.packRemaining <= 0) {
      if ((nextState.packNumber || 0) >= PACKS_BEFORE_COOLDOWN) {
        nextState.cooldownUntil = Date.now() + PACK_COOLDOWN_MS;
        nextState.packNumber = 0;
        saveEventState(nextState);
      }

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
      card.style.setProperty('--tilt-x', `${(-y * 16).toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${(x * 18).toFixed(2)}deg`);
      card.style.setProperty('--shine-x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--shine-y', `${event.clientY - rect.top}px`);
      card.classList.add('is-tilting');
    };

    card.addEventListener('pointermove', updateTilt);
    card.addEventListener('pointerleave', () => {
      card.classList.remove('is-tilting');
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
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
  const rewardLink = document.getElementById('reward-link');
  const state = getEventState();

  if (state.last && state.packRemaining > 0) {
    renderResult(state.last);
  } else {
    renderPackIdle();
  }

  updateEventView();
  bindTiltCards();
  bindTapGachaArea();
  setInterval(() => {
    if (isPackCooldownActive()) {
      renderPackIdle();
      updateEventView();
    }
  }, 1000);

  loadSpecialUltraRareImages().then(() => {
    updateEventView();
    bindTiltCards();
  });

  gachaButton?.addEventListener('click', runGacha);
  backupButton?.addEventListener('click', backupEventData);
  restoreButton?.addEventListener('click', restoreEventData);
  rewardLink?.addEventListener('click', () => {
    if (window.toast) window.toast.success('Membuka channel PM gratis kamu.', 1800);
  });
});
