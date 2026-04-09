const searchInput = document.getElementById('searchbar');
const typeFilter = document.getElementById('typeFilter');
const dateFilter = document.getElementById('dateFilter');
const clearBtn = document.getElementById('clearFilters');

const resultsCount = document.getElementById('resultsCount');
const emptyState = document.getElementById('emptyState');

function formatTime(hoursStr) {
  const timePart = hoursStr.split(' at ')[1];
  if (!timePart) return hoursStr;
  const [h, m] = timePart.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${suffix}`;
}

function applyFilters(){
    const query = searchInput.value.toLowerCase().trim();
    const type = typeFilter.value;
    const dateVal = dateFilter.value;
    let visible = 0;
    const listItems = Array.from(document.querySelectorAll('.event-list'));

    document.querySelectorAll('.event-list').forEach(li => {
        const itemType = li.dataset.type || '';
        const itemDate = li.dataset.date || '';
        const itemSearch = (li.dataset.search + ' ' + li.textContent).toLowerCase();

        const matchesType = !type || itemType === type;
        const matchesDate = !dateVal || itemDate === dateVal;
        const matchesSearch = !query || itemSearch.includes(query);
        const show = matchesType && matchesDate && matchesSearch;

        li.style.display = show ? '' : 'none';
        if (show) visible++;
    });

    const total = document.querySelectorAll('event-list').length;
    resultsCount.textContent = `Showing ${visible} of ${listItems.length} events`;
    emptyState.style.display = visible === 0 ? 'block' : 'none';
}

function clearAll(){
    searchInput.value = '';
    typeFilter.value = '';
    dateFilter.value = '';
    applyFilters();
}

searchInput.addEventListener('input', applyFilters);
typeFilter.addEventListener('change', applyFilters);
dateFilter.addEventListener('change', applyFilters);
clearBtn.addEventListener('click', clearAll);

applyFilters();

//Load submissions from google sheets
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxxusHFaeC22xszYBQYvduU5NUy6cTLS959E10d2_-AMSygFVffQCP0JcfRFADTNK9J0w/exec';

const BADGE_MAP = {
    community: 'badge-community',
    volunteer: 'badge-volunteer',
    fun: 'badge-fun',
    class: 'badge-class',
    other: 'badge-other',
};

fetch(SHEET_URL)
    .then(r => r.json())
    .then(rows => {
        const submitted = rows.filter(r => r.type === 'event');
        submitted.sort((a,b) => new Date(a.hours.split(' at ')[0]) - new Date(b.hours.split(' at ')[0]));
        if (submitted.length===0) return;

        submitted.forEach(r => {
            const li = document.createElement('li');
            li.className = 'event-list';
            li.dataset.type = r.category || 'community';
            li.dataset.search = (r.name + ' ' +r.description).toLowerCase();
            li.dataset.date = r.hours.split(' at ')[0];
            li.innerHTML = `
            <div class="event">
          <div class="event-left">
            <div class="event-date">
              <div class="date">${r.hours.split(' at ')[0].split('-')[2]}</div>
              <div class="month">${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(r.hours.split(' at ')[0].split('-')[1]) - 1]}</div>
            </div>
          </div>
          <div class="event-right">
            <div class="event-top">
              <h3 class="event-title">${r.name}</h3>
              <span class="event-type-badge ${BADGE_MAP[r.category] || 'badge-community'}">${r.category || 'Community'}</span>
            </div>
            <p class="event-description">${r.description}</p>
            <div class="event-meta">
              ${r.hours ? `<span class="event-pill">🕐 ${formatTime(r.hours)}</span>` : ''}
              ${r.address ? `<span class="event-pill">📍 ${r.address}</span>`  : ''}
              ${r.cost ? `<span class="event-pill">${r.cost}</span>`         : ''}
              ${r.audience ? `<span class="event-pill">👥 ${r.audience}</span>` : ''}
              ${r.register === 'yes' ? `<a href="register.html?event=${encodeURIComponent(r.name)}" class="btn btn-sm btn-outline">Register</a>` : ''}
            </div>
          </div>
        </div>`;

        const container = document.getElementById('list').querySelector('.event-container');
        const allBuiltIn = Array.from(container.querySelectorAll('.event-list'));
        const eventDate = new Date(r.hours.split(' at ')[0]);

        const insertBefore = allBuiltIn.find(el => {
            const d = el.dataset.date;
            return d && new Date(d) > eventDate;
        });

        if(insertBefore){
            container.insertBefore(li, insertBefore);
        } else{
            container.appendChild(li);
        }
        });

        applyFilters();
    })
    .catch(() => {
        //sheet unreachable - built in event still show normally
    })