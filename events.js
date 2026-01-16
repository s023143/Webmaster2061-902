function search_event() {
    let input = document.getElementById('searchbar').value
    input = input.toLowerCase();
    let x = document.getElementsByClassName('event');
    for (i = 0; i < x.length; i++) {
        if (!x[i].innerHTML.toLowerCase().includes(input)) {
            x[i].style.display = "none";
        }
        else {
            x[i].style.display ="flex";
        }
    }
}
const dateFilter = document.getElementById('dateFilter');
const typeFilter = document.getElementById('typeFilter');

const startTime = document.getElementById('startTime');
const endTime = document.getElementById('endTime');

const clearButton = document.getElementById('clearFilters');
const events = document.querySelectorAll('.event');

function filterEvents() {
  const dateVal = dateFilter.value;
  const typeVal = typeFilter.value;

  const startVal = startTime.value;
  const endVal = endTime.value;

  events.forEach((event) => {
     
   
     
    const eventDate = event.dataset.date;
    const eventTime = event.dataset.time;
    const eventType = event.dataset.type;

    let visible = true;

    // DATE FILTER
    if (dateVal && eventDate !== dateVal) visible = false;

    // TYPE FILTER
    if (typeVal && eventType !== typeVal) visible = false;

    // TIME RANGE FILTER
    if (startVal && eventTime < startVal) visible = false;
    if (endVal && eventTime > endVal) visible = false;

    event.style.display = visible ? 'flex' : 'none';
   
   
  });
}

dateFilter.addEventListener('change', filterEvents);
typeFilter.addEventListener('change', filterEvents);
startTime.addEventListener('change', filterEvents);
endTime.addEventListener('change', filterEvents);

clearButton.addEventListener('click', () => {
  dateFilter.value = '';
  typeFilter.value = '';
  startTime.value = '';
  endTime.value = '';
  filterEvents();
});

