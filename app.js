(() => {
  const data = window.portfolio;
  const $ = (selector) => document.querySelector(selector);
  const text = (tag, value, className) => {
    const element = document.createElement(tag);
    element.textContent = value;
    if (className) element.className = className;
    return element;
  };
  const safeURL = (value) => {
    try { const url = new URL(value); return url.protocol === "https:" ? url.href : ""; }
    catch { return ""; }
  };
  $(".brand-icon").setAttribute("aria-label", `${data.name} — home`);
  if (data.icon) {
    const icon = new URL(data.icon, location.href);
    if (icon.origin === location.origin) $("#brand-icon").src = icon.href;
  }
  $("#roblox-title").textContent = data.roblox.name;
  $("#roblox-description").textContent = data.roblox.description;
  const robloxURL = safeURL(data.roblox.url);
  if (robloxURL) { $("#roblox-link").href = robloxURL; $("#roblox-link").hidden = false; }
  $("#footer-name").textContent = data.name;
  $("#footer-affiliation").textContent = data.affiliation || "";
  $("#bio").textContent = data.bio;
  document.title = `${data.name} — Portfolio`;
  $("meta[name=description]").content = `${data.name} — ${data.bio}`;
  $("#github").href = safeURL(data.github) || "https://github.com/aleeframen";
  if (data.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    $("#email").hidden = false;
    $("#email").href = `mailto:${data.email}`;
    $("#footer-email").textContent = data.email;
    $("#footer-email").href = `mailto:${data.email}`;
  } else {
    $("#footer-email").hidden = true;
  }
  $("#year").textContent = new Date().getFullYear();
  data.projects.forEach((project, index) => {
    if (project.hidden) return;
    const row = text("article", "", "project reveal");
    const art = text("div", "", "project-art");
    art.setAttribute("aria-hidden", "true");
    art.append(text("span", String(index + 1).padStart(2, "0"), "project-index"));
    if (project.motif === "trading") {
      art.removeAttribute("aria-hidden");
      art.classList.add("trading-art");
      window.createTradingChart(art);
    } else {
      const motif = text("div", "", `motif ${project.motif === "orbit" ? "orbit" : ""}`);
      motif.append(text("span", ""));
      if (project.motif !== "orbit") motif.append(text("span", ""), text("span", ""));
      art.append(motif);
    }
    const copy = text("div", "", "project-copy");
    const title = text("h3", project.name, project.titleGradient ? "exchanger-title" : "");
    copy.append(text("p", project.category, "category"), title, text("p", project.description));
    const tags = text("div", "", "tags");
    project.tags.forEach(tag => tags.append(text("span", tag, "tag")));
    const detailsURL = safeURL(project.moreDetailsURL);
    if (detailsURL) {
      const details = text("a", "More details", "tag details-link");
      details.href = detailsURL;
      tags.append(details);
    }
    copy.append(tags);
    const url = safeURL(project.url);
    if (url) {
      const link = text("a", project.linkLabel || "Visit project", "text-link");
      link.href = url;
      link.append(text("span", "", "link-line"));
      copy.append(link);
    }
    if (project.status) copy.append(text("span", project.status, "draft"));
    row.append(art, copy);
    $("#projects").append(row);
  });
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let paused = reducedMotion.matches;
  let model;
  let characterState = "loading";
  const revealElements = [...document.querySelectorAll(".reveal")];
  document.documentElement.classList.toggle("motion-on", !paused);
  if (!paused && "IntersectionObserver" in window) {
    revealElements.forEach(element => element.classList.add("pending"));
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.remove("pending"); observer.unobserve(entry.target); }
    }), {threshold: .1});
    revealElements.forEach(element => observer.observe(element));
  }
  function updateMotion() {
    document.documentElement.classList.toggle("motion-paused", paused);
    if (paused) revealElements.forEach(element => element.classList.remove("pending"));
    if (model) paused || document.hidden ? model.pause() : model.play({repetitions: characterState === "wake" ? 1 : Infinity});
  }
  reducedMotion.addEventListener("change", event => { paused = event.matches; updateMotion(); });
  updateMotion();
  const infoToggle = $("#character-info-toggle");
  const infoPopup = $("#character-info-popup");
  function setInfoOpen(open) {
    infoToggle.setAttribute("aria-expanded", String(open));
    infoPopup.hidden = !open;
  }
  infoToggle.addEventListener("click", () => setInfoOpen(infoPopup.hidden));
  document.addEventListener("pointerdown", event => {
    if (!$(".character-info").contains(event.target)) setInfoOpen(false);
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !infoPopup.hidden) {
      setInfoOpen(false);
      infoToggle.focus();
    }
  });

  // A restrained glow follows the cursor in the welcome area.
  const hero = $(".hero");
  const glow = $(".hero-glow");
  const sizeGlow = () => hero.style.setProperty("--glow-width", `${document.documentElement.clientWidth}px`);
  sizeGlow();
  window.addEventListener("resize", sizeGlow);
  const finePointer = matchMedia("(pointer: fine)");
  let glowX = 50, glowY = 40, targetGlowX = 50, targetGlowY = 40;
  let glowFrame = 0;
  function animateGlow() {
    glowX += (targetGlowX - glowX) * .09;
    glowY += (targetGlowY - glowY) * .09;
    hero.style.setProperty("--glow-x", `${glowX}%`);
    hero.style.setProperty("--glow-y", `${glowY}%`);
    if (Math.abs(targetGlowX-glowX) + Math.abs(targetGlowY-glowY) > .05) {
      glowFrame = requestAnimationFrame(animateGlow);
    } else glowFrame = 0;
  }
  document.addEventListener("pointermove", event => {
    if (reducedMotion.matches || !finePointer.matches) return;
    const bounds = glow.getBoundingClientRect();
    if (event.clientY < bounds.top || event.clientY > bounds.bottom) {
      resetGlow();
      return;
    }
    targetGlowX = (event.clientX - bounds.left) / bounds.width * 100;
    targetGlowY = (event.clientY - bounds.top) / bounds.height * 100;
    hero.style.setProperty("--glow-opacity", ".8");
    if (!glowFrame) glowFrame = requestAnimationFrame(animateGlow);
  });
  function resetGlow() {
    targetGlowX = 50; targetGlowY = 40;
    hero.style.setProperty("--glow-opacity", ".45");
    if (!reducedMotion.matches && !glowFrame) glowFrame = requestAnimationFrame(animateGlow);
  }
  document.addEventListener("pointerleave", resetGlow);
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) { cancelAnimationFrame(glowFrame); glowFrame = 0; }
  });

  // A small original block-character preview, rendered without a 3D dependency.
  // This is not an exported Roblox asset. Replace it through content.js when ready.
  const canvas = $("#character");
  const ctx = canvas.getContext("2d");
  let width = 400, height = 390, phase = 0, waveUntil = 3, last = 0;
  let look = 0, targetLook = 0, visible = true;
  const rotateZ = ([x,y,z], angle) => [x*Math.cos(angle)-y*Math.sin(angle), x*Math.sin(angle)+y*Math.cos(angle), z];
  const rotateY = ([x,y,z], angle) => [x*Math.cos(angle)+z*Math.sin(angle), y, -x*Math.sin(angle)+z*Math.cos(angle)];
  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    width = bounds.width; height = bounds.height;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = width * ratio; canvas.height = height * ratio;
    ctx.setTransform(ratio,0,0,ratio,0,0);
  };
  new ResizeObserver(resize).observe(canvas);
  $(".character-stage").addEventListener("pointermove", event => {
    const bounds = canvas.getBoundingClientRect();
    targetLook = ((event.clientX - bounds.left) / bounds.width - .5) * .45;
  });
  $(".character-stage").addEventListener("pointerleave", () => { targetLook = 0; });
  if ("IntersectionObserver" in window) new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }).observe(canvas);
  const faceIndices = [[0,1,2,3],[4,7,6,5],[0,4,5,1],[3,2,6,7],[1,5,6,2],[0,3,7,4]];
  function render() {
    ctx.clearRect(0,0,width,height);
    const scale = Math.min(width / 6.3, height / 6.5);
    const bob = paused ? 0 : Math.sin(phase*2)*.045;
    const yaw = -.32 + look;
    const tilt = -.12;
    const world = point => {
      const [x,y,z] = rotateY(point, yaw);
      return [x, y*Math.cos(tilt)-z*Math.sin(tilt)+bob, y*Math.sin(tilt)+z*Math.cos(tilt)];
    };
    const project = ([x,y,z]) => { const perspective = 9/(9-z); return [width/2+x*scale*perspective,height*.43-y*scale*perspective]; };
    ctx.fillStyle = "#00000040";
    ctx.beginPath();ctx.ellipse(width/2,height*.81,scale*1.12,scale*.16,0,0,Math.PI*2);ctx.fill();
    const faces = [];
    function box(center, size, palette, joint = center, angle = 0) {
      const [sx,sy,sz] = size.map(v=>v/2);
      const points = [[-sx,-sy,-sz],[sx,-sy,-sz],[sx,sy,-sz],[-sx,sy,-sz],[-sx,-sy,sz],[sx,-sy,sz],[sx,sy,sz],[-sx,sy,sz]].map(p => {
        const relative = p.map((v,i)=>v+center[i]-joint[i]);
        const rotated = rotateZ(relative, angle).map((v,i)=>v+joint[i]);
        return world(rotated);
      });
      faceIndices.forEach((indices,i)=>faces.push({points:indices.map(n=>points[n]),color:palette[i%palette.length],depth:indices.reduce((sum,n)=>sum+points[n][2],0)/4}));
    }
    const stone = ["#8b9299","#c9d2dc","#9da7b2","#dce5ed","#b2bdc9","#a2acb8"];
    const blue = ["#57738e","#a9cffa","#769aba","#c2dfff","#94bbdf","#7396b8"];
    const legs = ["#444b54","#687585","#505b6a","#7d8b9d","#65758a","#4d5b70"];
    const waving = !paused && phase < waveUntil;
    const waveAngle = waving ? -2.1 + Math.sin(phase*9)*.25 : -.08;
    box([-.35,-1.05,0],[.6,1.25,.65],legs);
    box([.35,-1.05,0],[.6,1.25,.65],legs);
    box([0,.17,0],[1.3,1.35,.7],blue);
    box([-.98,.05,0],[.55,1.35,.62],stone,[-.98,.62,0],waveAngle);
    box([.98,.05,0],[.55,1.35,.62],stone,[.98,.62,0],paused?0:Math.sin(phase*2)*.035);
    box([0,1.35,0],[.9,.9,.85],stone);
    // Face details are flat polygons on the front of the head.
    for (const x of [-.17,.17]) {
      faces.push({points:[[x-.028,1.37,.43],[x+.028,1.37,.43],[x+.028,1.48,.43],[x-.028,1.48,.43]].map(world),color:"#273126",depth:world([x,1.43,.44])[2]+.01});
    }
    faces.sort((a,b)=>a.depth-b.depth).forEach(face=>{
      const points = face.points.map(project);
      ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=face.color;ctx.fill();ctx.strokeStyle="#10161018";ctx.lineWidth=.6;ctx.stroke();
    });
    const mouth = [-.16,-.08,0,.08,.16].map(x=>project(world([x,1.23+x*x*1.8,.44])));
    ctx.beginPath();mouth.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.strokeStyle="#273126";ctx.lineWidth=2;ctx.lineCap="round";ctx.stroke();
  }
  function frame(now) {
    const dt = Math.min((now-last)/1000,.05); last=now;
    if (visible && !document.hidden && !model) {
      if (!paused) { phase+=dt; look+=(targetLook-look)*Math.min(dt*5,1); }
      render();
    }
    requestAnimationFrame(frame);
  }
  if (ctx) requestAnimationFrame(frame);
  const stage = $(".character-stage");
  function characterFallback(message) {
    model = undefined;
    characterState = "fallback";
    canvas.hidden = false;
    $("#model-host").hidden = true;
    $("#model-status").textContent = message;
    $("#character-label").textContent = "Character preview.";
    stage.classList.remove("model-ready");
    updateMotion();
  }
  async function sleep() {
    characterState = "sleep";
    stage.dataset.characterState = "sleep";
    // Switch first: replaying the finished Wake action snaps it to frame zero.
    // Keep the mixer's clock intact so the outgoing pose survives the crossfade.
    model.animationCrossfadeDuration = 420;
    model.animationName = data.character.sleepAnimation;
    if (!paused) model.play({repetitions: Infinity});
    await model.updateComplete;
    $("#character-label").textContent = "Click me!";
    updateMotion();
  }
  async function wake() {
    if (paused || !model || characterState !== "sleep") return;
    characterState = "wake";
    stage.dataset.characterState = "wake";
    // Cached one-shot actions stay at their completed frame. Reset before the
    // new crossfade is scheduled, never during the Wake-to-Sleep handoff.
    model.currentTime = 0;
    model.animationCrossfadeDuration = 180;
    model.animationName = data.character.wakeAnimation;
    $("#model-status").textContent = "The character wakes up, then returns to sleep.";
    // Wait for the element's animation-name update: it otherwise resets playback
    // to infinite repetitions after play({repetitions: 1}). No asset is fetched here.
    await model.updateComplete;
    model.play({repetitions: 1});
  }
  function clickRipple(event) {
    if (!Number.isFinite(event.clientX) || !Number.isFinite(event.clientY) || event.detail === 0) return;
    const ripple = document.createElement("span");
    ripple.className = "character-click-ripple";
    ripple.setAttribute("aria-hidden", "true");
    ripple.style.left = `${event.clientX}px`;
    ripple.style.top = `${event.clientY}px`;
    document.body.append(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), {once:true});
    setTimeout(() => ripple.remove(), 1000);
  }
  document.addEventListener("visibilitychange", updateMotion);

  // The library loads only when a custom model is configured.
  if (data.character.model) {
    const source = new URL(data.character.model, location.href);
    if (source.origin !== location.origin || !source.pathname.endsWith(".glb")) return;
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js";
    script.addEventListener("error", () => characterFallback("Custom character unavailable. Showing the block-character preview."));
    script.addEventListener("load", async () => {
      await customElements.whenDefined("model-viewer");
      const candidate = document.createElement("model-viewer");
      candidate.src = source.href;
      candidate.alt = "Aleef’s seated, sleeping Roblox character. Click to wake up.";
      candidate.setAttribute("tabindex", "0");
      candidate.setAttribute("role", "button");
      candidate.setAttribute("aria-label", "Wake up the sleeping Roblox character");
      candidate.setAttribute("loading", "eager");
      candidate.setAttribute("reveal", "auto");
      candidate.setAttribute("touch-action", "pan-y");
      candidate.setAttribute("shadow-intensity", ".3");
      candidate.setAttribute("camera-orbit", "225deg 85deg 8.5m");
      candidate.setAttribute("camera-target", "0m 1.65m -0.35m");
      candidate.setAttribute("field-of-view", "30deg");
      candidate.setAttribute("animation-crossfade-duration", "180");
      candidate.animationName = data.character.sleepAnimation;
      candidate.addEventListener("click", event => { clickRipple(event); return wake(); });
      candidate.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); wake(); }
      });
      candidate.addEventListener("finished", () => {
        if (characterState === "wake") sleep();
      });
      candidate.addEventListener("load", () => {
        if (![data.character.sleepAnimation, data.character.wakeAnimation].every(name => candidate.availableAnimations.includes(name))) {
          characterFallback("The model must contain both Sleep and Wake animations. Showing the block-character preview.");
          return;
        }
        model = candidate;
        canvas.hidden = true;
        $("#model-host").hidden = false;
        stage.classList.add("model-ready");
        sleep();
      });
      candidate.addEventListener("error", () => {
        characterFallback("Custom character unavailable. Showing the block-character preview.");
      });
      $("#model-host").append(candidate);
      // Give the model a rendered surface to load while keeping the preview visible.
      $("#model-host").hidden = false;
      $("#model-host").style.position = "absolute";
      $("#model-host").style.inset = "0";
    });
    document.head.append(script);
  }
})();
