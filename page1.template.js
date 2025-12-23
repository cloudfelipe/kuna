const tabs = document.querySelectorAll('.tab[data-pane]');
const panes = document.querySelectorAll('.pane');

const trackEvent = (name, params = {}) => {
  if (typeof window !== 'undefined') {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params);
    }
    if (typeof window.fbq === 'function') {
      window.fbq('trackCustom', name, params);
    }
  }
};

const attachClickTracking = (element, eventName, extra = {}) => {
  if (!element || element.dataset.trackingAttached) return;
  element.addEventListener('click', () => {
    trackEvent(eventName, {
      element_id: element.id || undefined,
      text: element.textContent?.trim(),
      ...extra
    });
  });
  element.dataset.trackingAttached = 'true';
};

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const paneId = tab.getAttribute('data-pane');
    if (!paneId) return;
    tabs.forEach(item => item.classList.remove('active'));
    panes.forEach(pane => pane.classList.remove('active'));
    tab.classList.add('active');
    const targetPane = document.getElementById(paneId);
    if (targetPane) targetPane.classList.add('active');
    trackEvent('gallery_tab_change', { tab: tab.textContent?.trim(), pane: paneId });
    if (paneId === 'p-planos') {
      trackEvent('video_tab_view', { pane: paneId });
    }
  });
});

// WhatsApp floating size logic
const waButton = document.getElementById('wa');
const handleScroll = () => {
  if (!waButton) return;
  if (window.scrollY > 120) {
    waButton.classList.add('small');
  } else {
    waButton.classList.remove('small');
  }
};
document.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('pageshow', handleScroll);
handleScroll();

// Update all WA links when you set your number once here:
const WHATSAPP_NUMBER = '{{WHATSAPP_NUMBER}}';
const preMsgs = {
  hero: encodeURIComponent('{{WA_MSG_HERO}}'),
  final: encodeURIComponent('{{WA_MSG_FINAL}}'),
  button: encodeURIComponent('{{WA_MSG_BUTTON}}')
};

