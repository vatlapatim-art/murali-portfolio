import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Award, Cookie, FolderOpen, Gamepad2, Gift, Github, Mail, Monitor,
  Palette, Sparkles, Terminal, UserRound, WandSparkles, X, Zap,
} from 'lucide-react';
import { profile, projects } from '../data/siteData';
import SolarSystemLaunchScene from './SolarSystemLaunchScene';

const desktopApps = [
  { id: 'about', label: 'About Me', icon: UserRound, tint: 'cyan' },
  { id: 'projects', label: 'Project Explorer', icon: FolderOpen, tint: 'blue' },
  { id: 'powers', label: 'Superpower Machine', icon: WandSparkles, tint: 'lime' },
  { id: 'quiz', label: 'Guess My Stack', icon: Gamepad2, tint: 'pink' },
  { id: 'fortune', label: 'Fortune Cookie', icon: Cookie, tint: 'amber' },
  { id: 'scratch', label: 'Scratch Reveal', icon: Gift, tint: 'purple' },
  { id: 'themes', label: 'Theme Lab', icon: Palette, tint: 'orange' },
  { id: 'terminal', label: 'Terminal', icon: Terminal, tint: 'green' },
];

const superpowers = [
  {
    title: 'The Systems Thinker',
    stat: 'SCHEDULING · RESOURCE SAFETY',
    detail: 'I enjoy understanding what happens behind the interface. CampusCompute turns OS ideas like job queues, FCFS, SJF, priority scheduling, and Banker’s algorithm into something you can experiment with.',
  },
  {
    title: 'The Geospatial Explorer',
    stat: 'MAPS · EARTH OBSERVATION',
    detail: 'CycloneShield brings satellite observations, weather data, terrain, cyclone tracks, and infrastructure exposure together to explore disaster impact from more than one angle.',
  },
  {
    title: 'The Graph Detective',
    stat: 'LINEAR ALGEBRA · NETWORKS',
    detail: 'I like finding structure hidden in data. Social Network Clustering explores adjacency and Laplacian matrices, eigenvectors, and spectral clustering to reveal communities.',
  },
  {
    title: 'The Product Builder',
    stat: 'FRONTEND · BACKEND · AI',
    detail: 'From SmartStudy and Arthiq to AEGIS, I enjoy connecting interfaces, data, APIs, and useful workflows into products that solve a real problem.',
  },
  {
    title: 'The Scenic-Route Strategist',
    stat: 'CURIOSITY · TWO WHEELS',
    detail: 'When I am away from code, I like motorcycle rides, scenic roads, and turning travel moments into short videos. Exploration is a good way to reset and find new ideas.',
  },
];

const quizQuestions = [
  {
    question: 'Which project uses spectral graph theory to explore hidden communities?',
    options: ['CycloneShield', 'Social Network Clustering', 'Arthiq'],
    answer: 1,
    explanation: 'Correct. It uses graph matrices, eigenvalues, the Fiedler vector, and spectral clustering, with an interactive 3D visualization.',
  },
  {
    question: 'Which technology helps CycloneShield process Earth-observation data?',
    options: ['Google Earth Engine', 'Unity', 'Redis Streams'],
    answer: 0,
    explanation: 'That’s right. CycloneShield uses Google Earth Engine with sources such as Sentinel-1, CHIRPS, and NASADEM.',
  },
  {
    question: 'Which project is an adaptive study workspace with an AI Study Coach?',
    options: ['AEGIS', 'CampusCompute', 'SmartStudy'],
    answer: 2,
    explanation: 'Exactly. SmartStudy connects planning, focus sessions, active recall, learning analytics, and Gemini-powered study assistance.',
  },
];

const fortunes = [
  'Stay curious. Build things that matter. Take the scenic route.',
  'A difficult problem is just a new route waiting to be explored.',
  'Ship the prototype. Learn from the rough edges. Make it better.',
  'The best ideas often arrive when you step away from the screen.',
];

