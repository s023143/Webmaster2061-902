const allSteps = document.querySelectorAll('.step');
const continueBtn = document.getElementById('continueBtn');
const formChoice = document.getElementById('formChoice');
const mainForm = document.getElementById('mainForm');

let currentIndex = 0;
let visibleSteps = [];

function showCurrentStep() {
  allSteps.forEach(step => step.classList.remove('active'));
  visibleSteps[currentIndex].classList.add('active');
}

continueBtn.addEventListener('click', () => {
  if (!formChoice.checkValidity()) {
    formChoice.reportValidity();
    return;
  }

  visibleSteps = Array.from(
    document.querySelectorAll(`.${formChoice.value}Form`)
  );

  allSteps[0].classList.remove('active');
  currentIndex = 0;
  showCurrentStep();
});

document.addEventListener('click', e => {
  if (e.target.classList.contains('next')) {
    const currentStep = visibleSteps[currentIndex];
    const inputs = currentStep.querySelectorAll('input, select, textarea');

    for (let input of inputs) {
      if (!input.checkValidity()) {
        input.reportValidity();
        return;
      }
    }

    currentIndex++;
    showCurrentStep();
  }

  if (e.target.classList.contains('prev')) {
    if (currentIndex === 0) {
      visibleSteps[currentIndex].classList.remove('active');
      allSteps[0].classList.add('active');
    } else {
      currentIndex--;
      showCurrentStep();
    }
  }
});

function toggleOther(select, inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;

  if (select.value === 'other' || select.value === 'yes') {
    input.style.display = 'block';
    input.required = true;
  } else {
    input.style.display = 'none';
    input.required = false;
    input.value = '';
  }
}

mainForm.addEventListener('submit', e => {
  e.preventDefault();

  allSteps.forEach(step => {
    if (!step.classList.contains('active')) {
      step.querySelectorAll('input, select, textarea').forEach(el => {
        el.dataset.wasRequired = el.required;
        el.required = false;
      });
    }
  });

  const inputs = visibleSteps[currentIndex].querySelectorAll(
    'input, select, textarea'
  );

  for (let input of inputs) {
    if (!input.checkValidity()) {
      input.reportValidity();
      return;
    }
  }

  window.location.href = 'confirmation.html';
});


