
gsap.registerPlugin(ScrollTrigger, CustomEase, Flip);
CustomEase.create("primary", "0.51, 0, 0.08, 1");
CustomEase.create("test", "0.6, 0.06, 0.01, 0.99");
CustomEase.create("cta", "0.5, 0, 0.02, 0.99");
CustomEase.create("loadOut", "0.42, 0, 0.08, 1");
CustomEase.create("loadIn", "0.57, 0, 0.08, 1");
CustomEase.create("motion", "0.47, 0, 0, 1");

// —————  100VH MINUS NAV  —————
const appHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty("--app-height", `${window.innerHeight}px`);
};
window.addEventListener("resize", appHeight);
appHeight();
window.addEventListener("DOMContentLoaded", (event) => {
  appHeight();
});

// ————— LENIS
("use strict");
let lenis;

if (Webflow.env("editor") === undefined) {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    touchMultiplier: 2,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  $("[data-lenis-start]").on("click", function () {
    lenis.start();
  });
  $("[data-lenis-stop]").on("click", function () {
    lenis.stop();
  });
  $("[data-lenis-toggle]").on("click", function () {
    $(this).toggleClass("stop-scroll");
    if ($(this).hasClass("stop-scroll")) {
      lenis.stop();
    } else {
      lenis.start();
    }
  });
}
gsap.defaults({
  ease: "primary",
});

let splitLetters;
let splitLines;
const vimeoPlayers = {};
function runSplit(next) {
  if (!next) next = document;

  let letterTargets = next.querySelectorAll("[data-split-letters]");
  splitLetters = new SplitType(letterTargets, {
    types: "words, chars",
  });

  let lineTargets = next.querySelectorAll("[data-split-lines]");
  splitLines = new SplitType(lineTargets, {
    types: "lines, words",
  });
}

// ————— Update on window resize
let windowWidth = $(window).innerWidth();
window.addEventListener("resize", function () {
  if (windowWidth !== $(window).innerWidth()) {
    windowWidth = $(window).innerWidth();
    splitLetters.revert();
    splitLines.revert();
    runSplit();
  }
});

let nav = document.querySelector(".nav-w");
let loadWrap = document.querySelector(".load-w");
let loadBg = document.querySelector(".load-bg");
let loadInner = document.querySelector(".load-inner");
let loadTextWrap = document.querySelector(".load-inner__text");
let loadTextItem = document.querySelectorAll(".load-text__wrap");
let loadTexts = document.querySelectorAll(".load-text");
let loadPlusTl = loadWrap.querySelector(".u--abs.top-left");
let loadPlusTr = loadWrap.querySelector(".u--abs.top-right");
let loadPlusBl = loadWrap.querySelector(".u--abs.bottom-left");
let loadPlusBr = loadWrap.querySelector(".u--abs.bottom-right");
let loadLogo = loadWrap.querySelector(".load-logo");
let homeCurveTop = document.querySelector(".home-load__curve.is--top");
let homeCurveBottom = document.querySelector(".home-load__curve.is--bottom");
//var loaderColumns = document.querySelector(".home-load__item");
var loaderColumnsDefault = document.querySelector(".home-load__item.default");
var loaderMiddle = document.querySelector(".home-load__item.middle");
let loaderInitial = document.querySelector("#initial");
let loadNames = [
  "home",
  "work",
  "project",
  "artists",
  "artist",
  "about",
  "contact",
];

const isMobile = window.innerWidth < 480;
const isMobileLandscape = window.innerWidth < 768;
const isLoadBreak = window.innerWidth < 1367;

let ranHomeLoader = false;
let isAnimatingServices = false;
let mainSlider;
let thumbSlider;
let loadDuration = 1;

function prefersReducedMotion() {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  return query.matches;
}
function resetWebflow(data) {
  let parser = new DOMParser();
  let dom = parser.parseFromString(data.next.html, "text/html");
  let webflowPageId = dom.querySelector("html").getAttribute("data-wf-page");
  document.documentElement.setAttribute("data-wf-page", webflowPageId);
  window.Webflow.destroy();
  window.Webflow.ready();
  window.Webflow.require("ix2").init();
}
function resetHome(next) {
  let homeLogo = next.querySelector(".home-hero__h");
  let homeTitle = next.querySelector("[data-home-title]");
  let links = document.querySelectorAll(".text-link");
  gsap.set([homeLogo, homeTitle, links], { opacity: 1 });
  gsap.set(".home-load__wrap", { display: "none" });
  gsap.set(".home-hero__vid", {
    width: "100vw",
    height: "100vh",
  });
  let homeVid = document.querySelector("#hero-vid");
  homeVid.play();
}
function ignoreCurrentPageLink(next) {
  if (!next) next = document;
  let links = next.querySelectorAll("a");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      if (link.getAttribute("href") === window.location.pathname) {
        e.preventDefault();
      }
    });
  });
}
//
//
function initHomeLoader() {
  gsap.set(".load-w", { display: "none", overwrite: true });
  let homeLogo = document.querySelector(".home-hero__h");
  let homeTitle = document.querySelector("[data-home-title]");
  let homeVid = document.querySelector("#hero-vid");
  let homeVidWrap = document.querySelector(".home-hero__vid");
  let homeCenter = document.querySelector(".home-load__item.center");
  let homeCurveTop = document.querySelector(".home-cover__curve.is--top");
  let homeCurveBottom = document.querySelector(".home-cover__curve.is--bottom");
  let homeLoadItems = document.querySelectorAll(".home-load__item.default");
  let main = document.querySelector(".main-w");
  main.classList.add("is--transitioning");
  gsap.delayedCall(0.5, () => {
    let tl = gsap.timeline({
      defaults: {
        duration: 1.2,
      },
    });
    tl.to([homeCenter, homeVidWrap], {
      width: "100vw",
      height: "100vh",
    })
      .to(
        homeLoadItems,
        {
          width: "6vw",
          height: "100vh",
        },
        "<",
      )
      .to(
        homeCurveTop,
        {
          scale: 1.1,
          y: "-110%",
          rotate: 0.001,
        },
        0.05,
      )
      .to(
        homeCurveBottom,
        {
          y: "110%",
          scale: 1.1,
          rotate: 0.001,
        },
        "<",
      )
      .fromTo(
        [homeTitle, homeLogo],
        { opacity: 0, y: "2rem" },
        { opacity: 1, y: "0rem", duration: 0.5, stagger: 0.1 },
      )
      .fromTo(
        ".text-link[data-nav-item]",
        { opacity: 0, yPercent: -100 },
        {
          opacity: 1,
          yPercent: 0,
          duration: 0.5,
          stagger: 0.1,
        },
        "<",
      )
      .add(() => {
        homeVid.play();
        main.classList.remove("is--transitioning");
        ranHomeLoader = true;
        sessionStorage.setItem("loaderShown", "true");
      });
  });
}
function runTransition(container, data, nextName, nextContainer) {
  if (!container) container = document.querySelector(".main-w");
  let parent = container.parentElement;
  let index = loadNames.findIndex((loadName) => loadName === nextName);
  if (index === 0) {
    index = -2;
  }
  let centralIndex = 0;
  const scrollY = window.scrollY;
  let transformDistance = -(index - centralIndex) * 4;
  loaderMiddle = document.querySelector(".home-load__item.middle");
  loaderColumnsDefault = document.querySelectorAll(".home-load__item.default");

  let tl = gsap.timeline({
    defaults: {
      ease: "power4.inOut",
      duration: loadDuration,
      overwrite: "auto",
    },
  });

  tl.set(nextContainer, {
    clipPath: "inset(22.5vh 48.5vw)",
    height: "100vh",
    z: 0.001,
    overflow: "hidden",
    autoAlpha: 0,
  })
    .set(container, {
      left: "0",
      right: "0",
      top: `-${scrollY}px`,
    })
    .set(parent, {
      height: "100vh",
      overflow: "hidden",
    })
    .set(loadWrap, { display: "flex" }, 0)
    .set(loaderMiddle, { opacity: 0, z: 0.001 }, 0)
    .fromTo(
      [loadPlusTl, loadPlusBl],
      {
        xPercent: -200,
        rotate: -90,
      },
      {
        xPercent: 0,
        rotate: 0,
        delay: 0.15,
        yoyo: true,
        repeat: 1,
        repeatDelay: loadDuration / 1.25,
        duration: loadDuration / 1.25,
      },
      0,
    )
    .fromTo(
      [loadPlusTr, loadPlusBr],
      {
        xPercent: 200,
        rotate: 90,
      },
      {
        xPercent: 0,
        rotate: 0,
        delay: 0.15,
        yoyo: true,
        repeat: 1,
        repeatDelay: loadDuration / 1.25,
        duration: loadDuration / 1.25,
      },
      0,
    )
    .fromTo(
      loadLogo,
      {
        yPercent: -200,
      },
      {
        yPercent: 0,
        delay: 0.15,
        yoyo: true,
        repeat: 1,
        repeatDelay: loadDuration / 1.25,
        duration: loadDuration / 1.25,
      },
      0,
    )
    .fromTo(
      homeCurveTop,
      { width: "250vh", y: "-125vh", z: 0 },
      {
        width: isMobile ? "100vh" : "175vh",
        y: isMobile ? "-10vh" : "-50vh",
        z: 0.001,
        duration: loadDuration + 0.1,
      },
      0,
    )
    .fromTo(
      homeCurveBottom,
      { width: "250vh", y: "125vh", z: 0 },
      {
        width: isMobile ? "100vh" : "175vh",
        y: isMobile ? "10vh" : "50vh",
        z: 0.001,
        duration: loadDuration + 0.1,
      },
      0,
    )
    .fromTo(
      ".home-load__inner",
      {
        width: "100vw",
        height: "100vh",
        z: 0,
      },
      { width: "60vw", z: 0.001 },
      0,
    )
    .fromTo(
      loaderMiddle,
      { width: "100vw", height: "100vh", z: 0 },
      {
        width: "3vw",
        height: "45vh",
        z: 0.001,
        overwrite: "auto",
        onComplete: () => {
          gsap.set(loaderMiddle, { opacity: 1 });
          loaderMiddle.classList.remove("middle");
          loaderMiddle.classList.add("default");
          let loaderColumns = Array.from(
            document.querySelectorAll(".home-load__item"),
          );
          let currentMiddleIndex = loaderColumns.indexOf(loaderMiddle);
          let newMiddleIndex = currentMiddleIndex + index;
          newMiddleIndex = Math.max(
            0,
            Math.min(loaderColumns.length - 1, newMiddleIndex),
          );
          loaderColumns[newMiddleIndex].classList.add("middle");
          loaderMiddle = document.querySelector(".home-load__item.middle");
          loaderColumnsDefault = document.querySelectorAll(
            ".home-load__item.default",
          );

          var outroTl = gsap.timeline({
            defaults: {
              ease: "power3.inOut",
              duration: loadDuration,
              overwrite: "auto",
            },
            onComplete: () => {
              gsap.set(loadWrap, { display: "none" });
              gsap.set([nextContainer, parent], {
                overflow: "auto",
                height: "auto",
                clearProps: "all",
              });
              gsap.set(loaderColumnsDefault, { x: "0vw", clearProps: "all" });
              loaderMiddle.classList.remove("middle");
              loaderInitial.classList.add("middle");
              loaderInitial.classList.remove("default");
              loaderMiddle = null;
            },
          });
          outroTl
            .set(loaderMiddle, { opacity: 0, delay: 0.1 })
            .set(nextContainer, { autoAlpha: 1 })
            .fromTo(
              nextContainer.querySelector(".main-overlay"),
              { opacity: 1 },
              { opacity: 0, z: 0.001 },
            )
            .to(
              nextContainer,
              {
                clipPath: "inset(0vh 0vw)",
                clearProps: "all",
                z: 0.001,
              },
              "<",
            )
            .to(
              loaderMiddle,
              { width: "100vw", height: "100vh", z: 0.001 },
              "<",
            )
            .to(
              ".home-load__inner",
              { width: "99vw", height: "100vh", clearProps: "all", z: 0.001 },
              "<",
            )
            .to(
              homeCurveTop,
              {
                width: "250vh",
                y: "-125vh",
                clearProps: "all",
                z: 0.001,
                duration: loadDuration + 0.2,
              },
              "<",
            )
            .to(
              homeCurveBottom,
              {
                width: "250vh",
                y: "125vh",
                z: 0.001,
                clearProps: "all",
                duration: loadDuration + 0.2,
              },
              "<",
            );
          tl.add(outroTl, "outro");
        },
      },
      0,
    )
    .fromTo(
      loaderColumnsDefault,
      { width: "6vw", height: "100vh", z: 0 },
      { width: "3vw", height: "45vh", z: 0.001, overwrite: true },
      0,
    )
    .to(
      container,
      {
        clipPath: "inset(22.5vh 48.5vw)",
        z: 0.001,
      },
      0,
    )
    .fromTo(
      ".home-load__item",
      {
        x: "0vw",
        z: 0,
      },
      {
        x: `${transformDistance}vw`,
        z: 0.0001,
        height: "100vh",
        duration: loadDuration / 1.25,
      },
      loadDuration,
    )
    .addLabel("outro", ">-=0.25");
}

