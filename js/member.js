// member.js - UMADIGI STORE PM Member JKT48 catalog

const PM_PRICE = 8000;
const PM_ADMIN_FEE = 3000;
const JKT48_PROFILE_BASE = 'https://jkt48.com/profile/';
const JKT48_MEMBER_FRAME = 'https://jkt48.com/images/member/bg-member-item-frame-transparent.png';
const OWNER_OSHI_IMAGE = '../assets/img/member/owner-catherina-vallencia.png';

const nicknameMap = {
  'Afera Thalia': 'Fera',
  'Carissa Dini': 'Carissa',
  'Christabella Bonita': 'Bella',
  'Fahira Putri': 'Fahira',
  'Fatimah Azzahra': 'Rara',
  'Heidi Suyangga': 'Heidi',
  'Maxine Faye': 'Maxine',
  'Putry Jazyta': 'Jazzy',
  'Ralyne Van Irwan': 'Ralyne',
  'Sona Kalyana': 'Sona'
};

const manualMemberImages = {
  'Afera Thalia': '../assets/img/member/afera-thalia.png',
  'Carissa Dini': '../assets/img/member/carissa-dini.png',
  'Christabella Bonita': '../assets/img/member/christabella-bonita.png',
  'Fahira Putri': '../assets/img/member/fahira-putri.png',
  'Fatimah Azzahra': '../assets/img/member/fatimah-azzahra.png',
  'Heidi Suyangga': '../assets/img/member/heidi-suyangga.png',
  'Maxine Faye': '../assets/img/member/maxine-faye.png',
  'Putry Jazyta': '../assets/img/member/putry-jazyta.png',
  'Ralyne Van Irwan': '../assets/img/member/ralyne-van-irwan.png',
  'Sona Kalyana': '../assets/img/member/sona-kalyana.png',
  'Abigail Rachel': '../assets/img/member/abigail-rachel.png',
  'Adeline Wijaya': '../assets/img/member/adeline-wijaya.png',
  'Alya Amanda': '../assets/img/member/alya-amanda.png',
  'Angelina Christy': '../assets/img/member/angelina-christy.png',
  'Anindya Ramadhani': '../assets/img/member/anindya-ramadhani.png',
  Aurellia: '../assets/img/member/aurellia.png',
  'Aurhel Alana': '../assets/img/member/aurhel-alana.png',
  'Catherina Vallencia': '../assets/img/member/catherina-vallencia.png',
  'Cathleen Nixie': '../assets/img/member/cathleen-nixie.png',
  'Celline Thefani': '../assets/img/member/celline-thefani.png',
  'Chelsea Davina': '../assets/img/member/chelsea-davina.png',
  'Cornelia Vanisa': '../assets/img/member/cornelia-vanisa.png',
  'Cynthia Yaputera': '../assets/img/member/cynthia-yaputera.png',
  'Dena Natalia': '../assets/img/member/dena-natalia.png',
  'Desy Natalia': '../assets/img/member/desy-natalia.png',
  'Febriola Sinambela': '../assets/img/member/febriola-sinambela.png',
  'Feni Fitriyanti': '../assets/img/member/feni-fitriyanti.png',
  'Fiony Alveria': '../assets/img/member/fiony-alveria.png',
  'Freya Jayawardana': '../assets/img/member/freya-jayawardana.png',
  'Fritzy Rosmerian': '../assets/img/member/fritzy-rosmerian.png',
  'Gabriela Abigail': '../assets/img/member/gabriela-abigail.png',
  'Gendis Mayrannisa': '../assets/img/member/gendis-mayrannisa.png',
  'Gita Sekar Andarini': '../assets/img/member/gita-sekar-andarini.png',
  'Grace Octaviani': '../assets/img/member/grace-octaviani.png',
  'Greesella Adhalia': '../assets/img/member/greesella-adhalia.png',
  'Helisma Putri': '../assets/img/member/helisma-putri.png',
  'Hillary Abigail': '../assets/img/member/hillary-abigail.png',
  'Indah Cahya': '../assets/img/member/indah-cahya.png',
  'Jazzlyn Trisha': '../assets/img/member/jazzlyn-trisha.png',
  'Jessica Chandra': '../assets/img/member/jessica-chandra.png',
  'Jesslyn Elly': '../assets/img/member/jesslyn-elly.png',
  'Kathrina Irene': '../assets/img/member/kathrina-irene.png',
  'Lulu Salsabila': '../assets/img/member/lulu-salsabila.png',
  'Marsha Lenathea': '../assets/img/member/marsha-lenathea.png',
  'Michelle Alexandra': '../assets/img/member/michelle-alexandra.png',
  'Michelle Levia': '../assets/img/member/michelle-levia.png',
  'Mutiara Azzahra': '../assets/img/member/mutiara-azzahra.png',
  'Nayla Suji': '../assets/img/member/nayla-suji.png',
  'Nina Tutachia': '../assets/img/member/nina-tutachia.png',
  'Oline Manuel': '../assets/img/member/oline-manuel.png',
  'Raisha Syifa': '../assets/img/member/raisha-syifa.png',
  'Ribka Budiman': '../assets/img/member/ribka-budiman.png',
  'Shabilqis Naila': '../assets/img/member/shabilqis-naila.png',
  'Victoria Kimberly': '../assets/img/member/victoria-kimberly.png',
  'Astrella Virgiananda': '../assets/img/member/astrella-virgiananda.png',
  'Aulia Riza': '../assets/img/member/aulia-riza.png',
  'Bong Aprilli': '../assets/img/member/bong-aprilli.png',
  'Hagia Sopia': '../assets/img/member/hagia-sopia.png',
  'Humaira Ramadhani': '../assets/img/member/humaira-ramadhani.png',
  'Jacqueline Immanuela': '../assets/img/member/jacqueline-immanuela.png',
  'Jemima Evodie': '../assets/img/member/jemima-evodie.png',
  'Mikaela Kusjanto': '../assets/img/member/mikaela-kusjanto.png',
  'Nur Intan': '../assets/img/member/nur-intan.png'
};

