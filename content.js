// Edit this file to personalize the portfolio. Draft text is intentional:
// replace it with your real project contributions before publishing.
window.portfolio = {
  name: "Aleef Rahman",
  bio: "I’m a curious person who enjoys creating projects that help streamline workloads and learn more while exploring the many applications of Computer Science. Here, you’ll find projects I’ve completed and am currently working on, along with some of the process and ideas behind them!",
  github: "https://github.com/aleeframen",
  email: "aleefr167@gmail.com",
  affiliation: "UGA Student",
  icon: "./assets/favicon.svg", // Temporary icon: replace with your own SVG/PNG.
  roblox: {
    name: "Roblox Game Development",
    description: "I have programmed, animated, and designed models for a variety of functions within Roblox games from start to finish.",
    url: "" // Optional: your Roblox experience URL.
  },
  projects: [
    {
      name: "Project Exchanger",
      category: "Web Application",
      description: "An agentic dashboard for currently for personal use; a platform for agents working on a wide variety of tasks from trading to researching.",
      tags: [],
      moreDetailsURL: "./project-exchanger.html",
      titleGradient: true,
      url: "https://ops.projectexchanger.tools",
      linkLabel: "ops.projectexchanger.tools",
      motif: "trading"
    },
    {
      name: "Your next project",
      hidden: true, // Set to false when this project is ready to display.
      category: "Add a project",
      description: "Replace this draft with a real project, or remove this entry. Focus on the problem you solved and what you built.",
      tags: ["Draft"],
      url: "",
      status: "Placeholder",
      motif: "orbit"
    }
  ],
  character: {
    model: "./assets/dummy.glb",
    sleepAnimation: "Sleep",
    wakeAnimation: "Wake"
  }
};
