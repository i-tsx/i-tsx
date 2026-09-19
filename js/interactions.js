function initProjectInteractions() {
  const projectFeatures = document.querySelectorAll('.project-feature, .project-mini');
  projectFeatures.forEach((project) => {
    project.addEventListener('pointermove', (event) => {
      const rect = project.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      project.style.setProperty('--mouse-x', `${x}%`);
      project.style.setProperty('--mouse-y', `${y}%`);
    });
  });
}

function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const messageInput = form.querySelector('textarea[name="message"]');

    const fields = [nameInput, emailInput, messageInput];
    let valid = true;

    fields.forEach((field) => {
      const value = field.value.trim();
      field.style.borderColor = value ? 'var(--border)' : 'rgba(248, 113, 113, 0.7)';
      if (!value) valid = false;
    });

    if (!emailInput.value.includes('@') || !emailInput.value.includes('.')) {
      emailInput.style.borderColor = 'rgba(248, 113, 113, 0.7)';
      valid = false;
    }

    if (!valid) {
      form.reportValidity?.();
      return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nProject details:\n${message}`);
    const mailtoLink = `mailto:abdullah.elchebli@gmail.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;
    form.reset();
    fields.forEach((field) => {
      field.style.borderColor = 'var(--border)';
    });
  });
}

function initCopyEmail() {
  const links = document.querySelectorAll('a[href^="mailto:"]');
  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      navigator.clipboard?.writeText(link.getAttribute('href').replace('mailto:', '')).catch(() => null);
      window.location.href = link.getAttribute('href');
    });
  });
}

function initYear() {
  const yearNode = document.getElementById('current-year');
  if (yearNode) yearNode.textContent = new Date().getFullYear();
}

initProjectInteractions();
initContactForm();
initCopyEmail();
initYear();
