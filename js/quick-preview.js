// quick-preview.js - Product Quick Preview Modal
class QuickPreview {
  constructor() {
    this.modal = this.createModal();
  }

  createModal() {
    let modal = document.getElementById('quick-preview-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'quick-preview-modal';
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-content">
          <span class="modal-close">&times;</span>
          <div class="modal-body">
            <div class="preview-image-wrapper">
              <img id="preview-image" src="" alt="Product" class="preview-image">
            </div>
            <div class="preview-info">
              <h3 id="preview-title"></h3>
              <p id="preview-price" class="preview-price"></p>
              <p id="preview-description" class="preview-description"></p>
              <button class="preview-button" onclick="quickPreview.openProduct()">View Details</button>
              <button class="preview-button secondary" onclick="quickPreview.closeModal()">Close</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      
      // Close on background click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeModal();
      });
      
      // Close button
      modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
      
      // Keyboard close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.closeModal();
      });
    }
    return modal;
  }

  show(product) {
    this.currentProduct = product;
    document.getElementById('preview-image').src = product.image || 'assets/img/placeholder.php';
    document.getElementById('preview-title').textContent = product.name;
    document.getElementById('preview-price').textContent = product.price || 'Contact for price';
    document.getElementById('preview-description').textContent = product.description || 'No description available';
    
    this.modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.modal.classList.remove('show');
    document.body.style.overflow = '';
  }

  openProduct() {
    if (this.currentProduct && this.currentProduct.link) {
      window.location.href = this.currentProduct.link;
    }
  }
}

const quickPreview = new QuickPreview();
