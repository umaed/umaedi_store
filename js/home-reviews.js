(function () {
  const STORAGE_KEY = 'umadigi_customer_reviews';
  const openBtn = document.getElementById('floating-review-btn');
  const closeBtn = document.getElementById('close-review-panel');
  const panel = document.getElementById('floating-review-panel');
  const form = document.getElementById('home-review-form');

  renderSavedReviews();

  if (!form) return;

  const nameInput = document.getElementById('home-review-name');
  const categoryInput = document.getElementById('home-review-category');
  const messageInput = document.getElementById('home-review-message');

  if (openBtn && panel) {
    openBtn.addEventListener('click', () => {
      panel.classList.add('is-open');
      panel.setAttribute('aria-hidden', 'false');
      nameInput?.focus();
    });
  }

  if (closeBtn && panel) {
    closeBtn.addEventListener('click', () => closePanel());
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = (nameInput.value || 'User').trim().slice(0, 32);
    const category = categoryInput.value;
    const message = (messageInput.value || '').trim();

    if (!message) {
      if (window.toast) window.toast.warning('Tulis ulasan singkat dulu ya.', 2200);
      messageInput.focus();
      return;
    }

    const reviews = getReviews();
    reviews.unshift({
      name,
      category,
      message,
      rating: '5/5',
      date: 'Baru saja'
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews.slice(0, 24)));

    form.reset();
    closePanel();
    if (window.toast) window.toast.success('Ulasan tersimpan di halaman ulasan.', 2400);
  });

  function renderSavedReviews() {
    const list = document.querySelector('.review-list');
    if (!list) return;

    getReviews().forEach((review) => {
      const card = document.createElement('article');
      card.className = 'review-card is-user-review';
      card.innerHTML = `
        <div class="review-top">
          <div>
            <div class="review-user">${escapeHtml(review.name || 'User')}</div>
            <div class="review-date">${escapeHtml(review.date || 'Baru saja')}</div>
          </div>
          <div class="review-stars">${escapeHtml(review.rating || '5/5')}</div>
        </div>
        <h3 class="review-title">Ulasan pelanggan UMADIGI STORE</h3>
        <p class="review-text">${escapeHtml(review.message || '')}</p>
        <span class="review-product">${escapeHtml(review.category || 'Private Message JKT48')}</span>
      `;
      list.prepend(card);
    });
  }

  function getReviews() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function closePanel() {
    if (!panel) return;
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
