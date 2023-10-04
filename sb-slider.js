class Slider extends HTMLElement {
   constructor() {
      super();
      this.index = 0;
      this.autoUpdateDuration = 5000; // in milliseconds
      this.animationDuration = 300; // in milliseconds
      this.animationFPS = 60;
      this.width = "96vw";
      this.height = "300px";
      this.timeStatus = Date.now();

      this.shadow = this.attachShadow({ mode: "open" });
      this.allImgs = this.querySelectorAll("slide");
      this.slideData = [...this.allImgs].map((e) => {
         const obj = { src: "", href: "" };

         if (e.hasAttribute("src")) obj.src = e.getAttribute("src");
         if (e.hasAttribute("href")) obj.href = e.getAttribute("href");
         return obj;
      });
      this.MSL = this.allImgs.length; // max slides size
      this.innerHTML = "";

      if (this.MSL > 0) {
         this.template = document.createElement("template");
         this.template.innerHTML = `<style>${this.#getCss()}</style>${this.#getHtml()}`;
         this.shadow.appendChild(this.template.content.cloneNode(true));

         this.me = this.shadow.getElementById("slider");
         this.main = this.shadow.getElementById("main");
         this.slides = this.shadow.querySelectorAll(".slide");
         this.options = this.shadow.querySelectorAll(".option");

         this.#setSliderHREF(this.slides);

         this.#setSliderImages();
         this.eventListener = new SliderEventListener(this);

         setTimeout(() => {
            this.#update();
         }, this.autoUpdateDuration);
      }
   }

   static get observedAttributes() {
      return ["width", "height", "duration"];
   }

   attributeChangedCallback(name, value, newValue) {
      if (newValue && newValue != "") {
         switch (name) {
            case "width":
               this.width = this.#getModifiedValue(newValue);
               this.me.style.width = this.width;
               [...this.slides].forEach((slide) => {
                  slide.style.width = this.width;
               });
               break;

            case "height":
               this.height = this.#getModifiedValue(newValue);
               this.me.style.height = this.height;
               break;

            case "duration":
               const duration = this.#getModifiedValue(newValue, true);
               if (duration < 499) {
                  throw new Error(
                     "Please Pass a Higher Value in moveDuration\nEg: More than 500 (500 = 0.5s)\n"
                  );
               } else {
                  this.autoUpdateDuration = duration;
               }
               break;
         }
      }
   }

   #getModifiedValue(value, isTime = false) {
      if (isTime) {
         // time format
         return this.#getFormatTime(value);
      } else if (isNaN(value)) {
         return value;
      } else {
         return `${value}px`;
      }
   }

   #getFormatTime(string) {
      if (!isNaN(string)) {
         // if is number
         return Number(string);
      } else if (string.indexOf("ms") != -1) {
         const msIndex = string.indexOf("ms");
         return Number(string.substring(0, msIndex));
      } else if (string.indexOf("s") != -1) {
         const sIndex = string.indexOf("s");
         return Number(string.substring(0, sIndex)) * 1000;
      }

      return 1000;
   }

   #getHtml() {
      return `<div id="slider">
         <div id="main">
            <div class="slide"></div>
            <div class="slide"></div>
            <div class="slide"></div>
         </div>
         <div id="clickSelection">${this.#getOptions()}</div>
      </div>
   `;
   }

   #getCss() {
      return `
      *, *::after, *::before {
         margin: 0;
         padding: 0;
         box-sizing: border-box;
         user-select: none;
         --slider-w: ${this.width};
         --pointer: ${navigator.userAgentData.mobile ? "auto" : "pointer"};
      }
      #slider {
         position: relative;
         width: var(--slider-w);
         height: ${this.height};
         display: flex;
         justify-content: center;
         border-radius: 1vw;
         overflow: hidden;
      }
      #slider #main::-webkit-scrollbar {
         display: none;
      }
      #slider #main {
         position: relative;
         display: grid;
         grid-template-columns: 1fr 1fr 1fr;
         width: auto;
         height: 100%;
         overflow-x: scroll;
         overflow-y: hidden;
         cursor: var(--pointer);
      }
      #slider .slide {
         position: relative;
         width: var(--slider-w);
         height: 100%;
         background-position: center;
         background-repeat: no-repeat;
         background-size: cover;
      }
      #slider .slide::before {
         content: "src not found!";
         font-family: "Arial";
         color: white;
         font-size: x-large;
         font-weight: bold;
         position: absolute;
         width: 100%;
         height: 100%;
         display: flex;
         background: linear-gradient(55deg, #212121 0%, #212121 40%, #323232 calc(40% + 1px), #323232 60%, #008F95 calc(60% + 1px), #008F95 70%, #14FFEC calc(70% + 1px), #14FFEC 100%);
         justify-content: center;
         align-items: center;
         z-index: -1;
      }
      #slider #clickSelection {
         --radius: 15px;
         position: absolute;
         bottom: 5%;
         display: grid;
         grid-auto-flow: column;
         background-color: rgba(0, 0, 0, 0.2);
         border-radius: 20px;
         backdrop-filter: blur(2px);
         padding: 5px 10px;
         z-index: 2;
      }
      #slider .option {
         position: relative;
         width: var(--radius);
         height: var(--radius);
         cursor: var(--pointer);
         border-radius: 100px;
         margin: 0 2px;
         background-color: transparent;
         border: solid 1px white;
         transition: background-color 300ms linear;
      }
      #slider .option.active {
         background-color: #ffffff88;
         border: solid 1px white;
      }
      `;
   }

   #getOptions() {
      let html = ``;
      for (let i = 0; i < this.MSL; i++) {
         const isMatch = this.index == i;
         html += `<div class="option ${isMatch ? "active" : ""}"></div>`;
      }
      return html;
   }

   delay(ms) {
      return new Promise((res) => setTimeout(res, ms));
   }

   #setSliderHREF(slides) {
      [...slides].forEach((slide) => {
         slide.addEventListener("click", (e) => {
            if (this.eventListener.onlyStart == this.eventListener.dx) {
               const a = document.createElement("a");
               a.href = this.slideData[this.index].href || "#";
               document.body.appendChild(a);
               a.click();
               document.body.removeChild(a);
               console.log(this.eventListener.down);
            }
         });
      });
   }

   #setSliderImages() {
      for (let i = -1; i <= 1; i++) {
         const I = (this.index + this.MSL + i) % this.MSL;
         this.slides[
            i + 1
         ].style.backgroundImage = `url("${this.slideData[I].src}")`;
      }
      this.main.scrollLeft = this.main.clientWidth;
   }

   #updateSelections() {
      this.options.forEach((o) => o.classList.remove("active"));
      this.options[this.index].classList.add("active");
   }

   async #smoothScroll(
      element,
      currentScroll,
      tergetScroll,
      fun,
      duration = this.animationDuration
   ) {
      const distance = tergetScroll - currentScroll;
      const NoOfFrames = this.animationFPS * (duration / 1000);
      const dx = distance / NoOfFrames;
      let left = element.scrollLeft;

      for (let i = 0; i < NoOfFrames; i++) {
         await this.delay(1000 / this.animationFPS);
         left += dx;
         element.scrollLeft = Math.round(left);
      }
      fun();
   }

   move(dir, jump) {
      this.timeStatus = Date.now() + this.autoUpdateDuration; // update auto slide duration
      const slideWidth = this.main.clientWidth;
      const slideLeft = this.main.scrollLeft;
      const slideDir = slideWidth + dir * slideWidth;
      const slideDuration = jump ? 100 : this.animationDuration;

      const fun = () => {
         this.#updateSelections();
         this.#setSliderImages();

         // when long jump (slide click event)
         if (jump) {
            this.index = (this.index + this.MSL + dir) % this.MSL;
            this.move(dir, jump - 1);
         }
      };

      this.#smoothScroll(this.main, slideLeft, slideDir, fun, slideDuration);
   }

   #update() {
      const dt = Date.now();
      if (dt > this.timeStatus - 50) {
         this.index = (this.index + this.MSL + 1) % this.MSL;
         this.move(1);
         setTimeout(() => this.#update(), this.autoUpdateDuration);
      } else {
         setTimeout(() => this.#update(), this.timeStatus - dt);
      }
   }
}

