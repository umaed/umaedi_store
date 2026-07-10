// order-status.js - show payment history on homepage

(function () {
  const HISTORY_KEY = 'umaedi_order_history';
  const PENDING_DURATION_MS = 3 * 60 * 1000;
  const COMPLETE_DURATION_MS = 10 * 60 * 1000;
  const root = document.getElementById('home-order-status');
  const refreshButton = document.getElementById('refresh-order-status');

  if (!root) return;

  function getHistory() {
    try {
      const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      return Array.isArray(history) ? history : [];
    } catch (error) {
      return [];
    }
  }

  function saveHistory(history) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 12)));
  }

  function statusFor(order, now = Date.now()) {
    const elapsed = now - Number(order.createdAt || 0);
    if (elapsed >= COMPLETE_DURATION_MS) return 'Selesai';
    if (elapsed >= PENDING_DURATION_MS) return 'Diproses';
    return 'Pending';
  }

  function rupiah(value) {
    return `Rp${Number(value || 0).toLocaleString('id-ID')}`;
  }

  function render() {
    const now = Date.now();
    const history = getHistory().map(order => ({
      ...order,
      status: statusFor(order, now)
    }));
    saveHistory(history);

    if (history.length === 0) {
      root.innerHTML = '<div class="home-order-empty">Belum ada pesanan. Setelah bayar dan kirim bukti, status order akan muncul di sini.</div>';
      return;
    }

    root.innerHTML = history.slice(0, 4).map(order => {
      const statusClass = order.status === 'Selesai' ? 'done' : order.status === 'Diproses' ? 'process' : '';
      return `
        <article class="home-order-item">
          <strong>${order.id || 'Order UMADIGI'}</strong>
          <span>${order.itemCount || 1} item - ${rupiah(order.total)}</span>
          <small>${new Date(order.createdAt || Date.now()).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</small>
          <div class="home-order-badge ${statusClass}">${order.status}</div>
        </article>
      `;
    }).join('');
  }

  refreshButton?.addEventListener('click', render);
  render();
  setInterval(render, 15000);
})();
