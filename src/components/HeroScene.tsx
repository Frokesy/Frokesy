import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.55, 1),
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#76e2d0"),
        emissive: new THREE.Color("#0b3a37"),
        emissiveIntensity: 0.55,
        roughness: 0.28,
        metalness: 0.15,
        transparent: true,
        opacity: 0.22,
        transmission: 0.18,
        thickness: 0.8,
      }),
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

    group.add(shell, wire, orbit);

    const ambient = new THREE.AmbientLight("#c7fff0", 1.35);
    const point = new THREE.PointLight("#f6c0a6", 18, 24, 2);
    point.position.set(3.2, 2.4, 4.5);
    const rim = new THREE.PointLight("#6edcc7", 10, 20, 2);
    rim.position.set(-4.2, -2.8, 2.5);
    scene.add(ambient, point, rim);

    const pointer = new THREE.Vector2(0, 0);
    let animationFrame = 0;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const handleResize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const clock = new THREE.Clock();

    const render = () => {
      const elapsed = clock.getElapsedTime();

      if (reduceMotion) {
        group.rotation.y = 0.35;
        group.rotation.x = -0.18;
      } else {
        group.rotation.y += 0.0038;
        group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, pointer.y * 0.22 - 0.18, 0.06);
        group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, pointer.x * 0.12, 0.06);
        group.position.y = Math.sin(elapsed * 0.9) * 0.12;
        orbit.rotation.z += 0.0022;
        wire.rotation.y -= 0.0016;
      }

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(render);
    };

    handleResize();
    render();

    mount.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      mount.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      shell.geometry.dispose();
      (shell.material as THREE.Material).dispose();
      wire.geometry.dispose();
      (wire.material as THREE.Material).dispose();
      orbit.geometry.dispose();
      (orbit.material as THREE.Material).dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="hero-scene" ref={mountRef} aria-hidden="true" />;
}
