import React, { useEffect, useRef } from "react";
import * as THREE from "three";

type Ribbon = {
  mesh: THREE.Mesh<THREE.TubeGeometry, THREE.MeshPhysicalMaterial>;
  points: THREE.Vector3[];
  radius: number;
  phase: number;
  speed: number;
  amplitude: number;
  spread: number;
};

function makeCurve(points: THREE.Vector3[]) {
  return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.45);
}

function buildRibbonGeometry(
  points: THREE.Vector3[],
  radius: number,
  coarsePointer: boolean,
) {
  return new THREE.TubeGeometry(
    makeCurve(points),
    coarsePointer ? 52 : 92,
    radius,
    coarsePointer ? 10 : 18,
    false,
  );
}

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
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 10.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isCoarsePointer,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, isCoarsePointer ? 1.15 : 1.8),
    );
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const root = new THREE.Group();
    root.rotation.z = -0.18;
    scene.add(root);

    const ribbonGroup = new THREE.Group();
    ribbonGroup.rotation.x = -0.28;
    root.add(ribbonGroup);

    const ribbonConfigs = [
      {
        color: "#8eead6",
        emissive: "#13544d",
        radius: 0.2,
        phase: 0,
        speed: 1,
        amplitude: 0.9,
        spread: 0.95,
        opacity: 0.78,
      },
      {
        color: "#f2b79e",
        emissive: "#6a3f34",
        radius: 0.14,
        phase: 1.1,
        speed: 1.28,
        amplitude: 0.64,
        spread: 0.42,
        opacity: 0.86,
      },
      {
        color: "#78dfcb",
        emissive: "#0d4741",
        radius: 0.11,
        phase: 2.2,
        speed: 1.52,
        amplitude: 0.56,
        spread: -0.18,
        opacity: 0.72,
      },
      {
        color: "#b8fff0",
        emissive: "#1b5b53",
        radius: 0.08,
        phase: 3.1,
        speed: 1.82,
        amplitude: 0.42,
        spread: -0.64,
        opacity: 0.5,
      },
    ] as const;

    const ribbons: Ribbon[] = [];

    ribbonConfigs.forEach((config, index) => {
      const points = Array.from({ length: 8 }, (_, pointIndex) => {
        const progress = pointIndex / 7;
        const x = THREE.MathUtils.lerp(-4.8, 4.8, progress);
        const arc = Math.sin(progress * Math.PI) * (2.3 - index * 0.3);

        return new THREE.Vector3(
          x,
          arc + config.spread,
          Math.cos(progress * Math.PI * 2 + config.phase) * 0.8,
        );
      });

      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(config.color),
        emissive: new THREE.Color(config.emissive),
        emissiveIntensity: 0.88,
        roughness: 0.16,
        metalness: 0.06,
        transparent: true,
        opacity: config.opacity,
        transmission: 0.32,
        thickness: 1,
      });

      const mesh = new THREE.Mesh(
        buildRibbonGeometry(points, config.radius, isCoarsePointer),
        material,
      );
      mesh.position.z = index * -0.25;
      ribbonGroup.add(mesh);

      ribbons.push({
        mesh,
        points,
        radius: config.radius,
        phase: config.phase,
        speed: config.speed,
        amplitude: config.amplitude,
        spread: config.spread,
      });
    });

    const sparkGeometry = new THREE.BufferGeometry();
    const sparkCount = isCoarsePointer ? 26 : 48;
    const sparkPositions = new Float32Array(sparkCount * 3);

    for (let i = 0; i < sparkCount; i += 1) {
      sparkPositions[i * 3] = THREE.MathUtils.randFloatSpread(8);
      sparkPositions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(6);
      sparkPositions[i * 3 + 2] = THREE.MathUtils.randFloat(-1.5, 1.5);
    }

    sparkGeometry.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));

    const sparks = new THREE.Points(
      sparkGeometry,
      new THREE.PointsMaterial({
        color: new THREE.Color("#9aeedd"),
        size: isCoarsePointer ? 0.04 : 0.05,
        transparent: true,
        opacity: 0.5,
        sizeAttenuation: true,
      }),
    );
    root.add(sparks);

    const glowDisc = new THREE.Mesh(
      new THREE.CircleGeometry(2.1, 40),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#7fe3ce"),
        transparent: true,
        opacity: 0.08,
      }),
    );
    glowDisc.position.set(-0.5, -0.2, -1.2);
    root.add(glowDisc);

    const ambient = new THREE.AmbientLight("#d4fff6", 1.08);
    const keyLight = new THREE.PointLight("#8be7d3", 18, 38, 2);
    keyLight.position.set(4.8, 3.2, 6.8);
    const warmLight = new THREE.PointLight("#f3b69d", 12, 28, 2);
    warmLight.position.set(-4.5, -2.4, 5.2);
    const topLight = new THREE.PointLight("#7be2cf", 8, 24, 2);
    topLight.position.set(0.2, 4.2, 5.8);
    scene.add(ambient, keyLight, warmLight, topLight);

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
      pointerVelocity.x = THREE.MathUtils.clamp(nextX - lastPointer.x, -0.26, 0.26);
      pointerVelocity.y = THREE.MathUtils.clamp(nextY - lastPointer.y, -0.26, 0.26);
      lastPointer.set(nextX, nextY);
      pointerTarget.set(nextX, nextY);
    };

    const handlePointerLeave = () => {
      pointerTarget.set(0, 0);
      pointerVelocity.set(0, 0);
      lastPointer.set(0, 0);
    };

    const handleScroll = () => {
      const rect = mount.getBoundingClientRect();
      const viewHeight = window.innerHeight || 1;
      scrollStrength = THREE.MathUtils.clamp(
        (viewHeight - rect.top) / (viewHeight + rect.height),
        0,
        1,
      );
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

    const updateRibbonGeometry = (ribbon: Ribbon, elapsed: number, motionBoost: number) => {
      const pullX = pointer.x * 1.2;
      const pullY = pointer.y * 1.05;
      const twist = pointerVelocity.x * 2.2;
      const burst = pointerVelocity.y * 1.8;

      ribbon.points.forEach((point, index) => {
        const progress = index / (ribbon.points.length - 1);
        const arc = Math.sin(progress * Math.PI) * (2.4 - ribbon.radius * 3.5);
        const wave = Math.sin(elapsed * ribbon.speed + progress * Math.PI * 2 + ribbon.phase);
        const offset = Math.cos(
          elapsed * (ribbon.speed * 0.75) + progress * Math.PI * 3.2 + ribbon.phase,
        );
        const pull = 1 - Math.abs(progress - 0.5) * 1.8;

        point.x =
          THREE.MathUtils.lerp(-4.8, 4.8, progress) +
          wave * 0.32 +
          pullX * pull * ribbon.amplitude * 0.45;
        point.y =
          arc +
          ribbon.spread +
          wave * ribbon.amplitude +
          pullY * pull * 0.9 +
          burst * pull * 0.6;
        point.z =
          offset * 0.88 +
          twist * (progress - 0.5) * 1.6 +
          motionBoost * 1.4 * pull;
      });

      const nextGeometry = buildRibbonGeometry(
        ribbon.points,
        ribbon.radius,
        isCoarsePointer,
      );
      ribbon.mesh.geometry.dispose();
      ribbon.mesh.geometry = nextGeometry;
    };

    const render = () => {
      if (!isRunning) return;

      const elapsed = clock.getElapsedTime();
      pointer.lerp(pointerTarget, reduceMotion ? 0.2 : isCoarsePointer ? 0.065 : 0.1);
      const motionBoost = Math.min(
        Math.abs(pointerVelocity.x) + Math.abs(pointerVelocity.y),
        0.34,
      );
      const scrollOffset = (scrollStrength - 0.5) * 0.85;

      if (reduceMotion) {
        root.rotation.y = 0.22;
        root.rotation.x = -0.06;
      } else {
        root.rotation.y = THREE.MathUtils.lerp(
          root.rotation.y,
          pointer.x * 0.26 + pointerVelocity.x * 0.38,
          0.08,
        );
        root.rotation.x = THREE.MathUtils.lerp(
          root.rotation.x,
          -0.08 + pointer.y * 0.18 - pointerVelocity.y * 0.24,
          0.08,
        );
        root.rotation.z = THREE.MathUtils.lerp(
          root.rotation.z,
          -0.18 + pointer.x * -0.12,
          0.06,
        );
        root.position.x = THREE.MathUtils.lerp(root.position.x, pointer.x * 0.72, 0.08);
        root.position.y = THREE.MathUtils.lerp(
          root.position.y,
          scrollOffset * 0.55 - pointer.y * 0.42,
          0.08,
        );

        camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 1.1, 0.06);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.7, 0.06);
        camera.lookAt(root.position.x * 0.15, root.position.y * 0.1, 0);
      }

      ribbons.forEach((ribbon, index) => {
        updateRibbonGeometry(ribbon, elapsed, motionBoost);
        ribbon.mesh.rotation.y = THREE.MathUtils.lerp(
          ribbon.mesh.rotation.y,
          pointer.x * (0.22 - index * 0.03),
          0.08,
        );
        ribbon.mesh.rotation.x = THREE.MathUtils.lerp(
          ribbon.mesh.rotation.x,
          pointer.y * (0.12 + index * 0.02),
          0.08,
        );
        ribbon.mesh.position.z = THREE.MathUtils.lerp(
          ribbon.mesh.position.z,
          index * -0.25 + Math.sin(elapsed * ribbon.speed + ribbon.phase) * 0.16,
          0.08,
        );
        ribbon.mesh.material.emissiveIntensity =
          0.7 + Math.abs(pointer.x) * 0.26 + motionBoost * 1.75;
      });

      ribbonGroup.rotation.z += 0.0018 + motionBoost * 0.01;
      sparks.rotation.y += 0.0012 + motionBoost * 0.008;
      sparks.rotation.x = Math.sin(elapsed * 0.35) * 0.12 + pointer.y * 0.08;
      sparks.position.x = THREE.MathUtils.lerp(sparks.position.x, pointer.x * 0.4, 0.04);
      sparks.position.y = THREE.MathUtils.lerp(sparks.position.y, -pointer.y * 0.24, 0.04);

      glowDisc.scale.setScalar(1 + Math.abs(pointer.x) * 0.12 + motionBoost * 0.8);
      glowDisc.position.x = THREE.MathUtils.lerp(glowDisc.position.x, -0.5 + pointer.x * 0.8, 0.06);
      glowDisc.position.y = THREE.MathUtils.lerp(glowDisc.position.y, -0.2 + pointer.y * 0.45, 0.06);

      keyLight.position.x = 4.8 + pointer.x * 2.6;
      keyLight.position.y = 3.2 + pointer.y * 1.8;
      warmLight.position.x = -4.5 - pointer.x * 1.8;
      warmLight.position.y = -2.4 - pointer.y * 1.35;
      topLight.position.x = 0.2 + pointer.x * 0.8;
      topLight.position.y = 4.2 + pointer.y * 1.1;

      pointerVelocity.lerpScalar(0.88);
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
      { threshold: 0.08 },
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

      ribbons.forEach((ribbon) => {
        ribbon.mesh.geometry.dispose();
        ribbon.mesh.material.dispose();
      });
      sparkGeometry.dispose();
      (sparks.material as THREE.Material).dispose();
      glowDisc.geometry.dispose();
      (glowDisc.material as THREE.Material).dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="hero-scene" ref={mountRef} aria-hidden="true" />;
}