const setWhatsAppLinks = () => {
  const heroCta = document.getElementById('cta-hero');
  const finalCta = document.getElementById('cta-final');
  if (heroCta) heroCta.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${preMsgs.hero}`;
  if (finalCta) finalCta.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${preMsgs.final}`;
  if (waButton) waButton.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${preMsgs.button}`;
};
setWhatsAppLinks();
const trackWhatsappLinks = () => {
  const waLinks = document.querySelectorAll('a[href*="wa.me"]');
  waLinks.forEach(link => attachClickTracking(link, 'whatsapp_click', { href: link.href }));
};
trackWhatsappLinks();

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const lightboxCounter = document.getElementById('lightbox-counter');
const lightboxContent = document.querySelector('.lightbox-content');
const lightboxHint = document.getElementById('lightbox-hint');

const lightboxState = {
  images: [],
  index: 0,
  keyListenerActive: false
};

const updateLightbox = () => {
  if (!lightboxImg || !lightboxCounter || !lightboxState.images.length) return;
  lightboxImg.src = lightboxState.images[lightboxState.index];
  lightboxCounter.textContent = `${lightboxState.index + 1} / ${lightboxState.images.length}`;
  trackEvent('lightbox_image_view', { index: lightboxState.index + 1 });
};

const handleKeyNavigation = event => {
  if (!lightbox || !lightbox.classList.contains('active')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') showPrev();
  if (event.key === 'ArrowRight') showNext();
};

const isMobileViewport = () => window.innerWidth <= 700;

let touchStartX = null;
const handleTouchStart = event => {
  if (!isMobileViewport() || !event.changedTouches?.length) return;
  touchStartX = event.changedTouches[0].clientX;
};

const handleTouchEnd = event => {
  if (!isMobileViewport() || touchStartX === null || !event.changedTouches?.length) return;
  const touchEndX = event.changedTouches[0].clientX;
  const delta = touchStartX - touchEndX;
  touchStartX = null;
  if (Math.abs(delta) < 40) return;
  delta > 0 ? showNext() : showPrev();
};

lightboxContent?.addEventListener('touchstart', handleTouchStart, { passive: true });
lightboxContent?.addEventListener('touchend', handleTouchEnd, { passive: true });

const attachKeyListener = () => {
  if (!lightboxState.keyListenerActive) {
    document.addEventListener('keydown', handleKeyNavigation);
    lightboxState.keyListenerActive = true;
  }
};

const detachKeyListener = () => {
  if (lightboxState.keyListenerActive) {
    document.removeEventListener('keydown', handleKeyNavigation);
    lightboxState.keyListenerActive = false;
  }
};

function openLightbox() {
  if (!lightbox) return;
  lightbox.classList.add('active');
  updateLightbox();
  document.body.style.overflow = 'hidden';
  attachKeyListener();
  trackEvent('lightbox_open');
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  detachKeyListener();
  touchStartX = null;
  trackEvent('lightbox_close');
}

function showPrev() {
  if (!lightboxState.images.length) return;
  lightboxState.index = (lightboxState.index - 1 + lightboxState.images.length) % lightboxState.images.length;
  updateLightbox();
  trackEvent('lightbox_nav', { direction: 'prev' });
}

function showNext() {
  if (!lightboxState.images.length) return;
  lightboxState.index = (lightboxState.index + 1) % lightboxState.images.length;
  updateLightbox();
  trackEvent('lightbox_nav', { direction: 'next' });
}

function initLightbox() {
  const galleries = document.querySelectorAll('.gallery');
  galleries.forEach(gallery => {
    const images = gallery.querySelectorAll('img');
    images.forEach((img, index) => {
      img.addEventListener('click', () => {
        lightboxState.images = Array.from(images).map(i => i.src);
        lightboxState.index = index;
        openLightbox();
        trackEvent('gallery_image_click', { index: index + 1, alt: img.alt });
      });
    });
  });
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);
if (lightboxNext) lightboxNext.addEventListener('click', showNext);
if (lightbox) {
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });
}
initLightbox();

// Mobile Menu
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileOverlay = document.getElementById('mobile-overlay');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu .link');

const toggleMobileMenu = () => {
  menuToggle?.classList.toggle('active');
  mobileMenu?.classList.toggle('active');
  mobileOverlay?.classList.toggle('active');
  document.body.style.overflow = mobileMenu?.classList.contains('active') ? 'hidden' : '';
  trackEvent('mobile_menu_toggle', { state: mobileMenu?.classList.contains('active') ? 'open' : 'closed' });
};

const closeMobileMenu = (reason = 'manual') => {
  menuToggle?.classList.remove('active');
  mobileMenu?.classList.remove('active');
  mobileOverlay?.classList.remove('active');
  document.body.style.overflow = '';
  trackEvent('mobile_menu_toggle', { state: 'closed', reason });
};

menuToggle?.addEventListener('click', toggleMobileMenu);
mobileOverlay?.addEventListener('click', () => closeMobileMenu('overlay'));
mobileMenuLinks.forEach(link => link.addEventListener('click', () => closeMobileMenu('nav_link')));

// Tracking for secondary CTAs and navigation
attachClickTracking(document.querySelector('.btn-primary'), 'cta_secondary_click');
document.querySelectorAll('.nav .link').forEach(link => attachClickTracking(link, 'nav_link_click', { target: link.getAttribute('href') }));

document.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link) return;
  const href = link.getAttribute('href') || '';
  const isInternal = href.startsWith('#') || (link.host === window.location.host);
  const isWhatsApp = href.includes('wa.me');
  if (!isInternal && !isWhatsApp) {
    trackEvent('outbound_click', { href });
  }
});

const langLinks = document.querySelectorAll('.lang-switch a, .lang-switch-mobile a');
langLinks.forEach(link => {
  attachClickTracking(link, 'lang_switch', {
    lang: link.dataset.lang || link.textContent?.trim().toLowerCase()
  });
});

const videoFrame = document.querySelector('.video-frame');
if (videoFrame && 'IntersectionObserver' in window) {
  const videoObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        trackEvent('video_tour_view', { method: 'viewport' });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  videoObserver.observe(videoFrame);
}

const sectionIds = ['galeria','tour','amenidades','ubicacion','sura','contacto'];
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        trackEvent('section_view', { section: entry.target.id });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });
}

const scrollDepthTargets = [
  { threshold: 0.5, label: '50' },
  { threshold: 0.9, label: '90' }
];
const triggeredDepths = new Set();
const handleScrollDepth = () => {
  const scrollPosition = window.scrollY + window.innerHeight;
  const scrollHeight = document.documentElement.scrollHeight || 1;
  const progress = scrollPosition / scrollHeight;
  scrollDepthTargets.forEach(target => {
    if (progress >= target.threshold && !triggeredDepths.has(target.label)) {
      triggeredDepths.add(target.label);
      trackEvent('scroll_depth', { depth: `${target.label}%` });
    }
  });
};
document.addEventListener('scroll', handleScrollDepth, { passive: true });
window.addEventListener('load', handleScrollDepth);

setTimeout(() => {
  trackEvent('time_on_page', { seconds: 30 });
}, 30000);