const teamLoveMembers = new Set([
  'Alya Amanda',
  'Anindya Ramadhani',
  'Aurellia',
  'Aurhel Alana',
  'Cathleen Nixie',
  'Celline Thefani',
  'Cynthia Yaputera',
  'Fiony Alveria',
  'Fritzy Rosmerian',
  'Grace Octaviani',
  'Hillary Abigail',
  'Indah Cahya',
  'Jazzlyn Trisha',
  'Michelle Alexandra',
  'Nayla Suji'
]);

const teamDreamMembers = new Set([
  'Adeline Wijaya',
  'Chelsea Davina',
  'Febriola Sinambela',
  'Freya Jayawardana',
  'Gabriela Abigail',
  'Gendis Mayrannisa',
  'Gita Sekar Andarini',
  'Greesella Adhalia',
  'Helisma Putri',
  'Jesslyn Elly',
  'Marsha Lenathea',
  'Nina Tutachia',
  'Oline Manuel',
  'Shabilqis Naila'
]);

const teamPassionMembers = new Set([
  'Abigail Rachel',
  'Angelina Christy',
  'Catherina Vallencia',
  'Cornelia Vanisa',
  'Dena Natalia',
  'Desy Natalia',
  'Feni Fitriyanti',
  'Jessica Chandra',
  'Kathrina Irene',
  'Lulu Salsabila',
  'Michelle Levia',
  'Mutiara Azzahra',
  'Raisha Syifa',
  'Ribka Budiman',
  'Victoria Kimberly'
]);

const memberCategories = [
  { id: 'all', label: 'Semua Member' },
  { id: 'team-love', label: 'Team Love' },
  { id: 'team-dream', label: 'Team Dream' },
  { id: 'team-passion', label: 'Team Passion' },
  { id: 'trainee', label: 'Trainee' }
];

const graduateMembers = new Set([
  'Chelsea Davina'
]);

function memberTeam(name, fallback = 'Trainee') {
  if (teamLoveMembers.has(name)) return 'Team Love';
  if (teamDreamMembers.has(name)) return 'Team Dream';
  if (teamPassionMembers.has(name)) return 'Team Passion';
  return fallback;
}

function teamCategory(team) {
  return team.toLowerCase().replaceAll(' ', '-');
}

function officialProfileImage(name) {
  return `${JKT48_PROFILE_BASE}${name.toLowerCase().replaceAll(' ', '_')}.jpg`;
}

function memberPhoto(name) {
  return manualMemberImages[name] || officialProfileImage(name);
}

const gen14Members = [
  'Afera Thalia',
  'Carissa Dini',
  'Christabella Bonita',
  'Fahira Putri',
  'Fatimah Azzahra',
  'Heidi Suyangga',
  'Maxine Faye',
  'Putry Jazyta',
  'Ralyne Van Irwan',
  'Sona Kalyana'
].map((name, index) => ({
  id: `pm-gen14-${index + 1}`,
  name,
  nickname: nicknameMap[name],
  officialName: name,
  img: memberPhoto(name),
  officialImg: officialProfileImage(name),
  role: 'JKT48 Gen 14',
  generation: 'Gen 14',
  team: 'Trainee',
  teamCategory: 'trainee',
  price: PM_PRICE,
  adminFee: PM_ADMIN_FEE
}));

