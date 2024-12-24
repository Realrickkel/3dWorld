import React, { useEffect, useRef } from 'react';
import '.././App.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';

function RotatingPlanet() {
    const mountRef = useRef(null);
  
    useEffect(() => {
      // Scene, Camera, Renderer
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(renderer.domElement);
  
      // Add a Sphere (Planet Earth)
      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const textureLoader = new THREE.TextureLoader();
      const material = new THREE.MeshStandardMaterial({
        map: textureLoader.load('https://upload.wikimedia.org/wikipedia/commons/a/ac/Earthmap1000x500.jpg'),
      });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
  
      // Add Stars to Background
      function addStars() {
        const starGeometry = new THREE.SphereGeometry(0.01, 24, 24);
        const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  
        for (let i = 0; i < 200; i++) {
          const star = new THREE.Mesh(starGeometry, starMaterial);
  
          const [x, y, z] = Array(3)
            .fill()
            .map(() => THREE.MathUtils.randFloatSpread(100));
  
          star.position.set(x, y, z);
          scene.add(star);
        }
      }
      addStars();
  
      // Add Galaxies to Background
      function addGalaxies() {
        const galaxyGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const galaxyMaterial = new THREE.MeshBasicMaterial({
          map: textureLoader.load('https://upload.wikimedia.org/wikipedia/commons/6/60/ESO_-_Milky_Way.jpg'),
          transparent: true,
          opacity: 0.8,
        });
  
        for (let i = 0; i < 5; i++) {
          const galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
  
          const [x, y, z] = Array(3)
            .fill()
            .map(() => THREE.MathUtils.randFloatSpread(200));
  
          galaxy.position.set(x, y, z);
          scene.add(galaxy);
        }
      }
      addGalaxies();
  
      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 2);
      scene.add(ambientLight);
  
      const pointLight = new THREE.PointLight(0xffffff, 1.5); // Increased intensity
      pointLight.position.set(3, 3, 3); // Moved closer to the Earth for stronger lighting
      scene.add(pointLight);
  
      const spotlight = new THREE.SpotLight(0xffffff, 50);
      spotlight.position.set(-5, 5, 5);
      spotlight.target = sphere;
      spotlight.castShadow = true;
      scene.add(spotlight);
  
      // OrbitControls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enableZoom = false;
  
      // Set Camera Position
      camera.position.z = 3;
  
      // Animation Loop
      const animate = () => {
        requestAnimationFrame(animate);
        sphere.rotation.y += 0.001; // Slow rotation of the planet
        controls.update();
        renderer.render(scene, camera);
      };
      animate();
  
      // Cleanup
      return () => {
        mountRef.current.removeChild(renderer.domElement);
        renderer.dispose();
      };
    }, []);
  
    return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
  }

export default RotatingPlanet;