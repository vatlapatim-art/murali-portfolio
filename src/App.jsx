import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowDown, ArrowRight, ArrowUpRight, Award, Check, Code2,
  ChevronRight, Compass, FolderOpen, Github, Globe2, GraduationCap, Heart, Home,
  Linkedin, Mail, Menu, Monitor, Rocket, Sparkles, Terminal, User,
  X,
} from 'lucide-react';
import { certificates, milestones, profile, projects, skills, terminalCommands } from './data/siteData';
import MuraliOSDesktop from './components/MuraliOSDesktop';
import ThreeIntroScene from './components/ThreeIntroScene.jsx';

const ease = [0.22, 1, 0.36, 1];

function SectionHeading({ eyebrow, title, description, number }) {
  return (
    <div className="section-heading">
      <div className="section-heading-top">
        <span className="eyebrow"><span className="eyebrow-dot" />{eyebrow}</span>
        <span className="section-number">{number}</span>
      </div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}


function Reveal({ children, className, delay = 0, distance = 42, direction = 'up', duration = 0.82, ...props }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className} {...props}>{children}</div>;

  const initial = {
    opacity: 0,
    y: direction === 'up' ? distance : 0,
    x: direction === 'left' ? -distance : direction === 'right' ? distance : 0,
    scale: 0.975,
    filter: 'blur(7px)',
  };
  return (
    <motion.div
      className={className}
      {...props}
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2, margin: '0px 0px -7% 0px' }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}


function ArcaneCanvas() {
  const canvasRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const context = canvas?.getContext('2d');
    if (!canvas || !host || !context) return undefined;

    let width = 0;
    let height = 0;
    let frame = 0;
    let particles = [];
    let pointer = { x: -1000, y: -1000 };
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    const palette = ['rgba(185, 111, 91, .64)', 'rgba(220, 166, 145, .68)', 'rgba(142, 169, 183, .58)'];

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(42, Math.min(94, Math.round((width * height) / 12500)));
      particles = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: .65 + Math.random() * 1.45,
        vx: (Math.random() - .5) * .12,
        vy: (Math.random() - .5) * .12,
        phase: Math.random() * Math.PI * 2,
        color: palette[index % palette.length],
      }));
    };

    const onPointerMove = (event) => {
      const bounds = host.getBoundingClientRect();
      pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    };
    const onPointerLeave = () => { pointer = { x: -1000, y: -1000 }; };
    const draw = (time) => {
      context.clearRect(0, 0, width, height);
      const glow = context.createRadialGradient(width * .72, height * .43, 8, width * .72, height * .43, Math.max(width, height) * .64);
      glow.addColorStop(0, 'rgba(242, 216, 202, .20)');
      glow.addColorStop(.55, 'rgba(185, 111, 91, .045)');
      glow.addColorStop(1, 'rgba(247, 245, 241, 0)');
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      particles.forEach((point, index) => {
        const pulse = .55 + (Math.sin(time * .0007 + point.phase) + 1) * .22;
        if (!reduceMotion) {
          point.x += point.vx;
          point.y += point.vy;
          if (point.x < -12) point.x = width + 12;
          if (point.x > width + 12) point.x = -12;
          if (point.y < -12) point.y = height + 12;
          if (point.y > height + 12) point.y = -12;
        }
        const dx = point.x - pointer.x;
        const dy = point.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (!reduceMotion && distance < 145 && distance > 0) {
          const force = (145 - distance) / 145;
          point.x += (dx / distance) * force * .65;
          point.y += (dy / distance) * force * .65;
        }
        context.beginPath();
        context.fillStyle = point.color;
        context.globalAlpha = pulse;
        context.arc(point.x, point.y, point.r, 0, Math.PI * 2);
        context.fill();
        context.globalAlpha = 1;

        for (let next = index + 1; next < particles.length; next += 1) {
          const target = particles[next];
          const span = Math.hypot(point.x - target.x, point.y - target.y);
          if (span < 104) {
            context.beginPath();
            context.strokeStyle = `rgba(185, 111, 91, ${(1 - span / 104) * .09})`;
            context.lineWidth = .7;
            context.moveTo(point.x, point.y);
            context.lineTo(target.x, target.y);
            context.stroke();
          }
        }
      });
      if (!reduceMotion) frame = window.requestAnimationFrame(draw);
    };

    resize();
    host.addEventListener('pointermove', onPointerMove, { passive: true });
    host.addEventListener('pointerleave', onPointerLeave, { passive: true });
    window.addEventListener('resize', resize, { passive: true });
    draw(0);
    return () => {
      window.cancelAnimationFrame(frame);
      host.removeEventListener('pointermove', onPointerMove);
      host.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', resize);
    };
  }, [reduceMotion]);

  return <canvas ref={canvasRef} className="arcane-field-canvas" aria-hidden="true" />;
}

