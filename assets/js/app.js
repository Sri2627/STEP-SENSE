const revealItems = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-in'));
}

const directionCards = [...document.querySelectorAll('.direction-card')];
const toast = document.querySelector('.toast');
let toastTimeout;

directionCards.forEach((card) => {
  card.addEventListener('click', () => {
    directionCards.forEach((item) => {
      const active = item === card;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });

    const direction = card.dataset.direction.toUpperCase();
    document.querySelector('.toast-label').textContent = `${direction} ${direction === 'STRAIGHT' ? 'AHEAD' : 'TURN'}`;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove('is-visible'), 1700);

    if ('vibrate' in navigator) {
      const patterns = { left: [120, 80, 120], straight: [320], right: [80, 70, 80, 70, 80] };
      navigator.vibrate(patterns[card.dataset.direction]);
    }
  });
});

const useCases = {
  walk: {
    title: 'Walking',
    copy: 'Keep your phone in your pocket and your eyes up as you follow a route through the neighborhood.',
    image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85',
    label: 'A person exploring a city on foot',
    index: '01 / 06',
  },
  cycling: {
    title: 'Cycling',
    copy: 'Plan your ride before setting off, keep your phone stowed, and stay alert to traffic. Haptic cues are supplementary—not a substitute for safe riding.',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=85',
    label: 'A cyclist riding outdoors',
    index: '02 / 06',
  },
  driving: {
    title: 'Car journeys',
    copy: 'Set up your route before you leave and follow your vehicle’s hands-free navigation. STEPSENSE is designed for walking, not as a driving aid.',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=85',
    label: 'A car ready for a journey',
    index: '03 / 06',
  },
  trekking: {
    title: 'Trekking',
    copy: 'Prepare your route before heading out and enjoy the trail with your phone safely stowed. Always follow trail signs and local safety guidance.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=900&q=85',
    label: 'Hikers following a mountain trail',
    index: '04 / 06',
  },
  city: {
    title: 'Exploring the city',
    copy: 'Find your way through unfamiliar streets while keeping your attention on the people and places around you.',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=85',
    label: 'City streets at dusk',
    index: '05 / 06',
  },
  travel: {
    title: 'Travel',
    copy: 'Explore somewhere new hands-free, with a little more confidence around every corner.',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=85',
    label: 'A new city ready to explore',
    index: '06 / 06',
  },
};

const useTabs = document.querySelectorAll('.use-tab');
const useImage = document.querySelector('.use-image');

useTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    useTabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });

    const selected = useCases[tab.dataset.use];
    document.querySelector('[data-use-title]').textContent = selected.title;
    document.querySelector('[data-use-copy]').textContent = selected.copy;
    useImage.style.backgroundImage = `url("${selected.image}")`;
    useImage.setAttribute('aria-label', selected.label);
    document.querySelector('.use-image-index').textContent = selected.index;
  });
});

const menuButton = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  mainNav.classList.toggle('is-open', open);
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    mainNav.classList.remove('is-open');
  });
});

const contactForm = document.querySelector('#contact-form');
const contactStatus = document.querySelector('#contact-form-status');

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  const formData = new FormData(contactForm);
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const payload = Object.fromEntries(formData.entries());
  payload._subject = payload.subject;
  payload._replyto = payload.email;
  payload._template = 'table';

  submitButton.disabled = true;
  contactStatus.textContent = 'Sending your message…';

  fetch('https://formsubmit.co/ajax/srikanthnaidu2627@gmail.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then(async (response) => {
      const result = await response.json();
      if (!response.ok || result.success !== 'true') {
        throw new Error(result.message || 'The message could not be sent.');
      }
      contactStatus.textContent = 'Thanks! Your message has been sent.';
      contactForm.reset();
    })
    .catch((error) => {
      contactStatus.textContent = `${error.message} Please try again or email us directly.`;
    })
    .finally(() => {
      submitButton.disabled = false;
    });
});

const stepCounter = document.querySelector('[data-count]');
let counted = false;
const countSteps = () => {
  if (counted) return;
  counted = true;
  const target = Number(stepCounter.dataset.count);
  const started = performance.now();
  const duration = 1250;
  const animate = (now) => {
    const progress = Math.min((now - started) / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    stepCounter.textContent = Math.round(target * eased).toLocaleString('en-US');
    if (progress < 1) requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
};

if ('IntersectionObserver' in window && !reduceMotion) {
  const countObserver = new IntersectionObserver((entries, observer) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      countSteps();
      observer.disconnect();
    }
  }, { threshold: 0.35 });
  countObserver.observe(document.querySelector('.activity-panel'));
} else {
  stepCounter.textContent = Number(stepCounter.dataset.count).toLocaleString('en-US');
}