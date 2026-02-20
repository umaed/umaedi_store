// member.js - UMAEDI STORE

// Member data with prices (Admin fee is 3000 for JKT48 Members)
const membersList = [
  { id: 'pm-1', name: 'Abigail Rachel', role: 'JKT48 Member', img: 'https://jkt48.com/profile/abigail_rachel.jpg', price: 10000, adminFee: 3000 },
  { id: 'pm-2', name: 'Adeline Wijaya', role: 'JKT48 Member', img: 'https://jkt48.com/profile/adeline_wijaya.jpg', price: 10000, adminFee: 3000 },
  { id: 'pm-3', name: 'Alya Amanda', role: 'JKT48 Member', img: 'https://jkt48.com/profile/alya_amanda.jpg?v=20231212', price: 10000, adminFee: 3000 },
  { id: 'pm-4', name: 'Amanda Sukma', role: 'JKT48 Member', img: 'https://jkt48.com/profile/amanda_sukma.jpg?v=20230530', price: 10000, adminFee: 3000 },
  { id: 'pm-5', name: 'Angelina Christy', role: 'JKT48 Member', img: 'https://jkt48.com/profile/angelina_christy.jpg?v=20230116', price: 10000, adminFee: 3000 },
  { id: 'pm-6', name: 'Anindya Ramadhani', role: 'JKT48 Member', img: 'https://jkt48.com/profile/anindya_ramadhani.jpg?v=20231212', price: 10000, adminFee: 3000 },
  { id: 'pm-7', name: 'Aurellia', role: 'JKT48 Member', img: 'https://jkt48.com/profile/aurellia.jpg?v=20230531', price: 10000, adminFee: 3000 },
  { id: 'pm-8', name: 'Aurhel Alana', role: 'JKT48 Member', img: 'https://jkt48.com/profile/aurhel_alana.jpg?v=20231212', price: 10000, adminFee: 3000 },
  { id: 'pm-9', name: 'Catherina Vallencia', role: 'JKT48 Member', img: 'https://jkt48.com/profile/catherina_vallencia.jpg', price: 10000, adminFee: 3000 },
  { id: 'pm-10', name: 'Cathleen Nixie', role: 'JKT48 Member', img: 'https://jkt48.com/profile/cathleen_nixie.jpg?v=20231212', price: 10000, adminFee: 3000 },
  { id: 'pm-11', name: 'Celline Thefani', role: 'JKT48 Member', img: 'https://jkt48.com/profile/celline_thefani.jpg?v=20231212', price: 10000, adminFee: 3000 },
  { id: 'pm-12', name: 'Chelsea Davina', role: 'JKT48 Member', img: 'https://jkt48.com/profile/chelsea_davina.jpg?v=20231212', price: 10000, adminFee: 3000 },
  { id: 'pm-13', name: 'Cornelia Vanisa', role: 'JKT48 Member', img: 'https://jkt48.com/profile/cornelia_vanisa.jpg?v=20230116', price: 10000, adminFee: 3000 },
  { id: 'pm-14', name: 'Cynthia Yaputera', role: 'JKT48 Member', img: 'https://jkt48.com/profile/cynthia_yaputera.jpg?v=20231212', price: 10000, adminFee: 3000 },
  { id: 'pm-15', name: 'Dena Natalia', role: 'JKT48 Member', img: 'https://jkt48.com/profile/dena_natalia.jpg?v=20231212', price: 10000, adminFee: 3000 },
  { id: 'pm-16', name: 'Desy Natalia', role: 'JKT48 Member', img: 'https://jkt48.com/profile/desy_natalia.jpg?v=20231212', price: 10000, adminFee: 3000 },
  { id: 'pm-17', name: 'Febriola Sinambela', role: 'JKT48 Member', img: 'https://jkt48.com/profile/febriola_sinambela.jpg?v=20230116', price: 10000, adminFee: 3000 },
  { id: 'pm-18', name: 'Feni Fitriyanti', role: 'JKT48 Member', img: 'https://jkt48.com/profile/feni_fitriyanti.jpg?v=20230116', price: 10000, adminFee: 3000 },
  { id: 'pm-19', name: 'Fiony Alveria', role: 'JKT48 Member', img: 'https://jkt48.com/profile/fiony_alveria.jpg?v=20230116', price: 10000, adminFee: 3000 },
  { id: 'pm-20', name: 'Freya Jayawardana', role: 'JKT48 Member', img: 'https://jkt48.com/profile/freya_jayawardana.jpg?v=20230116', price: 10000, adminFee: 3000 },
  { id: 'pm-21', name: 'Fritzy Rosmerian', role: 'JKT48 Member', img: 'https://jkt48.com/profile/fritzy_rosmerian.jpg', price: 10000, adminFee: 3000 },
  { id: 'pm-22', name: 'Gabriela Abigail', role: 'JKT48 Member', img: 'https://jkt48.com/profile/gabriela_abigail.jpg?v=20230531', price: 10000, adminFee: 3000 },
  { id: 'pm-23', name: 'Gendis Mayrannisa', role: 'JKT48 Member', img: 'https://jkt48.com/profile/gendis_mayrannisa.jpg?v=20231212', price: 10000, adminFee: 3000 },
  { id: 'pm-24', name: 'Gita Sekar Andarini', role: 'JKT48 Member', img: 'https://jkt48.com/profile/gita_sekar_andarini.jpg?v=20230116', price: 10000, adminFee: 3000 },
  { id: 'pm-25', name: 'Grace Octaviani', role: 'JKT48 Member', img: 'https://jkt48.com/profile/grace_octaviani.jpg?v=20231212', price: 10000, adminFee: 3000 },
  { id: 'pm-26', name: 'Greesella Adhalia', role: 'JKT48 Member', img: 'https://jkt48.com/profile/greesella_adhalia.jpg?v=20231212', price: 10000, adminFee: 3000 },
  { id: 'pm-27', name: 'Helisma Putri', role: 'JKT48 Member', img: 'https://jkt48.com/profile/helisma_putri.jpg?v=20230116', price: 10000, adminFee: 3000 },
  { id: 'pm-28', name: 'Hillary Abigail', role: 'JKT48 Member', img: 'https://jkt48.com/profile/hillary_abigail.jpg', price: 10000, adminFee: 3000 },
  { id: 'pm-29', name: 'Indah Cahya', role: 'JKT48 Member', img: 'https://jkt48.com/profile/indah_cahya.jpg?v=20230116', price: 10000, adminFee: 3000 },
  { id: 'pm-30', name: 'Jazzlyn Trisha', role: 'JKT48 Member', img: 'https://jkt48.com/profile/jazzlyn_trisha.jpg', price: 10000, adminFee: 3000 },
  { id: 'pm-31', name: 'Jessica Chandra', role: 'JKT48 Member', img: 'https://jkt48.com/profile/jessica_chandra.jpg?v=20230116', price: 10000, adminFee: 3000 },
  { id: 'pm-32', name: 'Jesslyn Elly', role: 'JKT48 Member', img: 'https://jkt48.com/profile/jesslyn_elly.jpg?v=20230531', price: 10000, adminFee: 3000 },
  { id: 'pm-33', name: 'Kathrina Irene', role: 'JKT48 Member', img: 'https://jkt48.com/profile/kathrina_irene.jpg?v=20230116', price: 10000, adminFee: 3000 },
  { id: 'pm-34', name: 'Lulu Salsabila', role: 'JKT48 Member', img: 'https://jkt48.com/profile/lulu_salsabila.jpg?v=20230116', price: 10000, adminFee: 3000 },
  { id: 'pm-35', name: 'Marsha Lenathea', role: 'JKT48 Member', img: 'https://jkt48.com/profile/marsha_lenathea.jpg?v=20230116', price: 10000, adminFee: 3000 },
  { id: 'pm-36', name: 'Michelle Alexandra', role: 'JKT48 Member', img: 'https://jkt48.com/profile/michelle_alexandra.jpg?v=20231212', price: 10000, adminFee: 3000 },
  { id: 'pm-37', name: 'Michelle Levia', role: 'JKT48 Member', img: 'https://jkt48.com/profile/michelle_levia.jpg', price: 10000, adminFee: 3000 },
  { id: 'pm-38', name: 'Mutiara Azzahra', role: 'JKT48 Member', img: 'https://jkt48.com/profile/mutiara_azzahra.jpg?v=20230116', price: 10000, adminFee: 3000 },
  { id: 'pm-39', name: 'Nayla Suji', role: 'JKT48 Member', img: 'https://jkt48.com/profile/nayla_suji.jpg', price: 10000, adminFee: 3000 },
  { id: 'pm-40', name: 'Nina Tutachia', role: 'JKT48 Member', img: 'https://jkt48.com/profile/nina_tutachia.jpg?v=20231212', price: 10000, adminFee: 3000 },
  { id: 'pm-41', name: 'Oline Manuel', role: 'JKT48 Member', img: 'https://jkt48.com/profile/oline_manuel.jpg', price: 10000, adminFee: 3000 },
  { id: 'pm-42', name: 'Raisha Syifa', role: 'JKT48 Member', img: 'https://jkt48.com/profile/raisha_syifa.jpg?v=20230530', price: 10000, adminFee: 3000 },
  { id: 'pm-43', name: 'Ribka Budiman', role: 'JKT48 Member', img: 'https://jkt48.com/profile/ribka_budiman.jpg', price: 10000, adminFee: 3000 },
  { id: 'pm-44', name: 'Shabilqis Naila', role: 'JKT48 Member', img: 'https://jkt48.com/profile/shabilqis_naila.jpg', price: 10000, adminFee: 3000 },
  { id: 'pm-45', name: 'Victoria Kimberly', role: 'JKT48 Member', img: 'https://jkt48.com/profile/victoria_kimberly.jpg', price: 10000, adminFee: 3000 },
  { id: 'pm-46', name: 'Astrella Virgiananda', role: 'JKT48 Trainee', img: 'https://jkt48.com/profile/Astrella_Virgiananda.jpg', price: 10000, adminFee: 3000 },
  { id: 'pm-47', name: 'Aulia Riza', role: 'JKT48 Trainee', img: 'https://jkt48.com/profile/Aulia_Riza.jpg', price: 10000, adminFee: 3000 },
  { id: 'pm-48', name: 'Bong Aprilli', role: 'JKT48 Trainee', img: 'https://jkt48.com/profile/Bong_Aprilli.jpg', price: 10000, adminFee: 3000 },
  { id: 'pm-49', name: 'Hagia Sopia', role: 'JKT48 Trainee', img: 'https://jkt48.com/profile/Hagia_Sopia.jpg', price: 10000, adminFee: 3000 },
  { id: 'pm-50', name: 'Humaira Ramadhani', role: 'JKT48 Trainee', img: 'https://jkt48.com/profile/Humaira_Ramadhani.jpg', price: 10000, adminFee: 3000 },
  { id: 'pm-51', name: 'Jacqueline Immanuela', role: 'JKT48 Trainee', img: 'https://jkt48.com/profile/Jacqueline_Immanuela.jpg', price: 10000, adminFee: 3000 },
  { id: 'pm-52', name: 'Jemima Evodie', role: 'JKT48 Trainee', img: 'https://jkt48.com/profile/Jemima_Evodie.jpg', price: 10000, adminFee: 3000 },
  { id: 'pm-53', name: 'Mikaela Kusjanto', role: 'JKT48 Trainee', img: 'https://jkt48.com/profile/Mikaela_Kusjanto.jpg', price: 10000, adminFee: 3000 },
  { id: 'pm-54', name: 'Nur Intan', role: 'JKT48 Trainee', img: 'https://jkt48.com/profile/Nur_Intan.jpg', price: 10000, adminFee: 3000 },
];