const regularMembers = [
  'Abigail Rachel',
  'Adeline Wijaya',
  'Alya Amanda',
  'Angelina Christy',
  'Anindya Ramadhani',
  'Aurellia',
  'Aurhel Alana',
  'Catherina Vallencia',
  'Cathleen Nixie',
  'Celline Thefani',
  'Chelsea Davina',
  'Cornelia Vanisa',
  'Cynthia Yaputera',
  'Dena Natalia',
  'Desy Natalia',
  'Febriola Sinambela',
  'Feni Fitriyanti',
  'Fiony Alveria',
  'Freya Jayawardana',
  'Fritzy Rosmerian',
  'Gabriela Abigail',
  'Gendis Mayrannisa',
  'Gita Sekar Andarini',
  'Grace Octaviani',
  'Greesella Adhalia',
  'Helisma Putri',
  'Hillary Abigail',
  'Indah Cahya',
  'Jazzlyn Trisha',
  'Jessica Chandra',
  'Jesslyn Elly',
  'Kathrina Irene',
  'Lulu Salsabila',
  'Marsha Lenathea',
  'Michelle Alexandra',
  'Michelle Levia',
  'Mutiara Azzahra',
  'Nayla Suji',
  'Nina Tutachia',
  'Oline Manuel',
  'Raisha Syifa',
  'Ribka Budiman',
  'Shabilqis Naila',
  'Victoria Kimberly',
  'Astrella Virgiananda',
  'Aulia Riza',
  'Bong Aprilli',
  'Hagia Sopia',
  'Humaira Ramadhani',
  'Jacqueline Immanuela',
  'Jemima Evodie',
  'Mikaela Kusjanto',
  'Nur Intan'
].map((name, index) => ({
  id: `pm-${index + 1}`,
  name,
  officialName: name,
  img: memberPhoto(name),
  officialImg: officialProfileImage(name),
  role: index >= 45 ? 'JKT48 Trainee' : 'JKT48 Member',
  generation: index >= 45 ? 'Trainee' : 'Member',
  team: index >= 45 ? 'Trainee' : memberTeam(name, 'Member'),
  teamCategory: index >= 45 ? 'trainee' : teamCategory(memberTeam(name, 'Member')),
  status: graduateMembers.has(name) ? 'Lulus dari JKT48' : 'Aktif',
  price: PM_PRICE,
  adminFee: PM_ADMIN_FEE
}));

const membersList = [...gen14Members, ...regularMembers];
let activeMemberCategory = 'all';

function getInitials(name) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function addMemberToCart(memberId, button) {
  const member = membersList.find(item => item.id === memberId);
  if (!member) return;

  const product = {
    id: member.id,
    name: `PM ${member.name}`,
    price: member.price,
    img: member.img,
    category: 'rare',
    tag: member.generation,
    tagClass: member.generation === 'Gen 14' ? 'tag-limited' : 'tag-rare',
    rating: 4.9,
    adminFee: member.adminFee,
    type: 'PM Member JKT48',
    memberName: member.name,
    officialName: member.officialName,
    generation: member.generation,
    team: member.team
  };

  const cart = JSON.parse(localStorage.getItem('umaedi_cart') || '[]');
  const alreadyInCart = cart.some(item => item.id === member.id || item.memberName === member.name);

  if (alreadyInCart) {
    lockMemberButton(button);
    if (window.toast) {
      window.toast.info(`${member.name} sudah di pesan`, 1800);
    }
    return;
  }

  cart.push(product);
  localStorage.setItem('umaedi_cart', JSON.stringify(cart));

  if (window.playUmadigiSound) {
    window.playUmadigiSound();
  }
  if (window.toast) {
    window.toast.success(`PM ${member.name} masuk keranjang`, 1800);
  }

  lockMemberButton(button);

  window.dispatchEvent(new Event('cartUpdated'));
}

function lockMemberButton(button) {
  button.textContent = 'Di Pesan';
  button.classList.add('is-ordered');
  button.disabled = true;
  button.setAttribute('aria-disabled', 'true');
}

function syncOrderedMemberButtons() {
  const cart = JSON.parse(localStorage.getItem('umaedi_cart') || '[]');
  const orderedIds = new Set(cart
    .filter(item => item.type === 'PM Member JKT48' || item.adminFee === PM_ADMIN_FEE)
    .map(item => item.id));

  document.querySelectorAll('.member-add-btn').forEach(button => {
    if (orderedIds.has(button.dataset.memberId)) {
      lockMemberButton(button);
    }
  });
}

