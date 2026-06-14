
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