//
//

function initTitles(container) {
  if (!container) container = document;
  let wraps = container.querySelectorAll("[data-title-wrap]");
  if (!wraps.length) return;

  let letterTargets = container.querySelectorAll("[data-title-element]");
  splitLetters = new SplitType(letterTargets, {
    types: "words, chars",
  });

  wraps.forEach((wrap) => {
    let title = wrap.querySelector("[data-title-element]");
    let letters = title.querySelectorAll(".char");
    let direction = title.getAttribute("data-title-element");
    let directionDown = direction === "down";
    letters.forEach((letter, index) => {
      gsap.fromTo(
        letter,
        {
          x: "0em",
          y: directionDown
            ? `${-2.5 - 0.8 * index}em`
            : `${2.5 + 0.8 * index}em`,
          rotate: directionDown ? "-12deg" : "12deg",
          textShadow: directionDown
            ? "-0.3em 0.8em 0px currentColor, -0.6em 1.6em 0px currentColor"
            : "0.3em 0.8em 0px currentColor, 0.6em 1.6em 0px currentColor",
        },
        {
          x: "0em",
          y: directionDown ? "0em" : "-1.62em",
          rotate: "0deg",
          textShadow: "0em 0.8em 0px currentColor, 0em 1.6em 0px currentColor",
          duration: 1.5,
          stagger: 0.01,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrap,
            start: "top bottom",
            toggleActions: "play none none none",
          },
        },
      );
    });

    // gsap.fromTo(
    //   title.querySelectorAll(".char"),
    //   {
    //     x: "0em",
    //     y: directionDown ? "-1.6em" : "0em",
    //     rotate: directionDown ? "-12deg" : "12deg",
    //     textShadow: directionDown
    //       ? "-0.3em 0.8em 0px currentColor, -0.6em 1.6em 0px currentColor; "
    //       : "0.3em 0.8em 0px currentColor, 0.6em 1.6em 0px currentColor; ",
    //   },
    //   {
    //     x: "0em",
    //     y: "0em",
    //     rotate: "0deg",
    //     textShadow: directionDown
    //       ? "0em 0.8em 0px currentColor, 0em 1.6em 0px currentColor"
    //       : "0em 0.8em 0px currentColor, 0em 1.6em 0px currentColor",
    //     duration: 1.5,
    //     stagger: 0.01,
    //     ease: "power3.out",
    //     scrollTrigger: {
    //       trigger: wrap,
    //       markers: true,
    //       start: "top bottom",
    //       toggleActions: "play none none reset",
    //     },
    //     onComplete: () => {
    //       ScrollTrigger.refresh();
    //     },
    //   },
    // );
  });
}
function initNavToggle(container) {
  if (!container) container = document;
  let toggle = container.querySelector("[data-nav-toggle]");
  if (!toggle) return;
  ScrollTrigger.create({
    trigger: toggle,
    start: "top 5%",
    onEnter: function () {
      nav.classList.add("blend");
    },
    onLeaveBack: function () {
      nav.classList.remove("blend");
    },
  });
}
function initProjectHovers(next) {
  if (!next) next = document;
  let projectItems = next.querySelectorAll(".project-item");
  if (!projectItems) return;
  projectItems.forEach((item) => {
    item.addEventListener("mouseenter", () => toggleInactiveClass(item, true));
    item.addEventListener("mouseleave", () => toggleInactiveClass(item, false));
  });

  function toggleInactiveClass(currentItem, addClass) {
    projectItems.forEach((item) => {
      if (item !== currentItem) {
        item.classList.toggle("is--inactive", addClass);
      }
    });
  }
}
function initEyesImages(next) {
  if (!next) next = document;
  const eyes = next.querySelectorAll(".eyes-wrap");
  let duration;
  eyes.forEach((element) => {
    duration = element.getAttribute("data-duration");
    if (!duration) duration = 800;
  });

  eyes.forEach((container) => {
    const eyesImages = container.querySelectorAll(".eyes-img");
    let currentIndex = -1;

    function showNextImage() {
      currentIndex = (currentIndex + 1) % eyesImages.length;
      eyesImages.forEach((img, index) => {
        img.style.display = "none";
      });
      eyesImages[currentIndex].style.display = "block";
    }

    setInterval(showNextImage, duration);
    showNextImage();
  });
}
function initParallax(next) {
  if (!next) next = document;
  let parallax = next.querySelectorAll("[data-parallax-trigger]");
  if (!parallax) return;
  parallax.forEach((trigger) => {
    let target = trigger.querySelector("[data-parallax-target]");
    gsap.to(target, {
      scrollTrigger: {
        trigger: trigger,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
      yPercent: -8,
    });
  });
}
function initCtas(next) {
  let name;
  if (!next) {
    next = document;
    name = document.querySelector("main").getAttribute("data-barba-namespace");
  } else {
    name = next.getAttribute("data-barba-namespace");
  }

  let ctas = next.querySelectorAll(".cta-wrap");
  if (!ctas.length) return;

  let duration = 0.6;
  let ease = "cta";

  ctas.forEach((cta, index) => {
    let textTop = cta.querySelector('[data-cta-text="top"]');
    let textBottom = cta.querySelector('[data-cta-text="bottom"]');
    let lettersTop = textTop.querySelectorAll(".char");
    let lettersBottom = textBottom.querySelectorAll(".char");
    let parent;
    if (name !== "project" && name !== "artist") {
      parent = cta.parentElement;
    } else {
      parent = cta.parentElement.parentElement.parentElement.parentElement;
    }
    let plusTopLeft = parent.querySelector(".u--abs.top-left .plus-icon");
    let plusTopRight = parent.querySelector(".u--abs.top-right .plus-icon");
    let plusBottomLeft = parent.querySelector(".u--abs.bottom-left .plus-icon");
    let plusBottomRight = parent.querySelector(
      ".u--abs.bottom-right .plus-icon",
    );

    cta.addEventListener("mouseenter", () => {
      gsap.fromTo(
        lettersTop,
        {
          y: (i) => `-${1.25 + 0.2 * i}em`,
        },
        {
          y: "0em",
          stagger: 0.02,
          duration: duration,
          ease: ease,
          overwrite: true,
        },
      );
      gsap.fromTo(
        lettersBottom,
        {
          y: "0em",
        },
        {
          y: (i) => `${1.25 + 0.2 * i}em`,
          stagger: 0.02,
          duration: duration,
          ease: ease,
          overwrite: true,
        },
      );
      if (plusTopLeft) {
        gsap.fromTo(
          [plusTopLeft, plusBottomRight],
          { rotate: 0 },
          { rotate: 90, duration: duration, ease: ease },
        );
        gsap.fromTo(
          [plusTopRight, plusBottomLeft],
          { rotate: 0 },
          { rotate: -90, duration: duration, ease: ease },
        );
      }
    });
  });
}
function initNavScroll(next) {
  nav = next.querySelector(".nav-w");
  if (!nav) return;
  const navFadeElements = nav.querySelectorAll("[data-nav-item]");
  let lastScrollTop = 0;
  const buffer = 25;

  lenis.on(
    "scroll",
    (e) => {
      let scrollTop = window.scrollY || document.documentElement.scrollTop;

      if (Math.abs(scrollTop - lastScrollTop) > buffer) {
        if (scrollTop > lastScrollTop) {
          gsap.to(navFadeElements, {
            autoAlpha: 0,
            y: "-75%",
            stagger: {
              each: 0.03,
              from: "center",
            },
            ease: "power3",
            overwrite: "auto",
          });
        } else {
          gsap.to(navFadeElements, {
            autoAlpha: 1,
            y: "0%",
            ease: "power3",
            overwrite: "auto",
            stagger: {
              each: 0.03,
              from: "center",
            },
          });
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      }
    },
    { passive: true },
  );
}
function initFeatured(next) {
  if (!next) next = document;
  const sliderWrapper = next.querySelector(".slider-wrap");
  let isHome = sliderWrapper.classList.contains("home");
  const sliderInner = sliderWrapper.querySelector(".slider-inner");
  const slides = Array.from(sliderWrapper.querySelectorAll(".slide"));
  const amountOfSlides = slides.length;
  const slidesAmountTextBlock = next.querySelector("[data-slides-amount]");
  const sNrElement = next.querySelector(".s-nr");

  let activeIndex = Math.floor(amountOfSlides / 2);
  let translateYPercentage = -(activeIndex * 10);

  if (amountOfSlides < 5 && !isMobile) {
    let subtractedValue = `${(amountOfSlides - 1) * 4.5 + 1}rem`;
    sliderWrapper.style.setProperty(
      "--active-slide-size",
      `calc(100vw - ${subtractedValue})`,
    );
  }

  let introTl = gsap.timeline({
    defaults: {
      ease: "motion",
      duration: 0.8,
    },
  });
  introTl
    .fromTo(
      sNrElement,
      {
        yPercent: 0,
      },
      {
        yPercent: translateYPercentage,
      },
    )
    .fromTo(
      ".slider-container",
      { width: isMobile ? "12rem" : "31rem" },
      { width: "100%" },
      0,
    );
  if ((isMobile && amountOfSlides === 4) || amountOfSlides === 6) {
    introTl.to(
      sliderInner,
      {
        x: "-2.25rem",
      },
      0,
    );
  }

  ScrollTrigger.create({
    trigger: ".slider-container",
    start: "top 75%",
    animation: introTl,
    onEnter: () => {
      setInitialWrapperPosition();
    },
  });

  function remToPixels(rem) {
    return (
      rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
    );
  }

  const setInitialWrapperPosition = () => {
    sliderInner.style.justifyContent = "center";
    slides[activeIndex].classList.add("active");
  };

  const updateSlidesAmountText = () => {
    slidesAmountTextBlock.innerText =
      amountOfSlides < 10 ? `0${amountOfSlides}` : amountOfSlides;
  };
  updateSlidesAmountText();

  const updateSNrPosition = () => {
    translateYPercentage = -(activeIndex * 10);
    sNrElement.style.transform = `translateY(${translateYPercentage}%)`;
  };

  function manageVideoOnSlide(video, coverImage, overlay) {
    if (!video.src) {
      let videoSrc = video.getAttribute("data-src");
      if (videoSrc) {
        video.src = videoSrc;
        video.load();
      }
    } else {
      gsap.to([coverImage], { opacity: 0, duration: 0.3 });
      video.play();
    }

    video.addEventListener(
      "loadeddata",
      () => {
        gsap.to([coverImage], { opacity: 0, duration: 0.3 });
        video.play();
      },
      { once: true },
    );
  }

  function adjustSliderOnInteraction() {
    sliderInner.style.justifyContent = "center";
    const middleIndex = Math.floor(amountOfSlides / 2);
    let offsetMultiplier = middleIndex * 4.5;
    let edgeMultiplier = isMobile ? 1.5 : 9;
    let currentOffset = (middleIndex - activeIndex) * (4.5 * remToPixels(1));

    if (amountOfSlides > 4) {
      if (activeIndex === 0 || activeIndex === amountOfSlides - 1) {
        currentOffset =
          (activeIndex === 0 ? 1 : -1) *
          (offsetMultiplier * remToPixels(1) - edgeMultiplier * remToPixels(1));
      } else if (
        !isMobile &&
        (activeIndex === 1 || activeIndex === amountOfSlides - 2)
      ) {
        currentOffset =
          (activeIndex === 1 ? 1 : -1) *
          (offsetMultiplier * remToPixels(1) - edgeMultiplier * remToPixels(1));
      }
    } else if (isMobile) {
      if (activeIndex === middleIndex) {
        currentOffset = -2.25 * remToPixels(1);
      } else if (activeIndex === 0) {
        currentOffset = 5.25 * remToPixels(1);
      } else if (activeIndex === 1) {
        currentOffset = (middleIndex - activeIndex) * (2.25 * remToPixels(1));
      } else if (activeIndex > middleIndex) {
        currentOffset = -(activeIndex - middleIndex) * (5.25 * remToPixels(1));
      }
    } else {
      currentOffset = 0;
    }

    if (amountOfSlides % 2 === 0 && amountOfSlides >= 6) {
      if (activeIndex > middleIndex) {
        currentOffset += 2.25 * remToPixels(1);
      } else {
        currentOffset -= 2.25 * remToPixels(1);
      }
    }

    if (
      amountOfSlides % 2 === 0 &&
      isMobile &&
      activeIndex === amountOfSlides - 2
    ) {
      currentOffset =
        -(activeIndex - middleIndex) * (4.5 * remToPixels(1)) -
        2.25 * remToPixels(1);
    }

    sliderInner.style.transform = `translateX(${currentOffset}px)`;
  }

  slides.forEach((slide, index) => {
    const slideNrTextBlock = slide.querySelector("[data-slide-nr]");
    if (slideNrTextBlock) {
      slideNrTextBlock.innerText = index + 1;
    }

    slide.addEventListener("click", () => {
      if (index !== activeIndex) {
        updateActiveSlide(index);
        adjustSliderOnInteraction();
        let vids = next.querySelectorAll("[data-vimeo-player-target]");
        if (slide.classList.contains("active") && !isHome) {
          let vid = slide.querySelector("video");
          let coverImg = slide.querySelector(".cover-img");
          let overlay = slide.querySelector(".cover-overlay");
          if (vid) manageVideoOnSlide(vid, coverImg, overlay);
        }
        vids.forEach((vid) => {
          const playerID = vid.id;
          const player = vimeoPlayers[playerID];
          vid.setAttribute("data-vimeo-status-activated", "false");
          if (vid.getAttribute("data-vimeo-status-play") === "true") {
            player.pause();
            vid.setAttribute("data-vimeo-status-play", "false");
          }
        });
      }
    });

    if (!isMobile) {
      slide.addEventListener("mouseenter", function () {
        if (slide.classList.contains("active")) {
          let vid = slide.querySelector("video");
          let coverImg = slide.querySelector(".cover-img");
          let overlay = slide.querySelector(".cover-overlay");
          if (vid) manageVideoOnSlide(vid, coverImg, overlay);
        }
      });

      slide.addEventListener("mouseleave", function () {
        let vid = slide.querySelector("video");
        if (vid && !vid.paused) {
          vid.pause();
        }
        let coverImg = slide.querySelector(".cover-img");
        let overlay = slide.querySelector(".cover-overlay");
        if (coverImg && coverImg.style.opacity === "0") {
          gsap.to(coverImg, { opacity: 1, duration: 0.3 });
          gsap.to(overlay, { opacity: 0.3, duration: 0.3 });
        }
      });
    }
  });

  const updateActiveSlide = (index) => {
    slides[activeIndex].classList.remove("active");
    activeIndex = index;
    slides[activeIndex].classList.add("active");
    updateSNrPosition();
  };

  function initSwipeEvents() {
    let touchStartX = 0;
    let touchEndX = 0;
    let isDrag = false;

    const handleTouchStart = (event) => {
      touchStartX = event.changedTouches[0].screenX;
      isDrag = false;
    };

    const handleTouchMove = (event) => {
      touchEndX = event.changedTouches[0].screenX;
      if (Math.abs(touchStartX - touchEndX) > 10) {
        isDrag = true;
      }
    };

    const handleTouchEnd = () => {
      if (isDrag) {
        if (touchStartX - touchEndX > 50) {
          if (activeIndex < amountOfSlides - 1) {
            updateActiveSlide(activeIndex + 1);
            adjustSliderOnInteraction();
          }
        } else if (touchStartX - touchEndX < -50) {
          if (activeIndex > 0) {
            updateActiveSlide(activeIndex - 1);
            adjustSliderOnInteraction();
          }
        }
      }
    };

    sliderWrapper.addEventListener("touchstart", handleTouchStart);
    sliderWrapper.addEventListener("touchmove", handleTouchMove);
    sliderWrapper.addEventListener("touchend", handleTouchEnd);
  }
  if (isMobile) {
    initSwipeEvents();
  }
}

//
//
function initCounter(next) {
  if (!next) next = document;
  const countWrapper = document.querySelector("[data-count-wrap]");
  if (countWrapper) {
    gsap.fromTo(
      countWrapper,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 0.5,
        scrollTrigger: {
          trigger: countWrapper,
          start: "top bottom",
          onEnter: () => startCounting(countWrapper),
        },
      },
    );
  }
}
function startCounting(countWrapper) {
  const elements = countWrapper.querySelectorAll("[data-count]");

  elements.forEach((element) => {
    let countType = element.getAttribute("data-count");
    let countFrom, intervalTime;

    switch (countType) {
      case "photo":
        countFrom = 371;
        intervalTime = 500;
        break;
      case "video":
        countFrom = 123566;
        intervalTime = 10;
        break;
      case "campaigns":
        countFrom = 42;
        intervalTime = 1000;
        break;
      default:
        return;
    }

    countUp(element, countFrom, intervalTime);
  });
}
function countUp(element, start, interval) {
  element.textContent = start;
  const updateCount = () => {
    let current = parseInt(element.textContent, 10);
    element.textContent = current + 1;
  };

  let countInterval = setInterval(updateCount, interval);
  ScrollTrigger.create({
    trigger: element,
    start: "top bottom",
    onLeave: () => clearInterval(countInterval),
    once: true,
  });
}
function initHomeParallax(container) {
  if (!container) container = document.querySelector(".main-w");
  let homeParallax = gsap.timeline();
  homeParallax
    .to('[data-home-parallax="target"]', {
      yPercent: 80,
      rotate: 0.001,
      ease: "linear",
    })
    .to('[data-home-parallax="overlay"]', { opacity: 0.8, ease: "linear" }, 0)
    .fromTo(
      ".home-h",
      { opacity: 1, rotate: 0.001 },
      {
        opacity: 0,
        rotate: 0.001,
        duration: 0.6,
        ease: "linear",
        immediateRender: false,
      },
      0,
    )
    .to(".home-hero", { y: "10rem", rotate: 0.001, ease: "linear" }, 0);

  ScrollTrigger.create({
    trigger: '[data-home-parallax="trigger"]',
    start: isMobile ? "top 85%" : "top bottom",
    end: "top top",
    scrub: true,
    duration: 1,
    animation: homeParallax,
    onLeave: () => {
      ScrollTrigger.refresh();
      container.classList.remove("hero-in-view");
    },
    onEnterBack: () => {
      container.classList.add("hero-in-view");
    },
  });

  // ––––– SCROLLING
  gsap.to(".plus-bar", {
    scale: 1,
    rotate: "-=180deg",
    ease: "linear",
    scrollTrigger: {
      trigger: ".plus-w",
      start: "center center",
      endTrigger: ".home-intro__inner",
      end: "bottom bottom",
      scrub: true,
    },
  });

  gsap.to(".home-marquee", {
    xPercent: -15,
    rotate: 0.001,
    ease: "linear",
    scrollTrigger: {
      trigger: ".home-marquee",
      start: "top bottom",
      end: "+=800",
      scrub: 1.5,
    },
  });

  let scrollingTl = gsap.timeline({
    defaults: {
      ease: CustomEase.create(
        "custom",
        "M0,0 C0.29,0 0.317,0.018 0.388,0.103 0.457,0.186 0.466,0.362 0.498,0.502 0.518,0.592 0.528,0.77 0.591,0.864 0.666,0.975 0.704,1 1,1 ",
      ),
    },
    paused: true,
  });
  let motionLetters = document.querySelectorAll("[data-motion-title] .char");
  if (!isMobile) {
    scrollingTl
      .to(".plus-inner", {
        xPercent: isMobile ? 160 : 14,
        duration: 0.2,
        ease: "primary",
        overwrite: true,
      })
      .to(".plus-bar.is--h", {
        width: "100vw",
        height: "100vh",
        duration: 1.2,
      })
      .to("[data-motion-top]", { opacity: 0, y: "-10em", duration: 0.8 }, "<")
      .to("[data-motion-bottom]", { opacity: 0, y: "10em", duration: 0.8 }, "<")
      .fromTo(
        "[data-motion-section]",
        {
          clipPath: isMobile
            ? "inset(40vh 51vw 90vh 51vw)"
            : "inset(26% 51vw 75% 51vw)",
          y: "0vh",
        },
        {
          clipPath: isMobile
            ? "inset(0vh 0vw 0vh 0vw)"
            : "inset(0% 0vw 48% 0vw)",
          y: "0vh",
          duration: 1.2,
          //immediateRender: true,
        },
        0.25,
      )
      .fromTo(
        ".eyebrow-mask",
        {
          width: "0%",
        },
        {
          width: "100%",
          duration: 1,
        },
        0.5,
      )
      .fromTo(
        ".eyebrow-mask__text",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 1,
        },
        "<",
      )
      .fromTo(
        ".slider-container",
        {
          y: "5em",
        },
        {
          y: "0em",
          duration: 1,
        },
        "<+=0.2",
      )
      .fromTo(
        "[data-motion-section]",
        {
          clipPath: isMobile
            ? "inset(0vh 0vw 0vh 0vw)"
            : "inset(0% 0vw 48% 0vw)",
        },
        {
          clipPath: isMobile
            ? "inset(0vh 0vw 0vh 0vw)"
            : "inset(0% 0vw 0% 0vw)",
          duration: 0.2,
          overwrite: "auto",
          immediateRender: false,
        },
        1.45,
      );

    motionLetters.forEach((char, index) => {
      scrollingTl.fromTo(
        char,
        {
          x: "0em",
          y: `${-2.5 - 1.2 * index}em`,
          rotate: "-12deg",
          textShadow:
            "-0.3em 0.8em 0px currentColor, -0.6em 1.6em 0px currentColor; ",
        },
        {
          x: "0em",
          y: "0em",
          rotate: "0deg",
          textShadow: "0em 0.8em 0px currentColor, 0em 1.6em 0px currentColor",
          duration: 1.5,
          stagger: 0.015,
          ease: "motion",
        },
        0.5,
      );
    });

    ScrollTrigger.create({
      trigger: "[data-scroll-pin]",
      start: "bottom 51%",
      end: "bottom top",
      onEnter: () => {
        scrollingTl.timeScale(1).play();
        lenis.scrollTo(
          isMobile ? ".motion-mobile-trigger" : "[data-motion-section]",
          //"[data-motion-section]",
          {
            lock: true,
            duration: 1.2,
            onComplete: () => {
              ScrollTrigger.create({
                trigger: "[data-motion-section]",
                start: isMobile ? "top top+=50" : "top top+=3%",
                //markers: true,
                onLeaveBack: () => {
                  scrollingTl.timeScale(1).reverse();
                  lenis.stop();
                  gsap.delayedCall(2, () => {
                    lenis.scrollTo(".motion-trigger", {
                      lock: true,
                      duration: 0.2,
                      onComplete: lenis.start(),
                    });
                  });
                },
              });
            },
          },
        );
      },
    });

    ScrollTrigger.create({
      trigger: ".plus-w",
      start: "center center",
      endTrigger: ".home-intro__inner",
      end: "bottom top",
      scrub: true,
      pin: true,
      anticipatePin: 1,
    });

    gsap.to(".plus-w", {
      xPercent: 75,
      scrollTrigger: {
        trigger: "[data-scroll-pin]",
        start: "bottom bottom",
        end: "bottom top",
        scrub: true,
        pin: "[data-scroll-pin]",
        pinSpacing: false,
      },
    });
  } else {
    motionLetters.forEach((char, index) => {
      gsap.fromTo(
        char,
        {
          x: "0em",
          y: `${-2.5 - 1.2 * index}em`,
          rotate: "-12deg",
          textShadow:
            "-0.3em 0.8em 0px currentColor, -0.6em 1.6em 0px currentColor; ",
        },
        {
          x: "0em",
          y: "0em",
          rotate: "0deg",
          textShadow: "0em 0.8em 0px currentColor, 0em 1.6em 0px currentColor",
          duration: 1.5,
          stagger: 0.015,
          ease: "motion",
          scrollTrigger: {
            trigger: "[data-motion-section]",
            start: "top bottom",
            toggleActions: "play none none reset",
          },
        },
      );
    });
    scrollingTl
      .fromTo(
        ".eyebrow-mask",
        {
          width: "0%",
        },
        {
          width: "100%",
          duration: 1,
        },
      )
      .fromTo(
        ".eyebrow-mask__text",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 1,
        },
        "<",
      );
    ScrollTrigger.create({
      trigger: ".eyebrow-mask__text",
      start: "top 90%",
      onEnter: () => {
        scrollingTl.play();
      },
    });
  }
}
function initHomeArtists() {
  let artistItems = document.querySelectorAll(".artist-item");
  if (!artistItems) return;
  artistItems.forEach((item) => {
    item.addEventListener("mouseenter", () =>
      toggleInactiveClassForArtists(item, true),
    );
    item.addEventListener("mouseleave", () =>
      toggleInactiveClassForArtists(item, false),
    );
  });

  function toggleInactiveClassForArtists(currentItem, addClass) {
    artistItems.forEach((item) => {
      if (item !== currentItem) {
        item.classList.toggle("is--inactive", addClass);
      }
    });
  }
}

