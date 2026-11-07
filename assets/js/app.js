const body = document.body;
window.addEventListener('load', () => body.classList.add('loaded'));

const mobileBtn = document.querySelector('[data-mobile-toggle]');
const mobilePanel = document.querySelector('.mobile-panel');
if (mobileBtn && mobilePanel) {
  mobileBtn.addEventListener('click', () => mobilePanel.classList.toggle('open'));
}

document.querySelectorAll('[data-parallax]').forEach((el) => {
  window.addEventListener('scroll', () => {
    const speed = Number(el.dataset.parallax || 0.12);
    const rect = el.getBoundingClientRect();
    const offset = rect.top * speed;
    el.style.transform = `translateY(${offset}px)`;
  }, { passive: true });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      if (entry.target.classList.contains('reveal-text')) {
        entry.target.querySelectorAll('span').forEach((span, i) => span.style.transitionDelay = `${i * 40}ms`);
      }
    }
  })
}, { threshold: 0.16 });

document.querySelectorAll('.reveal, .reveal-text').forEach((el) => observer.observe(el));

const storyLinks = document.querySelectorAll('.story-link');
const panels = document.querySelectorAll('.story-panel[id]');
if (storyLinks.length && panels.length) {
  const panelObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        storyLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`));
      }
    })
  }, { threshold: 0.45 });
  panels.forEach((panel) => panelObserver.observe(panel));
}

// Split text into spans for reveal-text
const splitTargets = document.querySelectorAll('.reveal-text');
splitTargets.forEach((target) => {
  if (target.dataset.splitDone) return;
  const text = target.textContent.trim();
  target.textContent = '';
  text.split('').forEach((char) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    target.appendChild(span);
  });
  target.dataset.splitDone = 'true';
});
