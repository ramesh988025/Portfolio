const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
const year = document.getElementById('year');
const followUp = document.getElementById('followUp');
const optionCards = document.querySelectorAll('.option-card');

if (year) {
  year.textContent = new Date().getFullYear();
}

menuBtn?.addEventListener('click', () => {
  nav?.classList.toggle('open');
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

const answerMap = {
  'new website': 'Great choice. I can craft a full landing page system tailored to your brand and goals.',
  'modern redesign': 'Perfect. I can modernize your interface with cleaner hierarchy and smoother interactions.',
  'performance upgrades': 'Excellent. I can optimize your front-end for speed, accessibility, and UX quality.',
  'custom feature': 'Awesome. Let’s design a custom interactive section that makes your site stand out.',
};

optionCards.forEach((card) => {
  card.addEventListener('click', () => {
    optionCards.forEach((c) => c.classList.remove('active'));
    card.classList.add('active');

    const answer = card.dataset.answer;
    followUp.textContent = answerMap[answer] ?? 'Tell me more about your goal and I will build the right experience.';
  });
});

const revealEls = document.querySelectorAll('.reveal-up');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 },
);

revealEls.forEach((el) => observer.observe(el));

// Organic canvas animation
const canvas = document.getElementById('blobCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const size = 420;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.scale(dpr, dpr);

  let t = 0;

  const drawBlob = (radius, color, speed, amp, phase) => {
    ctx.beginPath();
    for (let i = 0; i <= 360; i += 4) {
      const angle = (i * Math.PI) / 180;
      const wobble = Math.sin(angle * 3 + t * speed + phase) * amp;
      const r = radius + wobble;
      const x = 210 + Math.cos(angle) * r;
      const y = 210 + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    const grad = ctx.createRadialGradient(180, 170, 20, 210, 210, 180);
    grad.addColorStop(0, color[0]);
    grad.addColorStop(1, color[1]);
    ctx.fillStyle = grad;
    ctx.fill();
  };

  const render = () => {
    t += 0.02;
    ctx.clearRect(0, 0, size, size);
    ctx.globalCompositeOperation = 'source-over';
    drawBlob(120, ['rgba(107,142,35,0.85)', 'rgba(107,142,35,0.1)'], 0.9, 10, 0);
    ctx.globalCompositeOperation = 'lighter';
    drawBlob(90, ['rgba(210,180,140,0.8)', 'rgba(160,82,45,0.08)'], 1.2, 14, Math.PI / 3);
    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(render);
  };

  render();
}

const contactForm = document.querySelector('.contact-form');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const button = contactForm.querySelector('button');
  const prevText = button.textContent;
  button.textContent = 'Message Sent ✓';
  button.disabled = true;

  setTimeout(() => {
    contactForm.reset();
    button.textContent = prevText;
    button.disabled = false;
  }, 1400);
});
