"use strict";
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const slideAnimationDuration = 300; // in milliseconds
const slideAnimationFPS = 60;

async function smoothScroll(
   element,
   currentScroll,
   tergetScroll,
   fun,
   duration = slideAnimationDuration
) {
   // console.log(element, currentScroll, tergetScroll, fun);
   const distance = tergetScroll - currentScroll;
   const NoOfFrames = slideAnimationFPS * (duration / 1000);
   const dx = distance / NoOfFrames;
   let left = element.scrollLeft;

   for (let i = 0; i < NoOfFrames; i++) {
      await delay(1000 / slideAnimationFPS);
      left += dx;
      element.scrollLeft = Math.round(left);
   }

   fun();
}

function getAryDirDistance(max, current, target) {
   const a = target - current;
   const b = max - Math.abs(a);

   if (a == 0) return { dir: 0, dis: 0 };

   let min = Math.min(Math.abs(a), Math.abs(b));

   let dir;

   if (a == min && b < 0) {
      dir = -1;
   } else if (a == min && b > 0) {
      dir = 1;
   } else if (b == min && a > 0) {
      dir = -1;
   } else if (b == min && a < 0) {
      dir = 1;
   } else {
      dir = -1;
   }

   return {
      dir: dir,
      dis: Math.abs(min) - 1
   };
}
