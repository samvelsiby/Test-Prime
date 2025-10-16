"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";

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
  const delayTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const initialize = () => {
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
      const dir = new THREE.DirectionalLight(0xffffff, 0.9);
      dir.position.set(100, 120, 200);
      scene.add(dir);

    // Load MTL (for colors/textures) then OBJ, and force a matte finish without changing colors
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();
    mtlLoader.setPath("/obj/");
    objLoader.setPath("/obj/");

    const applyMatte = (mat: any) => {
      if (!mat) return;
      if ("shininess" in mat) mat.shininess = 0; // Phong
      if ("specular" in mat) mat.specular = new THREE.Color(0x000000);
      if ("reflectivity" in mat) mat.reflectivity = 0;
      if ("metalness" in mat) mat.metalness = 0; // Standard/PBR
      if ("roughness" in mat) mat.roughness = 1;
      if ("envMap" in mat) mat.envMap = null;
      if ("needsUpdate" in mat) mat.needsUpdate = true;
    };

    const onObjLoaded = (obj: THREE.Object3D) => {
      // Keep original materials/colors and only make them matte
      obj.traverse((child: any) => {
        if (child.isMesh) {
          if (Array.isArray(child.material)) {
            child.material.forEach(applyMatte);
          } else {
            applyMatte(child.material);
          }
          child.castShadow = false;
          child.receiveShadow = false;
        }
      });

      const box = new THREE.Box3().setFromObject(obj);
      const size = new THREE.Vector3();
      box.getSize(size);
      const targetSize = 25; // desired normalized size
      const scale = targetSize / Math.max(size.x, size.y, size.z || 1);
      obj.scale.setScalar(scale);

      // Center
      const center = new THREE.Vector3();
      box.getCenter(center);
      obj.position.sub(center.multiplyScalar(scale));

      astronautRef.current = obj;
      scene.add(obj);
    };

      // Try to load MTL first; if it fails, load OBJ without it
      mtlLoader.load(
        "astronut.mtl",
        (materials) => {
          materials.preload();
          objLoader.setMaterials(materials);
          objLoader.load(
            "astronut.obj",
            onObjLoaded,
            undefined,
            (err) => {
              if (process.env.NODE_ENV !== 'production') {
                // eslint-disable-next-line no-console
                console.warn('Failed to load OBJ with MTL', err);
              }
            }
          );
        },
        undefined,
        () => {
          // No MTL: still load the OBJ and apply matte to its default materials
          objLoader.load(
            "astronut.obj",
            onObjLoaded,
            undefined,
            (err) => {
              if (process.env.NODE_ENV !== 'production') {
                // eslint-disable-next-line no-console
                console.warn('Failed to load OBJ /obj/astronut.obj', err);
              }
            }
          );
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
          // Keep same loop time but make perceived motion slower by shortening the path
          const angularSpeed = 0.25; // keep period ≈ 25.1s (2π/0.25)
          const angle = t * angularSpeed;
          const radiusX = Math.min(width, height) * 0.18; // smaller radius → slower apparent speed
          const bob = Math.sin(t * 0.8) * 3; // gentler bob

          // Horizontal ellipse crossing center (x=0)
          astronaut.position.x = Math.sin(angle) * radiusX;
          astronaut.position.y = bob;
          astronaut.position.z = Math.cos(angle) * 8; // shallower depth

          // Softer spins to match slower feel
          astronaut.rotation.y += 0.003;
          astronaut.rotation.x = Math.sin(t * 0.2) * 0.12;
          astronaut.rotation.z += 0.0015;
        }
        renderer.render(scene, camera);
        rafRef.current = requestAnimationFrame(animate);
      };
      animate();

      // Cleanup for initialized resources
      return () => {
        window.removeEventListener("resize", onResize);
      };
    };

    // Delay initialization by 30 seconds
    delayTimerRef.current = window.setTimeout(() => {
      initialize();
    }, 30000);

    return () => {
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = null;
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement && rendererRef.current.domElement.parentNode) {
          rendererRef.current.domElement.parentNode.removeChild(rendererRef.current.domElement);
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


