(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  const stories = [...document.querySelectorAll(".reveal-on-scroll")];
  document.documentElement.classList.add("word-motion");
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("in-view");
      observer.unobserve(entry.target);
    }
  }, { threshold:0.08 });
  stories.forEach(story => observer.observe(story));
})();
