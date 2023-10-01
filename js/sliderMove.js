let isSlideDown = false;
let slideStartX = 0;
let slideDX = 0;
const MAX_FORCE = 100;

const slideOnStart = (x) => {
   isSlideDown = true;
   slideStartX = slideDX = x;
};
function slideOnMove(x) {
   if (isSlideDown) {
      const dx = slideDX - x;
      all_slides.scrollLeft += dx;
      slideDX = x;
      nextSlideDuration = Date.now() + autoSlideDuration;
   }
}
const slideOnStop = (x) => {
   isSlideDown = false;
   const tx = slideStartX - x;
   let dir = 0;

   if (tx > MAX_FORCE) {
      // left slide
      currentSlide = (currentSlide + MSL + 1) % MSL;
      dir = 1;
   } else if (tx < -MAX_FORCE) {
      // right slide
      dir = -1;
      currentSlide = (currentSlide + MSL - 1) % MSL;
   } else {
      dir = 0;
   }

   moveSlider(dir);
};

/*  ---------- event listener for pc  -----------*/
// all_slides.addEventListener("mousedown", (e) => slideOnStart(e.clientX));
// all_slides.addEventListener("mouseup", (e) => slideOnStop(e.clientX));
// all_slides.addEventListener("mousemove", (e) => slideOnMove(e.clientX));

/*  ---------- event listener for mobile -----------*/
let touchEnd = 0;
// all_slides.addEventListener("touchstart", (e) => 
//    slideOnStart(e.touches[0].clientX)
// );
// all_slides.addEventListener("touchend", (e) => slideOnStop(touchEnd));
// all_slides.addEventListener("touchmove", (e) => {
//    slideOnMove(e.touches[0].clientX)
//    touchEnd = e.touches[0].clientX;
// });

// slide selection click event
options.forEach((option, i) => {
   option.addEventListener("click", () => {
      const DIS_DIR = getAryDirDistance(MSL, currentSlide, i);
      const { dir, dis } = DIS_DIR;
      currentSlide = (currentSlide + MSL + dir) % MSL;
      moveSlider(dir, dis);
   });
});
