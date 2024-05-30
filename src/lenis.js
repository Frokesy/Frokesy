import Lenis from '@studio-freight/lenis';


const lenisOptions = {
    lerp: 0.1,
    duration: 1.5,
    smoothTouch: true,
    smooth: true,
};

const lenis = new Lenis(lenisOptions);

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
