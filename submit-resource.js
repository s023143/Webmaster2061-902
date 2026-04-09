const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxxusHFaeC22xszYBQYvduU5NUy6cTLS959E10d2_-AMSygFVffQCP0JcfRFADTNK9J0w/exec';

const allSteps    = document.querySelectorAll('.step');
const continueBtn = document.getElementById('continueBtn');
const mainForm    = document.getElementById('mainForm');

let currentIndex = 0;
let visibleSteps = [];

function getFormType() {
  const checked = document.querySelector('input[name="formType"]:checked');
  return checked ? checked.value : null;
}

function updateProgress(stepIndex) {
  document.querySelectorAll('.progress-step').forEach((el, i) => {
    el.classList.remove('active', 'done');
    if (i < stepIndex)   el.classList.add('done');
    if (i === stepIndex) el.classList.add('active');
  });
}

function showStep(index) {
  allSteps.forEach(s => s.classList.remove('active'));
  if (visibleSteps[index]) {
    visibleSteps[index].classList.add('active');
    updateProgress(parseInt(visibleSteps[index].dataset.step) || index);
  }
}

//step 0 - choose type
continueBtn.addEventListener('click', () => {
  const type = getFormType();
  if (!type) { alert('Please select what you would like to submit.'); return; }
  visibleSteps = [allSteps[0], ...Array.from(document.querySelectorAll(`.${type}Form`))];
  currentIndex = 1;
  showStep(currentIndex);
});

//previous and next buttons
document.addEventListener('click', e => {
  if (e.target.classList.contains('next')) {
    const currentStep = visibleSteps[currentIndex];
    const inputs = currentStep.querySelectorAll('input, select, textarea');
    for (let inp of inputs) {
      if (inp.style.display === 'none') continue;
      if (!inp.checkValidity()) { inp.reportValidity(); return; }
    }
    currentIndex++;
    showStep(currentIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (e.target.classList.contains('prev')) {
    currentIndex--;
    if (currentIndex < 0) currentIndex = 0;
    showStep(currentIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

//submit
mainForm.addEventListener('submit', e => {
  e.preventDefault();

  //validate final step
  const currentStep = visibleSteps[currentIndex];
  const inputs = currentStep.querySelectorAll('input, select, textarea');
  for (let inp of inputs) {
    if (inp.style.display === 'none') continue;
    if (!inp.checkValidity()) { inp.reportValidity(); return; }
  }

  const type = getFormType();
  const submission = { type };

  if (type === 'resource') {
    submission.name = document.getElementById('resourceName').value;
    submission.category = document.getElementById('resourceType').value;
    submission.address = document.getElementById('resourceAddress').value;
    submission.phone = document.getElementById('resourcePhone').value;
    submission.hours = document.getElementById('resourceHours').value;
    submission.description = document.getElementById('resourceDesc').value;
    submission.audience = document.getElementById('resourceAudience').value;
    submission.cost = '';
    submission.register = document.getElementById('hasApplication').value === 'yes' ? 'yes' : 'no';
  } else {
    const costSelect = document.getElementById('eventCost');
    const costOther = document.getElementById('eventCostOther');
    const costValue = costSelect.value === 'other' ? costOther.value : costSelect.value;

    submission.name = document.getElementById('eventName').value;
    submission.category = document.getElementById('eventType').value;
    submission.address = document.getElementById('eventLocation').value;
    submission.hours = document.getElementById('eventDate').value
    + ' at ' + document.getElementById('eventTime').value;
    submission.description = document.getElementById('eventDetails').value;
    submission.audience = document.getElementById('eventAudience').value;
    submission.cost = costValue;
    submission.register = document.getElementById('eventRegister').value;

  }

  //send to Google Sheets, then redirect regardless of outcome
  fetch(SHEET_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify(submission)
  })
  .finally(() => {
    window.location.href = 'confirmation.html';
  });
});

//show/hide conditional fields (Other, Yes/No, etc.)
function toggleOther(select, inputId) {
  const el = document.getElementById(inputId);
  if (!el) return;
  const show = select.value === 'other' || select.value === 'yes';
  el.style.display = show ? 'block' : 'none';
  el.required = show;
  if (!show) el.value = '';
}

//update progress indicator
updateProgress(0);
