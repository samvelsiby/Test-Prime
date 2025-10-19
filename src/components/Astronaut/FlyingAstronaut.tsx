"use client";
import { useEffect, useRef, useState } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Detect mobile device and performance capabilities
    const checkMobileAndPerformance = () => {
      const isMobileDevice = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
      const shouldSkipOnMobile = isMobileDevice && isLowEndDevice;
      
      setIsMobile(isMobileDevice);
      setShouldRender(!shouldSkipOnMobile);
      
      return !shouldSkipOnMobile;
    };

    const container = containerRef.current;
    if (!container || !checkMobileAndPerformance()) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const initialize = () => {
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Mobile-optimized camera settings
      const fov = isMobile ? 60 : 45; // Wider field of view on mobile
      const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 2000);
      camera.position.set(0, 0, isMobile ? 220 : 180); // Further back on mobile
      cameraRef.current = camera;

      // Mobile-optimized renderer settings
      const renderer = new THREE.WebGLRenderer({ 
        antialias: !isMobile, // Disable antialiasing on mobile for performance
        alpha: true,
        powerPreference: isMobile ? "low-power" : "high-performance"
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2)); // Lower pixel ratio on mobile
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
      const targetSize = isMobile ? 20 : 25; // Smaller on mobile
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

      // Mobile-optimized animation
      const start = performance.now();
      let lastFrameTime = 0;
      const targetFPS = isMobile ? 30 : 60; // Lower FPS on mobile
      const frameInterval = 1000 / targetFPS;
      
      const animate = (currentTime: number) => {
        // Throttle animation on mobile
        if (isMobile && currentTime - lastFrameTime < frameInterval) {
          rafRef.current = requestAnimationFrame(animate);
          return;
        }
        lastFrameTime = currentTime;
        
        const t = (currentTime - start) / 1000; // seconds
        const astronaut = astronautRef.current;
        if (astronaut) {
          // Slower, simpler animation on mobile
          const angularSpeed = isMobile ? 0.15 : 0.25; // Slower on mobile
          const angle = t * angularSpeed;
          const radiusX = Math.min(width, height) * (isMobile ? 0.15 : 0.18); // Smaller radius on mobile
          const bob = Math.sin(t * (isMobile ? 0.5 : 0.8)) * (isMobile ? 2 : 3); // Gentler bob on mobile

          // Horizontal ellipse crossing center (x=0)
          astronaut.position.x = Math.sin(angle) * radiusX;
          astronaut.position.y = bob;
          astronaut.position.z = Math.cos(angle) * (isMobile ? 6 : 8); // Shallower depth on mobile

          // Simpler rotation on mobile
          astronaut.rotation.y += isMobile ? 0.002 : 0.003;
          astronaut.rotation.x = Math.sin(t * (isMobile ? 0.1 : 0.2)) * (isMobile ? 0.08 : 0.12);
          astronaut.rotation.z += isMobile ? 0.001 : 0.0015;
        }
        renderer.render(scene, camera);
        rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);

      // Cleanup for initialized resources
      return () => {
        window.removeEventListener("resize", onResize);
      };
    };

    // Shorter delay on mobile, longer on desktop
    const delay = isMobile ? 5000 : 30000; // 5 seconds on mobile, 30 seconds on desktop
    delayTimerRef.current = window.setTimeout(() => {
      initialize();
    }, delay);

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

  // Don't render on very low-end mobile devices
  if (!shouldRender) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        // Mobile-specific positioning adjustments
        ...(isMobile && {
          top: "10%",
          bottom: "10%",
          left: "5%",
          right: "5%",
        }),
      }}
    />
  );
};

export default FlyingAstronaut;