function addMemberToCart(member) {
  const product = {
    id: member.id,
    name: `PM: ${member.name}`,
    price: member.price,
    img: member.img,
    category: 'rare',
    tag: 'RARE',
    tagClass: 'tag-rare',
    rating: 4.9,
    adminFee: member.adminFee
  };
  
  let cart = JSON.parse(localStorage.getItem('umaedi_cart') || '[]');
  
  // Check if product already exists (for tracking purposes)
  const existingItem = cart.find(item => item.id === product.id);
  
  cart.push(product);
  localStorage.setItem('umaedi_cart', JSON.stringify(cart));
  
  // Visual feedback
  event.target.textContent = '✓ Added';
  event.target.style.background = '#4caf50';
  event.target.style.color = '#fff';
  setTimeout(() => {
    event.target.textContent = '📦 Pesan';
    event.target.style.background = '';
    event.target.style.color = '';
  }, 1200);
  
  // Update cart count
  window.dispatchEvent(new Event('cartUpdated'));
}

document.addEventListener('DOMContentLoaded', () => {
  // Owner member
  const ownerSection = document.getElementById('owner-member');
  if (ownerSection) {
    ownerSection.innerHTML = `
      <div class="owner-card luxury-glow-hover">
        <div class="owner-label">EXCLUSIVE OWNER</div>
        <div class="owner-name">Catherine Valencia</div>
        <div class="owner-role">Owner Member of UMAEDI STORE</div>
        <div class="owner-collab">UMAVERSE × UMAVALENCIA</div>
        <img src="../assets/img/owner-catherine.jpg" alt="Catherine Valencia" class="product-img" style="width:160px;height:160px;border-radius:50%;margin-bottom:1em;box-shadow:0 0 32px #bfa14a88;" />
      </div>
    `;
  }
  
  // Other JKT48 members with Add button
  const memberList = document.getElementById('jkt48-members');
  if (memberList) {
    memberList.innerHTML = '';
    membersList.forEach((member, idx) => {
      const card = document.createElement('div');
      card.className = 'member-card luxury-glow-hover';
      card.style.animation = `slideUpLuxury 0.6s ease-out ${idx * 0.1}s forwards`;
      card.innerHTML = `
        <img src="${member.img}" alt="${member.name}" class="product-img" style="width:120px;height:120px;border-radius:50%;margin-bottom:1em;box-shadow:0 0 24px #bfa14a44;" />
        <div class="member-name">${member.name}</div>
        <div class="member-role">${member.role}</div>
        <div class="member-collab">JKT48</div>
        <div class="member-price">Rp${member.price.toLocaleString('id-ID')}</div>
        <button class="member-add-btn" onclick="addMemberToCart({id:'${member.id}', name:'${member.name}', img:'${member.img}', price:${member.price}, adminFee:${member.adminFee}})">📦 Pesan</button>
      `;
      memberList.appendChild(card);
    });
  }
});