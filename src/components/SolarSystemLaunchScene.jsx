import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const clamp01 = (value) => Math.max(0, Math.min(1, value));
const smooth = (value) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

function seededRandom(seed = 19) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function makePlanetTexture(kind, seed = 11) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const random = seededRandom(seed);
  const palettes = {
    mercury: ['#77736d', '#aaa197', '#55534f'],
    venus: ['#b98a58', '#e2c28f', '#8c6547'],
    mars: ['#a9583d', '#d28a68', '#713b2c'],
    jupiter: ['#c99c76', '#ead5b7', '#966a50'],
    saturn: ['#cbb48d', '#f0dfbb', '#927b5e'],
    uranus: ['#8abac0', '#c1e1df', '#5e929d'],
    neptune: ['#315f9c', '#71a0ca', '#1e3c72'],
    moon: ['#777b80', '#b7b9b7', '#575c61'],
  };
  const colors = palettes[kind] || palettes.mercury;
  const gradient = ctx.createLinearGradient(0, 0, 0, 256);
  gradient.addColorStop(0, colors[1]);
  gradient.addColorStop(.48, colors[0]);
  gradient.addColorStop(1, colors[2]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 256);

  if (kind === 'jupiter' || kind === 'saturn' || kind === 'uranus' || kind === 'neptune') {
    const bandCount = kind === 'jupiter' ? 25 : kind === 'saturn' ? 19 : 13;
    for (let i = 0; i < bandCount; i += 1) {
      const y = (i / bandCount) * 256;
      const bandHeight = 2 + random() * (kind === 'jupiter' ? 13 : 9);
      ctx.globalAlpha = .09 + random() * .22;
      ctx.fillStyle = i % 2 ? colors[1] : colors[2];
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= 512; x += 32) {
        ctx.lineTo(x, y + Math.sin(x * .018 + i) * (2 + random() * 3));
      }
      ctx.lineTo(512, y + bandHeight);
      ctx.lineTo(0, y + bandHeight);
      ctx.closePath();
      ctx.fill();
    }
    if (kind === 'jupiter') {
      ctx.globalAlpha = .42;
      ctx.fillStyle = '#a95d48';
      ctx.beginPath();
      ctx.ellipse(340, 148, 24, 10, -.14, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    for (let i = 0; i < 240; i += 1) {
      const x = random() * 512;
      const y = random() * 256;
      const radius = 1 + random() * (kind === 'mercury' || kind === 'moon' ? 8 : 4);
      const crater = ctx.createRadialGradient(x - radius * .24, y - radius * .24, radius * .06, x, y, radius);
      crater.addColorStop(0, 'rgba(255,255,255,.20)');
      crater.addColorStop(.55, 'rgba(25,18,15,.08)');
      crater.addColorStop(1, 'rgba(15,12,10,0)');
      ctx.globalAlpha = .2 + random() * .34;
      ctx.fillStyle = crater;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

function makeGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(128, 128, 7, 128, 128, 126);
  gradient.addColorStop(0, 'rgba(255,239,205,.88)');
  gradient.addColorStop(.18, 'rgba(255,188,112,.46)');
  gradient.addColorStop(.48, 'rgba(224,123,69,.12)');
  gradient.addColorStop(1, 'rgba(224,123,69,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeStarField() {
  const random = seededRandom(20261105);
  const count = 2100;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const palette = [new THREE.Color('#d9e5ef'), new THREE.Color('#f1d9c7'), new THREE.Color('#f2eee7')];
  for (let i = 0; i < count; i += 1) {
    const radius = 28 + random() * 54;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi);
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    const color = palette[Math.floor(random() * palette.length)];
    const brightness = .28 + random() * .54;
    colors[i * 3] = color.r * brightness;
    colors[i * 3 + 1] = color.g * brightness;
    colors[i * 3 + 2] = color.b * brightness;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({ size: .035, vertexColors: true, transparent: true, opacity: .75, sizeAttenuation: true, depthWrite: false });
  return new THREE.Points(geometry, material);
}

function makeOrbit(radius, color = 0x9aa6b3) {
  const points = [];
  for (let i = 0; i <= 240; i += 1) {
    const angle = (i / 240) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: .24 });
  const line = new THREE.LineLoop(geometry, material);
  return line;
}

export default function SolarSystemLaunchScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance', stencil: false, depth: true });
    } catch {
      mount.classList.add('is-fallback');
      return undefined;
    }

    let disposed = false;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    const disposables = [];
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.setClearColor(0x05070d, 0);
    renderer.domElement.className = 'os-solar-canvas';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070d, .0016);
    const camera = new THREE.PerspectiveCamera(42, 1, .1, 180);
    camera.position.set(0, 10.8, 27);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.HemisphereLight(0xc4d2e2, 0x10131b, .42));
    const ambient = new THREE.AmbientLight(0x9ba9bf, .2);
    scene.add(ambient);

    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(.72, 64, 48),
      new THREE.MeshBasicMaterial({ color: 0xffc77e }),
    );
    scene.add(sun);
    disposables.push(sun.geometry, sun.material);
    const sunGlowTexture = makeGlowTexture();
    disposables.push(sunGlowTexture);
    const sunGlowMaterial = new THREE.SpriteMaterial({ map: sunGlowTexture, color: 0xffbd79, transparent: true, opacity: .9, blending: THREE.AdditiveBlending, depthWrite: false });
    const sunGlow = new THREE.Sprite(sunGlowMaterial);
    disposables.push(sunGlowMaterial);
    sunGlow.scale.set(5.2, 5.2, 1);
    scene.add(sunGlow);
    const sunLight = new THREE.PointLight(0xffd4a0, 2.8, 42, 1.4);
    scene.add(sunLight);

    const starField = makeStarField();
    scene.add(starField);
    disposables.push(starField.geometry, starField.material);

    const orbitColors = [0xb6a99e, 0xc7a48d, 0x8ea6b1, 0xb98b77];
    const planetSpecs = [
      { name: 'Mercury', orbit: 2.05, radius: .105, kind: 'mercury', speed: .42, seed: 11, phase: .4 },
      { name: 'Venus', orbit: 2.9, radius: .16, kind: 'venus', speed: .29, seed: 22, phase: 2.1 },
      { name: 'Earth', orbit: 3.9, radius: .18, kind: 'earth', speed: .22, seed: 33, phase: 4.2 },
      { name: 'Mars', orbit: 4.95, radius: .135, kind: 'mars', speed: .17, seed: 44, phase: 1.3 },
      { name: 'Jupiter', orbit: 6.75, radius: .43, kind: 'jupiter', speed: .095, seed: 55, phase: 3.15 },
      { name: 'Saturn', orbit: 8.75, radius: .36, kind: 'saturn', speed: .071, seed: 66, phase: .8 },
      { name: 'Uranus', orbit: 10.75, radius: .25, kind: 'uranus', speed: .05, seed: 77, phase: 5.4 },
      { name: 'Neptune', orbit: 12.4, radius: .24, kind: 'neptune', speed: .038, seed: 88, phase: 2.55 },
    ];

    const planetSystems = [];
    planetSpecs.forEach((spec, index) => {
      const orbitLine = makeOrbit(spec.orbit, orbitColors[index % orbitColors.length]);
      scene.add(orbitLine);
      disposables.push(orbitLine.geometry, orbitLine.material);

      const orbitRoot = new THREE.Group();
      orbitRoot.rotation.y = spec.phase;
      scene.add(orbitRoot);

      const tilt = new THREE.Group();
      tilt.rotation.z = index % 2 ? .05 : -.035;
      orbitRoot.add(tilt);
      const geometry = new THREE.SphereGeometry(spec.radius, spec.kind === 'jupiter' || spec.kind === 'saturn' ? 48 : 36, 28);
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: makePlanetTexture(spec.kind, spec.seed),
        roughness: .88,
        metalness: .015,
      });
      const body = new THREE.Mesh(geometry, material);
      body.position.x = spec.orbit;
      tilt.add(body);
      disposables.push(geometry, material, material.map);

      if (spec.kind === 'saturn') {
        const ringGeometry = new THREE.RingGeometry(spec.radius * 1.35, spec.radius * 2.2, 88);
        const ringMaterial = new THREE.MeshStandardMaterial({ color: 0xcab08b, roughness: .95, metalness: .02, side: THREE.DoubleSide, transparent: true, opacity: .82 });
        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = Math.PI / 2 + .12;
        body.add(rings);
        disposables.push(ringGeometry, ringMaterial);
      }

      if (spec.kind === 'earth') {
        const loader = new THREE.TextureLoader();
        loader.load('/textures/earth-surface.jpg', (texture) => {
          if (disposed) { texture.dispose(); return; }
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.wrapS = THREE.RepeatWrapping;
          material.map = texture;
          material.needsUpdate = true;
          disposables.push(texture);
        });
        const cloudGeometry = new THREE.SphereGeometry(spec.radius * 1.025, 32, 24);
        const cloudMaterial = new THREE.MeshLambertMaterial({ color: 0xf3f2ef, transparent: true, opacity: .36, alphaTest: .08, depthWrite: false });
        const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
        body.add(clouds);
        disposables.push(cloudGeometry, cloudMaterial);
        loader.load('/textures/earth-clouds.png', (texture) => {
          if (disposed) { texture.dispose(); return; }
          texture.colorSpace = THREE.NoColorSpace;
          texture.wrapS = THREE.RepeatWrapping;
          cloudMaterial.alphaMap = texture;
          cloudMaterial.needsUpdate = true;
          disposables.push(texture);
        });
        planetSystems.push({ orbitRoot, body, clouds, speed: spec.speed, radius: spec.orbit, kind: spec.kind });
        return;
      }

      planetSystems.push({ orbitRoot, body, speed: spec.speed, radius: spec.orbit, kind: spec.kind });
    });

    // A quiet asteroid belt adds scale between the inner and outer planets.
    const random = seededRandom(404);
    const asteroidCount = 850;
    const asteroidPositions = new Float32Array(asteroidCount * 3);
    const asteroidColors = new Float32Array(asteroidCount * 3);
    const asteroidPalette = [new THREE.Color('#a99c91'), new THREE.Color('#887b72'), new THREE.Color('#c0a58d')];
    for (let i = 0; i < asteroidCount; i += 1) {
      const angle = random() * Math.PI * 2;
      const radius = 5.55 + random() * .58;
      asteroidPositions[i * 3] = Math.cos(angle) * radius;
      asteroidPositions[i * 3 + 1] = (random() - .5) * .18;
      asteroidPositions[i * 3 + 2] = Math.sin(angle) * radius;
      const color = asteroidPalette[Math.floor(random() * asteroidPalette.length)];
      asteroidColors[i * 3] = color.r;
      asteroidColors[i * 3 + 1] = color.g;
      asteroidColors[i * 3 + 2] = color.b;
    }
    const asteroidGeometry = new THREE.BufferGeometry();
    asteroidGeometry.setAttribute('position', new THREE.BufferAttribute(asteroidPositions, 3));
    asteroidGeometry.setAttribute('color', new THREE.BufferAttribute(asteroidColors, 3));
    const asteroidMaterial = new THREE.PointsMaterial({ size: .026, vertexColors: true, transparent: true, opacity: .56, sizeAttenuation: true, depthWrite: false });
    const asteroidBelt = new THREE.Points(asteroidGeometry, asteroidMaterial);
    scene.add(asteroidBelt);
    disposables.push(asteroidGeometry, asteroidMaterial);

    let elapsed = 0;
    const startPosition = new THREE.Vector3(0, 10.8, 27);
    const endPosition = new THREE.Vector3(1.15, 7.6, 19.1);
    const lookTarget = new THREE.Vector3(0, 0, 0);
    const nextCameraPosition = new THREE.Vector3();
    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    resizeObserver?.observe(mount);
    window.addEventListener('resize', resize, { passive: true });
    resize();
    const clock = new THREE.Clock();

    renderer.setAnimationLoop(() => {
      const delta = Math.min(clock.getDelta(), .05);
      elapsed += delta;
      const cameraMix = reducedMotion ? 1 : smooth(elapsed / 4.15);
      nextCameraPosition.lerpVectors(startPosition, endPosition, cameraMix);
      nextCameraPosition.x += Math.sin(elapsed * .16) * .11;
      nextCameraPosition.y += Math.sin(elapsed * .21) * .08;
      camera.position.copy(nextCameraPosition);
      camera.lookAt(lookTarget);

      if (!reducedMotion) {
        sun.rotation.y = elapsed * .055;
        planetSystems.forEach((system, index) => {
          system.orbitRoot.rotation.y += delta * system.speed;
          system.body.rotation.y += delta * (.11 + index * .012);
          if (system.clouds) system.clouds.rotation.y = elapsed * .19;
        });
        asteroidBelt.rotation.y = elapsed * .008;
        starField.rotation.y = elapsed * .0014;
      }
      renderer.render(scene, camera);
    });

    return () => {
      disposed = true;
      renderer.setAnimationLoop(null);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', resize);
      disposables.forEach((item) => item?.dispose?.());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="os-solar-system-scene" aria-hidden="true" />;
}
