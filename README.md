# MuraliOS — Personal developer portfolio

A React + Vite portfolio for Murali Manohar Vatlapati. The main website keeps its warm ivory, peach, muted-clay and graphite editorial design, with scroll-led storytelling, six project showcases, certificates, and the hidden WORK/O desktop experience.

## Run locally

Requires Node.js 20 or newer. Open this folder (the one containing `package.json`) in VS Code.

```bash
npm install
npm run dev
```

Vite prints the local URL (normally `http://localhost:5173/`).

## Production build

```bash
npm run build
npm run preview
```

## Opening sequence

The first-load intro is an automatic Three.js Earth fly-in. It begins with a distant establishing shot, approaches the planet, then moves into a layered cloud deck. The cloud treatment uses two independently moving shells: a lower cloud-coverage layer, a lighter high-altitude cirrus layer, and a subtle cloud-shadow pass over the surface. As the camera closes in, the words **“Welcome to Murali’s Portfolio”** appear over the final approach. The site then opens automatically; there is no manual “Enter Portfolio” button. A small Skip Intro control remains available.

The high-detail Earth surface, normal and specular maps are requested from the version-pinned Three.js example texture set at runtime. If that host is unavailable, bundled local fallback maps are used. The local cloud maps include a contrast-rich, seamless coverage layer and a sparse high-cirrus layer. Texture credits and source notes are in `public/textures/TEXTURE_SOURCES.md`.

## Interactive experiences

- **WORK/O gateway:** the oversized WORK headline contains an interactive O. A visible, high-contrast hint explains how to open it.
- **MuraliOS desktop:** the O opens through a full-screen, animated solar system with eight orbiting planets, a lit sun, Saturn’s rings, an asteroid belt and star field. The same scene stays mounted while the archive boot progress runs; it then resolves into the desktop. Inside are a Project Explorer, Superpower Vending Machine, Guess My Stack mini-game, Fortune Cookie, Scratch Reveal, Theme Lab and Developer Terminal.
- **Project gallery:** CycloneShield, AEGIS, CampusCompute, Social Network Clustering, SmartStudy and Arthiq.
- **Certificates:** preview and download the submitted certificate PDFs.

## Deployment

The repository includes `amplify.yml` for AWS Amplify Hosting. Connect the GitHub repository in the AWS Amplify console and deploy the branch containing this project. Run `npm run build` locally before deployment.

## Accessibility and performance

Both 3D sequences include a graceful CSS fallback if WebGL cannot initialize, responsive layouts and reduced-motion handling. Their geometries, materials and loaded textures are disposed when the scenes unmount. The main website remains accessible through standard navigation after the automatic reveal.