const themeOptions = [
  { id: 'default', label: 'Peach & Copper', description: 'Warm paper, clay, muted blue and soft editorial light.' },
  { id: 'neon', label: 'Mist & Clay', description: 'Cool mist surfaces with a restrained clay accent.' },
  { id: 'pastel', label: 'Rosewood', description: 'Soft rose, warm ivory and a deeper terracotta accent.' },
];

function AppContent({ app, onThemeChange, currentTheme, onOpenTerminal }) {
  const [power, setPower] = useState(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [cookie, setCookie] = useState(null);
  const [scratchRevealed, setScratchRevealed] = useState(false);

  useEffect(() => {
    setPower(null);
    setQuizIndex(0);
    setQuizAnswer(null);
    setCookie(null);
    setScratchRevealed(false);
  }, [app]);

  if (app === 'about') {
    return (
      <div className="os-content os-about-content">
        <span className="os-kicker">A QUICK INTRODUCTION</span>
        <h3>Hi, I'm Murali.</h3>
        <p>{profile.intro}</p>
        <div className="os-fact-card"><Sparkles size={17} /><div><b>Outside the editor</b><span>{profile.funFact}</span></div></div>
        <div className="os-inline-links">
          <a href={profile.github} target="_blank" rel="noreferrer"><Github size={15} /> GitHub</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer"><UserRound size={15} /> LinkedIn</a>
          <a href={`mailto:${profile.email}`}><Mail size={15} /> Email</a>
        </div>
      </div>
    );
  }

  if (app === 'projects') {
    return (
      <div className="os-content">
        <span className="os-kicker">/home/murali/projects</span>
        <h3>Things I've built.</h3>
        <div className="os-project-list">
          {projects.map((project) => (
            <div className="os-project-row" key={project.name}>
              <div><b>{project.name}</b><span>{project.category}</span></div>
              {project.github && <a href={project.github} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} on GitHub`}><Github size={15} /></a>}
            </div>
          ))}
        </div>
        <a className="os-text-link" href="#projects">Browse project cards on the page ↗</a>
      </div>
    );
  }

  if (app === 'powers') {
    return (
      <div className="os-content">
        <span className="os-kicker">SUPERPOWER VENDING MACHINE</span>
        <h3>One skill. One story.</h3>
        <p>Tap the button and the machine will dispense a small piece of what makes me tick.</p>
        <button className="os-action-button" onClick={() => setPower(superpowers[Math.floor(Math.random() * superpowers.length)])}><Zap size={16} /> Dispense a superpower</button>
        {power && <motion.div className="os-reveal-card" key={power.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><span>{power.stat}</span><h4>{power.title}</h4><p>{power.detail}</p></motion.div>}
      </div>
    );
  }

  if (app === 'quiz') {
    const question = quizQuestions[quizIndex];
    return (
      <div className="os-content">
        <span className="os-kicker">MINI GAME · {quizIndex + 1} / {quizQuestions.length}</span>
        <h3>Guess my tech.</h3>
        <p>{question.question}</p>
        <div className="os-quiz-options">
          {question.options.map((option, index) => <button type="button" key={option} className={quizAnswer === index ? (index === question.answer ? 'correct' : 'incorrect') : ''} disabled={quizAnswer !== null} onClick={() => setQuizAnswer(index)}>{option}</button>)}
        </div>
        {quizAnswer !== null && <div className={`os-quiz-feedback ${quizAnswer === question.answer ? 'is-correct' : 'is-wrong'}`}><b>{quizAnswer === question.answer ? 'Nailed it!' : 'Not quite — now you know.'}</b><span>{question.explanation}</span><button onClick={() => { setQuizIndex((quizIndex + 1) % quizQuestions.length); setQuizAnswer(null); }}>{quizIndex === quizQuestions.length - 1 ? 'Play again' : 'Next question'} →</button></div>}
      </div>
    );
  }

  if (app === 'fortune') {
    return (
      <div className="os-content os-fortune-content">
        <span className="os-kicker">A LITTLE RANDOM WISDOM</span>
        <h3>Fortune cookie.</h3>
        <p>Crack it open. This one is for curious builders.</p>
        <button className={`fortune-cookie ${cookie ? 'is-open' : ''}`} onClick={() => setCookie(fortunes[Math.floor(Math.random() * fortunes.length)])} aria-label="Crack open a fortune cookie">🥠</button>
        {cookie && <motion.div className="os-fortune-reveal" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }}>{cookie}</motion.div>}
      </div>
    );
  }

  if (app === 'scratch') {
    return (
      <div className="os-content">
        <span className="os-kicker">HIDDEN PROJECT / PERSONAL DETAIL</span>
        <h3>Scratch to reveal.</h3>
        <p>There's something behind this card. Tap the button to uncover it.</p>
        <div className={`os-scratch-card ${scratchRevealed ? 'revealed' : ''}`}>
          {!scratchRevealed ? <><span>✳</span><b>TOP SECRET</b><small>Murali's hidden detail</small></> : <><span>🏍️</span><b>The scenic route matters.</b><small>I love motorcycle rides, discovering new places, and turning trips into travel videos.</small></>}
        </div>
        <button className="os-action-button" onClick={() => setScratchRevealed(true)}><Sparkles size={16} /> {scratchRevealed ? 'Secret revealed' : 'Scratch to reveal'}</button>
        {scratchRevealed && <p className="os-small-note">You found the human behind the code.</p>}
      </div>
    );
  }

  if (app === 'themes') {
    return (
      <div className="os-content">
        <span className="os-kicker">PERSONALIZE THE EXPERIENCE</span>
        <h3>Theme lab.</h3>
        <p>Switch the look of the whole portfolio. Your choice stays active as you explore.</p>
        <div className="os-theme-options">
          {themeOptions.map((theme) => <button type="button" key={theme.id} className={`os-theme-choice theme-choice-${theme.id} ${currentTheme === theme.id ? 'selected' : ''}`} onClick={() => onThemeChange(theme.id)}><span className="os-theme-swatch" /><b>{theme.label}</b><small>{theme.description}</small>{currentTheme === theme.id && <i>ACTIVE</i>}</button>)}
        </div>
      </div>
    );
  }

  return (
    <div className="os-content os-welcome-content">
      <span className="os-kicker">THE INNER ARCHIVE / ACCESS GRANTED</span>
      <h3>A little world beyond the portfolio.</h3>
      <p>Choose an artifact to explore a project, reveal a strength, or play a tiny challenge. The main portfolio remains one click away.</p>
      <div className="os-welcome-stats"><div><b>06</b><span>PROJECTS</span></div><div><b>05</b><span>SKILL AREAS</span></div><div><b>02</b><span>CREDENTIALS</span></div></div>
      <div className="os-welcome-hint"><Sparkles size={15} /> Tip: drag this window by its title bar on desktop.</div>
      <button className="os-action-button" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}><FolderOpen size={16} /> Explore the real portfolio</button>
    </div>
  );
}

export default function MuraliOSDesktop({ isOpen, launchOrigin, onClose, onOpenTerminal, currentTheme, onThemeChange }) {
  const [activeApp, setActiveApp] = useState('welcome');
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [stage, setStage] = useState('idle');
  const [bootProgress, setBootProgress] = useState(0);
  const drag = useRef(null);

  useEffect(() => {
    if (!isOpen) { setStage('idle'); return undefined; }
    setActiveApp('welcome');
    setOffset({ x: 0, y: 0 });
    setBootProgress(0);
    setStage('portal');
    document.body.style.overflow = 'hidden';
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const portalTimer = window.setTimeout(() => setStage('boot'), reduced ? 80 : 1450);
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(portalTimer);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
      setStage('idle');
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || stage !== 'boot') return undefined;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const start = performance.now();
    const duration = reduced ? 260 : 2550;
    let frame = 0;
    let finishTimer = 0;

    const tick = (now) => {
      const ratio = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - ratio, 2.2);
      setBootProgress(Math.round(eased * 100));
      if (ratio < 1) frame = window.requestAnimationFrame(tick);
      else finishTimer = window.setTimeout(() => setStage('desktop'), reduced ? 0 : 420);
    };

    frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(finishTimer);
    };
  }, [isOpen, stage]);

  const openApp = (id) => {
    if (id === 'terminal') {
      onClose();
      onOpenTerminal();
      return;
    }
    setActiveApp(id);
    setOffset({ x: 0, y: 0 });
  };

  const startDrag = (event) => {
    if (window.matchMedia('(max-width: 760px)').matches || event.button !== 0 || event.target.closest('button')) return;
    drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, offset };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event) => {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    setOffset({
      x: Math.max(-180, Math.min(180, drag.current.offset.x + dx)),
      y: Math.max(-110, Math.min(110, drag.current.offset.y + dy)),
    });
  };

  const stopDrag = () => { drag.current = null; };
  const originX = launchOrigin?.x ?? (typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const originY = launchOrigin?.y ?? (typeof window !== 'undefined' ? window.innerHeight / 2 : 0);
  const visibleStage = stage === 'idle' ? 'portal' : stage;
  const bootSteps = [
    { at: 18, title: 'Establishing the archive handshake', detail: 'Signal received from the WORK gateway' },
    { at: 44, title: 'Mounting project volumes', detail: 'CycloneShield · AEGIS · CampusCompute · more' },
    { at: 70, title: 'Indexing hidden applications', detail: 'Mini-games · personal artifacts · explorer tools' },
    { at: 96, title: 'Restoring the desktop environment', detail: 'Workspace ready for discovery' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="os-backdrop os-launch-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => event.target === event.currentTarget && visibleStage === 'desktop' && onClose()}
        >
          <AnimatePresence mode="wait">
            {visibleStage !== 'desktop' && (
              <motion.div
                key="solar-launch"
                className="os-solar-launch"
                initial={{ clipPath: `circle(0px at ${originX}px ${originY}px)`, opacity: .82 }}
                animate={{ clipPath: `circle(160vmax at ${originX}px ${originY}px)`, opacity: 1 }}
                exit={{ opacity: 0, scale: 1.035, filter: 'blur(9px)' }}
                transition={{ duration: .92, ease: [0.76, 0, 0.24, 1] }}
              >
                <SolarSystemLaunchScene />
                <div className="os-solar-vignette" aria-hidden="true" />
                <div className="os-solar-grain" aria-hidden="true" />
                <header className="os-solar-header">
                  <div className="os-solar-brand"><span>M.</span><div><b>MURALI.OS</b><small>INNER ARCHIVE · BENGALURU NODE</small></div></div>
                  <div className="os-solar-count"><i /> 8 WORLDS <span>·</span> 6 PROJECTS <span>·</span> ONE ARCHIVE</div>
                  <button type="button" className="os-sequence-skip" onClick={() => setStage('desktop')}>SKIP SEQUENCE ↗</button>
                </header>

                <motion.section
                  className="os-solar-copy"
                  key={visibleStage}
                  initial={{ opacity: 0, y: 18, filter: 'blur(7px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: .7, ease: [0.16, 1, .3, 1] }}
                  aria-live="polite"
                >
                  <span className="os-solar-kicker"><i /> {visibleStage === 'portal' ? 'SYSTEM 01 / ORBITAL HANDSHAKE' : 'SYSTEM 02 / ARCHIVE SYNCHRONIZATION'}</span>
                  <h2>{visibleStage === 'portal' ? <>Mapping a<br /><em>universe of ideas.</em></> : <>Bringing the<br /><em>archive online.</em></>}</h2>
                  <p>{visibleStage === 'portal'
                    ? 'A small universe of projects, experiments, systems and stories is coming into view.'
                    : 'Aligning the worlds, mounting project volumes and preparing your interactive workspace.'}</p>
                  <div className="os-solar-coordinates"><span>ORIGIN / BENGALURU, INDIA</span><span>EXPLORER SESSION / 01</span></div>
                </motion.section>

                <div className="os-solar-loader">
                  <div className="os-solar-load-head"><span><i /> {visibleStage === 'portal' ? 'ESTABLISHING SOLAR ROUTE' : 'RESTORING ARCHIVE SYSTEMS'}</span><b>{visibleStage === 'portal' ? '012' : String(Math.round(12 + bootProgress * .88)).padStart(3, '0')}%</b></div>
                  <div className="os-solar-track"><span style={{ width: `${visibleStage === 'portal' ? 12 : 12 + bootProgress * .88}%` }} /></div>
                  <div className="os-solar-steps">
                    {bootSteps.map((step, index) => {
                      const done = visibleStage === 'boot' && bootProgress >= step.at;
                      const active = visibleStage === 'portal' ? index === 0 : !done && (index === 0 || bootProgress >= bootSteps[index - 1].at);
                      return <div className={`os-solar-step ${done ? 'is-done' : ''} ${active ? 'is-active' : ''}`} key={step.title}>
                        <span>{done ? '✓' : active ? '↗' : '·'}</span><b>{step.title}</b>
                      </div>;
                    })}
                  </div>
                </div>
                <div className="os-solar-foot"><span>THE INNER ARCHIVE IS COMING INTO ALIGNMENT</span><span>OBSERVE <i /> BUILD <i /> DISCOVER</span></div>
              </motion.div>
            )}

            {visibleStage === 'desktop' && (
              <motion.div
                key="desktop"
                className="os-desktop"
                role="dialog"
                aria-modal="true"
                aria-label="MuraliOS interactive desktop"
                initial={{ opacity: 0, y: 28, scale: .965, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: 18, scale: .98 }}
                transition={{ duration: .58, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="os-topbar"><div className="os-brand"><span className="os-brand-mark">M</span><b>MURALI.OS</b><span className="os-version">THE INNER ARCHIVE · 01</span></div><div className="os-topbar-right"><span><i /> ONLINE</span><button onClick={onClose} aria-label="Close MuraliOS"><X size={17} /></button></div></div>
                <div className="os-wallpaper">
                  <div className="os-wallpaper-orb orb-a" /><div className="os-wallpaper-orb orb-b" />
                  <div className="os-desktop-icons">
                    {desktopApps.map(({ id, label, icon: Icon, tint }) => <button type="button" className={`os-desktop-icon tint-${tint} ${activeApp === id ? 'active' : ''}`} key={id} onClick={() => openApp(id)}><span><Icon size={20} /></span><small>{label}</small></button>)}
                  </div>
                  <div className="os-app-window" style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }} key={activeApp}>
                    <div className="os-window-titlebar" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={stopDrag} onPointerCancel={stopDrag}>
                      <span className="os-window-title-icon"><Monitor size={13} /></span><span>{activeApp === 'welcome' ? 'Welcome Center' : desktopApps.find((app) => app.id === activeApp)?.label}</span><span className="os-drag-label">DRAG WINDOW</span><div className="os-window-actions"><i /><i /><button onClick={() => setActiveApp('welcome')} aria-label="Minimize app"><X size={13} /></button></div>
                    </div>
                    <AppContent app={activeApp} currentTheme={currentTheme} onThemeChange={onThemeChange} onOpenTerminal={onOpenTerminal} />
                  </div>
                  <div className="os-desktop-caption"><span>ARCHIVE NODE / BENGALURU</span><span>OBSERVE · BUILD · DISCOVER</span></div>
                </div>
                <div className="os-taskbar"><div className="os-taskbar-brand"><span>M.</span> MuraliOS</div><div className="os-taskbar-apps"><button onClick={() => setActiveApp('welcome')}><Monitor size={14} /> Desktop</button><button onClick={() => openApp('projects')}><FolderOpen size={14} /> Projects</button><button onClick={() => openApp('powers')}><Zap size={14} /> Superpowers</button></div><div className="os-taskbar-clock"><Award size={14} /> EXPLORER MODE</div></div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
