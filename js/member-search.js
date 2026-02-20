// member-search.js - Search functionality for PM JKT48 members

class MemberSearch {
  constructor() {
    this.searchInput = document.getElementById('member-search');
    this.searchResults = document.getElementById('search-results');
    this.membersSection = document.getElementById('jkt48-members');
    this.allMembers = [];
    
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => this.handleSearch(e));
      this.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.clearSearch();
        }
      });
    }
  }

  handleSearch(event) {
    const query = event.target.value.toLowerCase().trim();
    
    if (query.length === 0) {
      this.clearSearch();
      return;
    }

    // Get all member elements if not already stored
    if (this.allMembers.length === 0) {
      this.allMembers = Array.from(document.querySelectorAll('.member-card'));
    }

    // Filter members
    const filtered = this.allMembers.filter(member => {
      const name = member.querySelector('.member-name')?.textContent.toLowerCase() || '';
      const role = member.querySelector('.member-role')?.textContent.toLowerCase() || '';
      return name.includes(query) || role.includes(query);
    });

    // Update display
    this.showResults(filtered, query);
  }

  showResults(members, query) {
    if (!this.searchResults) return;

    // Hide original members section
    if (this.membersSection) {
      this.membersSection.style.display = 'none';
    }

    // Clear previous results
    this.searchResults.innerHTML = '';
    this.searchResults.classList.add('show');

    if (members.length === 0) {
      this.searchResults.innerHTML = `
        <div class="search-empty">
          <p>😕 Tidak ada member yang cocok dengan "<strong>${query}</strong>"</p>
          <small>Coba cari dengan nama lain</small>
        </div>
      `;
      return;
    }

    // Show results count
    const count = members.length;
    const countText = count === 1 ? 'member' : 'members';
    const header = document.createElement('div');
    header.className = 'search-header';
    header.innerHTML = `<p>Ditemukan <strong>${count}</strong> ${countText}</p>`;
    this.searchResults.appendChild(header);

    // Clone and append filtered members
    members.forEach(member => {
      const clone = member.cloneNode(true);
      clone.classList.add('search-result-item');
      this.searchResults.appendChild(clone);
    });
  }

  clearSearch() {
    if (this.searchInput) {
      this.searchInput.value = '';
    }
    if (this.searchResults) {
      this.searchResults.innerHTML = '';
      this.searchResults.classList.remove('show');
    }
    if (this.membersSection) {
      this.membersSection.style.display = 'grid';
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new MemberSearch();
});
