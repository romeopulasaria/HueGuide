import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { DEPTH_DEFAULT_SWATCHES } from '../utils/skinProfile';
import { SkinDepth, Undertone } from '../types';

interface ComplexionSceneProps {
  depth: SkinDepth;
  undertone: Undertone;
  customHex?: string | null;
  previewDepth?: SkinDepth | null;
  previewUndertone?: Undertone | null;
  accentHex?: string;
  className?: string;
  label?: string;
}

const undertoneAdjustments: Record<Undertone, { hue: number; saturation: number; lightness: number }> = {
  cool: { hue: -0.012, saturation: 0.025, lightness: 0.005 },
  neutral: { hue: 0, saturation: 0, lightness: 0 },
  warm: { hue: 0.012, saturation: 0.03, lightness: 0.005 },
  olive: { hue: -0.022, saturation: -0.01, lightness: -0.002 },
  uncertain: { hue: 0, saturation: -0.01, lightness: 0 },
};

function complexionColor(depth: SkinDepth, undertone: Undertone, customHex?: string | null) {
  const colour = new THREE.Color(customHex || DEPTH_DEFAULT_SWATCHES[depth] || DEPTH_DEFAULT_SWATCHES.medium);
  const adjustment = undertoneAdjustments[undertone];
  colour.offsetHSL(adjustment.hue, adjustment.saturation, adjustment.lightness);
  return colour;
}

/**
 * A lightweight, reusable Three.js complexion study. It deliberately represents
 * complexion as a stylised visual reference rather than a photographic identity.
 */
