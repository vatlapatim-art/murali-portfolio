# AWS Student Builder Challenge — Submission Notes

## Project

**Title:** MuraliOS — An Interactive Developer Portfolio  
**Builder:** Murali Manohar Vatlapati  
**GitHub:** https://github.com/vatlapatim-art/murali-portfolio  
**Live URL:** Add the AWS Amplify URL after deployment.

## Project summary

MuraliOS is a personal developer portfolio built with React and Vite. It presents my background, skills, six projects, achievements, certificates and contact details through a responsive editorial interface with scroll-led storytelling and custom project artwork. The site uses a warm ivory, peach, muted-clay, mist-blue and graphite palette.

The first-load experience is an automatic Three.js Earth fly-in. A mapped globe with surface, normal and specular textures rotates as the camera approaches a layered cloud deck: a lower coverage layer, independently moving high cirrus and a faint cloud-shadow pass. During the final zoom, “Welcome to Murali’s Portfolio” appears, then a warm-white handoff reveals the homepage automatically. There is no manual Enter Portfolio button; Skip Intro remains available. Reduced-motion preferences are respected.

## Core portfolio sections

- **About** — my background as a Computer Science & Engineering student at PES University and the interests that shape my work.
- **Skills** — languages, frontend, backend, data/systems, and tools/cloud.
- **Projects** — CycloneShield, AEGIS, CampusCompute, Social Network Clustering, SmartStudy and Arthiq.
- **Achievements** — CodeFury 9.0 consolation prize and DataForge 2026 participation.
- **Certificates** — certificate previews and downloadable originals.

## Creative feature 1: 3D planetary opening and homepage reveal

A fresh page load starts a Three.js Earth sequence with a distant establishing shot, a measured camera approach and a final close pass through a layered cloud deck. The globe uses surface, normal and ocean-specular maps. Separate cloud shells create a lower cloud deck and a lighter high-cirrus layer, with a subtle surface-shadow pass. “Welcome to Murali’s Portfolio” appears while the camera closes in, and the homepage is revealed automatically. There is no Enter Portfolio button. A Skip Intro control remains available and uses the same closing movement.

The higher-detail Earth maps are requested from a version-pinned Three.js example asset directory at runtime; bundled local maps are fallbacks. The cloud coverage and high-cirrus fallback maps are locally generated visual masks, not live weather or satellite data. Texture details are documented in `public/textures/TEXTURE_SOURCES.md`.

## Creative feature 2: WORK/O → solar system → MuraliOS — The Inner Archive

The oversized **WORK** word on the homepage contains a clickable **O**. A visible, higher-contrast hint tells visitors to hover/focus and click the O, or tap it on mobile. The O expands into a continuous Three.js solar-system launch sequence: the sun, eight distinct planets, orbit paths, Saturn’s rings, an asteroid belt and a star field. While the solar system moves, a compact launch HUD establishes the connection and loads the archive. The same scene stays mounted across the loading stages; when boot progress completes, it gives way to the MuraliOS desktop. Visitors can explore it without losing access to standard portfolio navigation.

Inside MuraliOS, visitors can open:

- Project Explorer
- Superpower Vending Machine
- Guess My Stack mini-game
- Fortune Cookie
- Scratch Reveal
- Theme Lab
- Developer Terminal

The terminal is available inside the desktop and with `Ctrl + K`. The desktop apps use React state, SVG, CSS and Framer Motion. Both Three.js scenes are rendered client-side and do not require a backend or external API credentials.

## Design and inspiration

The main website uses an original warm editorial design direction: ivory, peach, muted clay, mist blue and graphite. It combines oversized typography, scroll-led storytelling, custom visual artwork and interactive details. The opening scene and interactive archive are original portfolio experiences built with Three.js, React and CSS.

## Technology stack

- React 18 + Vite
- Three.js for the real-time 3D opening
- Framer Motion for scroll reveals and page transitions
- Lucide React for interface icons
- SVG, CSS and Canvas for visual artwork and interactions
- AWS Amplify Hosting for static deployment (after deployment is completed)

## AWS implementation

**Planned AWS service:** AWS Amplify Hosting. After deployment succeeds, add the actual public app URL, screenshots of the Amplify app configuration and successful deployment, and the exact build settings. Do not claim any AWS services that were not actually used.

**Deployment flow:** GitHub repository → Amplify build (`npm install`, `npm run build`) → Vite `dist/` static assets → public Amplify URL.

## What I learned

Complete after deployment. Topics to cover based on the work actually completed: building React components, orchestrating staged animation timelines, creating and disposing a Three.js scene, coordinating automatic/manual intro-to-homepage transitions, using texture maps and camera animation, drawing SVG artwork, creating scroll-led responsive experiences, respecting reduced-motion settings, and deploying a static Vite app using AWS Amplify.

## Challenges encountered

Document the real issues and fixes: the initial missing React import runtime error, npm commands run one folder above `package.json`, and any actual deployment/build problems. Add the actual solutions and what changed.

## Screenshot checklist

- [ ] Earth establishing shot in Three.js intro
- [ ] Planet close-up with visible surface/cloud texture
- [ ] Low-orbit approach with visible lower and high cloud layers
- [ ] Welcome-to-portfolio message during the final camera zoom and automatic handoff
- [ ] Main homepage after its reveal animation
- [ ] About, toolkit and readable stats bar
- [ ] Project gallery with integrated CycloneShield feature card
- [ ] Social Network Clustering project detail / architecture
- [ ] WORK/O hover state and visible hint
- [ ] MuraliOS solar-system launch (sun, planets, orbits, Saturn rings and asteroid belt)
- [ ] MuraliOS archive loading HUD and desktop handoff
- [ ] MuraliOS desktop with one interactive app
- [ ] Developer Terminal with `help` output
- [ ] Certificates section with downloadable originals
- [ ] Mobile intro and mobile homepage/navigation
- [ ] AWS Amplify app overview
- [ ] Successful Amplify deployment and live URL

## Final verification

- [ ] `npm install` succeeds from the folder containing `package.json`.
- [ ] `npm run build` completes successfully.
- [ ] Public GitHub repository contains the final source.
- [ ] Public AWS Amplify URL loads on desktop and mobile.
- [ ] Automatic intro completion performs the camera approach, shows the welcome message and reveals the homepage.
- [ ] Skip Intro continues smoothly from the current camera position.
- [ ] Reduced-motion behavior works.
- [ ] Earth surface textures load and bundled fallbacks work when remote texture access is blocked.
- [ ] Both cloud layers render distinctly and move independently.
- [ ] The WORK/O solar system stays mounted through the archive loading sequence.
- [ ] All in-page navigation and external links work.
- [ ] Both certificate PDFs open.
- [ ] WORK/O opens the desktop on desktop and mobile.
- [ ] The creative apps and terminal work.
- [ ] The live site remains accessible through the judging window.
