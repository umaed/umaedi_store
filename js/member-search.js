// member-search.js - Search functionality for PM JKT48 members

class MemberSearch {
  constructor() {
    this.searchInput = document.getElementById('member-search');
    this.searchResults = document.getElementById('search-results');
    this.memberBlocks = Array.from(document.querySelectorAll('.member-block'));
    this.memberTabs = document.getElementById('member-tabs');
    this.allMembers = [];

    if (this.searchInput) {
      this.searchInput.addEventListener('input', event => this.handleSearch(event));
      this.searchInput.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
          this.clearSearch();
        }
      });
    }
  }

  collectMembers() {
    this.allMembers = typeof membersList !== 'undefined' ? membersList : [];
  }

  handleSearch(event) {
    const query = event.target.value.toLowerCase().trim();

    if (query.length === 0) {
      this.clearSearch();
      return;
    }

    if (this.allMembers.length === 0) {
      this.collectMembers();
    }

    const filtered = this.allMembers.filter(member => {
      const searchText = [
        member.name,
        member.role,
        member.generation,
        member.team
      ].join(' ').toLowerCase();
      return searchText.includes(query);
    });

    this.showResults(filtered, query);
  }

  showResults(members, query) {
    if (!this.searchResults) return;

    if (this.memberTabs) this.memberTabs.style.display = 'none';
    const memberList = document.getElementById('jkt48-members');
    if (memberList) memberList.style.display = 'none';

    this.searchResults.innerHTML = '';
    this.searchResults.classList.add('show');

    if (members.length === 0) {
      this.searchResults.innerHTML = `
        <div class="search-empty">
          <p>Tidak ada member yang cocok dengan "<strong>${query}</strong>".</p>
          <small>Coba cari nama atau generasi lain.</small>
        </div>
      `;
      return;
    }

    const header = document.createElement('div');
    header.className = 'search-header';
    header.innerHTML = `<p>Ditemukan <strong>${members.length}</strong> member.</p>`;
    this.searchResults.appendChild(header);

    members.forEach((member, index) => {
      const card = createMemberCard(member, index);
      card.classList.add('search-result-item');
      this.searchResults.appendChild(card);
    });
    if (typeof syncOrderedMemberButtons === 'function') syncOrderedMemberButtons();
  }

  clearSearch() {
    if (this.searchInput) {
      this.searchInput.value = '';
    }
    if (this.searchResults) {
      this.searchResults.innerHTML = '';
      this.searchResults.classList.remove('show');
    }
    if (this.memberTabs) this.memberTabs.style.display = '';
    const memberList = document.getElementById('jkt48-members');
    if (memberList) memberList.style.display = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MemberSearch();
});