export const ComplexionScene: React.FC<ComplexionSceneProps> = ({
  depth,
  undertone,
  customHex,
  previewDepth = null,
  previewUndertone = null,
  accentHex = '#A85D63',
  className = '',
  label = 'Interactive complexion study',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<THREE.Group | null>(null);
  const skinMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const cheekMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const lipMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const targetSkinRef = useRef(new THREE.Color('#CAA075'));
  const targetCheekRef = useRef(new THREE.Color('#B96F6C'));
  const targetLipRef = useRef(new THREE.Color(accentHex));
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef({ active: false, x: 0, y: 0, rotationY: 0, rotationX: 0 });
  const zoomRef = useRef(1);
  const [webglAvailable, setWebglAvailable] = useState(true);

  const activeDepth = previewDepth || depth;
  const activeUndertone = previewUndertone || undertone;
  // A hovered depth is a deliberate visual preview, so it temporarily takes
  // precedence over an optional custom swatch. The committed custom swatch is
  // restored as soon as the pointer leaves the control.
  const activeCustomHex = previewDepth ? null : customHex;

  useEffect(() => {
    targetSkinRef.current.copy(complexionColor(activeDepth, activeUndertone, activeCustomHex));
    const cheek = complexionColor(activeDepth, activeUndertone, activeCustomHex);
    cheek.offsetHSL(0.985, 0.06, 0.015);
    targetCheekRef.current.copy(cheek);
  }, [activeDepth, activeUndertone, activeCustomHex]);

  useEffect(() => {
    targetLipRef.current.set(accentHex);
  }, [accentHex]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      setWebglAvailable(false);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(27, 1, 0.1, 100);
    camera.position.set(0, 0.15, 5.2);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const studio = new THREE.HemisphereLight(0xfff7eb, 0x6c5438, 2.1);
    scene.add(studio);
    const key = new THREE.DirectionalLight(0xfff6e8, 2.4);
    key.position.set(-3.4, 4.3, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xf3d9cf, 1.15);
    fill.position.set(3.8, 1.2, 3);
    scene.add(fill);

    const head = new THREE.Group();
    head.position.y = 0.05;
    headRef.current = head;
    scene.add(head);

    const skinMaterial = new THREE.MeshStandardMaterial({
      color: targetSkinRef.current,
      roughness: 0.7,
      metalness: 0,
    });
    skinMaterialRef.current = skinMaterial;
    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(1.02, 48, 36), skinMaterial);
    headMesh.scale.set(0.78, 1.08, 0.76);
    head.add(headMesh);

    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.31, 0.43, 0.9, 32),
      skinMaterial
    );
    neck.position.set(0, -1.18, -0.08);
    head.add(neck);

    const cheekMaterial = new THREE.MeshStandardMaterial({
      color: targetCheekRef.current,
      roughness: 0.83,
      transparent: true,
      opacity: 0.3,
    });
    cheekMaterialRef.current = cheekMaterial;
    const cheekGeometry = new THREE.SphereGeometry(0.28, 24, 18);
    const leftCheek = new THREE.Mesh(cheekGeometry, cheekMaterial);
    leftCheek.scale.set(1.45, 0.66, 0.22);
    leftCheek.position.set(-0.45, -0.1, 0.62);
    const rightCheek = leftCheek.clone();
    rightCheek.position.x = 0.45;
    head.add(leftCheek, rightCheek);

    const featureMaterial = new THREE.MeshStandardMaterial({ color: '#382620', roughness: 0.8 });
    const eyeWhite = new THREE.MeshStandardMaterial({ color: '#f9f3eb', roughness: 0.55 });
    const eyeGeometry = new THREE.SphereGeometry(0.105, 24, 16);
    const leftEye = new THREE.Mesh(eyeGeometry, eyeWhite);
    leftEye.scale.set(1.3, 0.66, 0.5);
    leftEye.position.set(-0.28, 0.2, 0.72);
    const rightEye = leftEye.clone();
    rightEye.position.x = 0.28;
    head.add(leftEye, rightEye);

    const pupilGeometry = new THREE.SphereGeometry(0.048, 16, 12);
    const leftPupil = new THREE.Mesh(pupilGeometry, featureMaterial);
    leftPupil.position.set(-0.28, 0.2, 0.79);
    const rightPupil = leftPupil.clone();
    rightPupil.position.x = 0.28;
    head.add(leftPupil, rightPupil);

    const browGeometry = new THREE.BoxGeometry(0.31, 0.035, 0.045);
    const leftBrow = new THREE.Mesh(browGeometry, featureMaterial);
    leftBrow.position.set(-0.29, 0.4, 0.72);
    leftBrow.rotation.z = -0.08;
    const rightBrow = leftBrow.clone();
    rightBrow.position.x = 0.29;
    rightBrow.rotation.z = 0.08;
    head.add(leftBrow, rightBrow);

    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 18), skinMaterial);
    nose.scale.set(0.42, 1.18, 0.52);
    nose.position.set(0, -0.03, 0.76);
    head.add(nose);

    const lipMaterial = new THREE.MeshStandardMaterial({ color: accentHex, roughness: 0.48, metalness: 0.02 });
    lipMaterialRef.current = lipMaterial;
    const lipShape = new THREE.Shape();
    lipShape.moveTo(-0.18, 0);
    lipShape.quadraticCurveTo(-0.08, 0.08, 0, 0);
    lipShape.quadraticCurveTo(0.08, 0.08, 0.18, 0);
    lipShape.quadraticCurveTo(0.08, -0.12, 0, -0.1);
    lipShape.quadraticCurveTo(-0.08, -0.12, -0.18, 0);
    const lips = new THREE.Mesh(new THREE.ShapeGeometry(lipShape), lipMaterial);
    lips.position.set(0, -0.42, 0.76);
    lips.scale.set(0.9, 0.72, 1);
    head.add(lips);

    const earGeometry = new THREE.SphereGeometry(0.2, 24, 16);
    const leftEar = new THREE.Mesh(earGeometry, skinMaterial);
    leftEar.scale.set(0.35, 1, 0.55);
    leftEar.position.set(-0.78, 0, 0);
    const rightEar = leftEar.clone();
    rightEar.position.x = 0.78;
    head.add(leftEar, rightEar);

    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clock = new THREE.Clock();
    let animationFrame = 0;
    const animate = () => {
      animationFrame = window.requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const headObject = headRef.current;
      if (!headObject) return;

      skinMaterial.color.lerp(targetSkinRef.current, 0.055);
      cheekMaterial.color.lerp(targetCheekRef.current, 0.055);
      lipMaterial.color.lerp(targetLipRef.current, 0.07);
      const idle = reduceMotion ? 0 : Math.sin(elapsed * 0.55) * 0.025;
      const parallaxX = reduceMotion ? 0 : targetRotationRef.current.x;
      const parallaxY = reduceMotion ? 0 : targetRotationRef.current.y;
      headObject.rotation.x += ((dragRef.current.rotationX * 0.26 + parallaxX + idle * 0.35) - headObject.rotation.x) * 0.08;
      headObject.rotation.y += ((dragRef.current.rotationY * 0.48 + parallaxY + idle) - headObject.rotation.y) * 0.08;
      headObject.scale.lerp(new THREE.Vector3(zoomRef.current, zoomRef.current, zoomRef.current), 0.08);
      renderer.render(scene, camera);
    };
    animate();

    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      const normalizedX = (event.clientX - rect.left) / rect.width - 0.5;
      const normalizedY = (event.clientY - rect.top) / rect.height - 0.5;
      targetRotationRef.current = { x: normalizedY * -0.08, y: normalizedX * 0.08 };
      if (dragRef.current.active) {
        dragRef.current.rotationY = (event.clientX - dragRef.current.x) * 0.008;
        dragRef.current.rotationX = (event.clientY - dragRef.current.y) * -0.004;
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      dragRef.current.active = true;
      dragRef.current.x = event.clientX;
      dragRef.current.y = event.clientY;
      mount.setPointerCapture?.(event.pointerId);
    };
    const onPointerUp = () => {
      dragRef.current.active = false;
      dragRef.current.rotationX = 0;
      dragRef.current.rotationY = 0;
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      zoomRef.current = THREE.MathUtils.clamp(zoomRef.current - event.deltaY * 0.00045, 0.94, 1.08);
    };
    mount.addEventListener('pointermove', onPointerMove);
    mount.addEventListener('pointerdown', onPointerDown);
    mount.addEventListener('pointerup', onPointerUp);
    mount.addEventListener('pointerleave', onPointerUp);
    mount.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      mount.removeEventListener('pointermove', onPointerMove);
      mount.removeEventListener('pointerdown', onPointerDown);
      mount.removeEventListener('pointerup', onPointerUp);
      mount.removeEventListener('pointerleave', onPointerUp);
      mount.removeEventListener('wheel', onWheel);
      head.traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) object.material.forEach(material => material.dispose());
          else object.material.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      headRef.current = null;
    };
  }, []);

  if (!webglAvailable) {
    return (
      <div className={`complexion-fallback ${className}`} role="img" aria-label={`${label}. WebGL fallback swatch.`}>
        <div className="complexion-fallback-orb" style={{ backgroundColor: complexionColor(activeDepth, activeUndertone, activeCustomHex).getStyle() }} />
        <span>Visual preview unavailable</span>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className={`complexion-scene ${className}`}
      role="img"
      aria-label={`${label}. ${activeDepth.replace('-', ' ')} depth, ${activeUndertone} undertone.`}
      title="Drag gently to explore · Scroll to zoom"
    />
  );
};

