import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const clamp01 = (value) => Math.max(0, Math.min(1, value));
const smooth = (value) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

function seededRandom(seed = 29) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function createStarField() {
  const random = seededRandom(2026);
  const count = 1500;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const baseColors = [
    new THREE.Color(0xc8d6e2),
    new THREE.Color(0xe7ddd1),
    new THREE.Color(0xf1eee8),
  ];

  for (let i = 0; i < count; i += 1) {
    const radius = 38 + random() * 72;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi);
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

    const color = baseColors[Math.floor(random() * baseColors.length)];
    const brightness = 0.22 + random() * 0.54;
    colors[i * 3] = color.r * brightness;
    colors[i * 3 + 1] = color.g * brightness;
    colors[i * 3 + 2] = color.b * brightness;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.012,
    vertexColors: true,
    transparent: true,
    opacity: 0.68,
    sizeAttenuation: true,
    depthWrite: false,
  });

  return new THREE.Points(geometry, material);
}

function createAtmosphere(radius) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius, 128, 96),
    new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(0x75a9cd) },
        uIntensity: { value: 0.46 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vViewPosition = -viewPosition.xyz;
          gl_Position = projectionMatrix * viewPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uIntensity;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDirection = normalize(vViewPosition);
          float fresnel = pow(1.0 - max(dot(normal, viewDirection), 0.0), 4.0);
          float limb = smoothstep(0.02, 0.88, fresnel);
          float alpha = limb * uIntensity;
          gl_FragColor = vec4(uColor, alpha);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
}