//
//
function initWorkLoad(container) {
  container = container || document;
  let items = container.querySelectorAll(".work-list__item");
  gsap.delayedCall(loadDuration - 0.2, () => {
    gsap.from(items, {
      yPercent: 50,
      duration: 1.2,
      ease: "motion",
      stagger: 0.1,
      clearProps: "all",
    });
  });
}
function initWorkPage(container) {
  if (!container) {
    container = document;
  }
  let thumbWrap = container.querySelector(".thumb-wrap");
  let thumbs = thumbWrap.querySelectorAll(".work-thumb");
  let listWrap = container.querySelector(".work-list__wrap");
  let listItems = listWrap.querySelectorAll(".work-list__item");
  let listItemTitles = container.querySelectorAll(".work-list__title");
  let gridWrap = container.querySelector(".work-content__wrap");
  let gridItems = gridWrap.querySelectorAll(".work-grid__item");
  let plusLeft = container.querySelector('[data-thumb-plus="left"]');
  let plusRight = container.querySelector('[data-thumb-plus="right"]');
  let gridTexts = gridWrap.querySelectorAll("[data-grid-text]");
  const filterReset = container.querySelector('[data-work-filter="Both"]');

  let gridImages = container.querySelectorAll(".cover-img.is--work-grid");
  let thumbImages = container.querySelectorAll(".cover-img.is--thumb");

  thumbImages.forEach((thumbImage, index) => {
    thumbImage.setAttribute("data-flip-id", "flip-img-" + index);
  });
  gridImages.forEach((item, index) => {
    item.setAttribute("data-flip-id", "flip-img-" + index);
  });

  let viewButtons = container.querySelectorAll(".text-link.is--view");
  let listOpen = true;
  let transitioning = false;

  function initProjectHovers() {
    let projectItems = document.querySelectorAll(".project-item");
    if (!projectItems) return;
    projectItems.forEach((item) => {
      item.addEventListener("mouseenter", () =>
        toggleInactiveClass(item, true),
      );
      item.addEventListener("mouseleave", () =>
        toggleInactiveClass(item, false),
      );
    });

    function toggleInactiveClass(currentItem, addClass) {
      projectItems.forEach((item) => {
        if (item !== currentItem) {
          item.classList.toggle("is--inactive", addClass);
        }
      });
    }
  }
  initProjectHovers();

  function createScrollTrigger(triggerElement, timeline) {
    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top bottom",
      onLeaveBack: () => {
        timeline.progress(0);
        timeline.pause();
      },
    });
    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top 95%",
      onEnter: () => {
        timeline.play();
      },
    });
  }

  if (isMobile) {
    thumbSlider = new Swiper(".thumb-wrap", {
      spaceBetween: 8,
      slidesPerView: "auto",
      freeMode: true,
      watchSlidesProgress: true,
      observer: true,
      observeParents: true,
    });
    mainSlider = new Swiper(".work-list__wrap.is--work__page", {
      spaceBetween: 8,
      slidesPerView: 1.045,
      speed: 1200,
      observer: true,
      observeParents: true,
      thumbs: {
        swiper: thumbSlider,
      },
    });
  } else {
    listItemTitles.forEach((title) => {
      let tl = gsap.timeline({ paused: true });
      let words = title.querySelectorAll(".word");
      let client = title.querySelector(".eyebrow");

      if (client && words.length > 0) {
        tl.fromTo(
          [client, words],
          { yPercent: 200 },
          {
            yPercent: 0,
            duration: 0.8,
          },
        );
        createScrollTrigger(title, tl);
      }
    });
    gsap.to(thumbWrap, {
      yPercent: isMobile ? 0 : -95,
      xPercent: 0.001,
      ease: "none",
      scrollTrigger: {
        trigger: listWrap,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });
    listItems.forEach((listItem, index) => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: listItem,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            onEnter: () => {
              listItem.classList.add("active");
            },
            onEnterBack: () => {
              listItem.classList.add("active");
            },
            onLeave: () => {
              listItem.classList.remove("active");
            },
            onLeaveBack: () => {
              listItem.classList.remove("active");
            },
          },
        })
        .fromTo(
          thumbs[index],
          { width: "2.75rem", rotate: 0, filter: "saturate(0%)" },
          {
            width: "3.5rem",
            rotate: 0.001,
            filter: "saturate(100%)",
            ease: "none",
            duration: 0.5,
          },
        )
        .to(thumbs[index], {
          width: "2.75rem",
          rotate: 0.001,
          filter: "saturate(0%)",
          ease: "none",
          duration: 0.5,
        })
        .from(
          listItem.querySelector("img"),
          {
            yPercent: -15,
            ease: "none",
            duration: 1,
          },
          0,
        );
      // hovering
      const videoContainer = listItem.querySelector(".work-list__item-vid");
      const video = videoContainer.querySelector("video");
      const videoWrapper = listItem.querySelector(".list-vid__wrap");
      const img = listItem.querySelector("img");
      const info = listItem.querySelectorAll("[data-work-details]");
      gsap.set(info, { autoAlpha: 0 });
      listItem.addEventListener("mouseenter", () => {
        if (!videoContainer.classList.contains("w-condition-invisible")) {
          if (!video.src) {
            video.src = video.getAttribute("data-src");
          }
          video.play();
          gsap.to(videoWrapper, {
            height: "100%",
            duration: 0.6,
          });
        }
        gsap.to(img, {
          filter: "saturate(0%) blur(10px)",
          duration: 0.6,
        });
        gsap.fromTo(
          info,
          {
            autoAlpha: 0,
            yPercent: 25,
          },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.6,
            stagger: 0.1,
          },
        );
      });

      listItem.addEventListener("mouseleave", () => {
        if (!videoContainer.classList.contains("w-condition-invisible")) {
          video.pause();
          gsap.to(videoWrapper, {
            height: "0%",
            duration: 0.6,
          });
        }
        gsap.to(img, {
          filter: "saturate(100%) blur(0px)",
          duration: 0.6,
        });
        gsap.to(info, {
          autoAlpha: 0,
          yPercent: 25,
          duration: 0.6,
          stagger: { each: 0.1, from: "end" },
        });
      });
    });
    thumbs.forEach((thumb, index) => {
      thumb.addEventListener("click", () => {
        if (listItems[index]) {
          const imageRect = listItems[index].getBoundingClientRect();
          const scrollToPosition =
            window.scrollY +
            imageRect.top +
            imageRect.height / 2 -
            window.innerHeight / 2;
          lenis.scrollTo(scrollToPosition, {
            duration: 0.6,
            lerp: 0.08,
            lock: true,
          });
        }
      });
    });
  }

  //
  //
  gsap
    .timeline({
      scrollTrigger: {
        trigger: listWrap,
        start: "bottom 80%",
        end: "bottom center",
        scrub: 1,
      },
    })
    .to(thumbs, {
      opacity: 0,
      stagger: { each: 0.05, from: "end" },
      ease: "none",
      duration: 0.5,
    })
    .to(
      [plusLeft, plusRight],
      {
        opacity: 0,
        ease: "none",
      },
      0,
    );

  function listToGrid() {
    filterReset.click();
    lenis.scrollTo(0, { lerp: 0.2 });
    gsap.delayedCall(0.5, () => {
      // lenis.scrollTo(0, {
      //   lerp: 0.5,
      //   lock: true,
      //   onComplete: () => {
      gsap.to(listItems, {
        xPercent: isMobile ? 0 : -175,
        rotate: 0.0001,
        duration: 1,
        filter: "saturate(0%)",
        stagger: {
          each: 0.1,
        },
      });
      gsap.to(plusLeft, {
        rotate: -180,
        autoAlpha: 0,
      });
      gsap.to(plusRight, {
        rotate: 180,
        autoAlpha: 0,
      });
      gsap.set(listWrap, {
        position: "absolute",
        top: 0,
        height: isMobile ? "69.5svh" : "auto",
        pointerEvents: "none",
      });
      if (isMobile) {
        gsap.set(".item-info__bg", { scaleY: 0, height: "100%" });
        gsap.to(listWrap, {
          xPercent: 105,
          duration: 0.6,
        });
        gsap.set(thumbWrap, {
          left: "0rem",
          position: "fixed",
          top: "92.5svh",
        });
      }
      gsap.set(gridWrap, { display: "flex" });
      let state = Flip.getState(".cover-img.is--thumb");
      Flip.from(state, {
        targets: ".cover-img.is--work-grid",
        duration: 1,
        prune: true,
        stagger: { each: 0.05, from: "start" },
        absolute: ".project-item.is--square",
        simple: true,
        clearProps: "all",
        overwrite: "auto",
      });
      gsap.set(thumbWrap, { display: "none" });
      gsap.set(listWrap, {
        display: "none",
        delay: isMobile ? 0.65 : 0.9,
        onComplete: () => {
          lenis.resize();
        },
      });
      gsap.delayedCall(0.7, () => {
        if (isMobile) {
          gsap.fromTo(
            ".item-info__bg",
            {
              scaleY: 0,
            },
            {
              scaleY: 1,
              duration: 0.45,
              ease: "primary",
              force3D: false,
              // clearProps: true,
            },
          );
          gsap.fromTo(
            gridTexts,
            {
              y: "250%",
            },
            {
              y: 0,
              stagger: 0.01,
              delay: 0.4,
              duration: 0.45,
              ease: "primary",
            },
          );
        }
        transitioning = false;
      });
      //   },
      // });
    });
  }

  function gridToList() {
    filterReset.click();
    lenis.scrollTo(0, { lerp: 0.2 });
    gsap.delayedCall(0.5, () => {
      // lenis.scrollTo(0, {
      //   lerp: 0.5,
      //   lock: true,
      //   onComplete: () => {
      gsap.set(listWrap, {
        display: isMobile ? "flex" : "block",
        position: isMobile ? "absolute" : "relative",
      });
      gsap.to(listItems, {
        xPercent: 0,
        overwrite: true,
        rotate: 0.0001,
        duration: 1,
        filter: "saturate(100%)",
        stagger: {
          each: 0.1,
        },
      });
      gsap.to(plusLeft, {
        rotate: 0,
        autoAlpha: 1,
      });
      gsap.to(plusRight, {
        rotate: 0,
        autoAlpha: 1,
      });
      if (isMobile) {
        gsap.to(gridTexts, {
          y: "250%",
          ease: "primary",
          duration: 0.4,
        });
        gsap.to(".item-info__bg", {
          height: "0%",
          ease: "primary",
          duration: 0.4,
        });
        gsap.to(listWrap, {
          xPercent: 0,
          delay: 0.5,
          duration: 0.6,
          onComplete: () => {
            gsap.set(thumbWrap, {
              left: "-0.5rem",
              position: "relative",
              top: "auto",
            });
            gsap.set(listWrap, {
              position: "relative",
              top: "auto",
              height: "auto",
            });
          },
        });
      }
      if (isMobile) {
        gsap.delayedCall(0.2, () => {
          gsap.set(thumbWrap, { display: "flex" });
          let state = Flip.getState(".cover-img.is--work-grid");
          Flip.from(state, {
            targets: ".cover-img.is--thumb",
            duration: 0.8,
            prune: true,
            stagger: { each: 0.01, from: "start" },
            absolute: true,
            simple: true,
            clearProps: "all",
            overwrite: "auto",
          });
          gsap.set(gridWrap, {
            display: "none",
          });
          gsap.delayedCall(1.2, () => {
            transitioning = false;
            gsap.set(listWrap, { pointerEvents: "auto" });
          });
        });
      } else {
        gsap.set(thumbWrap, {
          display: "block",
        });
        let state = Flip.getState(".cover-img.is--work-grid");
        Flip.from(state, {
          targets: ".cover-img.is--thumb",
          duration: 1,
          prune: true,
          stagger: { each: 0.05, from: "start" },
          absolute: true,
          simple: true,
          clearProps: "all",
          overwrite: "auto",
        });
        gsap.set(gridWrap, {
          display: "none",
        });
        gsap.delayedCall(1.2, () => {
          transitioning = false;
          gsap.set(listWrap, { pointerEvents: "auto" });
        });
      }
      //   },
      // });
    });
  }

  //
  //
  // COUNT ITEMS
  const projectItems = listWrap.querySelectorAll("[data-project-category]");
  let motionCount = 0;
  let photoCount = 0;

  projectItems.forEach((item) => {
    const category = item.getAttribute("data-project-category");
    if (category === "Motion" || category === "Both") {
      motionCount++;
    }
    if (category === "Photography" || category === "Both") {
      photoCount++;
    }
  });

  const motionCounterElement = container.querySelector("#count-motion");
  const photoCounterElement = container.querySelector("#count-photo");
  if (motionCounterElement) {
    motionCounterElement.textContent = motionCount;
  }
  if (photoCounterElement) {
    photoCounterElement.textContent = photoCount;
  }

  //
  //
  // FILTERS
  const filterLinks = container.querySelectorAll("[data-work-filter]");
  const lists = container.querySelectorAll("[data-work-filter-list]");

  filterLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      if (this.classList.contains("active")) {
        return;
      }
      const activeLink = container.querySelector(".text-link.active");
      if (activeLink) {
        activeLink.classList.remove("active");
      }
      this.classList.add("active");
      const filterValue = this.getAttribute("data-work-filter");

      lists.forEach((list) => {
        const items = list.querySelectorAll("[data-project-category]");
        items.forEach((item, index) => {
          const category = item.getAttribute("data-project-category");

          if (
            filterValue === "Both" ||
            category === filterValue ||
            category === "Both"
          ) {
            item.classList.remove("u--hide");
            gsap.to(item, {
              autoAlpha: 1,
              //clearProps: "all",
              duration: 0.6,
            });
          } else {
            gsap.to(item, {
              autoAlpha: 0,
              duration: 0.6,
              onComplete: () => {
                ScrollTrigger.refresh();
                lenis.resize();
                item.classList.add("u--hide");
              },
            });
          }
        });
      });

      if (isMobile) {
        mainSlider.slideTo(0, 1200);
        mainSlider.update();
        thumbSlider.slideTo(0, 1200);
        thumbSlider.update();
      }
      lenis.scrollTo(0, { lerp: 0.5, lock: true });
      ScrollTrigger.refresh();
      lenis.resize();
    });
  });

  function updateImageStyles(item, selector) {
    const image = item.querySelector(selector);
    if (image) {
      gsap.set(image, {
        maxWidth: "none",
        maxHeight: "none",
        width: "100%",
        height: "100%",
      });
    }
  }

  viewButtons.forEach((viewButton) => {
    viewButton.addEventListener("click", () => {
      if (transitioning) return;
      if (listOpen) {
        transitioning = true;
        listToGrid();
        listOpen = false;
      } else {
        transitioning = true;
        gridToList();
        listOpen = true;
      }
      viewButtons.forEach((button) => {
        button.classList.toggle("is--active");
      });
    });
  });
}

