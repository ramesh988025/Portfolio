const STORAGE_KEY = 'ramesh_portfolio_data_v1';

const defaultData = {
  theme: 'dark',
  heroRole: '',
  heroTagline: '',
  aboutText: '',
  socialGithub: '',
  socialLinkedin: '',
  socialOther: '',
  skills: ['', '', ''],
  projects: [
    { name: '', desc: '', stack: '', live: '', github: '', status: 'Not Started' },
    { name: '', desc: '', stack: '', live: '', github: '', status: 'Not Started' },
    { name: '', desc: '', stack: '', live: '', github: '', status: 'Not Started' },
  ],
  timeline: [
    { title: '', subtitle: '', period: '', detail: '' },
    { title: '', subtitle: '', period: '', detail: '' },
  ],
};

const state = loadState();
applyTheme();
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader')?.classList.add('hidden'), 450);
});

renderEditableFields();
renderSkills();
renderProjects();
renderTimeline();
initTyping();
initObservers();
initNav();
initTilt();
initMagnetic();

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

document.getElementById('themeToggle')?.addEventListener('click', () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme();
  saveState();
});

document.getElementById('menuBtn')?.addEventListener('click', () => {
  document.getElementById('nav')?.classList.toggle('open');
});

document.getElementById('addSkillBtn')?.addEventListener('click', () => {
  state.skills.push('');
  saveState();
  renderSkills();
});

document.getElementById('addProjectBtn')?.addEventListener('click', () => {
  if (state.projects.length >= 6) return;
  state.projects.push({ name: '', desc: '', stack: '', live: '', github: '', status: 'Not Started' });
  saveState();
  renderProjects();
});

document.getElementById('addTimelineBtn')?.addEventListener('click', () => {
  state.timeline.push({ title: '', subtitle: '', period: '', detail: '' });
  saveState();
  renderTimeline();
});

document.getElementById('contactForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = document.getElementById('formMsg');
  if (!msg) return;
  msg.textContent = 'Message UI is ready. Connect backend/email service to send.';
  setTimeout(() => (msg.textContent = ''), 3000);
  e.target.reset();
});

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultData);
    return { ...structuredClone(defaultData), ...JSON.parse(raw) };
  } catch {
    return structuredClone(defaultData);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.theme || 'light');
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = state.theme === 'dark' ? '☀️' : '🌙';
}

function renderEditableFields() {
  document.querySelectorAll('.editable[data-key]').forEach((node) => {
    const key = node.dataset.key;
    const value = (state[key] ?? '').toString();

    if (node.tagName === 'A') {
      node.textContent = value || node.dataset.placeholder || 'Link';
      node.setAttribute('href', value && /^https?:\/\//.test(value) ? value : '#');
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noreferrer');
    } else {
      node.textContent = value;
    }

    node.addEventListener('input', () => {
      state[key] = node.textContent.trim();
      if (node.tagName === 'A') {
        const isLink = /^https?:\/\//.test(state[key]);
        node.setAttribute('href', isLink ? state[key] : '#');
      }
      saveState();
    });
  });
}

function renderSkills() {
  const grid = document.getElementById('skillsGrid');
  if (!grid) return;
  grid.innerHTML = state.skills
    .map(
      (skill, i) => `
      <article class="card tilt-card">
        <h3>Skill ${i + 1}</h3>
        <p class="editable" contenteditable="true" data-skill-index="${i}" data-placeholder="e.g., React / Node.js / UI Design">${escapeHTML(skill)}</p>
        <div class="card-actions">
          <button class="btn secondary" data-remove-skill="${i}">Remove</button>
        </div>
      </article>
    `,
    )
    .join('');

  grid.querySelectorAll('[data-skill-index]').forEach((el) => {
    el.addEventListener('input', () => {
      const idx = Number(el.dataset.skillIndex);
      state.skills[idx] = el.textContent.trim();
      saveState();
    });
  });

  grid.querySelectorAll('[data-remove-skill]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.removeSkill);
      state.skills.splice(idx, 1);
      saveState();
      renderSkills();
      initTilt();
      initMagnetic();
    });
  });

  initTilt();
}

