
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


/*
   COMMIT 8 — Filtrage freelances + validation formulaire 
Filtrage par catégorie (freelances.html) */
const btnsFiltres = document.querySelectorAll('#filtres .btn-filtre');
const cartesFreel = document.querySelectorAll('.carte-freelance');
const msgAucun    = document.getElementById('aucun-resultat');

if (btnsFiltres.length && cartesFreel.length) {
  btnsFiltres.forEach(btn => {
    btn.addEventListener('click', () => {

      /* Bouton actif */
      btnsFiltres.forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-outline-primary');
      });
      btn.classList.remove('btn-outline-primary');
      btn.classList.add('btn-primary');

      /* Afficher / masquer les cartes */
      const filtre  = btn.dataset.filtre;
      let nbVisible = 0;

      cartesFreel.forEach(carte => {
        const correspond = filtre === 'tous' || carte.dataset.categorie === filtre;
        carte.classList.toggle('masquee', !correspond);
        if (correspond) nbVisible++;
      });

      if (msgAucun) {
        msgAucun.style.display = nbVisible === 0 ? 'block' : 'none';
      }
    });
  });
}

/* Sur plus : compteur de résultats freelances
   Affiche combien de freelances sont visibles après filtre
   Ex: "3 freelances trouvés" → donne une vraie UX pro */
function majCompteurResultats() {
  const visibles = document.querySelectorAll('.carte-freelance:not(.masquee)');
  let compteurEl = document.getElementById('compteur-resultats');

  if (!compteurEl && cartesFreel.length) {
    compteurEl = document.createElement('p');
    compteurEl.id = 'compteur-resultats';
    compteurEl.style.cssText = 'text-align:center; color:var(--gris-texte); margin-top:1rem; font-size:.9rem;';
    const grille = document.getElementById('grille-freelances');
    if (grille) grille.parentNode.insertBefore(compteurEl, grille);
  }

  if (compteurEl) {
    compteurEl.textContent = visibles.length + ' freelance' + (visibles.length > 1 ? 's' : '') + ' trouvé' + (visibles.length > 1 ? 's' : '');
  }
}

if (btnsFiltres.length) {
  btnsFiltres.forEach(btn => {
    btn.addEventListener('click', majCompteurResultats);
  });
  majCompteurResultats();
}

/*Validation formulaire contact */
const form = document.getElementById('formulaireContact');

if (form) {

  function afficherErreur(id, msg) {
    const errEl = document.getElementById('erreur-' + id);
    const champ = document.getElementById(id);
    if (errEl) { errEl.textContent = msg; errEl.classList.add('visible'); }
    if (champ)   champ.classList.add('erreur');
  }

  function effacerErreur(id) {
    const errEl = document.getElementById('erreur-' + id);
    const champ = document.getElementById(id);
    if (errEl) { errEl.textContent = ''; errEl.classList.remove('visible'); }
    if (champ)   champ.classList.remove('erreur');
  }

  function emailValide(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  /* Effacement erreur en temps réel */
  ['nom','prenom','email','sujet','message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input',  () => effacerErreur(id));
      el.addEventListener('change', () => effacerErreur(id));
    }
  });

  /* Sur plus : compteur de caractères sur le textarea
     Affiche en temps réel combien de caractères ont été saisis
     Ex : "45 / 20 min" → aide l'utilisateur à savoir où il en est */
  const messageInput = document.getElementById('message');
  if (messageInput) {
    const compteurMsg = document.createElement('small');
    compteurMsg.style.cssText = 'display:block; text-align:right; color:var(--gris-texte); margin-top:.25rem;';
    compteurMsg.textContent = '0 / 20 caractères minimum';
    messageInput.parentNode.appendChild(compteurMsg);

    
    messageInput.addEventListener('input', () => {
      const len = messageInput.value.trim().length;
      compteurMsg.textContent = len + ' / 20 caractères minimum';
      compteurMsg.style.color = len >= 20 ? 'var(--vert)' : 'var(--gris-texte)';
    });
  }

  /* Soumission et validation */
  form.addEventListener('submit', e => {
    e.preventDefault();

    ['nom','prenom','email','sujet','message'].forEach(id => effacerErreur(id));

    const nom     = document.getElementById('nom');
    const prenom  = document.getElementById('prenom');
    const email   = document.getElementById('email');
    const sujet   = document.getElementById('sujet');
    const message = document.getElementById('message');
    let valide    = true;

    /* Tous les champs requis vérifiés */
    if (!nom.value.trim() || nom.value.trim().length < 2) {
      afficherErreur('nom', 'Nom requis (2 caractères minimum).');
      valide = false;
    }
    if (!prenom.value.trim() || prenom.value.trim().length < 2) {
      afficherErreur('prenom', 'Prénom requis (2 caractères minimum).');
      valide = false;
    }
    /* Format email vérifié par regex */
    if (!emailValide(email.value.trim())) {
      afficherErreur('email', 'Adresse email invalide.');
      valide = false;
    }
    if (!sujet.value) {
      afficherErreur('sujet', 'Veuillez choisir un sujet.');
      valide = false;
    }
    /* Longueur minimum du message (20 caractères) */
    if (message.value.trim().length < 20) {
      afficherErreur('message', 'Message trop court (20 caractères minimum).');
      valide = false;
    }

    if (!valide) {
      form.querySelector('.erreur').focus();
      return;
    }

    /* Message de succès après soumission */
    form.reset();
    form.style.display = 'none';
    const msgSucces = document.getElementById('message-succes');
    if (msgSucces) {
      msgSucces.style.display = 'block';
      msgSucces.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}