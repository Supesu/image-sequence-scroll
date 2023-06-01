const frameCount = 113; // Total amount of images

const currentFrame = (index) => {
  return `venue-images/LRT_${index.toString().padStart(4, "0")}.jpg`; ///LRT_0001
};

// this is scuffed I just cba thinking better angle rn
const animationContainer = document.getElementById('animationContainer');
const animationImage = document.getElementById('animationImage');
const imageSequence = Array.from({ length: frameCount }, (_, i) => currentFrame(i + 1))
const preloadedImages = []; // Array to store preloaded images

let currentIndex = 0;

function preloadImages() {
  let loadedImages = 0;

  function imageLoaded() {
    loadedImages++;
    if (loadedImages === imageSequence.length) {
      startAnimation();
    }
  }

  for (let i = 0; i < imageSequence.length; i++) {
    const img = new Image();
    img.onload = imageLoaded;
    img.src = imageSequence[i];
    preloadedImages.push(img);
  }
}

function startAnimation() {
  animationContainer.style.backgroundImage = `url(${imageSequence[0]})`;
  var unlocked = false;

  function changeImage(num) {
    let next = currentIndex + num;
    currentIndex = next;

    let process = `url(${imageSequence[currentIndex]})`;
    if (process !== "url(undefined)")
      animationContainer.style.backgroundImage = `url(${imageSequence[currentIndex]})`;
  }

  function handleScroll(event, passNum = 1) {
    const deltaY = event.deltaY;
    const pageOffset = window.pageYOffset || document.documentElement.scrollTop;

    // resume animation and lock 
    let finishedAnimation = currentIndex + 1 > frameCount;
    let scrollUp = deltaY < 0
    let topOfPage = pageOffset == 0;

    console.log(`${finishedAnimation}:${scrollUp}:${unlocked}:${topOfPage}`)

    if (finishedAnimation && unlocked && scrollUp && topOfPage) {
      document.body.style.overflow = "hidden";
      unlocked = false;
      changeImage(-1)
      return;
    }

    // finish animation and unlock
    if (currentIndex > frameCount && !unlocked) {
      document.body.style.overflow = "";
      unlocked = true;
      return;
    }

    if (unlocked) return;

    if (deltaY > 0) {
      changeImage(1)
    } else if (deltaY < 0) {
      changeImage(-1)
    }

    if (passNum !== 2)
      handleScroll(event, passNum+1);
  }

  window.addEventListener('wheel', handleScroll);
}

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function lazyLoadImages() {
  window.addEventListener('scroll', () => {
    for (let i = 0; i < preloadedImages.length; i++) {
      const img = preloadedImages[i];
      if (isInViewport(img) && !img.src) {
        img.src = imageSequence[i];
      }
    }
  });
}

// Preload images before starting the animation
preloadImages();

// Lazy load images as they come into the viewport
lazyLoadImages();