//
//

function initPageColorChange(next) {
  if (!next) next = document;
  let trigger = next.querySelectorAll("[data-toggle-body]");
  let cta = next.querySelector(".page-cta");
  gsap.to(".section", {
    backgroundColor: "#020202",
    color: "#fff",
    ease: "power3.out",
    duration: 0.5,
    scrollTrigger: {
      trigger: trigger,
      start: "top center",
      end: "bottom center",
      toggleActions: "play none none reverse",
      onEnter: () => {
        document.querySelector(".nav-w").setAttribute("theme", "light");
        cta.classList.add("black");
      },
      onLeaveBack: () => {
        gsap.to(".section", {
          backgroundColor: "#fff",
          color: "#020202",
          ease: "power3.out",
          duration: 0.5,
        });
        document.querySelector(".nav-w").setAttribute("theme", "dark");
        cta.classList.remove("black");
      },
    },
  });
}
function initVideos(next) {
  if (!next) next = document;
  let vids = next.querySelectorAll("[data-vimeo-player-target]");
  vids.forEach((vid, index) => {
    let videoIndexID = "vimeo-player-index-" + index;
    vid.id = videoIndexID;

    const player = new Vimeo.Player(vid);

    vimeoPlayers[videoIndexID] = player;

    player.on("play", () => {
      vid.setAttribute("data-vimeo-status-loaded", "true");
    });

    if (vid.getAttribute("data-vimeo-player-autoplay") === "false") {
      player.setVolume(1);
      player.pause();
    } else {
      player.setVolume(0);
      vid.setAttribute("data-vimeo-status-muted", "true");
      if (vid.getAttribute("data-vimeo-status-paused-by-user") === "false") {
        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: vid,
            start: "0% 100%",
            end: "100% 0%",
            toggleActions: "play none none none",
            markers: false,
            onEnter: () => vimeoPlayerPlay(vid, player),
            onLeave: () => vimeoPlayerPause(vid, player),
            onEnterBack: () => vimeoPlayerPlay(vid, player),
            onLeaveBack: () => vimeoPlayerPause(vid, player),
          },
        });
      }
    }

    // Control event bindings
    vid.querySelectorAll('[data-vimeo-control="play"]').forEach((button) => {
      button.addEventListener("click", () => {
        if (vid.getAttribute("data-vimeo-status-muted") === "true") {
          player.setVolume(0);
        } else {
          player.setVolume(1);
        }
        vimeoPlayerPlay(vid, player);
      });
    });

    vid.querySelectorAll('[data-vimeo-control="pause"]').forEach((button) => {
      button.addEventListener("click", () => {
        vimeoPlayerPause(vid, player);
        if (vid.getAttribute("data-vimeo-player-autoplay") === "true") {
          vid.setAttribute("data-vimeo-status-paused-by-user", "true");
          if (tl) tl.kill();
        }
      });
    });

    // Duration and timeline updates
    player.getDuration().then((duration) => {
      const formatDuration = secondsTimeSpanToHMS(duration);
      const vimeoDuration = vid.querySelector(".vimeo-duration .duration");
      if (vimeoDuration) {
        vimeoDuration.textContent = formatDuration;
      }
      vid
        .querySelectorAll('[data-vimeo-control="timeline"], progress')
        .forEach((element) => {
          element.max = duration;
        });
    });

    // Timeline
    vid
      .querySelectorAll('[data-vimeo-control="timeline"]')
      .forEach((timeline) => {
        timeline.addEventListener("input", function () {
          player.setCurrentTime(parseFloat(timeline.value));
          const progress = vid.querySelector("progress");
          if (progress) {
            progress.value = timeline.value;
          }
        });
      });

    // Progress Time & Timeline
    player.on("timeupdate", function (data) {
      const timeUpdate = secondsTimeSpanToHMS(Math.trunc(data.seconds));
      const vimeoTime = vid.querySelector(".vimeo-duration .time");
      if (vimeoTime) {
        vimeoTime.textContent = timeUpdate;
      }
      vid
        .querySelectorAll('[data-vimeo-control="timeline"], progress')
        .forEach((element) => {
          element.value = data.seconds;
        });
    });

    // Remove Controls after hover
    let vimeoHoverTimer;
    document.addEventListener("mousemove", function () {
      clearTimeout(vimeoHoverTimer);
      vid.setAttribute("data-vimeo-status-hover", "true");
      vimeoHoverTimer = setTimeout(() => {
        vid.setAttribute("data-vimeo-status-hover", "false");
      }, 3000);
    });

    // Time update handling
    player.on("timeupdate", (data) => {
      const formattedTime = secondsTimeSpanToHMS(Math.trunc(data.seconds));
      const vimeoTime = vid.querySelector(".vimeo-duration .time");
      if (vimeoTime) {
        vimeoTime.textContent = formattedTime;
      }
      vid
        .querySelectorAll('[data-vimeo-control="timeline"], progress')
        .forEach((element) => {
          element.value = data.seconds;
        });
    });

    // Listen for ended event
    player.on("ended", () => {
      vid.setAttribute("data-vimeo-status-activated", "false");
      vid.setAttribute("data-vimeo-status-play", "false");
      player.unload();
    });
  });
}
function vimeoPlayerPlay(vid, player) {
  vid.setAttribute("data-vimeo-status-activated", "true");
  vid.setAttribute("data-vimeo-status-play", "true");
  player.play();
}
function vimeoPlayerPause(vid, player) {
  vid.setAttribute("data-vimeo-status-play", "false");
  player.pause();
}
function secondsTimeSpanToHMS(s) {
  const h = Math.floor(s / 3600);
  s -= h * 3600;
  const m = Math.floor(s / 60);
  s -= m * 60;
  return m + ":" + (s < 10 ? "0" + s : s);
}
function initCmsFooter(next) {
  next = next || document.querySelector(".main-w");
  const name = next.getAttribute("data-name");
  const listItems = document.querySelectorAll("#link-util [data-link]");
  let type = next.getAttribute("data-barba-namespace");
  if (type === "artist") {
    type = "artists";
  } else {
    type = "projects";
  }

  let targetItemIndex = -1;
  listItems.forEach((item, index) => {
    if (item.getAttribute("data-name") === name) {
      targetItemIndex = index;
    }
  });

  let nextItem;
  if (targetItemIndex === listItems.length - 1) {
    nextItem = listItems[0];
  } else if (targetItemIndex !== -1) {
    nextItem = listItems[targetItemIndex + 1];
  }

  if (nextItem) {
    const linkValue = nextItem.getAttribute("data-link");
    const ctaWrap = next.querySelector(".cta-wrap");
    if (ctaWrap) {
      ctaWrap.href = `${window.location.origin}/${type}/${linkValue}`;
    }
    if (type === "projects") {
      const name = nextItem.getAttribute("data-name");
      const client = nextItem.getAttribute("data-client");
      const image = nextItem.querySelector("img");
      const nameTarget = ctaWrap.querySelector("[data-next-name]");
      const clientTarget = ctaWrap.querySelector("[data-next-client]");
      const imgTarget = ctaWrap.querySelector("[data-next-img]").parentElement;
      nameTarget.innerText = name;
      clientTarget.innerText = client;
      imgTarget.innerHTML = "";
      imgTarget.appendChild(image);
    }
  }
}