function createMemberCard(member, idx) {
  const card = document.createElement('article');
  card.className = `member-card ${member.generation === 'Gen 14' ? 'member-card-new' : ''}`;
  card.style.animation = `slideUpLuxury 0.42s ease-out ${Math.min(idx, 12) * 0.035}s forwards`;
  card.dataset.name = member.name.toLowerCase();
  card.dataset.role = member.role.toLowerCase();
  card.dataset.generation = member.generation.toLowerCase();
  card.dataset.team = member.team.toLowerCase();
  card.dataset.category = member.teamCategory;
  card.innerHTML = `
    <div class="member-avatar">
      <img src="${member.img}" alt="${member.officialName}" loading="lazy" onerror="this.onerror=function(){this.classList.add('is-hidden')};this.src='${member.officialImg}'" />
      <img src="${JKT48_MEMBER_FRAME}" alt="" class="member-frame" loading="lazy" aria-hidden="true" />
      <span>${getInitials(member.name)}</span>
    </div>
    <div class="member-content">
      <div class="member-pill">${member.team}</div>
      <h3 class="member-name">${member.name}</h3>
      <p class="member-role">${member.status === 'Lulus dari JKT48' ? 'Graduate - Lulus dari JKT48' : member.nickname ? `${member.role} - ${member.nickname}` : member.role}</p>
      <div class="member-price">
        <span>Harga akses</span>
        <strong>Rp8.000</strong>
      </div>
      <button class="member-add-btn ${member.status === 'Lulus dari JKT48' ? 'is-graduate' : ''}" data-member-id="${member.id}">${member.status === 'Lulus dari JKT48' ? 'Graduate' : 'Pesan 8K'}</button>
    </div>
  `;
  return card;
}

function renderMemberList(sectionId, members) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  section.innerHTML = '';
  const sortedMembers = [...members].sort((a, b) => {
    if (a.status === 'Lulus dari JKT48' && b.status !== 'Lulus dari JKT48') return 1;
    if (a.status !== 'Lulus dari JKT48' && b.status === 'Lulus dari JKT48') return -1;
    return 0;
  });

  if (members.length === 0) {
    section.innerHTML = `
      <div class="member-empty">
        <strong>Belum ada member di kategori ini.</strong>
        <span>Kategori ini disiapkan mengikuti tampilan resmi JKT48.</span>
      </div>
    `;
    return;
  }

  sortedMembers.forEach((member, index) => {
    section.appendChild(createMemberCard(member, index));
  });
}

function membersByCategory(category) {
  if (category === 'all') return membersList;
  return membersList.filter(member => member.teamCategory === category);
}

function renderMemberTabs() {
  const tabs = document.getElementById('member-tabs');
  if (!tabs) return;

  tabs.innerHTML = memberCategories.map(category => {
    const count = membersByCategory(category.id).length;
    return `
      <button class="member-tab member-tab-${category.id} ${category.id === activeMemberCategory ? 'active' : ''}" data-member-category="${category.id}">
        <span>${category.label}</span>
        <strong>${count}</strong>
      </button>
    `;
  }).join('');
}

function setMemberCategory(category) {
  activeMemberCategory = category;
  renderMemberTabs();
  renderMemberList('jkt48-members', membersByCategory(category));
  syncOrderedMemberButtons();
}

document.addEventListener('DOMContentLoaded', () => {
  const ownerSection = document.getElementById('owner-member');
  if (ownerSection) {
    ownerSection.innerHTML = `
      <div class="owner-card">
        <div class="owner-avatar">
          <img src="${OWNER_OSHI_IMAGE}" alt="Catherina Vallencia" onerror="this.onerror=function(){this.classList.add('is-hidden')};this.src='${officialProfileImage('Catherina Vallencia')}'" />
          <span>CV</span>
        </div>
        <div>
          <div class="owner-label">VIP OSHI ADMIN UMAEDI</div>
          <div class="owner-name">Catherina Vallencia</div>
          <div class="owner-role">Admin Oshi Umaedi - PM Member JKT48</div>
          <div class="owner-collab">UMAVALENCIA</div>
          <div class="owner-note">Harga terbaru semua member: Rp8.000. Checkout cepat lewat WhatsApp admin.</div>
        </div>
      </div>
    `;
  }

  renderMemberTabs();
  renderMemberList('jkt48-members', membersByCategory(activeMemberCategory));
  syncOrderedMemberButtons();

  document.addEventListener('click', event => {
    const tab = event.target.closest('.member-tab');
    if (tab) {
      setMemberCategory(tab.dataset.memberCategory);
      return;
    }

    const button = event.target.closest('.member-add-btn');
    if (!button || button.disabled) return;
    const member = membersList.find(item => item.id === button.dataset.memberId);
    if (member?.status === 'Lulus dari JKT48') {
      if (window.toast) {
        window.toast.warning(`${member.name} telah lulus dari JKT48`, 2200);
      } else {
        alert(`${member.name} telah lulus dari JKT48`);
      }
      return;
    }
    addMemberToCart(button.dataset.memberId, button);
  });
});
