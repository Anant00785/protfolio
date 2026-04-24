import './style.css';

document.addEventListener('DOMContentLoaded', () => {

  // ─── Nav hamburger ───────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // ─── Navbar scroll ───────────────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveNav();
  }, { passive: true });

  // ─── Active nav highlight ────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navAs    = document.querySelectorAll('.nav-links a');
  function updateActiveNav() {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 160) current = s.id;
    });
    navAs.forEach(a => {
      const match = a.getAttribute('href') === `#${current}`;
      a.classList.toggle('active-link', match);
    });
  }

  // ─── Boot sequence + Typing ──────────────────────────────
  const bootEl   = document.getElementById('bootLine');
  const typingEl = document.getElementById('typing-text');
  const bootSeq  = ['LOADING MODULES...', 'CALIBRATING SYSTEMS...', 'INITIALIZING ANANT.EXE...'];
  let bIdx = 0;

  function runBootLine() {
    if (bIdx < bootSeq.length - 1) {
      bootEl.textContent = bootSeq[bIdx++];
      setTimeout(runBootLine, 600);
    } else {
      bootEl.textContent = bootSeq[bIdx];
      setTimeout(startTyping, 400);
    }
  }

  const phrase = 'Initializing Anant.exe...';
  let tIdx = 0;
  function startTyping() {
    if (tIdx < phrase.length) {
      typingEl.textContent += phrase.charAt(tIdx++);
      setTimeout(startTyping, 85 + Math.random() * 55);
    }
  }
  setTimeout(runBootLine, 300);

  // ─── Arc reactor orbit dots ──────────────────────────────
  const orbitDots = document.getElementById('orbitDots');
  if (orbitDots) {
    const count = 8, radius = 170;
    for (let i = 0; i < count; i++) {
      const d = document.createElement('div');
      d.classList.add('orbit-dot');
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      d.style.cssText = `transform:translate(${x}px,${y}px);margin-left:-3.5px;margin-top:-3.5px;${i%2===1?'background:var(--orange);box-shadow:0 0 8px var(--orange);':''}`;
      orbitDots.appendChild(d);
    }
  }

  // ─── Canvas Particles ────────────────────────────────────
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x        = Math.random() * canvas.width;
      this.y        = initial ? Math.random() * canvas.height : canvas.height + 10;
      this.r        = Math.random() * 2 + 0.5;
      this.vy       = -(Math.random() * 0.5 + 0.15);
      this.vx       = (Math.random() - 0.5) * 0.25;
      this.alpha    = 0;
      this.maxAlpha = Math.random() * 0.45 + 0.08;
      this.life     = 0;
      this.maxLife  = Math.random() * 280 + 120;
      this.blue     = Math.random() > 0.3;
    }
    update() {
      this.x += this.vx; this.y += this.vy; this.life++;
      const t = this.life / this.maxLife;
      this.alpha = t < 0.15 ? (t / 0.15) * this.maxAlpha
                 : t > 0.8  ? ((1 - t) / 0.2) * this.maxAlpha
                 : this.maxAlpha;
      if (this.life >= this.maxLife) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle   = this.blue ? '#00f0ff' : '#ff7b00';
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur  = 8;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const particles = Array.from({ length: 60 }, () => new Particle());
  (function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  })();

  // ─── Scroll Reveal ───────────────────────────────────────
  const reveals   = document.querySelectorAll('.reveal, .timeline-item, .project-card');
  const skillBars = document.querySelectorAll('.bar-fill');

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('active');
      if (entry.target.classList.contains('skills-grid') || entry.target.closest('.skills-grid')) {
        skillBars.forEach(b => setTimeout(() => { b.style.width = b.dataset.w; }, 200));
      }
      io.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => io.observe(el));

  // Observe skills grid separately for bar animation
  const skillsGrid = document.querySelector('.skills-grid');
  if (skillsGrid) {
    const sio = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        skillBars.forEach(b => setTimeout(() => { b.style.width = b.dataset.w; }, 200));
        sio.disconnect();
      }
    }, { threshold: 0.15 });
    sio.observe(skillsGrid);
  }

  // ─── Robot Social FAB ────────────────────────────────────
  const fab     = document.getElementById('robotFab');
  const panel   = document.getElementById('socialPanel');
  const closeP  = document.getElementById('panelClose');

  fab?.addEventListener('click', e => { e.stopPropagation(); panel.classList.toggle('open'); });
  closeP?.addEventListener('click', e => { e.stopPropagation(); panel.classList.remove('open'); });
  document.addEventListener('click', e => {
    if (!panel.contains(e.target) && e.target !== fab) panel.classList.remove('open');
  });

  // ─── J.A.R.V.I.S. Panel ─────────────────────────────────
  const jarvisBubble = document.getElementById('jarvisBubble');
  const jarvisPanel  = document.getElementById('jarvisPanel');
  const jpClose      = document.getElementById('jpClose');
  const jpOutput     = document.getElementById('jpOutput');
  const jpInput      = document.getElementById('jpInput');
  const jpSend       = document.getElementById('jpSend');
  const jpCmds       = document.querySelectorAll('.jp-cmd');

  let jarvisOpened = false;

  function jarvisMsg(text, isUser = false) {
    const p = document.createElement('p');
    p.classList.add('jp-msg', isUser ? 'user-msg' : 'jarvis-msg');
    p.textContent = isUser ? `> ${text}` : `J: ${text}`;
    jpOutput.appendChild(p);
    jpOutput.scrollTop = jpOutput.scrollHeight;
  }

  function jarvisGreet() {
    if (jarvisOpened) return;
    jarvisOpened = true;
    const msgs = [
      'Good evening. I\'m J.A.R.V.I.S.',
      'Welcome to Anant Kumar Tanti\'s portfolio.',
      'Co-Founder of Infosventra | CSE @ NIT Kolkata.',
      'Type a section name or use the buttons below.'
    ];
    msgs.forEach((m, i) => setTimeout(() => jarvisMsg(m), i * 800));
  }

  const jarvisKB = {
    about:      'Navigating to About section...',
    hero:       'Taking you back to the beginning.',
    experience: 'Loading experience timeline...',
    projects:   'Opening projects directory...',
    skills:     'Pulling up capability matrix...',
    contact:    'Opening communication channels...',
    infosventra:'Infosventra — Co-founded by Anant. Helps businesses go digital with UI, dev, hosting & SSL.',
    who:        'Anant Kumar Tanti — Frontend Dev, AI/ML Enthusiast, B.Tech CSE @ NIT, Co-Founder @ Infosventra.',
    github:     'GitHub: github.com/Anant00785 — check it out!',
    linkedin:   'LinkedIn: linkedin.com/in/anant-kumar-tanti-8a0420316',
  };

  function handleJarvisInput(raw) {
    const q = raw.trim().toLowerCase();
    if (!q) return;
    jarvisMsg(raw, true);
    let replied = false;
    for (const [key, resp] of Object.entries(jarvisKB)) {
      if (q.includes(key)) {
        setTimeout(() => {
          jarvisMsg(resp);
          const secId = ['about','hero','experience','projects','skills','contact'].find(s => q.includes(s));
          if (secId) document.getElementById(secId)?.scrollIntoView({ behavior:'smooth' });
        }, 400);
        replied = true;
        break;
      }
    }
    if (!replied) {
      setTimeout(() => jarvisMsg('I\'m not sure about that. Try: about, projects, skills, experience, contact.'), 400);
    }
  }

  jarvisBubble?.addEventListener('click', e => {
    e.stopPropagation();
    jarvisPanel.classList.toggle('open');
    if (jarvisPanel.classList.contains('open')) jarvisGreet();
  });

  jpClose?.addEventListener('click', e => { e.stopPropagation(); jarvisPanel.classList.remove('open'); });

  document.addEventListener('click', e => {
    if (!jarvisPanel.contains(e.target) && e.target !== jarvisBubble) jarvisPanel.classList.remove('open');
  });

  jpCmds.forEach(btn => {
    btn.addEventListener('click', () => {
      const sec = btn.dataset.section;
      jarvisMsg(jarvisKB[sec] || `Navigating to ${sec}...`);
      document.getElementById(sec)?.scrollIntoView({ behavior:'smooth' });
    });
  });

  jpSend?.addEventListener('click', () => {
    handleJarvisInput(jpInput.value);
    jpInput.value = '';
  });

  jpInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') { handleJarvisInput(jpInput.value); jpInput.value = ''; }
  });

  // Auto-open Jarvis after 3 seconds on first load
  setTimeout(() => {
    if (!jarvisOpened) {
      jarvisPanel.classList.add('open');
      jarvisGreet();
    }
  }, 3000);

  // ─── Contact Form ────────────────────────────────────────
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  form?.addEventListener('submit', e => {
    e.preventDefault();
    const orig = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>TRANSMITTING...</span>';
    submitBtn.disabled  = true;

    setTimeout(() => {
      submitBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> TRANSMITTED!`;
      submitBtn.style.cssText = 'border-color:#0f0;color:#0f0;';
      form.reset();
      setTimeout(() => {
        submitBtn.innerHTML = orig;
        submitBtn.disabled  = false;
        submitBtn.style.cssText = '';
      }, 3000);
    }, 1800);
  });

});
