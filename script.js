const track = document.querySelector('.carousel__track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.carousel__button--right');
const prevButton = document.querySelector('.carousel__button--left');
const dotsNav = document.querySelector('.carousel__nav');
const dots = Array.from(dotsNav.children);

function getSlideWidth() {
    return track.getBoundingClientRect().width;
  }
  
  function setSlidePositions() {
    const width = getSlideWidth();
    slides.forEach((slide, index) => {
      slide.style.left = width * index + 'px';
    });
  }
  
  function moveToSlide(currentSlide, targetSlide) {
    track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
    currentSlide.classList.remove('current-slide');
    targetSlide.classList.add('current-slide');
  }
  
  function updateDots(currentDot, targetDot) {
    currentDot.classList.remove('current-slide');
    targetDot.classList.add('current-slide');
  }
  
  function hideShowArrows(targetIndex) {
    prevButton.classList.toggle('is-hidden', targetIndex === 0);
    nextButton.classList.toggle('is-hidden', targetIndex === slides.length - 1);
  }
  
  // Wait for full paint before measuring
  window.addEventListener('load', () => {
    setSlidePositions();
  
    // Recalculate on resize so arrows/positions stay correct
    window.addEventListener('resize', () => {
      const currentSlide = track.querySelector('.current-slide');
      const currentIndex = slides.indexOf(currentSlide);
      setSlidePositions();
      track.style.transform = 'translateX(-' + currentSlide.style.left + ')';
    });
  });
  
  prevButton.addEventListener('click', () => {
    const currentSlide = track.querySelector('.current-slide');
    const prevSlide = currentSlide.previousElementSibling;
    const currentDot = dotsNav.querySelector('.current-slide');
    const prevDot = currentDot.previousElementSibling;
    const prevIndex = slides.indexOf(prevSlide);
  
    moveToSlide(currentSlide, prevSlide);
    updateDots(currentDot, prevDot);
    hideShowArrows(prevIndex);
  });
  
  nextButton.addEventListener('click', () => {
    const currentSlide = track.querySelector('.current-slide');
    const nextSlide = currentSlide.nextElementSibling;
    const currentDot = dotsNav.querySelector('.current-slide');
    const nextDot = currentDot.nextElementSibling;
    const nextIndex = slides.indexOf(nextSlide);
  
    moveToSlide(currentSlide, nextSlide);
    updateDots(currentDot, nextDot);
    hideShowArrows(nextIndex);
  });
  
  dotsNav.addEventListener('click', (e) => {
    const targetDot = e.target.closest('button');
    if (!targetDot) return;
  
    const currentSlide = track.querySelector('.current-slide');
    const currentDot = dotsNav.querySelector('.current-slide');
    const targetIndex = dots.indexOf(targetDot);
    const targetSlide = slides[targetIndex];
  
    moveToSlide(currentSlide, targetSlide);
    updateDots(currentDot, targetDot);
    hideShowArrows(targetIndex);
  });
  