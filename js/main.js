
    /* COMMIT 6
/* Année dynamique footer */
document.querySelectorAll('#annee').forEach(el => {
  el.textContent = new Date().getFullYear();
});

/* Dark mode */
const darkToggle = document.getElementById('darkModeToggle');

function applyDarkMode(enabled) {
  document.body.classList.toggle('dark-mode', enabled);
  if (!darkToggle) return;
  const icon = darkToggle.querySelector('i');
  if (icon) icon.className = enabled ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
  darkToggle.setAttribute('aria-label',
    enabled ? 'Désactiver le mode sombre' : 'Activer le mode sombre'
  );
}

const savedDark  = localStorage.getItem('darkMode');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyDarkMode(savedDark !== null ? savedDark === 'true' : prefersDark);

if (darkToggle) {
  darkToggle.addEventListener('click', () => {
    const nowDark = !document.body.classList.contains('dark-mode');
    applyDarkMode(nowDark);
    localStorage.setItem('darkMode', nowDark);
  });
}

/*Navbar dynamique au scroll (fond + ombre + shrink) */
const navbar = document.getElementById('navbar');

if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.style.padding   = '.35rem 0';
      navbar.style.boxShadow = '0 4px 16px rgba(0,0,0,.12)';
    } else {
      navbar.style.padding   = '.75rem 0';
      navbar.style.boxShadow = '0 2px 12px rgba(0,0,0,.07)';
    }
  }, { passive: true });
}

/* Bouton retour en haut */
const btnHaut = document.getElementById('btnHaut');

if (btnHaut) {
  function majBtnHaut() {
    btnHaut.classList.toggle('visible', window.scrollY > 100);
  }
  majBtnHaut();
  window.addEventListener('scroll', majBtnHaut, { passive: true });
  btnHaut.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* 
   COMMIT 7 — Compteurs animés + fade-in sections
    Compteurs animés (IntersectionObserver) */
function animerCompteur(el) {
  const cible = parseInt(el.dataset.cible, 10);
  const duree = 1800;
  const pas   = 16;
  const steps = Math.ceil(duree / pas);
  let count   = 0;

  const timer = setInterval(() => {
    count++;
    const val = Math.round(cible * (1 - Math.pow(1 - count / steps, 3)));
    el.textContent = '+' + val.toLocaleString('fr-FR');
    if (count >= steps) {
      el.textContent = '+' + cible.toLocaleString('fr-FR');
      clearInterval(timer);
    }
  }, pas);
}

const statsEls = document.querySelectorAll('.stat-nombre[data-cible]');

if (statsEls.length) {
  const obsCompteurs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animerCompteur(entry.target);
        obsCompteurs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  statsEls.forEach(el => obsCompteurs.observe(el));
}

/* Fade-in sections au scroll */
document.querySelectorAll('main section').forEach(section => {
  section.classList.add('fade-in-section');
});

const obsSections = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      obsSections.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in-section').forEach(el => {
  obsSections.observe(el);
});

/* sur plus : effet de frappe sur le titre hero
   Le titre s'écrit lettre par lettre au chargement
   Donne un effet vivant et moderne à la page d'accueil */
const heroTitre = document.querySelector('.hero-titre');
if (heroTitre) {
  const texte  = heroTitre.textContent;
  heroTitre.textContent = '';
  heroTitre.style.borderRight = '2px solid currentColor';
  let i = 0;
  const frappe = setInterval(() => {
    heroTitre.textContent += texte[i];
    i++;
    if (i >= texte.length) {
      clearInterval(frappe);
      heroTitre.style.borderRight = 'none';
    }
  }, 40);
}


