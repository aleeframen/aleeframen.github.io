(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  const sections = [...document.querySelectorAll(".detail-reveal")];
  document.documentElement.classList.add("has-motion");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in-view");
      observer.unobserve(entry.target);
    });
  }, { threshold:0.12 });
  sections.forEach(section => observer.observe(section));
})();
