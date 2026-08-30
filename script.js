/* ============================================================
   MR. GAY WORLD — script.js
   Vanilla JS for the mobile menu drawer, hero mute toggle,
   smooth-scrolling anchors, back-to-top button, and interactive
   world map initialization.
============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     1. MOBILE MENU TOGGLE DRAWER
  ============================================================ */

  var menuToggle = document.getElementById('menu-toggle');
  var menuIcon = document.getElementById('menu-icon');
  var mobileMenu = document.getElementById('mobile-menu');
  var menuOverlay = document.getElementById('menu-overlay');
  var menuLinks = document.querySelectorAll('.menu-link');
  var menuOpen = false;

  function openMenu() {
    menuOpen = true;
    mobileMenu.classList.remove('translate-x-full');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuOverlay.classList.remove('opacity-0', 'pointer-events-none');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
    if (menuIcon) {
      menuIcon.className = 'fa-solid fa-xmark text-lg';
    }
    document.body.classList.add('overflow-hidden');
  }

  function closeMenu() {
    menuOpen = false;
    mobileMenu.classList.add('translate-x-full');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuOverlay.classList.add('opacity-0', 'pointer-events-none');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    if (menuIcon) {
      menuIcon.className = 'fa-solid fa-bars text-lg';
    }
    document.body.classList.remove('overflow-hidden');
  }

  function toggleMenu() {
    if (menuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (menuToggle && mobileMenu && menuOverlay) {
    menuToggle.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', closeMenu);

    menuLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menuOpen) {
        closeMenu();
      }
    });

    /* Close the drawer automatically if the viewport grows past
       the mobile breakpoint while it is open */
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768 && menuOpen) {
        closeMenu();
      }
    });
  }

  /* ============================================================
     1B. ACTIVE NAV LINK (multi-page site)
     Every nav-link / menu-link carries a data-page attribute
     ("index", "about", "network", "news", "contact"). We read the
     current page from <body data-page="..."> and highlight the
     matching links in both the desktop nav and the mobile drawer.
  ============================================================ */

  var currentPage = document.body.getAttribute('data-page');

  if (currentPage) {
    document.querySelectorAll('.nav-link[data-page], .menu-link[data-page]').forEach(function (link) {
      if (link.getAttribute('data-page') === currentPage) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ============================================================
     2. HERO VIDEO MUTE / UNMUTE
  ============================================================ */

  var muteBtn = document.getElementById('mute-btn');
  var muteIcon = document.getElementById('mute-icon');
  var heroVideo = document.getElementById('hero-video');

  if (muteBtn && heroVideo) {
    muteBtn.addEventListener('click', function () {
      heroVideo.muted = !heroVideo.muted;

      var isMuted = heroVideo.muted;
      muteBtn.setAttribute('aria-label', isMuted ? 'Unmute video' : 'Mute video');

      if (muteIcon) {
        muteIcon.className = isMuted
          ? 'fa-solid fa-volume-xmark text-lg'
          : 'fa-solid fa-volume-high text-lg';
      }
    });
  }

  /* ============================================================
     3. SMOOTH SCROLLING FOR INTERNAL ANCHORS
     Applies to every in-page link (#about, #candidate,
     #national-director, and all the rest), not just a fixed list,
     so new sections keep working without extra wiring.
  ============================================================ */

  var anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      var targetId = link.getAttribute('href');

      if (!targetId || targetId === '#') {
        return;
      }

      var targetEl = document.querySelector(targetId);

      if (targetEl) {
        event.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

        /* Keep the URL in sync without triggering a jump-scroll */
        if (history.pushState) {
          history.pushState(null, '', targetId);
        }
      }
    });
  });

  /* ============================================================
     4. BACK-TO-TOP FLOATING BUTTON
  ============================================================ */

  var backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    var SHOW_AFTER_PX = 480;

    function toggleBackToTop() {
      if (window.scrollY > SHOW_AFTER_PX) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-3');
      } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-3');
      }
    }

    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', toggleBackToTop, { passive: true });

    /* Set the correct initial state on load, e.g. if the page
       is opened mid-scroll via a hash link */
    toggleBackToTop();
  }

/* ============================================================
   5. INTERACTIVE WORLD MAP (Enhanced Visuals + Click Redirect)
============================================================ */