//
//
function initAboutServices(next) {
  if (!next) next = document;
  const links = next.querySelectorAll("[data-about-link]");
  const titles = next.querySelectorAll(".about-title__wrap");
  const descriptions = next.querySelectorAll(".about-d__item");
  const numbers = next.querySelectorAll(".about-nr__item");
  const section = next.querySelector(".about-track");
  const images = next.querySelectorAll(".about-track__img");
  let movingUp = false;

  links.forEach((link, index) => {
    link.addEventListener("click", function (event) {
      if (link.classList.contains("active")) return;
      if (isAnimatingServices) return;

      links.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      isAnimatingServices = true;

      const sectionHeight = section.offsetHeight;
      const percentages = [0.25, 0.5, 0.75, 0.9];
      const scrollToPosition =
        section.offsetTop + sectionHeight * percentages[index];

      lenis.scrollTo(scrollToPosition, { lerp: 0.1 });

      gsap.to(numbers, {
        y: `-${index * 100}%`,
        duration: 0.8,
        ease: "primary",
      });

      const currentActiveIndex = [...titles].findIndex(
        (title) =>
          title.style.visibility === "visible" ||
          getComputedStyle(title).visibility === "visible",
      );

      if (currentActiveIndex !== -1) {
        movingUp = currentActiveIndex > index;
        gsap.to(titles[currentActiveIndex].querySelectorAll(".line"), {
          y: "-50%",
          autoAlpha: 0,
          duration: 0.6,
          overwrite: "auto",
          stagger: 0.05,
          onComplete: () =>
            gsap.set(titles[currentActiveIndex], { autoAlpha: 0 }),
        });
        gsap.fromTo(
          images[currentActiveIndex],
          {
            clipPath: "inset(0%)",
          },
          {
            clipPath: "inset(50%)",
            duration: 0.8,
            delay: movingUp ? 0 : 1.2,
            overwrite: "auto",
          },
        );
        gsap.to(descriptions[currentActiveIndex].querySelectorAll(".line"), {
          y: "-50%",
          autoAlpha: 0,
          duration: 0.6,
          stagger: 0.025,
          ease: "primary",
          onComplete: () =>
            gsap.set(descriptions[currentActiveIndex], { autoAlpha: 0 }),
        });
      }
      gsap.fromTo(
        images[index],
        {
          clipPath: "inset(50%)",
        },
        {
          clipPath: "inset(0%)",
          duration: movingUp ? 0 : 0.8,
          delay: 0,
          ease: "primary",
          overwrite: "auto",
        },
      );
      gsap.set(titles[index], { autoAlpha: 1 });
      gsap.fromTo(
        titles[index].querySelectorAll(".line"),
        {
          y: "50%",
          autoAlpha: 0,
        },
        {
          y: "0%",
          autoAlpha: 1,
          duration: 0.6,
          delay: movingUp ? 1 : 0,
          stagger: 0.05,
          ease: "primary",
        },
      );
      gsap.set(descriptions[index], { autoAlpha: 1 });
      gsap.fromTo(
        descriptions[index].querySelectorAll(".line"),
        {
          y: "50%",
          autoAlpha: 0,
        },
        {
          y: "0%",
          autoAlpha: 1,
          duration: 0.6,
          delay: 0.5,
          stagger: 0.025,
          ease: "primary",
          onComplete: () => {
            isAnimatingServices = false;
          },
        },
      );
    });
  });
}
function initAboutScrolling(next) {
  if (!next) next = document;
  const links = next.querySelectorAll("[data-about-link]");
  const section = next.querySelector(".about-track");
  const aboutTop = next.querySelector("#about-top");
  let lastScrollTop = 0;
  const buffer = 25;

  lenis.on(
    "scroll",
    (e) => {
      let scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (Math.abs(scrollTop - lastScrollTop) > buffer) {
        if (scrollTop > lastScrollTop) {
          gsap.to(aboutTop, {
            yPercent: 0,
            duration: 0.45,
            ease: "power3.out",
            overwrite: "auto",
          });
        } else {
          gsap.to(aboutTop, {
            yPercent: isMobile ? 40 : 90,
            duration: 0.45,
            ease: "power3.out",
            overwrite: "auto",
          });
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      }
    },
    { passive: true },
  );

  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress;
      const index = Math.min(
        Math.floor(progress * links.length),
        links.length - 1,
      );
      if (index < links.length) {
        links[index].click();
      }
    },
  });
}

