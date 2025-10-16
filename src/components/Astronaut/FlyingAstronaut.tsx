"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

/**
 * Renders a flying astronaut OBJ over the hero section.
 * - Loads `/obj/13 Astronaut eat donut.obj` from public/
 * - Animates in a gentle circular path with bobbing
 * - Non-interactive; pointer-events are disabled
 */
const FlyingAstronaut = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const astronautRef = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.set(0, 0, 180);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0x99bbff, 0.9);
    dir.position.set(100, 120, 200);
    scene.add(dir);

    // Load OBJ
    const loader = new OBJLoader();
    loader.load(
      "/obj/13 Astronaut eat donut.obj",
      (obj) => {
        // Normalize scale and orientation
        obj.traverse((child: any) => {
          if (child.isMesh) {
            child.material = new THREE.MeshPhongMaterial({
              color: 0x9ab3ff,
              shininess: 40,
              specular: 0x3355ff,
            });
            child.castShadow = false;
            child.receiveShadow = false;
          }
        });

        const box = new THREE.Box3().setFromObject(obj);
        const size = new THREE.Vector3();
        box.getSize(size);
        const targetSize = 60; // desired normalized size
        const scale = targetSize / Math.max(size.x, size.y, size.z || 1);
        obj.scale.setScalar(scale);

        // Center
        const center = new THREE.Vector3();
        box.getCenter(center);
        obj.position.sub(center.multiplyScalar(scale));

        astronautRef.current = obj;
        scene.add(obj);
      },
      undefined,
      () => {
        // silently fail; keeps app running if asset missing
      }
    );

    const onResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // Animation
    const start = performance.now();
    const animate = () => {
      const t = (performance.now() - start) / 1000; // seconds
      const astronaut = astronautRef.current;
      if (astronaut) {
        const radius = Math.min(width, height) * 0.22; // path radius
        const speed = 0.25; // revolutions per second
        const angle = t * Math.PI * 2 * speed;
        const bob = Math.sin(t * 2) * 8;

        astronaut.position.x = Math.cos(angle) * radius;
        astronaut.position.y = Math.sin(angle) * radius * 0.6 + bob;
        astronaut.position.z = Math.sin(angle * 0.8) * 20;
        astronaut.rotation.y += 0.01;
        astronaut.rotation.x = Math.sin(t * 0.6) * 0.3;
      }
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
};

export default FlyingAstronaut;