if (document.getElementById('world-map') && typeof jsVectorMap !== 'undefined') {
  var activeCodes = ['PH', 'ZA', 'ES', 'US', 'TH', 'IN', 'GB', 'MX', 'BR', 'DE'];

  var map = new jsVectorMap({
    selector: '#world-map',
    map: 'world',
    draggable: true,
    zoomButtons: false,
    zoomOnScroll: false,
    bindTouchEvents: true,
    
    regionStyle: {
      initial: {
        fill: '#1A184B',          // Lighter midnight navy so landmasses pop
        fillOpacity: 1,
        stroke: '#00A8FF',        // Subtle cyan border lines between countries
        strokeWidth: 0.3,
      },
      hover: {
        fill: '#00A8FF',          // Vibrant cyan highlight on hover
        fillOpacity: 1,
        cursor: 'pointer'
      },
      selected: {
        fill: '#D4AF37',          // Bright pageantry gold for franchised countries
      }
    },

    selectedRegions: activeCodes,

    // Contact is now its own page. Send unfranchised-country clicks
    // there with a query param so the inquiry dropdown can pre-fill.
    onRegionClick: function (event, code) {
      window.location.href = 'contact.html?inquiry=Franchise#contact';
    },

    onRegionTooltipShow: function (event, tooltip, code) {
      var activeFranchises = {
        PH: 'Philippines: Official Franchise',
        ZA: 'South Africa: Official Franchise',
        ES: 'Spain: Official Franchise',
        US: 'USA: Official Franchise',
        TH: 'Thailand: Official Franchise',
        IN: 'India: Official Franchise',
        GB: 'United Kingdom: Official Franchise',
        MX: 'Mexico: Official Franchise',
        BR: 'Brazil: Official Franchise',
        DE: 'Germany: Official Franchise'
      };

      if (activeFranchises[code]) {
        tooltip.text(`<strong>${activeFranchises[code]}</strong>`, true);
      } else {
        tooltip.text(`<strong>${tooltip.text()}</strong><br><span style="color:#D4AF37; font-size:11px;">Click to apply for Franchise</span>`, true);
      }
    }
  });

  /* Keep map responsive on device resize */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (map && typeof map.updateSize === 'function') {
        map.updateSize();
      }
    }, 150);
  });
}

/* ============================================================
   6. FLIP CARDS — "WHAT WE STAND FOR"
   Desktop relies on the CSS :hover rule. Touch devices (and
   keyboard users tabbing through) don't get :hover, so a click/
   tap toggles the .is-flipped class directly.
============================================================ */

var flipCards = document.querySelectorAll('.flip-card');

flipCards.forEach(function (card) {
  card.addEventListener('click', function () {
    card.classList.toggle('is-flipped');
  });

  card.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      card.classList.toggle('is-flipped');
    }
  });
});

/* ============================================================
   7. GDPR / COOKIE PREFERENCES BANNER
============================================================ */

var COOKIE_STORAGE_KEY = 'mgw_cookie_consent';

var cookieBanner = document.getElementById('cookie-banner');
var cookieAcceptAllBtn = document.getElementById('cookie-accept-all');
var cookieRejectOptionalBtn = document.getElementById('cookie-reject-optional');
var cookiePreferencesToggleBtn = document.getElementById('cookie-preferences-toggle');
var cookiePreferencesModal = document.getElementById('cookie-preferences-modal');
var cookieSavePreferencesBtn = document.getElementById('cookie-save-preferences');
var cookieClosePreferencesBtn = document.getElementById('cookie-close-preferences');
var cookieAnalyticsInput = document.getElementById('cookie-pref-analytics');
var cookieMarketingInput = document.getElementById('cookie-pref-marketing');

