// pm-info.js - compact PM info toggle

document.addEventListener('DOMContentLoaded', () => {
  const trigger = document.getElementById('pmInfoTrigger');
  const panel = document.getElementById('pmInfoPanel');
  if (!trigger || !panel) return;

  trigger.addEventListener('click', () => {
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(!isOpen));
    panel.hidden = isOpen;
    panel.classList.toggle('show', !isOpen);
  });
});
