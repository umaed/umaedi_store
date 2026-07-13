.payment-page {
  padding-bottom: 0;
}

body.payment-body,
body:has(.payment-page) {
  padding-bottom: 0;
}

body.payment-body .sticky-order-bar,
body:has(.payment-page) .sticky-order-bar {
  /* Make the order bar in-flow on the payment page so the Pesan button
     is always visible and not fixed to the bottom */
  position: static;
  z-index: 240;
  margin-top: 12px;
  padding: 12px 14px calc(12px + env(safe-area-inset-bottom));
  box-shadow: 0 0 0 rgba(0,0,0,0);
}

body.payment-body .checkout-main-btn,
body:has(.payment-page) .checkout-main-btn {
  min-height: 54px;
  font-size: 1rem;
}

.sticky-total {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  margin-right: 12px;
}

.sticky-total span {
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 800;
}

.sticky-total strong {
  color: #ee4d2d;
  font-size: 1.05rem;
  font-weight: 900;
  transition: transform 0.35s ease, text-shadow 0.35s ease;
}

/* glowing animation when active */
.sticky-total.active strong {
  animation: glow 1.6s ease-in-out infinite;
  transform: translateY(-2px);
  text-shadow: 0 6px 18px rgba(238,77,45,0.28), 0 0 8px rgba(255,160,120,0.16);
}

@keyframes glow {
  0% { text-shadow: 0 6px 6px rgba(238,77,45,0.08); transform: translateY(0); }
  50% { text-shadow: 0 10px 26px rgba(238,77,45,0.28); transform: translateY(-3px); }
  100% { text-shadow: 0 6px 6px rgba(238,77,45,0.08); transform: translateY(0); }
}

.payment-hero {
  margin: 12px 0 14px;
  padding: 22px 18px;
  border-radius: 18px;
  color: #fff;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.94), rgba(15, 118, 110, 0.82)),
    url("../assets/img/umadigi-hero.png") center / cover;
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.18);
}

.payment-hero span {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.payment-hero h1 {
  margin: 14px 0 0;
  font-size: clamp(1.6rem, 8vw, 2.6rem);
  line-height: 1.05;
}

.payment-hero p {
  margin: 10px 0 0;
  color: #e0f2fe;
  line-height: 1.6;
}

.payment-status,
.payment-card,
.order-history-card {
  margin: 0 0 14px;
  padding: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
  backdrop-filter: blur(10px);
}

.payment-status {
  display: none;
  color: #991b1b;
  background: #fee2e2;
  border-color: #fecaca;
  font-weight: 900;
  line-height: 1.45;
}

.payment-status.is-visible {
  display: block;
}

.payment-timer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 14px;
  color: #111827;
  background: #ecfeff;
}

.payment-timer span {
  color: #0f766e;
  font-size: 0.84rem;
  font-weight: 900;
}

.payment-timer strong {
  color: #ee4d2d;
  font-size: 1.45rem;
  font-weight: 900;
}

.qris-frame {
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: #fff;
}

.qris-frame img {
  width: 100%;
  display: block;
  border-radius: 12px;
}

.payment-summary {
  margin-top: 12px;
}

.proof-uploader {
  display: grid;
  gap: 14px;
  margin-top: 16px;
  padding: 20px 16px;
  border: 3px dashed #14b8a6;
  border-radius: 20px;
  background:
    linear-gradient(135deg, rgba(240, 253, 250, 0.98), rgba(236, 254, 255, 0.94));
  color: #0f766e;
  font-weight: 900;
  text-align: center;
  box-shadow: inset 0 0 0 1px rgba(20, 184, 166, 0.08);
}

.proof-uploader span {
  color: #111827;
  font-size: 1.12rem;
}

.proof-uploader span::before {
  content: "+";
  display: inline-flex;
  width: 34px;
  height: 34px;
  margin-right: 8px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #fff;
  background: #14b8a6;
  font-size: 1.4rem;
  font-weight: 900;
  vertical-align: middle;
}

.proof-uploader input {
  width: 100%;
  min-height: 64px;
  padding: 12px;
  border: 2px solid rgba(20, 184, 166, 0.28);
  border-radius: 14px;
  background: #fff;
  color: #111827;
  font-size: 0.98rem;
  font-weight: 850;
  cursor: pointer;
}

.proof-uploader input::file-selector-button {
  min-height: 42px;
  margin-right: 10px;
  padding: 0 14px;
  border: 0;
  border-radius: 10px;
  color: #fff;
  background: linear-gradient(135deg, #14b8a6, #0f766e);
  font-weight: 900;
  cursor: pointer;
}

.proof-uploader small {
  color: #64748b;
  font-weight: 800;
  line-height: 1.45;
}

.payment-confirm-btn:disabled {
  background: #94a3b8;
  box-shadow: none;
  cursor: not-allowed;
}

.payment-confirm-btn.is-ready {
  background: linear-gradient(135deg, #16a34a, #0f766e);
  box-shadow: 0 14px 26px rgba(22, 163, 74, 0.26);
}

.order-history {
  display: grid;
  gap: 9px;
}

.history-item {
  display: grid;
  gap: 5px;
  padding: 11px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
}

.history-item strong {
  color: #111827;
}

.history-item span,
.history-item small {
  color: #64748b;
  font-size: 0.82rem;
  font-weight: 800;
}

.history-status {
  width: fit-content;
  padding: 5px 8px;
  border-radius: 999px;
  color: #92400e;
  background: #fef3c7;
  font-size: 0.72rem;
  font-weight: 900;
}

.history-status.done {
  color: #0f766e;
  background: #ccfbf1;
}

.history-status.process {
  color: #1d4ed8;
  background: #dbeafe;
}

@media (min-width: 760px) {
  .payment-page {
    max-width: 760px;
  }
}

@media (max-width: 760px) {
  body.payment-body .mobile-bottom-nav,
  body:has(.payment-page) .mobile-bottom-nav {
    display: none;
  }
}

/* On small screens place the order bar in-flow below the content
   so it won't be hidden by Android bottom bars. */
@media (max-width: 760px) {
  body.payment-body .sticky-order-bar,
  body:has(.payment-page) .sticky-order-bar {
    position: static;
    margin-top: 12px;
    box-shadow: none;
    border-top: 0;
    padding: 12px 14px calc(12px + env(safe-area-inset-bottom));
  }

  /* remove extra bottom padding on the page when the bar is in-flow */
  .payment-page {
    padding-bottom: 0;
  }
}