//
//

function initContactPage(next) {
  if (!next) next = document;
  const contactItems = next.querySelectorAll(".contact-item__inner");
  const coverImages = next.querySelectorAll(".cover-img");

  contactItems.forEach((item, index) => {
    item.addEventListener("mouseenter", () => {
      nav.setAttribute("theme", "light");
      gsap.to(
        [
          ".contact-h__wrap",
          ".contact-p__wrap",
          ".footer-bottom",
          ".contact-h__socials",
        ],
        {
          autoAlpha: 0,
          y: "2em",
          ease: "primary",
          duration: 0.4,
        },
      );
      gsap.to(".section", {
        color: "#fff",
        ease: "primary",
        duration: 0.4,
      });
      if (coverImages[index]) {
        gsap.fromTo(
          coverImages[index],
          {
            opacity: 0,
            scale: 1.03,
          },
          {
            opacity: 1,
            scale: 1,
            ease: "primary",
            duration: 0.4,
          },
        );
      }
      contactItems.forEach((otherItem, otherIndex) => {
        if (otherIndex !== index) {
          gsap.to(otherItem, {
            opacity: 0.2,
            duration: 0.4,
            ease: "primary",
          });
        }
      });
    });

    item.addEventListener("mouseleave", () => {
      nav.setAttribute("theme", "dark");
      gsap.to(
        [
          ".contact-h__wrap",
          ".contact-p__wrap",
          ".footer-bottom",
          ".contact-h__socials",
        ],
        {
          autoAlpha: 1,
          y: "0em",
          ease: "primary",
          duration: 0.4,
        },
      );
      gsap.to(".section", {
        color: "#020202",
        clearProps: "color",
        ease: "primary",
        duration: 0.4,
      });
      gsap.to(coverImages, {
        opacity: 0,
        scale: 1,
        ease: "primary",
        duration: 0.4,
      });
      gsap.to(contactItems, {
        opacity: 1,
        duration: 0.4,
        ease: "primary",
      });
    });
  });
}

//
//

