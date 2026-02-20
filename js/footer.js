// footer.js - UMAEDI STORE

document.addEventListener('DOMContentLoaded', () => {
  const footer = document.getElementById('footer');
  if (!footer) return;
  
  footer.innerHTML = `
    <div class="footer-content">
      <div>
        <h4>UMAEDI STORE</h4>
        <p>Luxury digital creator store with premium products and exclusive offerings.</p>
        <p style="color:#666;font-size:0.9rem;">© 2026 UMAEDI STORE | UMAVERSE × UMAVALENCIA</p>
      </div>
      <div>
        <h4>Navigation</h4>
        <a href="/index.html">Home</a>
        <a href="/pages/fashion.html">Fashion</a>
        <a href="/pages/preset.html">Presets</a>
        <a href="/pages/limited.html">Limited</a>
        <a href="/pages/rare.html">Rare</a>
        <a href="/pages/pm-jkt48.html">JKT48</a>
      </div>
      <div>
        <h4>Customer Service</h4>
        <a href="https://wa.me/6283818115136" target="_blank">WhatsApp Support</a>
        <a href="mailto:info@umaedi.store">Email Us</a>
        <p style="margin-top:1em;font-size:0.9rem;color:#666;">
          <strong>WhatsApp:</strong> +62 838-1811-5136<br>
          <strong>Hours:</strong> 09:00 - 22:00 WIB
        </p>
      </div>
      <div>
        <h4>About</h4>
        <p style="font-size:0.95rem;line-height:1.6;">
          UMAEDI STORE is a premium marketplace collaboration between UMAVERSE and UMAVALENCIA, offering exclusive digital creator products with modern, luxury, and refined aesthetics.
        </p>
      </div>
    </div>
    <div class="footer-bottom">
      Made with ❤️ by UMAEDI STORE | All Rights Reserved
    </div>
  `;
});