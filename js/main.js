const sliderImages = [
   `./src/0.jpg`,
   `./src/1.jpg`,
   `./src/2.jpg`,
   `./src/3.jpg`,
   `./src/4.jpg`,
   `./src/5.jpg`,
   `./src/6.jpg`,
   `./src/7.jpg`,
];

let autoSlideDuration = 5000;
let nextSlideDuration = Date.now();
const MSL = sliderImages.length; // max slides size
let currentSlide = 0;
// setSelections();
const options = document.querySelectorAll("#image_click_selection .option");
const SLIDES = document.querySelectorAll(".slide");

function updateSliderImages() {
   for (let i = -1; i <= 1; i++) {
      const I = (currentSlide + MSL + i) % MSL;
      SLIDES[i + 1].style.backgroundImage = `url('${sliderImages[I]}')`;
   }
   all_slides.scrollLeft = all_slides.clientWidth;
}

// select slides
function moveSlider(dir, jump) {
   nextSlideDuration = Date.now() + autoSlideDuration; // update auto slide duration
   const slideWidth = all_slides.clientWidth;
   const slideLeft = all_slides.scrollLeft;
   const slideDir = slideWidth + dir * slideWidth;
   const slideDuration = jump ? 100 : slideAnimationDuration;

   const fun = () => {
      updateSlideSelections();
      updateSliderImages();

      // when long jump (slide click event)
      if (jump) {
         currentSlide = (currentSlide + MSL + dir) % MSL;
         moveSlider(dir, jump - 1);
      }
   };

   smoothScroll(all_slides, slideLeft, slideDir, fun, slideDuration);
}

function setSelections() {
   let html = ``;
   for (let i = 0; i < MSL; i++) {
      const isMatch = currentSlide == i;
      html += `<div class="option ${isMatch ? "active" : ""}"></div>`;
   }
   image_click_selection.innerHTML = html;
}

function updateSlideSelections() {
   options.forEach((o) => o.classList.remove("active"));
   options[currentSlide].classList.add("active");
}

// auto slide update
function _ASM_() {
   const dt = Date.now();
   if (dt > nextSlideDuration - 50) {
      currentSlide = (currentSlide + MSL + 1) % MSL;
      moveSlider(1);
      setTimeout(_ASM_, autoSlideDuration);
   } else {
      setTimeout(_ASM_, nextSlideDuration - dt);
   }
}

// deafult call
// updateSliderImages();
// _ASM_();