class SliderEventListener {
   constructor(slider) {
      this.slider = slider;
      this.animationDuration = this.slider.animationDuration;
      slider.timeStatus = Date.now();
      this.down = false;
      this.startX = 0;
      this.dx = 0;
      this.touchEnd = 0;
      this.onlyStart = 0;
      this.MAX_FORCE = 100;

      /*  ---------- event listener for pc  -----------*/
      this.slider.main.addEventListener("mousedown", (e) =>
         this.#onStart(e.clientX)
      );
      this.slider.main.addEventListener("mouseup", (e) =>
         this.#onStop(e.clientX)
      );
      this.slider.main.addEventListener("mousemove", (e) =>
         this.#onMove(e.clientX)
      );

      /*  ---------- event listener for mobile -----------*/
      this.slider.main.addEventListener("touchstart", (e) =>
         this.#onStart(e.touches[0].clientX)
      );
      this.slider.main.addEventListener("touchend", (e) =>
         this.#onStop(this.touchEnd)
      );
      this.slider.main.addEventListener("touchmove", (e) => {
         this.#onMove(e.touches[0].clientX);
         this.touchEnd = e.touches[0].clientX;
      });

      this.slider.options.forEach((option, i) => {
         option.addEventListener("click", () => {
            const { index, MSL } = this.slider;
            const DIS_DIR = this.#getAryDirDistance(MSL, index, i);
            const { dir, dis } = DIS_DIR;
            this.slider.index = (index + MSL + dir) % MSL;
            this.slider.move(dir, dis);
         });
      });
   }

   #getAryDirDistance(max, current, target) {
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
         dis: Math.abs(min) - 1,
      };
   }

   #onStart(x) {
      this.down = true;
      this.onlyStart = this.startX = this.dx = x;
   }

   #onMove(x) {
      if (this.down) {
         const dx = this.dx - x;
         if (!navigator.userAgentData.mobile) {
            this.slider.main.scrollLeft += dx;
         }
         this.dx = x;
         this.slider.timeStatus = Date.now() + this.slider.autoUpdateDuration;
      }
   }

   #onStop(x) {
      const { MSL, index } = this.slider;
      this.down = false;
      const tx = this.startX - x;
      let dir = 0;

      // left slide
      if (tx > this.MAX_FORCE) {
         this.slider.index = (index + MSL + 1) % MSL;
         dir = 1;

         // right slide
      } else if (tx < -this.MAX_FORCE) {
         dir = -1;
         this.slider.index = (index + MSL - 1) % MSL;
      } else {
         dir = 0;
      }

      this.slider.move(dir);
   }
}

customElements.define("sb-slider", Slider);
