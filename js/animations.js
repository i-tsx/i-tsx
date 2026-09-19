function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!revealObserverSupported()) {
    reveals.forEach((element) => element.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  reveals.forEach((element) => observer.observe(element));
}

function revealObserverSupported() {
  return 'IntersectionObserver' in window;
}

initScrollReveal();
