import React from 'react';
import ReactDOM from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import App from './App.jsx';
import './styles.css';
import './visual-refresh.css';
import './architecture-theme.css';
import './reference-design.css';
import './juan-mora-refresh.css';
import './scroll-story-motion.css';
import './interaction-updates.css';
import './final-experience.css';
import './hero-atmosphere.css';
import './astral-archive.css';
import './intro-sequence.css';
import './editorial-contrast.css';
import './three-intro.css';
import './precision-fixes.css';
import './portfolio-reveal.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </React.StrictMode>,
);