function prepareTexture(texture, colorSpace = THREE.NoColorSpace, anisotropy = 4) {
  texture.colorSpace = colorSpace;
  texture.anisotropy = anisotropy;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * A restrained orbital game-style opening. The planet uses a satellite-derived
 * Blue Marble surface map and mapped normal/specular/cloud layers. The camera
 * eases from a distant establishing shot into a low atmospheric pass; it never
 * tunnels through the solid planet or adds artificial rings/portal geometry.
 */
export default function ThreeIntroScene({ progress = 0, reducedMotion = false, closing = false }) {
  const mountRef = useRef(null);
  const progressRef = useRef(progress);
  const reducedMotionRef = useRef(reducedMotion);
  const closingRef = useRef(closing);
  progressRef.current = progress;
  reducedMotionRef.current = reducedMotion;
  closingRef.current = closing;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: false,
        antialias: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      });
    } catch {
      mount.classList.add('is-webgl-fallback');
      return undefined;
    }

    let disposed = false;
    const loadedTextures = [];
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.domElement.className = 'intro3d-webgl-canvas';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x03070d);
    scene.fog = new THREE.FogExp2(0x03070d, 0.0011);

    const camera = new THREE.PerspectiveCamera(31, 1, 0.045, 220);
    camera.position.set(0, 0.06, 11.8);
    camera.lookAt(1.08, 0, 0);

    // A soft ambient fill keeps the night side readable without flattening it.
    scene.add(new THREE.HemisphereLight(0x9eb4c9, 0x101720, 0.31));

    const sunlight = new THREE.DirectionalLight(0xfff1dc, 3.25);
    sunlight.position.set(-8.5, 4.7, 7.2);
    scene.add(sunlight);

    const nightFill = new THREE.DirectionalLight(0x7195b8, 0.28);
    nightFill.position.set(5.2, -2.4, -6.5);
    scene.add(nightFill);

    const planetCenter = new THREE.Vector3(1.62, -0.04, 0);
    const planet = new THREE.Group();
    planet.position.copy(planetCenter);
    planet.rotation.z = THREE.MathUtils.degToRad(-18.5);
    scene.add(planet);

    const earthRadius = 2.42;
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 160, 128);
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: new THREE.Color(0x526a82),
      shininess: 15,
      normalScale: new THREE.Vector2(0.7, -0.7),
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    planet.add(earth);

    // Two independently moving cloud decks create depth: a denser lower deck,
    // a sparse high cirrus layer, and a faint shadow pass over the surface.
    const cloudMaterial = new THREE.MeshPhongMaterial({
      color: 0xf5f7f8,
      transparent: true,
      opacity: 0.68,
      alphaTest: 0.055,
      depthWrite: false,
      side: THREE.DoubleSide,
      shininess: 2,
      specular: new THREE.Color(0x343d49),
    });
    const cloudLayer = new THREE.Mesh(
      new THREE.SphereGeometry(earthRadius * 1.014, 160, 128),
      cloudMaterial,
    );
    planet.add(cloudLayer);

    const highCloudMaterial = new THREE.MeshLambertMaterial({
      color: 0xdbe6ed,
      transparent: true,
      opacity: 0.28,
      alphaTest: 0.035,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const highCloudLayer = new THREE.Mesh(
      new THREE.SphereGeometry(earthRadius * 1.025, 144, 112),
      highCloudMaterial,
    );
    planet.add(highCloudLayer);

    const cloudShadowMaterial = new THREE.MeshLambertMaterial({
      color: 0x273440,
      transparent: true,
      opacity: 0.105,
      alphaTest: 0.07,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const cloudShadowLayer = new THREE.Mesh(
      new THREE.SphereGeometry(earthRadius * 1.002, 144, 112),
      cloudShadowMaterial,
    );
    planet.add(cloudShadowLayer);

    const atmosphere = createAtmosphere(earthRadius * 1.055);
    planet.add(atmosphere);

    const stars = createStarField();
    scene.add(stars);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const textureBase = 'https://raw.githubusercontent.com/mrdoob/three.js/r168/examples/textures/planets';

    const loadWithFallback = (remoteUrl, localUrl, onLoad, colorSpace = THREE.NoColorSpace) => {
      const attach = (texture) => {
        if (disposed) {
          texture.dispose();
          return;
        }
        prepareTexture(texture, colorSpace, anisotropy);
        loadedTextures.push(texture);
        onLoad(texture);
      };
      loader.load(
        remoteUrl,
        attach,
        undefined,
        () => {
          if (disposed) return;
          loader.load(
            localUrl,
            attach,
            undefined,
            () => {
              if (!disposed) mount.classList.add('has-texture-fallback');
            },
          );
        },
      );
    };

    // Real satellite-mosaic color map plus normal/specular data from the Three.js
    // planet texture set. Bundled procedural maps remain as offline fallbacks.
    loadWithFallback(
      `${textureBase}/earth_atmos_2048.jpg`,
      '/textures/earth-surface.jpg',
      (texture) => {
        earthMaterial.map = texture;
        earthMaterial.needsUpdate = true;
      },
      THREE.SRGBColorSpace,
    );

    loadWithFallback(
      `${textureBase}/earth_normal_2048.jpg`,
      '/textures/earth-height.jpg',
      (texture) => {
        if (texture.image?.src?.includes('earth_normal_2048')) {
          earthMaterial.normalMap = texture;
        } else {
          earthMaterial.bumpMap = texture;
          earthMaterial.bumpScale = 0.022;
        }
        earthMaterial.needsUpdate = true;
      },
    );

    loadWithFallback(
      `${textureBase}/earth_specular_2048.jpg`,
      '/textures/earth-height.jpg',
      (texture) => {
        // The remote map has bright ocean / dark land. Keep specular response subtle.
        if (texture.image?.src?.includes('earth_specular_2048')) {
          earthMaterial.specularMap = texture;
          earthMaterial.specular.setHex(0x455a70);
          earthMaterial.shininess = 11;
        }
        earthMaterial.needsUpdate = true;
      },
    );

    loadWithFallback(
      `${textureBase}/earth_clouds_1024.png`,
      '/textures/earth-clouds.png',
      (texture) => {
        // Cloud maps are coverage masks: sample their green channel as alpha,
        // rather than painting a pale rectangle over the entire globe.
        cloudMaterial.alphaMap = texture;
        cloudShadowMaterial.alphaMap = texture;
        cloudMaterial.opacity = 0.74;
        cloudShadowMaterial.opacity = 0.12;
        cloudMaterial.needsUpdate = true;
        cloudShadowMaterial.needsUpdate = true;
      },
    );

    loader.load('/textures/earth-clouds-high.png', (texture) => {
      if (disposed) { texture.dispose(); return; }
      prepareTexture(texture, THREE.NoColorSpace, anisotropy);
      loadedTextures.push(texture);
      highCloudMaterial.alphaMap = texture;
      highCloudMaterial.opacity = 0.32;
      highCloudMaterial.needsUpdate = true;
    });

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onPointerMove = (event) => {
      const bounds = mount.getBoundingClientRect();
      pointer.targetX = ((event.clientX - bounds.left) / Math.max(1, bounds.width) - 0.5) * 2;
      pointer.targetY = ((event.clientY - bounds.top) / Math.max(1, bounds.height) - 0.5) * 2;
    };
    const onPointerLeave = () => {
      pointer.targetX = 0;
      pointer.targetY = 0;
    };
    mount.addEventListener('pointermove', onPointerMove, { passive: true });
    mount.addEventListener('pointerleave', onPointerLeave, { passive: true });

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
    const startCamera = new THREE.Vector3(0.04, 0.08, 11.8);
    const approachCamera = new THREE.Vector3(0.96, 0.1, 5.1);
    const lowOrbitCamera = planetCenter.clone().add(new THREE.Vector3(-0.22, 0.12, 2.72));
    const startTarget = new THREE.Vector3(1.08, 0, 0);
    const approachTarget = planetCenter.clone();
    const lowOrbitTarget = planetCenter.clone().add(new THREE.Vector3(-0.56, -0.34, 0.22));
    const nextPosition = new THREE.Vector3();
    const nextTarget = new THREE.Vector3();
    let descent = 0;

    renderer.setAnimationLoop(() => {
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.elapsedTime;
      const motionAllowed = !reducedMotionRef.current;
      const approach = smooth(clamp01(progressRef.current / 100));

      if (closingRef.current) {
        descent = Math.min(1, descent + delta / (motionAllowed ? 2.25 : 0.12));
      }
      const descentEase = smooth(descent);

      pointer.x += (pointer.targetX - pointer.x) * 0.018;
      pointer.y += (pointer.targetY - pointer.y) * 0.018;

      if (motionAllowed) {
        // Earth rotates almost imperceptibly; the separate cloud deck moves slightly faster.
        planet.rotation.y = -0.24 + elapsed * 0.008;
        cloudLayer.rotation.y = elapsed * 0.0115;
        highCloudLayer.rotation.y = -elapsed * 0.0065;
        highCloudLayer.rotation.x = Math.sin(elapsed * 0.035) * 0.008;
        cloudShadowLayer.rotation.y = elapsed * 0.0115;
        stars.rotation.y = elapsed * 0.00035;
      }

      nextPosition.lerpVectors(startCamera, approachCamera, approach);
      nextTarget.lerpVectors(startTarget, approachTarget, approach);
      if (descentEase > 0) {
        nextPosition.lerp(lowOrbitCamera, descentEase);
        nextTarget.lerp(lowOrbitTarget, descentEase);
      }

      // Very small camera drift gives a hand-operated game-camera feel without wobble.
      const drift = motionAllowed ? Math.sin(elapsed * 0.22) * 0.007 : 0;
      nextPosition.x += pointer.x * 0.035 * (1 - descentEase) + drift;
      nextPosition.y -= pointer.y * 0.024 * (1 - descentEase);
      camera.position.copy(nextPosition);
      camera.lookAt(nextTarget);
      camera.fov = 31 + descentEase * 7.8;
      camera.updateProjectionMatrix();
      camera.rotateZ(-0.006 * descentEase + drift * 0.2);

      atmosphere.material.uniforms.uIntensity.value = 0.44 + approach * 0.1;
      renderer.toneMappingExposure = 1.08 + descentEase * 0.05;
      renderer.render(scene, camera);
    });

    return () => {
      disposed = true;
      renderer.setAnimationLoop(null);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', resize);
      mount.removeEventListener('pointermove', onPointerMove);
      mount.removeEventListener('pointerleave', onPointerLeave);
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      loadedTextures.forEach((texture) => texture.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="intro3d-webgl-host"
      aria-label="A three-dimensional Earth with satellite-derived surface imagery, layered cloud decks and a cinematic atmospheric approach"
    />
  );
}