function PortfolioIntro({ onEnter }) {
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);
  const [closing, setClosing] = useState(false);
  const finishRef = useRef(onEnter);
  const beginEnterRef = useRef(null);
  const closingGuardRef = useRef(false);
  const closeTimerRef = useRef(0);
  const progressFrameRef = useRef(0);
  const progressFinishTimerRef = useRef(0);

  useEffect(() => { finishRef.current = onEnter; }, [onEnter]);

  const beginEnter = () => {
    if (closingGuardRef.current) return;
    closingGuardRef.current = true;
    window.cancelAnimationFrame(progressFrameRef.current);
    window.clearTimeout(progressFinishTimerRef.current);
    setProgress(100);
    setClosing(true);
    setStage(4);
    // Let the final atmospheric pass complete; the portfolio then appears on its own.
    closeTimerRef.current = window.setTimeout(() => finishRef.current?.(), reduceMotion ? 100 : 2250);
  };
  beginEnterRef.current = beginEnter;

  useEffect(() => {
    const duration = reduceMotion ? 700 : 6800;
    const stages = [
      { at: 0, label: 'ORBIT', detail: 'A WORLD OF IDEAS, FROM A DISTANCE.' },
      { at: 1450, label: 'APPROACH', detail: 'FOLLOWING THE LIGHT TOWARD THE HORIZON.' },
      { at: 3050, label: 'CLOUD DECK', detail: 'CLOUD SYSTEMS DRIFT BENEATH THE CAMERA.' },
      { at: 4850, label: 'DESCENT', detail: 'CLOSING IN ON A NEW POINT OF VIEW.' },
      { at: 5950, label: 'WELCOME', detail: "WELCOME TO MURALI'S PORTFOLIO." },
    ];
    const start = performance.now();
    let frame = 0;
    let finishTimer = 0;
    let lastStage = -1;
    let lastProgress = -1;

    const tick = (now) => {
      const elapsed = now - start;
      const ratio = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - ratio, 2.05);
      const nextProgress = Math.min(100, Math.round(eased * 100));
      if (nextProgress !== lastProgress) {
        lastProgress = nextProgress;
        setProgress(nextProgress);
      }
      const activeIndex = stages.reduce((current, item, index) => (elapsed >= item.at ? index : current), 0);
      if (activeIndex !== lastStage) {
        lastStage = activeIndex;
        setStage(activeIndex);
      }
      if (ratio < 1) {
        frame = window.requestAnimationFrame(tick);
        progressFrameRef.current = frame;
      } else {
        finishTimer = window.setTimeout(() => beginEnterRef.current?.(), reduceMotion ? 80 : 220);
        progressFinishTimerRef.current = finishTimer;
      }
    };

    frame = window.requestAnimationFrame(tick);
    progressFrameRef.current = frame;
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(finishTimer);
      window.clearTimeout(progressFinishTimerRef.current);
      window.clearTimeout(closeTimerRef.current);
    };
  }, [reduceMotion]);

  const stages = [
    ['ORBIT', 'A WORLD OF IDEAS, FROM A DISTANCE.'],
    ['APPROACH', 'FOLLOWING THE LIGHT TOWARD THE HORIZON.'],
    ['CLOUD DECK', 'CLOUD SYSTEMS DRIFT BENEATH THE CAMERA.'],
    ['DESCENT', 'CLOSING IN ON A NEW POINT OF VIEW.'],
    ['WELCOME', "WELCOME TO MURALI'S PORTFOLIO."],
  ];
  const stageCopy = closing ? stages[4] : stages[stage];
  const showWelcome = closing || stage >= 4;

  return (
    <motion.div
      className={`portfolio-intro-3d ${closing ? 'is-closing' : ''} ${showWelcome ? 'is-welcome' : ''}`}
      initial={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.025, filter: 'blur(12px)', transition: { duration: reduceMotion ? .16 : .78, ease: [0.76, 0, 0.24, 1] } }}
      role="dialog"
      aria-modal="true"
      aria-label="Opening Murali's portfolio"
    >
      <ThreeIntroScene progress={progress} reducedMotion={reduceMotion} closing={closing} />
      <div className="intro3d-cinematic-shade" aria-hidden="true" />
      <div className="intro3d-grain" aria-hidden="true" />
      <div className="intro3d-planet-exit" aria-hidden="true" />

      <header className="intro3d-topbar">
        <div className="intro3d-brand">
          <span className="intro3d-mark">M<span>.</span></span>
          <span><b>MURALI MANOHAR</b><small>PERSONAL PORTFOLIO · BENGALURU</small></span>
        </div>
        <div className="intro3d-session"><i /> {stageCopy[0]}</div>
        <button type="button" className="intro3d-skip" onClick={beginEnter}>SKIP INTRO <ArrowUpRight size={14} /></button>
      </header>

      <main className="intro3d-main">
        <section className="intro3d-copy">
          <span className="intro3d-eyebrow"><i /> CURIOUS BY DEFAULT</span>
          <h1>Murali<br /><em>Manohar.</em></h1>
          <p>A computer science student building useful things across systems, data and thoughtful interfaces.</p>
          <div className="intro3d-story-status">
            <span>{stageCopy[0]}</span>
            <b>{stageCopy[1]}</b>
          </div>
        </section>
      </main>

      {showWelcome && (
        <motion.div
          className="intro3d-welcome"
          initial={{ opacity: 0, y: 24, scale: .96, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: reduceMotion ? .2 : 1.05, ease: [0.16, 1, 0.3, 1] }}
          aria-live="polite"
        >
          <span><i /> THE NEXT CHAPTER STARTS HERE</span>
          <h2>Welcome to<br /><em>Murali's Portfolio.</em></h2>
          <p>Curiosity in motion. Ideas made tangible.</p>
        </motion.div>
      )}

      <footer className="intro3d-footer">
        <div className="intro3d-progress-copy"><span><i /> {stageCopy[0]}</span><b>{String(progress).padStart(3, '0')}%</b></div>
        <div className="intro3d-progress-track"><span style={{ width: `${progress}%` }} /></div>
        <div className="intro3d-footer-bottom">
          <span>BUILT FROM CURIOSITY <i /> BENGALURU, INDIA</span>
          <span className="intro3d-auto-note">{closing || stage >= 4 ? "WELCOME TO MURALI'S PORTFOLIO" : 'OPENING YOUR VIEW OF THE WORLD'}</span>
          <small>THE PORTFOLIO OPENS AUTOMATICALLY</small>
        </div>
      </footer>
    </motion.div>
  );
}

function SocialLink({ href, label, icon: Icon, external = true }) {
  if (!href) return null;
  return (
    <a className="social-link" href={href} aria-label={label} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
      <Icon size={17} strokeWidth={1.8} />
      <span>{label}</span>
      {external && <ArrowUpRight size={13} />}
    </a>
  );
}

