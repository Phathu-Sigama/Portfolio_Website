"use client";

import { useEffect, useRef } from "react";
import PsLogo from "./PsLogo";
import styles from "./SpinningLogo.module.css";

const MODEL_URL = "/logo.glb";
/** Seconds per full turn. */
const TURN_SECONDS = 3;

/**
 * The 3D PS logo (public/logo.glb), spinning.
 *
 * The flat pixel logo is rendered first and stays in place if anything goes wrong —
 * no JavaScript, no WebGL, a failed download — or if the visitor prefers reduced motion.
 * three.js is downloaded lazily, only when a spinning logo is actually going to be shown.
 *
 * `boot` is the start-up screen's logo: it is skipped when the start-up screen is skipped and
 * stops for good once that screen has gone. Without it the logo keeps spinning while visible.
 */
export default function SpinningLogo({ boot = false, className }: { boot?: boolean; className?: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    if (!box || !canvas) return;
    // Skip when this copy is hidden (other breakpoint), the start-up screen was already
    // seen this session, or motion should be reduced.
    if (box.clientWidth === 0) return;
    if (boot && document.documentElement.dataset.booted) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let cleanup = () => {};

    (async () => {
      const [THREE, { GLTFLoader }, { RoomEnvironment }] = await Promise.all([
        import("three"),
        import("three/examples/jsm/loaders/GLTFLoader.js"),
        import("three/examples/jsm/environments/RoomEnvironment.js"),
      ]);
      const gltf = await new GLTFLoader().loadAsync(MODEL_URL);
      if (cancelled) return;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(box.clientWidth, box.clientHeight, false);

      const scene = new THREE.Scene();
      // Soft studio reflections so the metallic grey reads as metal instead of black.
      const pmrem = new THREE.PMREMGenerator(renderer);
      const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = environment;
      scene.environmentIntensity = 0.75;
      const key = new THREE.DirectionalLight(0xffffff, 1.1);
      key.position.set(-4, 5, 8);
      scene.add(key);

      const model = gltf.scene;
      model.traverse((object) => {
        const material = (object as import("three").Mesh).material as
          | import("three").MeshStandardMaterial
          | undefined;
        // The model's indicator light is exported 4× over-bright, which clips to yellow on screen.
        // A faint glow keeps it the logo's lime green.
        if (material?.emissiveIntensity) material.emissiveIntensity = 0.15;
      });
      // Centre the model and fit it to the view.
      const bounds = new THREE.Box3().setFromObject(model);
      const size = bounds.getSize(new THREE.Vector3());
      model.position.sub(bounds.getCenter(new THREE.Vector3()));
      const pivot = new THREE.Group();
      pivot.add(model);
      scene.add(pivot);

      const fov = 28;
      const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);
      const radius = Math.max(size.x, size.y) / 2;
      const distance = (radius * 1.32) / Math.tan(THREE.MathUtils.degToRad(fov / 2));
      camera.position.set(0, radius * 0.35, distance);
      camera.lookAt(0, 0, 0);

      let frame = 0;
      const start = performance.now();
      const tick = (now: number) => {
        const hidden = canvas.clientWidth === 0 || getComputedStyle(canvas).visibility === "hidden";
        // The start-up logo stops for good once its screen has gone; others just idle while hidden.
        if (hidden && boot) return;
        if (!hidden) {
          pivot.rotation.y = ((now - start) / 1000 / TURN_SECONDS) * Math.PI * 2;
          renderer.render(scene, camera);
        }
        frame = requestAnimationFrame(tick);
      };
      tick(start);
      box.dataset.ready = "true";

      cleanup = () => {
        cancelAnimationFrame(frame);
        environment.dispose();
        pmrem.dispose();
        renderer.dispose();
      };
    })().catch(() => {
      // Leave the flat logo in place.
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [boot]);

  return (
    <div className={`${styles.box} ${className ?? ""}`} ref={boxRef}>
      <PsLogo height={196} className={styles.flat} alt={boot ? "PS logo" : ""} />
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
    </div>
  );
}