function initArtistsList(next) {
  if (!next) next = document;
  const artistsLists = next.querySelectorAll("[data-artists-list]");
  if (!artistsLists) {
    return;
  }

  let directors = artistsLists[0].querySelectorAll("h3").length;
  let amountDirectorsNr = next.querySelectorAll("[data-directors]");
  amountDirectorsNr.forEach((e) => {
    e.innerHTML = directors;
  });

  let photographers = artistsLists[1].querySelectorAll("h3").length;
  let photographersNr = next.querySelectorAll("[data-photographers]");
  photographersNr.forEach((e) => {
    e.innerHTML = photographers;
  });

  if (!isMobile) {
    artistsLists.forEach((list, index) => {
      list.addEventListener("mouseenter", function () {
        const otherList = [...artistsLists].filter((_, i) => i !== index)[0];
        const headings = otherList.querySelectorAll(".name-h");
        gsap.to([otherList], {
          opacity: 0.3,
          stagger: 0.01,
          duration: 0.2,
          ease: "power1.out",
          overwrite: true,
        });
      });

      list.addEventListener("mouseleave", function () {
        const otherList = [...artistsLists].filter((_, i) => i !== index)[0];
        const headings = otherList.querySelectorAll(".name-h");
        gsap.to([otherList], {
          opacity: 1,
          stagger: {
            each: 0.025,
            from: "end",
          },
          duration: 0.2,
          ease: "power1.out",
          overwrite: true,
        });
      });
    });
  } else {
    next.querySelectorAll("[data-work-filter]").forEach((button) => {
      button.addEventListener("click", function () {
        if (!this.classList.contains("active")) {
          next
            .querySelectorAll("[data-work-filter]")
            .forEach((btn) => btn.classList.remove("active"));
          this.classList.add("active");
          const filter = this.getAttribute("data-work-filter");

          if (filter === "directors") {
            gsap.to('[data-artist-link="right"]', {
              autoAlpha: 0,
              yPercent: -75,
              stagger: 0.01,
              overwrite: "auto",
              onComplete: () => {
                gsap.set('[data-artist-link="right"]', { yPercent: 75 });
              },
            });
            gsap.fromTo(
              '[data-artist-link="left"]',
              {
                autoAlpha: 0,
                yPercent: 75,
              },
              {
                autoAlpha: 1,
                yPercent: 0,
                stagger: 0.01,
                delay: 0.3,
                overwrite: "auto",
              },
            );
          } else {
            gsap.to('[data-artist-link="left"]', {
              autoAlpha: 0,
              yPercent: -75,
              stagger: 0.01,
              overwrite: "auto",
              onComplete: () => {
                gsap.set('[data-artist-link="left"]', { yPercent: 75 });
              },
            });
            gsap.fromTo(
              '[data-artist-link="right"]',
              {
                autoAlpha: 0,
                yPercent: 75,
              },
              {
                autoAlpha: 1,
                yPercent: 0,
                stagger: 0.01,
                delay: 0.3,
                overwrite: "auto",
              },
            );
          }
        }
      });
    });
  }

  ///
  ///
  const wrapperRight = next.querySelector(".artists-right");
  const wrapperLeft = next.querySelector(".artists-left");
  const labelRight = next.querySelector(".artists-right__label");
  const labelLeft = next.querySelector(".artists-left__label");
  const linksRight = wrapperRight.querySelectorAll("[data-artist-link]");
  const linksLeft = wrapperLeft.querySelectorAll("[data-artist-link]");
  let moveLabelTimeout;
  let currentMouseMoveHandler;

  function createMouseMoveHandler(label) {
    return function (e) {
      const bounds = label.parentElement.getBoundingClientRect();
      const mouseY = e.clientY - bounds.top;
      const targetTop = Math.min(
        Math.max(mouseY - label.offsetHeight / 2, 0),
        bounds.height - label.offsetHeight,
      );
      gsap.to(label, {
        top: `${targetTop}px`,
        duration: 0.3, // Duration for the animation to complete
        ease: "power2.out", // Smoothing the animation
      });
    };
  }

  function setOpacityForLinks(links, target, opacity) {
    links.forEach((link) => {
      if (link !== target) {
        gsap.to(link, { opacity: opacity, duration: 0.2 });
      }
    });
  }

  function handleMouseEnter(e, wrapper, label, links) {
    clearTimeout(moveLabelTimeout); // Clear any existing timeout
    setOpacityForLinks(links, e.currentTarget, 0.3);
    gsap.to(e.currentTarget, { opacity: 1, duration: 0.2 });

    gsap.to(["section", ".footer"], {
      backgroundColor: "#000",
      color: "#fff",
      duration: 0.3,
      ease: "power2.inOut",
    });

    // Remove existing listener if there's any
    if (currentMouseMoveHandler) {
      wrapper.removeEventListener("mousemove", currentMouseMoveHandler);
    }

    // Create a new handler and attach it
    currentMouseMoveHandler = createMouseMoveHandler(label);
    wrapper.addEventListener("mousemove", currentMouseMoveHandler);
  }

  function handleMouseLeave(e, links, label, wrapper) {
    gsap.to(links, { opacity: 1, duration: 0.2 });

    gsap.to(["section", ".footer"], {
      backgroundColor: "#fff",
      color: "#020202",
      duration: 0.3,
      ease: "power2.inOut",
    });

    moveLabelTimeout = setTimeout(() => {
      gsap.to(label, {
        top: "4px",
        duration: 0.8,
        ease: "power3.inOut",
      });
      wrapper.removeEventListener("mousemove", currentMouseMoveHandler);
      currentMouseMoveHandler = null;
    }, 25);
  }

  if (!isMobile) {
    linksRight.forEach((link) => {
      link.addEventListener("mouseenter", (e) =>
        handleMouseEnter(e, wrapperRight, labelRight, linksRight),
      );
      link.addEventListener("mouseleave", (e) =>
        handleMouseLeave(e, linksRight, labelRight, wrapperRight),
      );
    });

    linksLeft.forEach((link) => {
      link.addEventListener("mouseenter", (e) =>
        handleMouseEnter(e, wrapperLeft, labelLeft, linksLeft),
      );
      link.addEventListener("mouseleave", (e) =>
        handleMouseLeave(e, linksLeft, labelLeft, wrapperLeft),
      );
    });
  }
}
function initHeroTitle(next) {
  next = next || document;
  let title = next.querySelector("h1");
  let letters = title.querySelectorAll(".char");
  gsap.set(letters, {
    rotate: -12,
    y: "-2.5",
  });
  gsap.delayedCall(loadDuration, () => {
    letters.forEach((letter, index) => {
      gsap.fromTo(
        letter,
        {
          x: "0em",
          y: `${-2.5 - 0.8 * index}em`,
          rotate: "-12deg",
          textShadow:
            "-0.3em 0.8em 0px currentColor, -0.6em 1.6em 0px currentColor",
        },
        {
          x: "0em",
          y: "0em",
          rotate: "0deg",
          textShadow: "0em 0.8em 0px currentColor, 0em 1.6em 0px currentColor",
          duration: 1.5,
          stagger: 0.015,
          ease: "motion",
        },
      );
    });
  });
}

//
//
function initArtistPhotographer(container) {
  if (!container) {
    container = document;
  }

  let target = container.querySelector("#masonry");

  var macy = Macy({
    container: target,
    trueOrder: false,
    waitForImages: true,
    margin: 8,
    columns: 3,
    breakAt: {
      991: 2,
      600: 1,
    },
  });

  container.querySelectorAll(".artist-img__item").forEach((item) => {
    item.addEventListener("mouseenter", () => {
      container.querySelectorAll(".artist-img__item").forEach((other) => {
        if (other !== item) {
          other.classList.add("faded");
        }
      });
    });

    item.addEventListener("mouseleave", () => {
      container.querySelectorAll(".artist-img__item").forEach((other) => {
        other.classList.remove("faded");
      });
    });
  });
}
function initLightbox(container) {
  container = container || document;
  const lightboxWrapper = container.querySelector(".lightbox-w");
  const allTriggers = Array.from(
    container.querySelectorAll("[data-lightbox-trigger]"),
  );
  const pageCta = container.querySelector(".page-cta");
  const navItems = lightboxWrapper.querySelectorAll("[data-lightbox-fade]");
  const lightboxTotal = container.querySelector("#lightbox-total");
  const lightboxIndex = container.querySelector("#lightbox-index");
  const prevButton = container.querySelector("[data-lightbox-prev]");
  const nextButton = container.querySelector("[data-lightbox-next]");
  const closeButton = container.querySelector("[data-lightbox-close]");
  let lightboxItems = container.querySelectorAll(".lightbox-img");

  lightboxTotal.textContent = allTriggers.length;

  function closeLightbox() {
    const originalItem = container.querySelector(".original-item");
    const originalParent = container.querySelector(".original-parent");
    let hiddenItem = container.querySelector(".contain-img.u--hide");
    container.removeEventListener("click", outsideClickListener);

    const tl = gsap.timeline({
      defaults: {
        ease: "primary",
        duration: 0.5,
      },
      onComplete: () => {
        lightboxWrapper.classList.remove("active");
        lightboxItems.forEach((item) => item.classList.remove("active"));
        gsap.set(lightboxItems, { autoAlpha: 0, clearProps: "all" });
        lenis.start();
        if (originalItem && originalParent) {
          originalParent.classList.remove("original-parent");
          originalItem.classList.remove("original-item");
          hiddenItem.classList.remove("u--hide");
        }
      },
    });

    const state = Flip.getState(originalItem);
    let openItemActive =
      originalItem.parentElement.classList.contains("active");
    originalParent.appendChild(originalItem);

    if (openItemActive) {
      tl.add(
        Flip.from(state, {
          targets: originalItem,
          absolute: true,
          zIndex: 100,
        }),
        0,
      );
    } else {
      tl.to(".lightbox-img.active", {
        y: "3em",
        autoAlpha: 0,
        duration: 0.45,
      });
    }

    tl.to(
      navItems,
      {
        autoAlpha: 0,
        y: "1rem",
        stagger: 0,
        duration: 0.45,
      },
      0,
    )
      .to(".page-cta", { yPercent: 0, duration: 0.45 }, 0.25)
      .to(lightboxWrapper, { background: "rgba(0,0,0,0)", duration: 0 }, 0);
  }

  function outsideClickListener(event) {
    if (
      !event.target.closest(
        ".lightbox-img.active img, [data-lightbox-fade], [data-lightbox-close]",
      )
    ) {
      closeLightbox();
    }
  }
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });
  closeButton.addEventListener("click", closeLightbox);

  function updateActiveItem(currentIndex) {
    lightboxItems.forEach((item) => item.classList.remove("active"));
    lightboxItems[currentIndex].classList.add("active");
    lightboxIndex.textContent = currentIndex + 1;
  }

  allTriggers.forEach((trigger, index) => {
    trigger.addEventListener("click", function () {
      //const lightboxId = trigger.getAttribute("data-lightbox-id");
      const state = Flip.getState(trigger);
      updateActiveItem(index);
      trigger.parentElement.classList.add("original-parent");
      trigger.classList.add("original-item");
      container.addEventListener("click", outsideClickListener);
      const matchingLightboxItem = lightboxItems[index];
      // const matchingLightboxItem = Array.from(
      //   container.querySelectorAll(".lightbox-img"),
      // ).find((item) => item.getAttribute("data-lightbox-id") === lightboxId);

      const tl = gsap.timeline({
        defaults: {
          ease: "motion",
        },
      });

      lightboxWrapper.classList.add("active");
      lenis.stop();

      tl.to(lightboxWrapper, { background: "rgba(0,0,0,1)" })
        .to(
          pageCta,
          {
            yPercent: 105,
            duration: 0.6,
          },
          0,
        )
        .fromTo(
          navItems,
          {
            autoAlpha: 0,
            y: "1rem",
          },
          {
            autoAlpha: 1,
            y: "0rem",
            stagger: { each: 0.05, from: "center" },
            duration: 0.6,
          },
          0.5,
        );

      let originalImage = matchingLightboxItem.querySelector("img");
      originalImage.classList.add("u--hide");
      matchingLightboxItem.classList.add("active");

      if (!matchingLightboxItem.contains(trigger)) {
        matchingLightboxItem.appendChild(trigger);
        tl.add(
          Flip.from(state, {
            targets: trigger,
            absolute: true,
            duration: 0.6,
          }),
          0.2,
        );
      }
    });
  });

  nextButton.addEventListener("click", () => {
    let currentIndex = parseInt(lightboxIndex.textContent) - 1;
    const nextIndex = (currentIndex + 1) % lightboxItems.length;
    updateActiveItem(nextIndex);
  });

  prevButton.addEventListener("click", () => {
    let currentIndex = parseInt(lightboxIndex.textContent) - 1;
    const prevIndex =
      (currentIndex - 1 + lightboxItems.length) % lightboxItems.length;
    updateActiveItem(prevIndex);
  });
}

