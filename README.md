# Aleef Rahman — Portfolio

A static GitHub Pages portfolio using Instrument Sans, pastel blue accents, cursor-responsive header lighting, and an illustrative candlestick chart. The chart uses fictional prices, not live market data. Edit project descriptions and links in content.js before publishing.

## Interactive Roblox character

assets/dummy.glb contains the repaired seated character, face, hat, clothing, skeleton, and two baked clips: Sleep (4.42 seconds, looping) and Wake (3.35 seconds, playing once).

Both clips load together. Clicking the left-facing character starts Wake with a 180 ms crossfade from the current sleeping pose. A pastel blue circle expands from the click position. The animation's finished event switches back to looping Sleep; there is no arbitrary timeout. Repeated clicks during Wake are ignored. Enter or Space also triggers the focused character. Floating zZs fade back in over 1.6 seconds after a short delay; cartoon bubbles appear when waking. A lowered “Click me!” label replaces the separate Wake up button. The background is transparent.

Reduced-motion preference disables playback and effects. The character pauses when the tab is hidden; the library also skips offscreen animation updates. The old drawn character remains as a fallback if the model/library cannot load.

The browser loads Google's open-source model-viewer 4.0.0 from its official hosted CDN. There is no branding badge or deployment attribution. Instrument Sans loads from Google Fonts. These services require internet access; the character asset is included locally.

The editable Blender file is ../portfolio-rig-seated.blend; do not upload it to the website. The GLB contains its textures. For future animation replacements, retain names Sleep and Wake and export selected PortfolioRig and Portfolio_ meshes as GLB, with animations enabled and NLA Tracks mode. Exclude preserved original rigs and experimental actions.

## Preview locally

Open a terminal in this folder and run an HTTP server, not a file URL:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Visit http://127.0.0.1:8000/#work. Stop with Ctrl+C. No build step is needed. Check the face, hat, looping Sleep, click-to-Wake, return to Sleep, and mobile layout before publishing.

The GLB contains exactly Sleep and Wake with 24 channels each. JavaScript syntax and character-state logic pass their checks. The in-app browser preview was verified after starting the preview server from your own PowerShell: click-to-Wake, blue circle coordinates, return to Sleep, lowered label, removed button, and the zZ opacity transition.

## Your GitHub address

With your supplied account aleeframen, the free user-site address is https://aleeframen.github.io/ and repository name is aleeframen.github.io.

https://aleef.github.io/ requires control of the GitHub user or organization named aleef and repository aleef.github.io. Naming a repository that under aleeframen will not grant the aleef address. If you control aleef, replace both occurrences of aleeframen in the remote below with aleef.

Reference: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## First commit and push — you run these

Create an empty public repository named aleeframen.github.io on GitHub first. Do not initialize it with a README, license, or gitignore for this workflow. If a repository already exists, clone it and review its files instead of using these new-repository instructions.

This portfolio folder is not currently a Git repository. In PowerShell:

```powershell
cd "C:\Users\aleef\Documents\Codex\2026-10-01\if-x20\outputs\portfolio"
git init -b main
git add index.html styles.css content.js app.js trading.js assets .nojekyll README.md
git diff --cached --stat
git commit -m "Add portfolio with interactive sleeping character"
git remote add origin https://github.com/aleeframen/aleeframen.github.io.git
git push -u origin main
```

If Git asks for identity, set git config user.name "Aleef Rahman" and git config user.email "YOUR_GITHUB_COMMIT_EMAIL", substituting your verified GitHub email or GitHub-provided noreply email. Retry the commit. No co-author line is necessary.

Then open Settings → Pages → Deploy from a branch, select main and /(root), and save. No commits, pushes, or GitHub settings changes have been made on your behalf.

For later changes:

```powershell
git status
git add index.html styles.css content.js app.js trading.js assets README.md
git diff --cached --stat
git commit -m "Update portfolio"
git push
```

Animation reference: https://modelviewer.dev/examples/animation/
