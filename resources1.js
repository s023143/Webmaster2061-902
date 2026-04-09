const searchInput = document.getElementById('searchbar');
const typeFilter = document.getElementById('typeFilter');
const clearBtn = document.getElementById('clearFilters');

const resultsCount = document.getElementById('resultsCount');
const emptyState = document.getElementById('emptyState');

function applyFilters(){
    const query = searchInput.value.toLowerCase().trim();
    const type = typeFilter.value;
    let visible = 0;

    const listItems = Array.from(document.querySelectorAll('.resource-list'));
    listItems.forEach(li => {
        const itemType   = li.dataset.type || '';
        const itemSearch = (li.dataset.search + ' ' + li.textContent).toLowerCase();

        const matchesType = !type || itemType.split(' ').includes(type);
        const matchesSearch = !query || itemSearch.includes(query);
        const show = matchesType && matchesSearch;

        li.style.display = show ? '' : 'none';
        if (show) visible++;
    });

     resultsCount.textContent = `Showing ${visible} of ${listItems.length} resources`;
     emptyState.style.display = visible === 0 ? 'block' : 'none';
}

const parameters = new URLSearchParams(window.location.search);
const presetType = parameters.get('type');
if (presetType) {
  typeFilter.value = presetType;
  applyFilters;
}


function clearAll() {
  searchInput.value = '';
  typeFilter.value  = '';
  applyFilters();
}

searchInput.addEventListener('input', applyFilters);
typeFilter.addEventListener('change', applyFilters);
clearBtn.addEventListener('click', clearAll);

applyFilters();

// Load approved submissions from Google Sheets
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxxusHFaeC22xszYBQYvduU5NUy6cTLS959E10d2_-AMSygFVffQCP0JcfRFADTNK9J0w/exec';

fetch(SHEET_URL)
  .then(r => r.json())
  .then(rows => {
    const submitted = rows.filter(r => r.type === 'resource');
    if (submitted.length === 0) return;

    submitted.forEach(r => {
      const catMap = { emergency: { emoji: '🚨', label: 'Emergency' }, food: { emoji: '🥫', label: 'Food' }, health: { emoji: '🏥', label: 'Health' }, housing: { emoji: '🏠', label: 'Housing' }, education: { emoji: '📚', label: 'Education' } };
      const cat = catMap[r.category] || {emoji: '📋', label: 'Other'};
      const li = document.createElement('li');
      li.className = 'resource-list';
      li.dataset.type = r.category || 'other';
      li.dataset.search = (r.name + ' ' + r.description + ' ' + r.category).toLowerCase();
      li.innerHTML = `
      <div class="resource">
        <div class="resource-left">
          <span class="res-emoji">${cat.emoji}</span>
          <span class="res-cat">${cat.label}</span>
        </div>
        <div class="resource-right">
          <h3 class="resource-title">${r.name}</h3>
          <p class="resource-description">${r.description}</p>
          <div class="resource-meta">
            ${r.address ? `<span class="res-detail">📍 ${r.address}</span>` : ''}
            ${r.phone   ? `<span class="res-detail">📞 ${r.phone}</span>`   : ''}
            ${r.hours   ? `<span class="res-detail">🕐 ${r.hours}</span>`   : ''}
            ${r.register === 'yes' ? `<a href="register.html?event=${encodeURIComponent(r.name)}" class="btn btn-green btn-sm">Register</a>` : ''}
          </div>
        </div>
      </div>`;
      document.getElementById('list').appendChild(li);

    });

    applyFilters();
  })

  .catch(() => {
    //sheet unreachable - built in resources still show normally
  });