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

  // Backend URL — update this to your deployed backend URL in production
  const BACKEND_URL = 'http://localhost:3000';
  const sessionId = Math.random().toString(36).slice(2);

  let jarvisOpened = false;
  let isThinking   = false;

  function jarvisMsg(text, isUser = false) {
    const p = document.createElement('p');
    p.classList.add('jp-msg', isUser ? 'user-msg' : 'jarvis-msg');
    p.textContent = isUser ? `> ${text}` : `J: ${text}`;
    jpOutput.appendChild(p);
    jpOutput.scrollTop = jpOutput.scrollHeight;
    return p;
  }

  function jarvisThinking() {
    const p = document.createElement('p');
    p.classList.add('jp-msg', 'jarvis-msg');
    p.id = 'jarvisThinking';
    p.textContent = 'J: ...';
    p.style.opacity = '0.5';
    jpOutput.appendChild(p);
    jpOutput.scrollTop = jpOutput.scrollHeight;
  }

  function removeThinking() {
    document.getElementById('jarvisThinking')?.remove();
  }

  function jarvisGreet() {
    if (jarvisOpened) return;
    jarvisOpened = true;
    const msgs = [
      'Good day. I\'m J.A.R.V.I.S.',
      'Welcome to Anant Kumar Tanti\'s portfolio.',
      'I\'m powered by Groq AI — ask me anything about Anant, his projects, skills, or experience.',
    ];
    msgs.forEach((m, i) => setTimeout(() => jarvisMsg(m), i * 800));
  }

  function parseNavAndClean(text) {
    const match = text.match(/\[NAVIGATE:(\w+)\]/);
    const sectionId = match ? match[1] : null;
    const cleanText = text.replace(/\[NAVIGATE:\w+\]/g, '').trim();
    return { cleanText, sectionId };
  }

  async function handleJarvisInput(raw) {
    const q = raw.trim();
    if (!q || isThinking) return;

    isThinking = true;
    jpSend.disabled = true;
    jpInput.disabled = true;

    jarvisMsg(q, true);
    jarvisThinking();

    try {
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q, sessionId }),
      });

      const data = await res.json();
      removeThinking();

      if (data.error) {
        jarvisMsg('Systems error. Backend may be offline. Run: cd backend && npm start');
      } else {
        const { cleanText, sectionId } = parseNavAndClean(data.reply);
        jarvisMsg(cleanText);
        if (sectionId) {
          setTimeout(() => {
            document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
          }, 600);
        }
      }
    } catch (err) {
      removeThinking();
      jarvisMsg('Unable to reach AI systems. Make sure the backend is running on port 3000.');
    } finally {
      isThinking = false;
      jpSend.disabled = false;
      jpInput.disabled = false;
      jpInput.focus();
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
      const label = btn.textContent.toLowerCase();
      handleJarvisInput(`Tell me about the ${label} section`);
      document.getElementById(sec)?.scrollIntoView({ behavior: 'smooth' });
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
