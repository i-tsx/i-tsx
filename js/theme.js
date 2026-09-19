const html = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');

function initTheme() {
  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const appliedTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  html.setAttribute('data-theme', appliedTheme);
  updateThemeLabel(appliedTheme);

  themeToggle?.addEventListener('click', () => {
    const nextTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', nextTheme);
    localStorage.setItem('portfolio-theme', nextTheme);
    updateThemeLabel(nextTheme);
  });
}

function updateThemeLabel(theme) {
  const icon = document.querySelector('.theme-icon');
  if (!icon) return;
  icon.textContent = theme === 'dark' ? '☼' : '☾';
  themeToggle?.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

initTheme();
