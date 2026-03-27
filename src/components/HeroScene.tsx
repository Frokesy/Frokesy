import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) return;

    const interactionSurface = mount.parentElement;

    if (!interactionSurface) return;

    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
    const reduceMotion = reduceMotionQuery.matches;
    const isCoarsePointer = coarsePointerQuery.matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isCoarsePointer,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, isCoarsePointer ? 1.2 : 1.6),
    );
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#76e2d0"),
      emissive: new THREE.Color("#0b3a37"),
      emissiveIntensity: 0.55,
      roughness: 0.28,
      metalness: 0.15,
      transparent: true,
      opacity: 0.22,
      transmission: 0.18,
      thickness: 0.8,
    });

    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.55, 1),
      coreMaterial,
    );

    const wire = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.1, 0)),
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#f1b8a1"),
        transparent: true,
        opacity: 0.42,
      }),
    );

    const orbit = new THREE.Mesh(
      new THREE.TorusGeometry(2.65, 0.035, 18, 180),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#9debd8"),
        transparent: true,
        opacity: 0.55,
      }),
    );
    orbit.rotation.x = Math.PI * 0.46;
    orbit.rotation.y = Math.PI * 0.2;

    const nucleus = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.72, 0),
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#f4c2ac"),
        emissive: new THREE.Color("#60362f"),
        emissiveIntensity: 0.75,
        roughness: 0.18,
        metalness: 0.22,
        transparent: true,
        opacity: 0.9,
      }),
    );

    const pointsGeometry = new THREE.BufferGeometry();
    const pointCount = isCoarsePointer ? 32 : 56;
    const positions = new Float32Array(pointCount * 3);

    for (let i = 0; i < pointCount; i += 1) {
      const radius = THREE.MathUtils.randFloat(2.4, 3.35);
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = THREE.MathUtils.randFloat(0.2, Math.PI - 0.2);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi) * 0.7;
      const z = radius * Math.sin(phi) * Math.sin(theta);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const points = new THREE.Points(
      pointsGeometry,
      new THREE.PointsMaterial({
        color: new THREE.Color("#8ce7d3"),
        size: 0.05,
        transparent: true,
        opacity: 0.72,
        sizeAttenuation: true,
      }),
    );

    group.add(shell, wire, orbit, nucleus, points);

    const ambient = new THREE.AmbientLight("#c7fff0", 1.35);
    const point = new THREE.PointLight("#f6c0a6", 18, 24, 2);
    point.position.set(3.2, 2.4, 4.5);
    const rim = new THREE.PointLight("#6edcc7", 10, 20, 2);
    rim.position.set(-4.2, -2.8, 2.5);
    scene.add(ambient, point, rim);

    const pointer = new THREE.Vector2(0, 0);
    const pointerTarget = new THREE.Vector2(0, 0);
    const pointerVelocity = new THREE.Vector2(0, 0);
    const lastPointer = new THREE.Vector2(0, 0);
    let animationFrame = 0;
    let scrollStrength = 0;
    let isVisible = true;
    let isDocumentVisible = document.visibilityState === "visible";
    let isRunning = false;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = interactionSurface.getBoundingClientRect();
      const nextX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const nextY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      pointerVelocity.x = THREE.MathUtils.clamp(nextX - lastPointer.x, -0.18, 0.18);
      pointerVelocity.y = THREE.MathUtils.clamp(nextY - lastPointer.y, -0.18, 0.18);
      lastPointer.set(nextX, nextY);
      pointerTarget.x = nextX;
      pointerTarget.y = nextY;
    };

    const handlePointerLeave = () => {
      pointerTarget.set(0, 0);
      pointerVelocity.set(0, 0);
      lastPointer.set(0, 0);
    };

    const handleScroll = () => {
      const rect = mount.getBoundingClientRect();
      const viewHeight = window.innerHeight || 1;
      scrollStrength = THREE.MathUtils.clamp((viewHeight - rect.top) / (viewHeight + rect.height), 0, 1);
    };

    const handleResize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const handleVisibilityChange = () => {
      isDocumentVisible = document.visibilityState === "visible";

      if (isDocumentVisible && isVisible) {
        startRenderLoop();
      }
    };

    const clock = new THREE.Clock();

    const render = () => {
      if (!isRunning) return;

      const elapsed = clock.getElapsedTime();
      pointer.lerp(pointerTarget, reduceMotion ? 0.2 : isCoarsePointer ? 0.055 : 0.08);

      if (reduceMotion) {
        group.rotation.y = 0.35;
        group.rotation.x = -0.18;
      } else {
        const scrollOffset = (scrollStrength - 0.5) * 0.45;
        const motionBoost = Math.min(
          Math.abs(pointerVelocity.x) + Math.abs(pointerVelocity.y),
          0.24,
        );

        group.rotation.y += (isCoarsePointer ? 0.0021 : 0.0032) + motionBoost * 0.045;
        group.rotation.x = THREE.MathUtils.lerp(
          group.rotation.x,
          pointer.y * 0.34 - 0.2 + scrollOffset * 0.18 - pointerVelocity.y * 0.55,
          0.085,
        );
        group.rotation.z = THREE.MathUtils.lerp(
          group.rotation.z,
          pointer.x * 0.28 + pointerVelocity.x * 0.7,
          0.085,
        );
        group.position.y = Math.sin(elapsed * 1.2) * 0.16 + scrollOffset * 0.55 - pointer.y * 0.18;
        group.position.x = THREE.MathUtils.lerp(group.position.x, pointer.x * 0.38, 0.08);

        camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.48, 0.06);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.32, 0.06);
        camera.lookAt(group.position);

        nucleus.rotation.x += (isCoarsePointer ? 0.007 : 0.011) + motionBoost * 0.08;
        nucleus.rotation.y -= (isCoarsePointer ? 0.008 : 0.013) + motionBoost * 0.06;
        nucleus.rotation.z = THREE.MathUtils.lerp(nucleus.rotation.z, pointer.x * 0.9, 0.08);
        const pulse = 1 + Math.sin(elapsed * 2.2) * 0.08 + motionBoost * 0.65;
        nucleus.scale.setScalar(pulse);

        orbit.rotation.z += (isCoarsePointer ? 0.0014 : 0.0022) + motionBoost * 0.03;
        orbit.rotation.y = Math.sin(elapsed * 0.8) * 0.34 + pointer.x * 0.22;
        orbit.rotation.x = Math.PI * 0.46 + pointer.y * 0.18;

        wire.rotation.y -= (isCoarsePointer ? 0.001 : 0.0016) + motionBoost * 0.02;
        wire.rotation.x = THREE.MathUtils.lerp(wire.rotation.x, -pointer.y * 0.24, 0.06);

        points.rotation.y += (isCoarsePointer ? 0.0007 : 0.0011) + motionBoost * 0.012;
        points.rotation.x = Math.sin(elapsed * 0.5) * 0.24 + pointer.y * 0.16;
        points.scale.setScalar(1 + motionBoost * 0.55);

        point.position.x = 3.2 + pointer.x * 1.8;
        point.position.y = 2.4 + pointer.y * 1.4;
        rim.position.x = -4.2 - pointer.x * 1.2;
        rim.position.y = -2.8 - pointer.y * 1.1;

        coreMaterial.emissiveIntensity = 0.48 + Math.sin(elapsed * 2) * 0.14 + motionBoost * 0.8;
        coreMaterial.opacity = 0.2 + motionBoost * 0.12;

        pointerVelocity.lerpScalar(0.9);
      }

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(render);
    };

    const startRenderLoop = () => {
      if (isRunning || !isVisible || !isDocumentVisible) return;
      isRunning = true;
      clock.start();
      animationFrame = window.requestAnimationFrame(render);
    };

    const stopRenderLoop = () => {
      if (!isRunning) return;
      isRunning = false;
      window.cancelAnimationFrame(animationFrame);
      clock.stop();
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry?.isIntersecting ?? true;

        if (isVisible && isDocumentVisible) {
          startRenderLoop();
        } else {
          stopRenderLoop();
        }
      },
      {
        threshold: 0.08,
      },
    );

    handleResize();
    handleScroll();
    visibilityObserver.observe(interactionSurface);
    startRenderLoop();

    interactionSurface.addEventListener("pointermove", handlePointerMove);
    interactionSurface.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopRenderLoop();
      visibilityObserver.disconnect();
      interactionSurface.removeEventListener("pointermove", handlePointerMove);
      interactionSurface.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      renderer.dispose();
      shell.geometry.dispose();
      coreMaterial.dispose();
      wire.geometry.dispose();
      (wire.material as THREE.Material).dispose();
      orbit.geometry.dispose();
      (orbit.material as THREE.Material).dispose();
      nucleus.geometry.dispose();
      (nucleus.material as THREE.Material).dispose();
      points.geometry.dispose();
      (points.material as THREE.Material).dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="hero-scene" ref={mountRef} aria-hidden="true" />;
}
