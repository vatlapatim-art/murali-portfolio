# MuraliOS — planetary intro and solar-system gateway handoff

This package preserves the existing peach/ivory editorial portfolio, project art, scroll animations and interactive apps. The updates focus on the two cinematic sequences and the Earth cloud layers.

## First-load intro

- Keeps the Earth surface, normal and ocean-specular texture path.
- Uses a lower cloud-coverage shell, a separately moving high-cirrus shell and a faint cloud-shadow pass. The bundled local cloud maps are contrast-rich and seamless; the lower shell can also use the pinned Three.js cloud texture when available.
- Holds a natural distant-to-close camera move and shows **“Welcome to Murali’s Portfolio”** during the final zoom / cloud pass.
- Automatically hands off into the existing homepage reveal. The manual Enter Portfolio button is removed. Skip Intro remains available and uses the same final camera close.

## WORK/O gateway

- Clicking O still opens from the letter’s screen position.
- The old single-sigil portal and separate boot card are replaced with one continuous solar-system launch scene.
- The scene contains the sun, eight distinct orbiting planets, orbit paths, Saturn’s rings, an asteroid belt, star field and slow camera dolly.
- A small launch HUD updates from orbital handshake to archive synchronization while the same Three.js scene remains mounted.
- When boot progress completes, the scene clears and the original MuraliOS desktop appears. The desktop apps and terminal are preserved.

## Run and verify

From this directory (where `package.json` is located):

```bash
npm install
npm run build
npm run dev
```

Verify the Earth cloud deck, welcome text and automatic handoff; skip intro; click WORK/O and observe the solar system through boot; confirm the desktop and apps open; test desktop/mobile layouts and reduced-motion behavior.