function getCookieConsent() {
  try {
    var raw = localStorage.getItem(COOKIE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

function saveCookieConsent(consent) {
  consent.timestamp = new Date().toISOString();
  try {
    localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(consent));
  } catch (err) {
    /* localStorage unavailable (private browsing, etc.); fail silently */
  }
}

function hideCookieBanner() {
  if (cookieBanner) {
    cookieBanner.classList.add('cookie-hidden');
  }
}

function showCookieBanner() {
  if (cookieBanner) {
    cookieBanner.classList.remove('cookie-hidden');
  }
}

function openPreferencesModal() {
  if (!cookiePreferencesModal) return;

  var existing = getCookieConsent();
  if (cookieAnalyticsInput) {
    cookieAnalyticsInput.checked = existing ? !!existing.analytics : true;
  }
  if (cookieMarketingInput) {
    cookieMarketingInput.checked = existing ? !!existing.marketing : false;
  }

  cookiePreferencesModal.classList.remove('hidden');
}

function closePreferencesModal() {
  if (cookiePreferencesModal) {
    cookiePreferencesModal.classList.add('hidden');
  }
}

if (cookieBanner) {
  var existingConsent = getCookieConsent();

  if (!existingConsent) {
    showCookieBanner();
  }

  if (cookieAcceptAllBtn) {
    cookieAcceptAllBtn.addEventListener('click', function () {
      saveCookieConsent({ necessary: true, analytics: true, marketing: true, accepted: true });
      hideCookieBanner();
      closePreferencesModal();
    });
  }

  if (cookieRejectOptionalBtn) {
    cookieRejectOptionalBtn.addEventListener('click', function () {
      saveCookieConsent({ necessary: true, analytics: false, marketing: false, accepted: true });
      hideCookieBanner();
      closePreferencesModal();
    });
  }

  if (cookiePreferencesToggleBtn) {
    cookiePreferencesToggleBtn.addEventListener('click', openPreferencesModal);
  }

  if (cookieClosePreferencesBtn) {
    cookieClosePreferencesBtn.addEventListener('click', closePreferencesModal);
  }

  if (cookieSavePreferencesBtn) {
    cookieSavePreferencesBtn.addEventListener('click', function () {
      saveCookieConsent({
        necessary: true,
        analytics: cookieAnalyticsInput ? cookieAnalyticsInput.checked : true,
        marketing: cookieMarketingInput ? cookieMarketingInput.checked : false,
        accepted: true
      });
      hideCookieBanner();
      closePreferencesModal();
    });
  }

  if (cookiePreferencesModal) {
    cookiePreferencesModal.addEventListener('click', function (event) {
      if (event.target === cookiePreferencesModal) {
        closePreferencesModal();
      }
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && cookiePreferencesModal && !cookiePreferencesModal.classList.contains('hidden')) {
      closePreferencesModal();
    }
  });
}

/* ============================================================
   7B. CONTACT INQUIRY PRE-FILL (from ?inquiry= query param)
   Lets other pages link into the contact form with a reason
   already selected, e.g. contact.html?inquiry=Franchise
============================================================ */

(function () {
  var inquirySelect = document.getElementById('contact-inquiry');
  if (!inquirySelect) return;

  var params = new URLSearchParams(window.location.search);
  var inquiry = params.get('inquiry');

  if (inquiry) {
    var optionExists = Array.prototype.some.call(inquirySelect.options, function (opt) {
      return opt.value === inquiry;
    });
    if (optionExists) {
      inquirySelect.value = inquiry;
    }
  }
})();

/* ============================================================
   8. "WHO WE ARE" 3-PHOTO CAROUSEL
============================================================ */

(function () {
  var slides = document.querySelectorAll('#about-carousel .about-slide');
  var dots = document.querySelectorAll('#about-dots .carousel-dot');
  var prevBtn = document.getElementById('about-prev');
  var nextBtn = document.getElementById('about-next');
  var carousel = document.getElementById('about-carousel');

  if (!slides.length || !carousel) return;

  var current = 0;
  var autoTimer;

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === current);
    });
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(function () {
      goTo(current + 1);
    }, 6000);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      goTo(current - 1);
      startAuto();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      goTo(current + 1);
      startAuto();
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      goTo(i);
      startAuto();
    });
  });

  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);

  startAuto();
})();

/* ============================================================
   9. "JOIN MR. GAY WORLD 2026" FLOATING PHOTO COLLAGE
   Hover already scales/outlines each photo via CSS. Click/tap
   gives touch devices (which have no :hover) the same effect.
============================================================ */

var collagePhotos = document.querySelectorAll('.collage-photo');

collagePhotos.forEach(function (photo) {
  photo.addEventListener('click', function () {
    collagePhotos.forEach(function (other) {
      if (other !== photo) {
        other.classList.remove('is-active');
      }
    });
    photo.classList.toggle('is-active');
  });
});

/* ============================================================
   10. "THE COMPETITION" STAGGERED GALLERY LIGHTBOX
============================================================ */

var competitionPhotos = document.querySelectorAll('.competition-photo');
var competitionLightbox = document.getElementById('competition-lightbox');
var competitionLightboxImg = document.getElementById('competition-lightbox-img');
var competitionLightboxCaption = document.getElementById('competition-lightbox-caption');
var competitionLightboxClose = document.getElementById('competition-lightbox-close');

function openCompetitionLightbox(photo) {
  if (!competitionLightbox) return;

  var img = photo.querySelector('img');
  if (competitionLightboxImg) {
    competitionLightboxImg.src = img ? img.src : '';
    competitionLightboxImg.alt = img ? img.alt : '';
  }
  if (competitionLightboxCaption) {
    competitionLightboxCaption.textContent = photo.getAttribute('data-caption') || '';
  }

  competitionLightbox.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
}

function closeCompetitionLightbox() {
  if (!competitionLightbox) return;
  competitionLightbox.classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
}

competitionPhotos.forEach(function (photo) {
  photo.addEventListener('click', function (event) {
    event.preventDefault();
    openCompetitionLightbox(photo);
  });
});

if (competitionLightboxClose) {
  competitionLightboxClose.addEventListener('click', closeCompetitionLightbox);
}

if (competitionLightbox) {
  competitionLightbox.addEventListener('click', function (event) {
    if (event.target === competitionLightbox) {
      closeCompetitionLightbox();
    }
  });
}

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && competitionLightbox && !competitionLightbox.classList.contains('hidden')) {
    closeCompetitionLightbox();
  }
});

});