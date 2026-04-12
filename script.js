const yearNode = document.getElementById("year");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const revealItems = document.querySelectorAll(".reveal");
const profileName = document.getElementById("profile-name");
const profileBio = document.getElementById("profile-bio");
const statYears = document.getElementById("stat-years");
const statRepos = document.getElementById("stat-repos");
const statFollowers = document.getElementById("stat-followers");
const githubLink = document.getElementById("github-link");
const projectCards = Array.from(document.querySelectorAll("[data-project-card]"));

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("open");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 70, 350)}ms`;
  observer.observe(item);
});

const form = document.querySelector(".contact-form");

const GITHUB_USER = "i-tsx";
const preferredRepos = ["simplifield-sql", "stavo-e-commerce", "SystemBot"];

const formatYearsSince = (isoDate) => {
  const created = new Date(isoDate);
  const now = new Date();
  const years = Math.max(1, now.getFullYear() - created.getFullYear());
  return `${years}+`;
};

const pickRepositories = (repositories) => {
  const preferred = preferredRepos
    .map((name) => repositories.find((repo) => repo.name.toLowerCase() === name.toLowerCase()))
    .filter(Boolean);

  if (preferred.length >= 3) {
    return preferred.slice(0, 3);
  }

  const fallback = repositories
    .filter((repo) => !repo.fork)
    .sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }
      return new Date(b.pushed_at) - new Date(a.pushed_at);
    });

  return [...preferred, ...fallback].slice(0, 3);
};

const hydrateProjectCards = (repositories) => {
  const selectedRepos = pickRepositories(repositories);

  projectCards.forEach((card, index) => {
    const repo = selectedRepos[index];
    if (!repo) {
      return;
    }

    const languageNode = card.querySelector("[data-project-language]");
    const nameNode = card.querySelector("[data-project-name]");
    const descriptionNode = card.querySelector("[data-project-description]");
    const metaNode = card.querySelector("[data-project-meta]");
    // const linkNode = card.querySelector("[data-project-link]");

    if (languageNode) {
      languageNode.textContent = repo.language || "Repository";
    }

    if (nameNode) {
      nameNode.textContent = repo.name;
    }

    if (descriptionNode) {
      descriptionNode.textContent = repo.description || "Public project available on GitHub.";
    }

    if (metaNode) {
      const stars = `stars:${repo.stargazers_count}`;
      const visibility = repo.visibility || "public";
      metaNode.innerHTML = `<span>${stars}</span><span>${visibility}</span><span>${repo.default_branch}</span>`;
    }

    // if (linkNode) {
    //   linkNode.href = repo.html_url;
    //   linkNode.textContent = "Open Repository";
    // }
  });
};

const hydrateProfile = async () => {
  try {
    const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USER}`),
      fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`),
    ]);

    if (!userResponse.ok || !reposResponse.ok) {
      return;
    }

    const user = await userResponse.json();
    const repos = await reposResponse.json();

    if (profileName && user.name) {
      profileName.textContent = user.name;
    }

    if (profileBio && user.bio) {
      profileBio.textContent = user.bio;
    }

    if (statYears && user.created_at) {
      statYears.textContent = formatYearsSince(user.created_at);
    }

    if (statRepos && Number.isInteger(user.public_repos)) {
      statRepos.textContent = String(user.public_repos);
    }

    if (statFollowers && Number.isInteger(user.followers)) {
      statFollowers.textContent = String(user.followers);
    }

    if (githubLink && user.html_url) {
      githubLink.href = user.html_url;
    }

    if (Array.isArray(repos)) {
      hydrateProjectCards(repos);
    }
  } catch (error) {
    // Keep static fallback content if GitHub API is unavailable.
  }
};

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const submitButton = form.querySelector("button[type='submit']");
    const endpoint = (form.dataset.formEndpoint || form.getAttribute("action") || "").trim();
    const existing = form.querySelector("[role='status']");

    if (existing) {
      existing.remove();
    }

    const notice = document.createElement("p");
    notice.setAttribute("role", "status");
    notice.style.fontWeight = "700";
    notice.style.margin = "0";

    if (!endpoint || endpoint.includes("your-form-id")) {
      notice.textContent = "Configure your real form endpoint in index.html to enable email delivery.";
      notice.style.color = "#ff9b52";
      form.appendChild(notice);
      return;
    }

    if (submitButton) {
      submitButton.textContent = "Sending...";
      submitButton.setAttribute("disabled", "true");
    }

    const payload = new FormData(form);

    fetch(endpoint, {
      method: "POST",
      body: payload,
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Submission failed");
        }

        notice.textContent = "Message sent successfully. I will get back to you soon.";
        notice.style.color = "#58d3ff";
        form.appendChild(notice);
        form.reset();
      })
      .catch(() => {
        notice.textContent = "Could not send the message. Please try again in a moment.";
        notice.style.color = "#ff9b52";
        form.appendChild(notice);
      })
      .finally(() => {
        if (submitButton) {
          submitButton.textContent = "Send Message";
          submitButton.removeAttribute("disabled");
        }
      });
  });
}

hydrateProfile();