function TerminalWindow({ isOpen, onClose }) {
  const initial = useMemo(() => ([
    { kind: 'system', text: 'MURALI.OS [Version 1.0.26]' },
    { kind: 'system', text: 'A small terminal for exploring a bigger story.' },
    { kind: 'system', text: 'Type help to see what you can discover.' },
  ]), []);
  const [entries, setEntries] = useState(initial);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      window.setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [entries]);

  const runCommand = (raw) => {
    const command = raw.trim();
    if (!command) return;
    const normalized = command.toLowerCase();
    setHistory((old) => [command, ...old].slice(0, 30));
    setHistoryIndex(-1);
    if (normalized === 'clear') {
      setEntries([]);
      setValue('');
      return;
    }

    let result;
    const [verb, ...rest] = normalized.split(/\s+/);
    if (verb === 'open' && rest.length) {
      const query = rest.join(' ');
      const project = projects.find((item) => `${item.name} ${item.category}`.toLowerCase().replace(/[^a-z0-9 ]/g, '').includes(query.replace(/[^a-z0-9 ]/g, '')) || item.name.toLowerCase().replace(/[^a-z0-9]/g, '').includes(query.replace(/[^a-z0-9]/g, '')));
      result = project
        ? { title: `./projects/${project.name.toLowerCase()}`, lines: [project.description, `Stack: ${project.details.join(' · ')}`, `Status: ${project.status}`, 'Scroll to the projects section for the full card.'] }
        : { title: 'project not found', lines: ['I could not match that project name.', 'Try: open cycloneshield, open campuscompute, or open smartstudy.'] };
    } else if (normalized === 'whoami' || normalized === 'ls') {
      result = normalized === 'whoami' ? terminalCommands.about : terminalCommands.projects;
    } else if (terminalCommands[normalized]) {
      result = terminalCommands[normalized];
    } else if (normalized.startsWith('sudo')) {
      result = { title: 'permission denied', lines: ['Nice try 😄 You already have permission to explore.', 'Try `secret` instead.'] };
    } else {
      result = { title: 'command not found', lines: [`${command}: command not found.`, 'Type help to see the available commands.'] };
    }
    setEntries((old) => [...old, { kind: 'command', text: command }, { kind: 'response', title: result.title, lines: result.lines }]);
    setValue('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      runCommand(value);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const next = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(next);
      setValue(history[next] || '');
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      const next = Math.max(historyIndex - 1, -1);
      setHistoryIndex(next);
      setValue(next === -1 ? '' : history[next] || '');
    } else if (event.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="terminal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div className="terminal-window" role="dialog" aria-modal="true" aria-labelledby="terminal-title" initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.98 }} transition={{ duration: 0.24, ease }}>
            <div className="terminal-titlebar">
              <div className="terminal-controls"><i /><i /><i /></div>
              <div className="terminal-title" id="terminal-title"><Terminal size={13} /> murali@portfolio: ~</div>
              <button className="icon-button terminal-close" onClick={onClose} aria-label="Close terminal"><X size={17} /></button>
            </div>
            <div className="terminal-body" ref={scrollRef} onClick={() => inputRef.current?.focus()}>
              {entries.map((entry, index) => (
                <div className={`terminal-entry ${entry.kind}`} key={`${entry.kind}-${index}`}>
                  {entry.kind === 'command' && <div className="terminal-command"><span>visitor@murali:~$</span> {entry.text}</div>}
                  {entry.kind === 'system' && <div className="terminal-system">{entry.text}</div>}
                  {entry.kind === 'response' && (
                    <div className="terminal-response">
                      <div className="terminal-response-title">{entry.title}</div>
                      {entry.lines.map((line, lineIndex) => <div className="terminal-line" key={lineIndex}>{line}</div>)}
                    </div>
                  )}
                </div>
              ))}
              <form className="terminal-input-row" onSubmit={(e) => { e.preventDefault(); runCommand(value); }}>
                <span>visitor@murali:~$</span>
                <input ref={inputRef} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown} spellCheck="false" autoComplete="off" aria-label="Terminal command" placeholder="type a command..." />
                <span className="terminal-cursor" />
              </form>
            </div>
            <div className="terminal-footer"><span><span className="status-dot" /> interactive shell</span><span>↑ ↓ history&nbsp; · &nbsp;esc to close</span></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return undefined;
    const onKey = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div className="project-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title" initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }} transition={{ duration: 0.22 }}>
            <button className="icon-button modal-close" onClick={onClose} aria-label="Close project details"><X size={18} /></button>
            <span className={`project-symbol ${project.accent}`}>{project.icon}</span>
            <span className="eyebrow"><span className="eyebrow-dot" />{project.category}</span>
            <h3 id="project-modal-title">{project.name}</h3>
            <p className="modal-description">{project.description}</p>
            {project.architecture && (
              <div className="project-architecture">
                <div className="architecture-heading"><h4>How the system fits together</h4><span>HIGH-LEVEL ARCHITECTURE</span></div>
                <div className="architecture-flow">
                  {project.architecture.map((layer, index) => (
                    <React.Fragment key={layer.title}>
                      <div className="architecture-layer">
                        <span className="architecture-layer-index">0{index + 1}</span>
                        <div><b>{layer.title}</b><strong>{layer.stack}</strong><small>{layer.note}</small></div>
                      </div>
                      {index < project.architecture.length - 1 && <div className="architecture-connector" aria-hidden="true">↓</div>}
                    </React.Fragment>
                  ))}
                </div>
                <p className="architecture-footnote">The Python side handles the graph mathematics; the React / Three.js side renders the computed communities and relationships.</p>
              </div>
            )}
            <div className="modal-highlights">
              <h4>What went into it</h4>
              {project.highlights.map((item) => <div className="highlight-row" key={item}><Check size={15} />{item}</div>)}
            </div>
            <div className="tag-row modal-tags">{project.details.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
            <div className="modal-actions">
              {project.github ? <a className="button button-secondary" href={project.github} target="_blank" rel="noreferrer"><Github size={16} /> View source <ArrowUpRight size={14} /></a> : <span className="modal-note">Project link can be added before publishing.</span>}
              {project.demo && <a className="button button-primary" href={project.demo} target="_blank" rel="noreferrer">Live demo <ArrowUpRight size={14} /></a>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProjectArtwork({ index }) {
  if (index === 0) return (
    <div className="artwork artwork-cyclone" aria-hidden="true">
      <div className="cyclone-map-grid" />
      <svg className="cyclone-map-svg" viewBox="0 0 720 420" preserveAspectRatio="xMidYMid slice" role="presentation">
        <defs>
          <radialGradient id="cycloneEyeGradient" cx="38%" cy="30%" r="72%">
            <stop offset="0" stopColor="#f8e2d2" />
            <stop offset=".34" stopColor="#d99378" />
            <stop offset=".72" stopColor="#8b6d69" />
            <stop offset="1" stopColor="#244c54" />
          </radialGradient>
          <linearGradient id="cycloneSpiralGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8fc7bd" />
            <stop offset=".48" stopColor="#e6a58b" />
            <stop offset="1" stopColor="#f2d3c1" />
          </linearGradient>
          <linearGradient id="cycloneSweepGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#dba18a" stopOpacity=".65" />
            <stop offset="1" stopColor="#dba18a" stopOpacity="0" />
          </linearGradient>
          <filter id="cycloneGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <g opacity=".72">
          <path className="cyclone-coast" d="M-20 72C52 44 84 72 116 96s51 34 82 23c26-9 36-35 69-34 27 1 41 25 60 42 21 19 45 26 69 18 31-10 48-43 74-51 39-12 62 18 84 44 18 21 44 28 72 18 40-15 63-55 114-39v66c-39-1-62 20-84 48-19 25-42 50-77 52-35 2-57-17-83-32-25-15-49-15-70 4-27 25-44 66-82 73-39 7-63-24-87-51-20-23-43-33-69-21-33 15-54 46-88 47-34 1-52-30-75-55-23-26-45-35-85-18Z" />
          <path className="cyclone-coast" d="M450-30c-5 42 9 71 34 96 24 25 55 40 64 70 8 27-8 49-28 73-20 24-38 47-33 78 5 30 31 52 58 69 38 24 63 50 65 94" />
          <path className="cyclone-contours" d="M-20 126C84 92 125 148 188 144s87-65 140-56 83 80 149 75 100-72 160-54 63 67 103 70M-15 292c68-49 117-54 172-28s77 63 132 47 89-76 151-68 91 56 145 44 81-55 153-44M-10 344c82-32 130-25 179 3s85 37 130 8 83-70 143-45 88 48 139 26 82-49 146-24" />
        </g>
        <g className="cyclone-radar" transform="translate(394 204)">
          <circle className="cyclone-radar-ring outer" r="174" />
          <circle className="cyclone-radar-ring" r="132" />
          <circle className="cyclone-radar-ring" r="88" />
          <circle className="cyclone-radar-ring" r="45" />
          <g className="cyclone-sweep"><path d="M0 0L0 -174A174 174 0 0 1 134 -111Z" /></g>
          <path className="cyclone-spiral" d="M-8 -4C-38 -39-70 -4-51 30c23 40 87 31 106-13 23-54-14-110-75-112-77-2-133 73-109 144 30 88 145 117 222 62" />
          <circle className="cyclone-eye" r="27" />
          <circle className="cyclone-eye-core" r="7" />
          <circle cx="-118" cy="-97" r="5" fill="#e5b49b" stroke="#f4e0d4" strokeWidth="2" />
          <circle cx="124" cy="-54" r="4" fill="#8db8c2" stroke="#dce9e6" strokeWidth="2" />
          <circle cx="-92" cy="118" r="4" fill="#8db8c2" stroke="#dce9e6" strokeWidth="2" />
        </g>
        <path className="cyclone-track" d="M72 352C166 317 190 284 260 278s105 14 153-28 73-87 140-112 99-12 145-43" />
        <circle className="cyclone-track-node" cx="72" cy="352" r="6" />
        <circle className="cyclone-track-node" cx="260" cy="278" r="6" />
        <circle className="cyclone-track-node" cx="413" cy="250" r="6" />
        <circle className="cyclone-track-node" cx="553" cy="138" r="6" />
        <circle className="cyclone-track-node" cx="698" cy="95" r="6" />
      </svg>
      <div className="cyclone-caption">BAY OF BENGAL <strong>/ MODEL VIEW</strong></div>
      <div className="cyclone-readout cyclone-readout-a"><span>WIND FIELD</span><b>42 km/h</b><small>ILLUSTRATIVE INTENSITY</small></div>
      <div className="cyclone-readout cyclone-readout-b"><span>RISK LAYERS</span><b>03 ACTIVE</b><small>RAIN · TERRAIN · EXPOSURE</small></div>
      <div className="cyclone-map-legend"><span><i /> STORM TRACK</span><span><i /> RADAR FIELD</span><span><i /> COASTAL LAYER</span></div>
    </div>
  );
  if (index === 1) return (
    <div className="artwork artwork-aegis" aria-hidden="true">
      <div className="voice-top"><span className="voice-live"><i /> VOICE SESSION</span><span>00:18.42</span></div>
      <div className="voice-orb"><span /><span /><span /></div>
      <div className="voice-wave">{Array.from({ length: 33 }, (_, i) => <i key={i} style={{ '--h': `${12 + ((i * 17) % 55)}px` }} />)}</div>
      <div className="voice-foot"><b>Generation fencing</b><span>INTERRUPTION SAFE</span></div>
    </div>
  );
  if (index === 2) return (
    <div className="artwork artwork-campus" aria-hidden="true">
      <div className="terminal-chrome"><i /><i /><i /><span>campuscompute — worker-01</span></div>
      <div className="terminal-code"><p><b>$</b> ./campuscompute</p><p><em>✓</em> coordinator online</p><p><em>✓</em> worker pool: 04</p><p><b>→</b> dispatching job <strong>#014</strong></p><p className="terminal-progress"><i /></p><p className="terminal-ready">JOB COMPLETED · 0.42s</p></div>
    </div>
  );
  if (index === 3) return (
    <div className="artwork artwork-graph" aria-hidden="true">
      <svg viewBox="0 0 520 250" role="presentation">
        <g className="graph-links">
          {[[60,78,145,48],[60,78,154,132],[145,48,228,77],[154,132,228,77],[228,77,298,42],[228,77,310,150],[298,42,388,73],[310,150,388,73],[388,73,455,45],[388,73,455,155],[154,132,80,188],[310,150,230,210],[230,210,455,155],[145,48,80,188],[298,42,455,45],[60,78,230,210]].map((edge,i)=><line key={i} x1={edge[0]} y1={edge[1]} x2={edge[2]} y2={edge[3]} />)}
        </g>
        <g className="graph-nodes">
          {[[60,78],[145,48],[154,132],[228,77],[298,42],[310,150],[388,73],[455,45],[455,155],[80,188],[230,210]].map((point,i)=><circle key={i} cx={point[0]} cy={point[1]} r={i===3?10:6+(i%3)} className={`graph-node node-${i%4}`} />)}
        </g>
      </svg>
      <span className="graph-float-label">COMMUNITY DETECTED <b>k = 4</b></span>
      <span className="art-label label-bottom">LAPLACIAN → EIGENVECTORS → CLUSTERS</span>
    </div>
  );
  if (index === 4) return (
    <div className="artwork artwork-study" aria-hidden="true">
      <div className="study-window"><div className="study-nav"><span>✳ smartstudy</span><i>Today</i></div><div className="study-greeting">Good morning, Murali<span>↗</span></div><div className="study-sub">A little progress goes a long way.</div><div className="study-progress"><span /><span /><span /><span /></div><div className="study-row"><div><small>FOCUS SESSION</small><b>42 min</b></div><div><small>STREAK</small><b>08 days</b></div><div><small>RECALL</small><b>84%</b></div></div></div>
    </div>
  );
  return (
    <div className="artwork artwork-arthiq" aria-hidden="true">
      <div className="finance-card"><div className="finance-top"><span>YOUR MONEY MAP</span><b>↗</b></div><small>MONTHLY OVERVIEW</small><strong>₹ 24,850</strong><span className="finance-positive">+12.8% this month</span><div className="finance-chart"><svg viewBox="0 0 450 120"><path d="M0 96 C36 92 43 68 78 76 S126 104 160 65 S220 78 252 48 S305 74 341 30 S396 44 450 8" /><path className="finance-area" d="M0 96 C36 92 43 68 78 76 S126 104 160 65 S220 78 252 48 S305 74 341 30 S396 44 450 8 L450 120 L0 120Z" /></svg></div><div className="finance-footer"><span>GOALS ON TRACK</span><b>3 / 4</b></div></div>
    </div>
  );
}

function SkillArtwork({ index }) {
  const scenes = [
    <svg viewBox="0 0 280 110" role="img" aria-label="Code editor illustration">
      <rect className="skill-visual-window" x="12" y="10" width="256" height="90" rx="9" />
      <path className="skill-visual-topbar" d="M21 10h238a9 9 0 0 1 9 9v12H12V19a9 9 0 0 1 9-9Z" />
      <circle className="skill-dot dot-a" cx="27" cy="21" r="3" /><circle className="skill-dot dot-b" cx="38" cy="21" r="3" /><circle className="skill-dot dot-c" cx="49" cy="21" r="3" />
      <path className="skill-code-line code-muted" d="M31 47h18m-18 15h10m-10 15h20" />
      <path className="skill-code-line code-accent" d="M66 47h45m-32 15h62m-45 15h35" />
      <path className="skill-code-line code-secondary" d="M151 47h37m-65 15h28m-11 15h57" />
      <path className="skill-code-brace" d="m224 44-9 17 9 17" />
    </svg>,
    <svg viewBox="0 0 280 110" role="img" aria-label="Frontend browser and interface illustration">
      <rect className="skill-visual-window" x="12" y="10" width="256" height="90" rx="9" />
      <path className="skill-visual-topbar" d="M21 10h238a9 9 0 0 1 9 9v12H12V19a9 9 0 0 1 9-9Z" />
      <circle className="skill-dot dot-a" cx="27" cy="21" r="3" /><circle className="skill-dot dot-b" cx="38" cy="21" r="3" /><circle className="skill-dot dot-c" cx="49" cy="21" r="3" />
      <rect className="skill-ui-sidebar" x="24" y="42" width="42" height="48" rx="4" />
      <rect className="skill-ui-block ui-a" x="78" y="42" width="80" height="27" rx="4" />
      <rect className="skill-ui-block ui-b" x="166" y="42" width="88" height="27" rx="4" />
      <rect className="skill-ui-block ui-c" x="78" y="76" width="52" height="14" rx="3" />
      <rect className="skill-ui-block ui-d" x="138" y="76" width="116" height="14" rx="3" />
    </svg>,
    <svg viewBox="0 0 280 110" role="img" aria-label="Backend API and database pipeline illustration">
      <path className="skill-flow-line" d="M58 55h49m64 0h50M140 34v-13m0 68V76" />
      <rect className="skill-flow-node node-api" x="14" y="34" width="74" height="42" rx="8" />
      <rect className="skill-flow-node node-core" x="107" y="34" width="66" height="42" rx="8" />
      <rect className="skill-flow-node node-db" x="192" y="34" width="74" height="42" rx="8" />
      <path className="skill-flow-mini" d="M29 47h42m-42 8h28m-28 8h34M122 47h36m-36 8h28m-28 8h20M207 47h43m-43 8h34m-34 8h29" />
      <circle className="skill-flow-dot" cx="140" cy="15" r="7" /><circle className="skill-flow-dot second" cx="140" cy="95" r="7" />
    </svg>,
    <svg viewBox="0 0 280 110" role="img" aria-label="Data graph and analytics illustration">
      <g className="skill-graph-edges"><path d="M43 67 91 30 137 61 190 24 237 63M43 67l47 25 47-31 53 28 47-26M91 30l-1 62m47-31 53-37v65" /></g>
      <g className="skill-graph-nodes"><circle cx="43" cy="67" r="6"/><circle cx="91" cy="30" r="7"/><circle cx="137" cy="61" r="9"/><circle cx="190" cy="24" r="6"/><circle cx="237" cy="63" r="7"/><circle cx="90" cy="92" r="5"/><circle cx="190" cy="83" r="6"/></g>
      <rect className="skill-data-bar bar-a" x="28" y="10" width="5" height="15" rx="2"/><rect className="skill-data-bar bar-b" x="38" y="4" width="5" height="21" rx="2"/><rect className="skill-data-bar bar-c" x="48" y="14" width="5" height="11" rx="2"/>
    </svg>,
    <svg viewBox="0 0 280 110" role="img" aria-label="Developer tools and cloud infrastructure illustration">
      <path className="skill-tool-link" d="M80 60h50m20 0h50M140 34v-13m0 60V76" />
      <rect className="skill-tool-card tool-left" x="24" y="39" width="57" height="42" rx="7"/><rect className="skill-tool-card tool-mid" x="111" y="34" width="58" height="52" rx="8"/><rect className="skill-tool-card tool-right" x="199" y="39" width="57" height="42" rx="7"/>
      <path className="skill-tool-glyph" d="m41 55 8 7-8 7m17-14-8 14m72-9h18m-9-9v18m80-9h23" />
      <circle className="skill-tool-node" cx="140" cy="15" r="7"/><circle className="skill-tool-node node-bottom" cx="140" cy="95" r="7"/>
    </svg>,
  ];
  return <div className={`skill-art skill-art-${index + 1}`} aria-hidden="true">{scenes[index] || scenes[0]}</div>;
}


function HeroOrbit({ sceneRef, onPointerMove, onPointerLeave, style, onExploreProjects, onExploreSkills }) {
  return (
    <motion.aside className="hero-visual-column hero-orbit-column" style={style} aria-label="Animated visual representing connected ideas and systems">
      <div className="hero-visual-caption"><span>THE ASTRAL ARCHIVE / NODE 07</span><span>SYSTEMS IN MOTION</span></div>
      <div className="hero-orbit-shell" ref={sceneRef} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
        <div className="orbit-corner orbit-corner-a">SYS / 01</div>
        <div className="orbit-corner orbit-corner-b">DATA / 02</div>
        <div className="orbit-corner orbit-corner-c">DESIGN / 03</div>
        <svg className="hero-orbit-art" viewBox="0 0 620 590" role="img" aria-label="Abstract orbiting forms connected by fine lines">
          <defs>
            <radialGradient id="heroOrbCore" cx="38%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#e6f0df" />
              <stop offset="32%" stopColor="#a9d4bd" />
              <stop offset="70%" stopColor="#4f8b80" />
              <stop offset="100%" stopColor="#204f52" />
            </radialGradient>
            <linearGradient id="heroOrbGlass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f7f0df" stopOpacity=".72" />
              <stop offset="50%" stopColor="#c9e7d2" stopOpacity=".14" />
              <stop offset="100%" stopColor="#8bb9aa" stopOpacity=".42" />
            </linearGradient>
            <filter id="heroOrbShadow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="18" />
            </filter>
          </defs>
          <ellipse className="orb-shadow" cx="318" cy="317" rx="150" ry="118" filter="url(#heroOrbShadow)" />
          <g className="orbital-ring orbital-ring-one"><ellipse cx="310" cy="294" rx="210" ry="92" /><ellipse cx="310" cy="294" rx="210" ry="92" transform="rotate(58 310 294)" /></g>
          <g className="orbital-ring orbital-ring-two"><ellipse cx="310" cy="294" rx="255" ry="128" transform="rotate(-35 310 294)" /></g>
          <g className="orbital-threads">
            <path d="M86 165 C180 210 190 385 300 416 S452 346 535 410" />
            <path d="M135 470 C220 376 380 155 500 170" />
            <path d="M104 295 C212 246 382 255 520 285" />
          </g>
          <g className="orbital-satellites">
            <circle cx="115" cy="184" r="7" /><circle cx="492" cy="174" r="9" /><circle cx="526" cy="412" r="6" /><circle cx="145" cy="461" r="5" /><circle cx="310" cy="95" r="4" /><circle cx="414" cy="493" r="4" />
          </g>
          <g className="hero-orb-core">
            <circle cx="310" cy="294" r="105" fill="url(#heroOrbCore)" />
            <circle cx="310" cy="294" r="105" fill="url(#heroOrbGlass)" opacity=".62" />
            <path d="M234 261 C270 190 371 180 402 247 C426 300 373 390 301 396 C246 400 205 337 234 261Z" fill="none" stroke="rgba(240,248,224,.72)" strokeWidth="1.2" />
            <path d="M260 210 C300 259 335 331 377 374" fill="none" stroke="rgba(226,240,220,.42)" strokeWidth="1" />
            <path d="M213 309 C269 278 355 268 409 288" fill="none" stroke="rgba(92,59,48,.34)" strokeWidth="1" />
            <circle cx="277" cy="250" r="30" fill="rgba(231,243,219,.17)" />
          </g>
          <g className="orbit-crosshair"><path d="M310 48v18M310 522v18M62 294h18M540 294h18" /><circle cx="310" cy="294" r="4" /></g>
        </svg>
        <div className="orbit-core-mark" aria-hidden="true"><b>M.</b><span>IDEAS → SYSTEMS</span></div>
        <div className="orbit-note orbit-note-top"><span className="orbit-note-dot" /> ARCHIVE CORE / ONLINE</div>
        <div className="orbit-note orbit-note-bottom"><b>01—06</b><span>REAL PROJECTS<br />ONE CURIOUS MIND</span></div>
        <button type="button" className="orbit-float-card orbit-float-card-a" onClick={onExploreProjects}><span>01 / THINK</span><b>Find the pattern.</b><i>OPEN PROJECTS ↗</i></button>
        <button type="button" className="orbit-float-card orbit-float-card-b" onClick={onExploreSkills}><span>02 / BUILD</span><b>Make it tangible.</b><i>EXPLORE TOOLKIT ↗</i></button>
      </div>
      <div className="hero-visual-foot"><span>COMPUTATION <i /> CURIOSITY <i /> CRAFT</span><span>MOVE YOUR POINTER</span></div>
    </motion.aside>
  );
}

function SidequestSection() {
  return (
    <section className="sidequest-section" id="sidequest">
      <div className="sidequest-inner">
        <Reveal className="sidequest-copy" direction="left">
          <span className="sidequest-kicker"><i /> 04 / OFF THE CLOCK · 001</span>
          <h2>Take the<br /><em>scenic route.</em></h2>
          <p>When I'm away from the editor, I'm usually looking for a road worth taking, a place I've never seen, or a moment worth turning into a short video. Curiosity doesn't stop at the edge of a screen.</p>
          <div className="sidequest-tags"><span>Motorcycle rides</span><span>Travel frames</span><span>Video edits</span></div>
        </Reveal>
        <Reveal className="sidequest-map-wrap" direction="right" delay={.12}>
          <div className="sidequest-map-head"><span>ANOTHER KIND OF EXPLORATION</span><span>NO FIXED ROUTE ↗</span></div>
          <div className="sidequest-map-art">
            <svg viewBox="0 0 620 390" role="img" aria-label="An abstract winding road with three checkpoints">
              <defs><linearGradient id="routeStroke" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#b87864"/><stop offset=".55" stopColor="#748b79"/><stop offset="1" stopColor="#9a8b9b"/></linearGradient></defs>
              <path className="route-shadow" d="M40 324 C110 280 98 188 185 192 S270 308 326 230 S360 92 452 114 S516 234 584 44" />
              <path className="route-line" pathLength="1" d="M40 324 C110 280 98 188 185 192 S270 308 326 230 S360 92 452 114 S516 234 584 44" />
              <g className="route-checkpoint checkpoint-one"><circle cx="40" cy="324" r="12"/><circle cx="40" cy="324" r="4"/></g>
              <g className="route-checkpoint checkpoint-two"><circle cx="326" cy="230" r="12"/><circle cx="326" cy="230" r="4"/></g>
              <g className="route-checkpoint checkpoint-three"><circle cx="584" cy="44" r="12"/><circle cx="584" cy="44" r="4"/></g>
              <g className="route-sparkles"><path d="M118 78v22m-11-11h22M480 300v18m-9-9h18M260 50v14m-7-7h14"/></g>
            </svg>
            <span className="route-label route-label-one">START WITH CURIOSITY</span>
            <span className="route-label route-label-two">TAKE THE DETOUR</span>
            <span className="route-label route-label-three">KEEP THE FRAME</span>
            <div className="route-stamp">M.<span>✳</span></div>
          </div>
          <div className="sidequest-map-foot"><span>THE BEST PART IS OFTEN THE WAY THERE.</span><span>SCENIC ROUTE / VOL. 01</span></div>
        </Reveal>
      </div>
    </section>
  );
}

function App() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [desktopLaunchOrigin, setDesktopLaunchOrigin] = useState(null);
  const [introVisible, setIntroVisible] = useState(true);
  const [portfolioRevealed, setPortfolioRevealed] = useState(false);
  const [revealEffect, setRevealEffect] = useState(false);
  const introFinishedRef = useRef(false);
  const revealTimerRef = useRef(0);
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('murali-portfolio-theme-v2') || 'default'; } catch { return 'default'; }
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [projectFilter, setProjectFilter] = useState('All work');
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroSceneRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroLift = useTransform(scrollYProgress, [0, 0.16], [0, -72]);
  const heroFade = useTransform(scrollYProgress, [0, 0.14], [1, 0.42]);
  const heroScale = useTransform(scrollYProgress, [0, 0.16], [1, 0.975]);
  const heroVisualLift = useTransform(scrollYProgress, [0, 0.22], [0, -42]);
  const heroVisualRotate = useTransform(scrollYProgress, [0, 0.3], [0, -3]);

  useEffect(() => {
    if (!introVisible) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [introVisible]);

  const finishIntro = () => {
    if (introFinishedRef.current) return;
    introFinishedRef.current = true;
    setIntroVisible(false);
    setPortfolioRevealed(true);
    setRevealEffect(true);
    window.clearTimeout(revealTimerRef.current);
    revealTimerRef.current = window.setTimeout(() => setRevealEffect(false), 1650);
  };

  useEffect(() => () => window.clearTimeout(revealTimerRef.current), []);

  const openArchiveDesktop = (event) => {
    const bounds = event?.currentTarget?.getBoundingClientRect?.();
    if (bounds) setDesktopLaunchOrigin({ x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 });
    else setDesktopLaunchOrigin(null);
    setDesktopOpen(true);
  };

  useEffect(() => {
    const onKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setTerminalOpen((open) => !open);
      }
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    const sectionIds = ['home', 'about', 'skills', 'projects', 'sidequest', 'journey', 'credentials', 'contact'];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: '-22% 0px -62% 0px', threshold: [0.1, 0.25, 0.5] });
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    try { localStorage.setItem('murali-portfolio-theme-v2', theme); } catch { /* storage may be unavailable */ }
  }, [theme]);

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Toolkit' },
    { id: 'projects', label: 'Projects' },
    { id: 'journey', label: 'Journey' },
    { id: 'credentials', label: 'Certificates' },
  ];

  const filters = ['All work', 'Product & AI', 'Data & 3D', 'Systems'];
  const visibleProjects = projects.filter((project) => {
    if (projectFilter === 'All work') return true;
    if (projectFilter === 'Product & AI') return /AI|EdTech|FinTech|agent/i.test(project.category);
    if (projectFilter === 'Data & 3D') return /Geospatial|Graph|3D|Data/i.test(project.category);
    if (projectFilter === 'Systems') return /Operating systems|DevOps|SRE|C programming/i.test(project.category);
    return true;
  });

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1700);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const goTo = (id) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleHeroPointerMove = (event) => {
    if (!heroSceneRef.current || event.pointerType === 'touch') return;
    const bounds = heroSceneRef.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroSceneRef.current.style.setProperty('--pointer-rotate-y', `${x * 9}deg`);
    heroSceneRef.current.style.setProperty('--pointer-rotate-x', `${-y * 8}deg`);
    heroSceneRef.current.style.setProperty('--pointer-shift-x', `${x * 12}px`);
    heroSceneRef.current.style.setProperty('--pointer-shift-y', `${y * 12}px`);
  };

  const resetHeroPointer = () => {
    if (!heroSceneRef.current) return;
    heroSceneRef.current.style.setProperty('--pointer-rotate-y', '0deg');
    heroSceneRef.current.style.setProperty('--pointer-rotate-x', '0deg');
    heroSceneRef.current.style.setProperty('--pointer-shift-x', '0px');
    heroSceneRef.current.style.setProperty('--pointer-shift-y', '0px');
  };

  return (
    <div className={`reference-shell theme-${theme} ${portfolioRevealed ? 'portfolio-is-revealed' : 'portfolio-intro-locked'} ${revealEffect ? 'portfolio-reveal-active' : ''}`}>
      <div className="scroll-progress"><span style={{ width: `${scrollProgress}%` }} /></div>

      <header className="topbar">
        <a className="topbar-brand" href="#home" aria-label="Murali Manohar home">
          <span className="brand-monogram">M<span>.</span></span>
          <span className="brand-name-lockup"><b>Murali Manohar</b><small>DEVELOPER / BUILDER</small></span>
        </a>
        <button className="mobile-nav-toggle" onClick={() => setMobileMenuOpen((value) => !value)} aria-label="Toggle navigation">{mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}</button>
        <nav className={`topbar-nav ${mobileMenuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          {navItems.map((item) => <a key={item.id} href={`#${item.id}`} className={activeSection === item.id ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>{item.label}</a>)}
          <a className="nav-contact" href="#contact" onClick={() => setMobileMenuOpen(false)}>Say hello <ArrowUpRight size={14} /></a>
        </nav>
      </header>

      <nav className="chapter-rail" aria-label="Page chapters">
        {[
          ['home', 'Intro'], ['about', 'About'], ['skills', 'Toolkit'], ['projects', 'Work'],
          ['sidequest', 'Off the clock'], ['journey', 'Journey'], ['credentials', 'Awards'], ['contact', 'Contact'],
        ].map(([id, label], index) => (
          <a href={`#${id}`} key={id} className={activeSection === id ? 'active' : ''} aria-label={`Go to ${label}`} aria-current={activeSection === id ? 'location' : undefined}>
            <span className="chapter-dot" /><span className="chapter-tooltip">0{index + 1} / {label}</span>
          </a>
        ))}
      </nav>

      <main>
        <section className="hero-section" id="home">
          <div className="hero-backdrop-mark" aria-hidden="true">M.</div>
          <div className="hero-atmosphere" aria-hidden="true">
            <svg viewBox="0 0 1600 900" preserveAspectRatio="none">
              <defs>
                <linearGradient id="atmosphereStroke" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#B96F5B" stopOpacity="0" />
                  <stop offset=".42" stopColor="#B96F5B" stopOpacity=".28" />
                  <stop offset="1" stopColor="#718A7A" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="atmosphereMint" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#7F9A88" stopOpacity="0" />
                  <stop offset=".5" stopColor="#7F9A88" stopOpacity=".25" />
                  <stop offset="1" stopColor="#7F9A88" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path className="atmosphere-curve atmosphere-curve-a" d="M-80 660 C190 460 330 190 650 270 S1090 650 1680 210" />
              <path className="atmosphere-curve atmosphere-curve-b" d="M-60 270 C250 500 490 760 820 620 S1270 150 1660 440" />
              <path className="atmosphere-curve atmosphere-curve-c" d="M-80 820 C300 700 420 390 770 420 S1280 840 1680 620" />
              <path className="atmosphere-contour" d="M40 150 C290 40 470 80 650 180 S1030 340 1510 80" />
              <path className="atmosphere-contour" d="M-30 760 C300 590 470 610 680 720 S1180 910 1650 730" />
              <g className="atmosphere-points">
                <circle cx="180" cy="245" r="4"/><circle cx="520" cy="184" r="3"/><circle cx="730" cy="650" r="5"/>
                <circle cx="1045" cy="210" r="4"/><circle cx="1370" cy="670" r="5"/><circle cx="1490" cy="300" r="3"/>
              </g>
            </svg>
            <span className="atmosphere-side-note">A MIND IN MOTION <i /> 2026</span>
            <span className="atmosphere-coordinate">12°58' N&nbsp;&nbsp; 77°35' E</span>
          </div>
          <ArcaneCanvas />
          <motion.div className="hero-content" style={{ y: heroLift, opacity: heroFade, scale: heroScale }}>
            <motion.div className="hero-meta" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }}>
              <span className="eyebrow-pill"><i /> ENGINEER OF CURIOUS THINGS</span>
              <span className="hero-location"><Globe2 size={14} /> PES University · Bengaluru, India</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .14, duration: .7, ease }}>
              I turn ideas<br /><span className="hero-serif">into systems</span><br />that <span className="hero-outline-word">matter.</span>
            </motion.h1>
            <motion.div className="hero-bottomline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .32 }}>
              <p>I'm <strong>Murali Manohar Vatlapati</strong> — a CSE student who enjoys connecting systems, data, and thoughtful interface design to build software that solves real problems.</p>
              <div className="hero-actions">
                <a className="button button-dark" href="#projects">Explore selected work <ArrowUpRight size={16} /></a>
              </div>
            </motion.div>
            <motion.div className="hero-social-strip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .42 }}>
              <div className="hero-social-links"><SocialLink href={profile.github} label="GitHub" icon={Github} /><SocialLink href={profile.linkedin} label="LinkedIn" icon={Linkedin} /><SocialLink href={`mailto:${profile.email}`} label="Email" icon={Mail} external={false} /></div>
              <span className="hero-edition">PORTFOLIO / 2026 <i /> INDEPENDENTLY BUILT</span>
            </motion.div>
            <motion.div className="hero-work-portal" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .55, duration: .75, ease }}>
              <div className="work-portal-copy"><span>THE ARCHIVE HAS A HIDDEN ROOM</span><p>A hidden room of experiments, mini-games, and details beyond the code.</p></div>
              <div className="work-word" aria-label="Interactive WORK portal">
                <span>W</span>
                <button type="button" className="work-gateway-letter" onClick={openArchiveDesktop} aria-label="Open the interactive MuraliOS desktop"><span>O</span><i><ArrowUpRight size={21} /></i></button>
                <span>R</span><span>K</span>
              </div>
              <span className="work-portal-hint"><i /> HOVER OR TAP THE O TO OPEN THE HIDDEN DESKTOP</span>
            </motion.div>
          </motion.div>

          <HeroOrbit
            sceneRef={heroSceneRef}
            onPointerMove={handleHeroPointerMove}
            onPointerLeave={resetHeroPointer}
            style={{ y: heroVisualLift, rotate: heroVisualRotate }}
            onExploreProjects={() => goTo('projects')}
            onExploreSkills={() => goTo('skills')}
          />

          <div className="hero-bottom-note"><span>SCROLL TO EXPLORE</span><ArrowDown size={15} /><span className="note-line" /></div>
        </section>

        <div className="marquee-band" aria-label="Areas of interest">
          <div className="marquee-track">{Array.from({ length: 2 }, (_, i) => <span key={i}>SYSTEMS <i>✳</i> DATA <i>✳</i> GEOSPATIAL <i>✳</i> AI-ASSISTED PRODUCTS <i>✳</i> INTERACTIVE 3D <i>✳</i> CLOUD <i>✳</i></span>)}</div>
        </div>

        <section className="content-section about-section" id="about">
          <Reveal className="section-topline" distance={14}><span>01 / THE ORIGIN · ABOUT ME</span><span>THE PERSON BEHIND THE PROJECTS</span></Reveal>
          <div className="about-layout">
            <Reveal className="about-statement" direction="left">
              <h2>Curious by nature.<br /><span>Builder by habit.</span></h2>
              <p className="about-lead">I like getting to the bottom of how things work — then turning that understanding into something useful.</p>
            </Reveal>
            <Reveal className="about-story" direction="right" delay={0.1}>
              <p>I'm a Computer Science & Engineering student at <strong>PES University</strong>, Bengaluru. My interests move between low-level programming, graph algorithms, geospatial intelligence, AI-assisted products, and the interfaces that bring them together.</p>
              <p>Some days that means reasoning about memory and scheduling in C. Other days it's exploring satellite data, building a full-stack app, or turning a graph into an interactive 3D space. I enjoy the process of learning a new domain and making its complexity easier to explore.</p>
              <div className="about-signoff"><span className="signoff-mark">M.</span><span>Always learning. Always building.</span><ArrowUpRight size={15} /></div>
            </Reveal>
          </div>
          <Reveal className="stat-ribbon" delay={0.12} distance={18}>
            <div><b>06</b><span>PROJECTS IN THE WORKSHOP</span></div>
            <div><b>05</b><span>TECHNICAL DOMAINS</span></div>
            <div><b>02</b><span>HACKATHON CREDENTIALS</span></div>
            <div><b>∞</b><span>THINGS LEFT TO LEARN</span></div>
          </Reveal>
        </section>

        <section className="content-section skills-section" id="skills">
          <Reveal className="section-topline" distance={14}><span>02 / THE SPELLBOOK · TOOLKIT</span><span>TOOLS ARE A MEANS, NOT THE POINT</span></Reveal>
          <Reveal className="section-intro-row" direction="left"><h2>A growing spellbook<br /><span>of useful tools.</span></h2><p>A practical toolkit shaped by coursework, experiments, hackathons, and projects. I'm always adding something new to the mix.</p></Reveal>
          <div className="skills-board">
            {skills.map((group, index) => <motion.article className={`skill-tile skill-tile-${index + 1}`} key={group.group} initial={{ opacity: 0, y: 22, scale: .985 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: .2 }} transition={{ delay: index * .08, duration: .65, ease }}>
              <div className="skill-tile-top"><span>0{index + 1}</span><span className="skill-art-caption">{['LANGUAGE LAYER', 'INTERFACE LAYER', 'SERVICE LAYER', 'ANALYSIS LAYER', 'TOOLCHAIN'][index]}</span></div>
              <SkillArtwork index={index} />
              <h3>{group.group}</h3>
              <div className="skill-chip-list">{group.items.map((item) => <span key={item}>{item}</span>)}</div>
            </motion.article>)}
            <motion.article className="skill-tile skill-next-tile" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .18 }} transition={{ duration: .55, delay: .28 }}><span className="mini-overline">CURRENTLY EXPLORING</span><div className="next-orbit"><i /><i /><i /></div><h3>Cloud architecture<br />& AWS.</h3><p>Building, deploying, learning — one experiment at a time.</p><span className="tile-arrow">↗</span></motion.article>
          </div>
        </section>

        <section className="content-section projects-section" id="projects">
          <Reveal className="section-topline" distance={14}><span>03 / THE ARTIFACTS · SELECTED WORK</span><span>IDEAS MADE TANGIBLE</span></Reveal>
          <Reveal className="projects-heading-row" direction="left"><div><h2>Things I've brought<br /><span>into the world.</span></h2><p>Learning projects, experiments, and ideas turned into working prototypes.</p></div><div className="projects-counter"><b>06</b><span>PROJECTS<br />& COUNTING</span></div></Reveal>
          <Reveal className="project-filter-row" distance={12} delay={0.08} role="group" aria-label="Filter projects">
            {filters.map((filter) => <button key={filter} className={projectFilter === filter ? 'active' : ''} onClick={() => setProjectFilter(filter)}>{filter}<span>{filter === 'All work' ? projects.length : projects.filter((project) => filter === 'Product & AI' ? /AI|EdTech|FinTech|agent/i.test(project.category) : filter === 'Data & 3D' ? /Geospatial|Graph|3D|Data/i.test(project.category) : /Operating systems|DevOps|SRE|C programming/i.test(project.category)).length}</span></button>)}
          </Reveal>
          <div className="projects-gallery">
            {visibleProjects.map((project) => {
              const originalIndex = projects.findIndex((item) => item.name === project.name);
              return <motion.article layout className={`project-showcase project-showcase-${originalIndex}`} key={project.name} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .08 }} transition={{ duration: .45 }}>
                <button className="project-art-button" onClick={() => setSelectedProject(project)} aria-label={`Open ${project.name} project details`}><ProjectArtwork index={originalIndex} /><span className="art-open"><ArrowUpRight size={18} /></span></button>
                <div className="project-showcase-info"><div className="project-showcase-meta"><span>{project.number} / 06</span><span>{project.category}</span></div><button className="project-title-button" onClick={() => setSelectedProject(project)}><h3>{project.name}</h3><ArrowUpRight size={19} /></button><p>{project.description}</p><div className="project-showcase-bottom"><div className="project-techline">{project.details.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div><div className="project-links"><button onClick={() => setSelectedProject(project)}>Case notes <ArrowRight size={13} /></button>{project.github && <a href={project.github} target="_blank" rel="noreferrer" aria-label={`View ${project.name} source`}><Github size={15} /></a>}</div></div></div>
              </motion.article>;
            })}
          </div>
          <Reveal className="project-endnote" distance={16}><span>✳</span><p>Each project is a snapshot of a learning curve. Some are prototypes, some are still evolving — all of them taught me something worth keeping.</p></Reveal>
        </section>

        <section className="approach-band" aria-label="How I approach building">
          <Reveal className="approach-band-inner" distance={22}><span className="mini-overline">THE BUILDING RITUAL</span><div className="approach-steps"><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05, duration: 0.6 }}><b>01</b><h3>Understand</h3><p>Get curious about the problem before reaching for a tool.</p></motion.div><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.13, duration: 0.6 }}><b>02</b><h3>Explore</h3><p>Break complex ideas into pieces I can test and reason about.</p></motion.div><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.21, duration: 0.6 }}><b>03</b><h3>Build</h3><p>Turn the moving parts into a working, usable experience.</p></motion.div><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.29, duration: 0.6 }}><b>04</b><h3>Refine</h3><p>Keep iterating until the details feel as considered as the idea.</p></motion.div></div></Reveal>
        </section>

        <SidequestSection />

        <section className="content-section journey-section" id="journey">
          <Reveal className="section-topline" distance={14}><span>05 / THE QUEST LOG · MY JOURNEY</span><span>SMALL STEPS. REAL PROGRESS.</span></Reveal>
          <div className="journey-layout"><Reveal className="journey-heading" direction="left"><h2>Still early.<br /><span>Already building.</span></h2><p>Some milestones that mark the path so far — with plenty more ahead.</p></Reveal><div className="journey-list">{milestones.map((item, index) => <motion.article className="journey-item" key={item.title} initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .2 }} transition={{ delay: index * .07 }}><span className="journey-index">0{index + 1}</span><div><span className="journey-date">{item.date} / {item.type}</span><h3>{item.title}</h3><p>{item.detail}</p></div><span className="journey-arrow"><ArrowUpRight size={16} /></span></motion.article>)}</div></div>
        </section>

        <section className="content-section certificates-section" id="credentials">
          <Reveal className="section-topline" distance={14}><span>06 / THE RELICS · CERTIFICATES</span><span>PROOF OF SHOWING UP</span></Reveal>
          <Reveal className="section-intro-row" direction="left"><h2>Milestones worth<br /><span>framing.</span></h2><p>Hackathons are where ideas meet a deadline. These are two recent moments from that journey.</p></Reveal>
          <div className="certificate-gallery">{certificates.map((certificate, index) => <motion.article className="certificate-display" key={certificate.title} initial={{ opacity: 0, y: 28, scale: 0.985 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: .16 }} transition={{ duration: .65, delay: index * .12 }}><a className="certificate-preview" href={certificate.file} target="_blank" rel="noreferrer"><img src={certificate.image} alt={`${certificate.title} certificate preview`} loading="lazy" /><span className="certificate-zoom"><ArrowUpRight size={18} /> VIEW CERTIFICATE</span></a><div className="certificate-info"><span className="mini-overline">{certificate.label} / 0{index + 1}</span><h3>{certificate.title}</h3><p>{certificate.issuer}</p><span className="certificate-date">{certificate.date}</span></div></motion.article>)}</div>
        </section>

        <section className="contact-section" id="contact">
          <Reveal className="contact-topline" distance={14}><span>07 / OPEN A PORTAL · CONTACT</span><span>GOOD THINGS START WITH A CONVERSATION</span></Reveal>
          <Reveal className="contact-content" distance={28} duration={0.85}><span className="contact-asterisk">✳</span><h2>Have a good<br /><span>problem?</span></h2><p>I'm always up for interesting ideas, thoughtful collaborations, and opportunities to learn by building.</p><div className="contact-actions"><a className="contact-email" href={`mailto:${profile.email}`}>{profile.email} <ArrowUpRight size={19} /></a><button className="copy-email" onClick={copyEmail}>{copied ? <><Check size={14} /> Copied</> : 'Copy email'}</button></div></Reveal>
          <Reveal className="contact-bottom" distance={12} delay={0.08}><div className="contact-socials"><a href={profile.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a><a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn</a></div><span>BASED IN BENGALURU, INDIA <i /> OPEN TO WHAT'S NEXT</span></Reveal>
        </section>
      </main>

      <footer className="site-footer"><a className="footer-brand" href="#home"><span className="brand-monogram">M<span>.</span></span><span><b>Murali Manohar Vatlapati</b><small>BUILT WITH CURIOSITY.</small></span></a><span className="footer-mid">A SMALL CORNER OF THE INTERNET / 2026</span><a href="#home" className="back-top">BACK TO TOP ↑</a></footer>

      <AnimatePresence>{introVisible && <PortfolioIntro onEnter={finishIntro} />}</AnimatePresence>
      <AnimatePresence>
        {revealEffect && (
          <motion.div
            className="homepage-reveal-sweep"
            initial={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            animate={{ opacity: 0, scale: 1.045, filter: 'blur(10px)' }}
            transition={{ duration: 1.55, ease: [0.76, 0, 0.24, 1] }}
            onAnimationComplete={() => setRevealEffect(false)}
            aria-hidden="true"
          >
            <span className="homepage-reveal-ring homepage-reveal-ring-one" />
            <span className="homepage-reveal-ring homepage-reveal-ring-two" />
            <span className="homepage-reveal-caption"><i /> THE ARCHIVE IS OPENING</span>
          </motion.div>
        )}
      </AnimatePresence>
      <TerminalWindow isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />
      <MuraliOSDesktop isOpen={desktopOpen} launchOrigin={desktopLaunchOrigin} onClose={() => setDesktopOpen(false)} onOpenTerminal={() => setTerminalOpen(true)} currentTheme={theme} onThemeChange={setTheme} />
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}

export default App;