//
//

function initGeneral(next) {
  runSplit(next);
  initNavScroll(next);
  ignoreCurrentPageLink(next);
  initTitles(next);
  initNavToggle(next);
  initProjectHovers(next);
  initEyesImages(next);
  initParallax(next);
  initCtas(next);
  gsap.delayedCall(1, () => {
    ranHomeLoader = true;
  });
}
function initHome(next) {
  initHomeParallax(next);
  initCounter(next);
  initHomeArtists();
  initFeatured(next);
}
function initAbout(next) {
  initAboutServices(next);
  initAboutScrolling(next);
  if (isMobile) {
    let nav = next.querySelector(".nav-w");
    nav.setAttribute("theme", "light");
  }
}
function initWork(next) {
  initWorkPage(next);
}
function initContact(next) {
  if (!isMobile) {
    initContactPage(next);
  }
}
function initArtists(next) {
  initArtistsList(next);
  initEyesImages(next);
  if (isMobile) {
    let nav = next.querySelector(".nav-w");
    nav.setAttribute("theme", "light");
  }
}
function initProject(next) {
  initPageColorChange(next);
  initVideos(next);
  initLightbox(next);
  initCmsFooter(next);
}
function initArtist(next) {
  let cat = next.getAttribute("data-category");
  let footer = next.querySelector(".footer");
  let sections = next.querySelectorAll(".section");
  initCmsFooter(next);
  gsap.set([footer, sections], {
    background: "black",
    color: "white",
    clearProps: "all",
  });
  if (cat === "Photographer") {
    initArtistPhotographer(next);
    initLightbox(next);
  } else {
    initFeatured(next);
    initVideos(next);
  }
}

//
//

function removeElements(elements) {
  elements.forEach((element) => {
    if (element) {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      } else if (element.length) {
        Array.from(element).forEach(
          (el) => el.parentNode && el.parentNode.removeChild(el),
        );
      }
    }
  });
}

//
//

barba.hooks.leave(() => {
  lenis.destroy();
});

barba.hooks.enter((data) => {
  let next = data.next.container;
  next.classList.add("fixed");
});

barba.hooks.afterEnter((data) => {
  let next = data.next.container;
  let triggers = ScrollTrigger.getAll();
  triggers.forEach((trigger) => {
    trigger.kill();
  });

  $(".is--transitioning").removeClass("is--transitioning");
  $(".nav-w.blend").removeClass("blend");
  next.classList.remove("fixed");

  resetWebflow(data);
  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -13 * t)),
  });
  lenis.scrollTo(0, {
    immediate: true,
    force: true,
    lock: true,
  });
});

barba.hooks.after(() => {
  ScrollTrigger.refresh();
});

barba.init({
  preventRunning: true,
  timeout: 5000,
  prevent: function ({ el }) {
    if (el.hasAttribute("data-barba-prevent")) {
      return true;
    }
  },
  transitions: [
    {
      name: "default",
      sync: false,
      leave(data) {
        let current = data.current.container;
        let nextName = data.next.namespace;
        let nextContainer = data.next.container;
        runTransition(current, data, nextName, nextContainer);
        return gsap.fromTo(
          ".main-overlay",
          { opacity: 0 },
          {
            opacity: 1,
            duration: loadDuration,
            ease: "power4.inOut",
          },
        );
      },
      after(data) {
        let trigger = data.trigger;
        let next = data.next.container;
        let nextName = data.next.namespace;
        gsap.from(data.next.container, {
          opacity: 0,
          duration: 1,
        });
        if (nextName === "artists" || nextName === "about") {
          initHeroTitle(next);
        } else if (nextName === "work") {
          initWorkLoad(next);
        }
        if (
          trigger &&
          trigger !== "back" &&
          trigger !== "forward" &&
          trigger !== "popstate"
        ) {
          if (trigger.hasAttribute("data-work-motion")) {
            let motionFilter = data.next.container.querySelector(
              '[data-work-filter="Motion"]',
            );
            motionFilter.click();
          }
          if (trigger.hasAttribute("data-work-stills")) {
            let photographyFilter = data.next.container.querySelector(
              '[data-work-filter="Photography"]',
            );
            photographyFilter.click();
          }
        }
      },
    },
    {
      name: "work-to-case",
      from: {
        namespace: ["work"],
      },
      to: {
        namespace: ["project"],
      },
      sync: false,
      custom: ({ trigger }) => {
        return trigger.hasAttribute("data-case-link");
      },
      leave(data) {
        let current = data.current.container;
        let triggerParent = data.trigger.parentElement;
        let nav = current.querySelector(".nav-w");
        let thumbs = current.querySelector(".thumb-wrap");
        let left = current.querySelector(".work-nav__wrap");
        let image = triggerParent.querySelector("img");
        let overlay = triggerParent.querySelector(".cover-overlay");
        let words = triggerParent.querySelectorAll(".word");
        let vid = triggerParent.querySelectorAll(".list-vid__wrap");
        let eyebrow = triggerParent.querySelector("[data-list-eyebrow]");
        let details = triggerParent.querySelectorAll("[data-work-details]");
        let title = triggerParent.querySelector(".work-list__title");
        let listItems = current.querySelectorAll(".work-list__item");
        let plusLeft = current.querySelector('[data-thumb-plus="left"]');
        let plusRight = current.querySelector('[data-thumb-plus="right"]');
        let squares = current.querySelectorAll(".work-grid__item");
        let squareTitle = triggerParent.querySelectorAll("[data-grid-text]");
        let squareBg = triggerParent.querySelector(".item-info__bg");

        const imageRect = triggerParent.getBoundingClientRect();
        const scrollToPosition =
          window.scrollY +
          imageRect.top +
          imageRect.height / 2 -
          window.innerHeight / 2;
        lenis.scrollTo(scrollToPosition, {
          duration: 0.8,
          ease: "primary",
          lock: true,
        });

        const done = this.async();

        let tl = gsap.timeline({
          defaults: {
            ease: "power4.inOut",
            duration: 0.8,
          },
          onStart: () => {
            gsap.set(triggerParent, { pointerEvents: "none" });
          },
          onComplete: () => {
            removeElements([
              overlay,
              eyebrow,
              ...words,
              ...vid,
              ...details,
              squareTitle,
              squareBg,
            ]);
            done();
          },
        });

        tl.to(nav, { yPercent: -150, z: 0.01 })
          .to(thumbs, { xPercent: 150, z: 0.01, overwrite: true }, 0)
          .to(left, { xPercent: -100, z: 0.01 }, 0)
          .to(
            image,
            {
              filter: "saturate(100%) blur(0px)",
              height: "100%",
              yPercent: 0,
              overwrite: true,
            },
            0,
          )
          .to(plusLeft, { rotate: -180, autoAlpha: 0 }, 0)
          .to(plusRight, { rotate: 180, autoAlpha: 0 }, 0)
          .to(eyebrow, { y: "-150%", overwrite: true, z: 0.01 }, 0)
          .to(words, { yPercent: -150 }, 0)
          .to(vid, { height: "0%" }, 0)
          .to(overlay, { opacity: 0 }, 0)
          .to(details, { opacity: 0, yPercent: 25, stagger: 0.1 }, 0)
          .set(title, { display: "none" })
          .to(
            listItems,
            {
              autoAlpha: 0,
              overwrite: "auto",
            },
            0,
          )
          .to(
            squares,
            {
              yPercent: 25,
              stagger: { amount: 0.4 },
              duration: 0.4,
              opacity: 0,
            },
            0,
          )
          .to(
            triggerParent,
            { opacity: 1, yPercent: 0, autoAlpha: 1, overwrite: "auto" },
            0,
          );
      },
      enter(data) {
        let trigger = data.trigger;
        let incoming = data.next.container;
        let nav = incoming.querySelector(".nav-w");
        let cta = incoming.querySelector(".page-cta");
        let heading = incoming.querySelector(".case-title");

        gsap.set(incoming, { zIndex: 5 });
        gsap.set(trigger, { position: "absolute" });

        let parent = trigger.parentElement;
        let state = Flip.getState(parent);
        let outGoingImage = parent.querySelector("img");

        let target = incoming.querySelector(".hero-img");
        let targetImage = target.querySelector("img");

        gsap.set(targetImage, { display: "none" });
        gsap.set(parent, { aspectRatio: "auto", height: "100%" });
        target.appendChild(parent);
        Flip.from(state, {
          duration: 1,
          ease: "power4.inOut",
        });

        let tl = gsap.timeline({
          defaults: {
            ease: "power4.inOut",
            duration: 0.8,
          },
        });
        tl.from(nav, { yPercent: -150 }, 0)
          .from([heading], { autoAlpha: 0, yPercent: -200 }, "<")
          .from(cta, { yPercent: 125 }, "<")
          .to(
            trigger,
            {
              filter: "saturate(100%)",
              height: "100%",
              overwrite: true,
              z: 0.001,
            },
            "<",
          );
      },
    },
  ],
  views: [
    {
      namespace: "home",
      afterEnter(data) {
        let next = data.next.container;
        if (ranHomeLoader === true) {
          resetHome(next);
        } else {
          initHomeLoader();
        }
        initGeneral(next);
        initHome(next);
      },
    },
    {
      namespace: "about",
      afterEnter(data) {
        let next = data.next.container;
        initGeneral(next);
        initAbout(next);
      },
    },
    {
      namespace: "work",
      afterEnter(data) {
        let next = data.next.container;
        initGeneral(next);
        initWork(next);
      },
    },
    {
      namespace: "contact",
      afterEnter(data) {
        let next = data.next.container;
        initGeneral(next);
        initContact(next);
      },
    },
    {
      namespace: "artists",
      afterEnter(data) {
        let next = data.next.container;
        initGeneral(next);
        initArtists(next);
      },
    },
    {
      namespace: "project",
      afterEnter(data) {
        let next = data.next.container;
        initGeneral(next);
        initProject(next);
      },
    },
    {
      namespace: "artist",
      afterEnter(data) {
        let next = data.next.container;
        initGeneral(next);
        initArtist(next);
      },
    },
    {
      namespace: "default",
      afterEnter(data) {
        let next = data.next.container;
        initGeneral(next);
      },
    },
  ],
});
