import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Chrome3DBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0c10);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 12);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Create a procedural studio environment map for realistic chrome reflections
    const createStudioEnvMap = (): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;

      // Deep studio gradient
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#12151c');
      grad.addColorStop(0.5, '#080a0e');
      grad.addColorStop(1, '#020305');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 512);

      // Studio softbox 1 (top overhead white light)
      const soft1 = ctx.createRadialGradient(512, 100, 10, 512, 100, 220);
      soft1.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      soft1.addColorStop(0.4, 'rgba(230, 240, 255, 0.55)');
      soft1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = soft1;
      ctx.fillRect(0, 0, 1024, 300);

      // Studio softbox 2 (side specular stripe)
      const soft2 = ctx.createLinearGradient(0, 0, 300, 0);
      soft2.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      soft2.addColorStop(0.5, 'rgba(200, 225, 255, 0.4)');
      soft2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = soft2;
      ctx.fillRect(0, 150, 300, 362);

      // Studio softbox 3 (right rim light)
      const soft3 = ctx.createLinearGradient(724, 0, 1024, 0);
      soft3.addColorStop(0, 'rgba(0, 0, 0, 0)');
      soft3.addColorStop(0.5, 'rgba(210, 235, 255, 0.5)');
      soft3.addColorStop(1, 'rgba(255, 255, 255, 0.9)');
      ctx.fillStyle = soft3;
      ctx.fillRect(724, 150, 300, 362);

      const texture = new THREE.CanvasTexture(canvas);
      texture.mapping = THREE.EquirectangularReflectionMapping;
      return texture;
    };

    const envMap = createStudioEnvMap();
    scene.environment = envMap;

    // Chrome Material: High metalness, very low roughness for mirror-polished finish
    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5f8fc,
      metalness: 0.98,
      roughness: 0.1,
      envMap: envMap,
      envMapIntensity: 2.2,
    });

    // 1. Large Main Torus Ring (wrapping behind and underneath the card)
    const torusGeometry = new THREE.TorusGeometry(3.5, 0.75, 48, 100);
    const mainTorus = new THREE.Mesh(torusGeometry, chromeMaterial);
    mainTorus.position.set(0.5, -0.6, -1.0);
    mainTorus.rotation.set(Math.PI * 0.32, -Math.PI * 0.18, Math.PI * 0.15);
    scene.add(mainTorus);

    // 2. Secondary Interlocking Torus Ring (for geometric depth)
    const torus2Geometry = new THREE.TorusGeometry(2.6, 0.48, 36, 80);
    const secondTorus = new THREE.Mesh(torus2Geometry, chromeMaterial);
    secondTorus.position.set(-2.8, 1.8, -2.5);
    secondTorus.rotation.set(-Math.PI * 0.25, Math.PI * 0.35, Math.PI * 0.1);
    scene.add(secondTorus);

    // 3. Floating Chrome Sphere (Top-Right)
    const sphere1Geo = new THREE.SphereGeometry(1.2, 48, 48);
    const sphere1 = new THREE.Mesh(sphere1Geo, chromeMaterial);
    sphere1.position.set(4.2, 2.2, -1.8);
    scene.add(sphere1);

    // 4. Floating Chrome Sphere (Middle-Right Edge)
    const sphere2Geo = new THREE.SphereGeometry(0.75, 40, 40);
    const sphere2 = new THREE.Mesh(sphere2Geo, chromeMaterial);
    sphere2.position.set(5.4, -0.4, 0.2);
    scene.add(sphere2);

    // 5. Floating Chrome Sphere (Bottom-Right)
    const sphere3Geo = new THREE.SphereGeometry(0.5, 32, 32);
    const sphere3 = new THREE.Mesh(sphere3Geo, chromeMaterial);
    sphere3.position.set(3.8, -2.5, 0.6);
    scene.add(sphere3);

    // 6. Floating Liquid Chrome Drop (Top-Left Accent)
    const sphere4Geo = new THREE.SphereGeometry(0.65, 32, 32);
    const sphere4 = new THREE.Mesh(sphere4Geo, chromeMaterial);
    sphere4.position.set(-4.5, -1.8, -1.2);
    scene.add(sphere4);

    // Studio Lights
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 3.2);
    dirLight1.position.set(6, 8, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xb0d8ff, 2.0);
    dirLight2.position.set(-7, -4, 5);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 2.5, 20);
    pointLight.position.set(0, 4, 4);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0x222633, 1.2);
    scene.add(ambientLight);

    // Mouse movement interaction parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 0.45;
      targetY = y * 0.45;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse easing
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Subtle organic floating rotations
      mainTorus.rotation.x = Math.PI * 0.32 + Math.sin(elapsedTime * 0.4) * 0.08 + mouseY * 0.4;
      mainTorus.rotation.y = -Math.PI * 0.18 + Math.cos(elapsedTime * 0.35) * 0.1 + mouseX * 0.4;
      mainTorus.rotation.z = Math.PI * 0.15 + elapsedTime * 0.06;

      secondTorus.rotation.x = -Math.PI * 0.25 + Math.cos(elapsedTime * 0.3) * 0.06 - mouseY * 0.3;
      secondTorus.rotation.y = Math.PI * 0.35 + Math.sin(elapsedTime * 0.4) * 0.08 - mouseX * 0.3;

      // Floating spheres gentle levitation
      sphere1.position.y = 2.2 + Math.sin(elapsedTime * 0.8) * 0.18;
      sphere1.position.x = 4.2 + Math.cos(elapsedTime * 0.6) * 0.12;

      sphere2.position.y = -0.4 + Math.cos(elapsedTime * 1.1) * 0.14;
      sphere2.position.x = 5.4 + Math.sin(elapsedTime * 0.9) * 0.1;

      sphere3.position.y = -2.5 + Math.sin(elapsedTime * 1.3) * 0.12;
      sphere4.position.y = -1.8 + Math.cos(elapsedTime * 0.7) * 0.15;

      camera.position.x = mouseX * 1.2;
      camera.position.y = -mouseY * 1.2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      // Clean up Three.js resources
      renderer.dispose();
      torusGeometry.dispose();
      torus2Geometry.dispose();
      sphere1Geo.dispose();
      sphere2Geo.dispose();
      sphere3Geo.dispose();
      sphere4Geo.dispose();
      chromeMaterial.dispose();
      envMap.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0a0c10]"
      aria-hidden="true"
    />
  );
};
