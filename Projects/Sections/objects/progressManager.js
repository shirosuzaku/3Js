import gsap from "gsap";
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export class ProgressManager {
    constructor(className) {
      this.proxy = { t: 0 };
  
      gsap.to(this.proxy, {
        t: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: className,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          onUpdate: (self) => {
            this.progress = self.progress; // ✅ store progress in the class
            this.getProgress();
          }
        }
      });
    }
    
    getProgress() {
        return this.progress
        const pos = this.curve.getPoint(this.progress);
        this.sphere.position.copy(pos);
    }
}