function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;
  grid.innerHTML = state.projects
    .map(
      (project, i) => `
      <article class="card tilt-card">
        <h3 class="editable" contenteditable="true" data-project="${i}" data-field="name" data-placeholder="Project Name">${escapeHTML(project.name)}</h3>
        <p class="editable" contenteditable="true" data-project="${i}" data-field="desc" data-placeholder="Project Description">${escapeHTML(project.desc)}</p>
        <p class="editable" contenteditable="true" data-project="${i}" data-field="stack" data-placeholder="Tech Stack">${escapeHTML(project.stack)}</p>
        <div class="link-row">
          <a class="editable" contenteditable="true" data-project="${i}" data-field="live" data-placeholder="Live Demo URL">${escapeHTML(project.live)}</a>
          <a class="editable" contenteditable="true" data-project="${i}" data-field="github" data-placeholder="GitHub URL">${escapeHTML(project.github)}</a>
        </div>
        <div class="status">Status</div>
        <select data-project-status="${i}">
          <option ${project.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
          <option ${project.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
          <option ${project.status === 'Completed' ? 'selected' : ''}>Completed</option>
        </select>
        <div class="card-actions">
          <button class="btn secondary" data-remove-project="${i}">Remove</button>
        </div>
      </article>
    `,
    )
    .join('');

  grid.querySelectorAll('[data-project][data-field]').forEach((el) => {
    el.addEventListener('input', () => {
      const idx = Number(el.dataset.project);
      const field = el.dataset.field;
      state.projects[idx][field] = el.textContent.trim();
      saveState();
    });
  });

  grid.querySelectorAll('[data-project-status]').forEach((el) => {
    el.addEventListener('change', () => {
      const idx = Number(el.dataset.projectStatus);
      state.projects[idx].status = el.value;
      saveState();
    });
  });

  grid.querySelectorAll('[data-remove-project]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.removeProject);
      state.projects.splice(idx, 1);
      saveState();
      renderProjects();
      initTilt();
      initMagnetic();
    });
  });

  initTilt();
}

function renderTimeline() {
  const wrap = document.getElementById('timelineList');
  if (!wrap) return;
  wrap.innerHTML = state.timeline
    .map(
      (item, i) => `
      <article class="timeline-item card tilt-card">
        <h3 class="editable" contenteditable="true" data-time="${i}" data-field="title" data-placeholder="Role or Degree">${escapeHTML(item.title)}</h3>
        <p class="editable" contenteditable="true" data-time="${i}" data-field="subtitle" data-placeholder="Company or Institution">${escapeHTML(item.subtitle)}</p>
        <p class="editable" contenteditable="true" data-time="${i}" data-field="period" data-placeholder="e.g. 2023 - 2025">${escapeHTML(item.period)}</p>
        <p class="editable" contenteditable="true" data-time="${i}" data-field="detail" data-placeholder="Highlights or details">${escapeHTML(item.detail)}</p>
        <button class="btn secondary" data-remove-time="${i}">Remove</button>
      </article>
    `,
    )
    .join('');

  wrap.querySelectorAll('[data-time][data-field]').forEach((el) => {
    el.addEventListener('input', () => {
      const idx = Number(el.dataset.time);
      const field = el.dataset.field;
      state.timeline[idx][field] = el.textContent.trim();
      saveState();
    });
  });

  wrap.querySelectorAll('[data-remove-time]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.removeTime);
      state.timeline.splice(idx, 1);
      saveState();
      renderTimeline();
      initTilt();
      initMagnetic();
    });
  });

  initTilt();
}

function initTyping() {
  const words = ['React', 'Node.js', '3D Interfaces', 'Creative UI', 'Multiverse Ideas'];
  const target = document.getElementById('typingText');
  if (!target) return;

  let wordIndex = 0;
  let letterIndex = 0;
  let deleting = false;

  const tick = () => {
    const current = words[wordIndex];
    if (!deleting) {
      letterIndex++;
      target.textContent = current.slice(0, letterIndex);
      if (letterIndex === current.length) {
        deleting = true;
        return setTimeout(tick, 900);
      }
    } else {
      letterIndex--;
      target.textContent = current.slice(0, letterIndex);
      if (letterIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }
    setTimeout(tick, deleting ? 40 : 85);
  };
  tick();
}

function initObservers() {
  const sections = document.querySelectorAll('.reveal, section[id]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.target.classList.contains('reveal') && entry.isIntersecting) {
          entry.target.classList.add('show');
        }

        if (entry.target.id && entry.isIntersecting) {
          document.querySelectorAll('.nav-link').forEach((link) => {
            const match = link.getAttribute('href') === `#${entry.target.id}`;
            link.classList.toggle('active', match);
          });
        }
      });
    },
    { threshold: 0.3 },
  );

  sections.forEach((sec) => observer.observe(sec));
}

function initNav() {
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => document.getElementById('nav')?.classList.remove('open'));
  });
}

function initTilt() {
  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.onmousemove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotX = -((y / rect.height - 0.5) * 8);
      const rotY = (x / rect.width - 0.5) * 10;
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    };
    card.onmouseleave = () => {
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
    };
  });
}

function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach((el) => {
    el.onmousemove = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * 0.16;
      const y = (e.clientY - (r.top + r.height / 2)) * 0.16;
      el.style.transform = `translate(${x}px, ${y}px)`;
    };
    el.onmouseleave = () => {
      el.style.transform = 'translate(0,0)';
    };
  });
}

function escapeHTML(value) {
  return (value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
