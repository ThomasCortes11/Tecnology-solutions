/**
 * TECNOLOGY SOLUTIONS — Globe 3D Realista con Three.js
 * Texturas fotográficas reales de la NASA
 */

(function () {
    'use strict';

    /* ─── Texturas NASA / naturalearthdata (dominio público) ─── */
    const TEX = {
        // Blue Marble NASA — mapa de color diurno 4K
        day:    'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
        // Mapa de nubes reales
        clouds: 'https://unpkg.com/three-globe/example/img/earth-clouds.png',
        // Mapa de luces nocturnas (emisión)
        night:  'https://unpkg.com/three-globe/example/img/earth-night.jpg',
        // Mapa de topografía / bump
        bump:   'https://unpkg.com/three-globe/example/img/earth-topology.png',
        // Mapa especular (agua brilla, tierra no)
        spec:   'https://unpkg.com/three-globe/example/img/earth-water.png',
    };

    document.addEventListener('DOMContentLoaded', function () {
        const container = document.getElementById('globe-canvas-container');
        if (!container) return;

        /* ── Loader UI ── */
        const loader = document.createElement('div');
        loader.id = 'globe-loader';
        loader.innerHTML = `
            <div style="
                position:absolute; inset:0; display:flex;
                flex-direction:column; align-items:center; justify-content:center;
                color:rgba(100,160,255,0.7); font-family:Inter,sans-serif; font-size:0.8rem;
                gap:10px; z-index:10;
            ">
                <svg width="40" height="40" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="16" fill="none" stroke="#1E6BFF" stroke-width="2" stroke-dasharray="60 40"
                        style="animation:spin 1.2s linear infinite; transform-origin:center">
                    </circle>
                </svg>
                <span>Cargando globo...</span>
            </div>
            <style>@keyframes spin{to{transform:rotate(360deg)}}</style>`;
        container.appendChild(loader);

        /* ── Dimensiones ── */
        let W = container.clientWidth  || 420;
        let H = container.clientHeight || 420;

        /* ── Renderer ── */
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(W, H);
        renderer.setClearColor(0x000000, 0);
        renderer.shadowMap.enabled = false;
        container.appendChild(renderer.domElement);
        renderer.domElement.style.position = 'relative';
        renderer.domElement.style.zIndex   = '1';

        /* ── Escena & Cámara ── */
        const scene  = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 1000);
        camera.position.z = 2.6;

        /* ── Iluminación ── */
        // Luz ambiental suave para que el lado oscuro no sea negro total
        scene.add(new THREE.AmbientLight(0x334466, 0.9));

        // Sol — luz principal que ilumina la tierra
        const sunLight = new THREE.DirectionalLight(0xfff5e0, 2.2);
        sunLight.position.set(5, 2, 4);
        scene.add(sunLight);

        // Luz de relleno tenue (efecto subsurface scatter suave)
        const fillLight = new THREE.DirectionalLight(0x1a3a6e, 0.35);
        fillLight.position.set(-4, -1, -3);
        scene.add(fillLight);

        /* ── Grupo raíz del planeta ── */
        const earthGroup = new THREE.Group();
        earthGroup.rotation.z = THREE.MathUtils.degToRad(23.5); // inclinación axial
        scene.add(earthGroup);

        /* ── TextureLoader ── */
        const texLoader   = new THREE.TextureLoader();
        texLoader.crossOrigin = 'anonymous';

        let loadedCount = 0;
        const TOTAL     = 4; // day, bump, spec, clouds

        function onLoad() {
            loadedCount++;
            if (loadedCount >= TOTAL) {
                loader.style.display = 'none';
                startAnimation();
            }
        }
        function onError(url) {
            console.warn('Globe texture failed:', url);
            onLoad(); // continuar aunque falle
        }

        /* ── Cargar texturas ── */
        const dayTex    = texLoader.load(TEX.day,    onLoad, undefined, () => onError(TEX.day));
        const bumpTex   = texLoader.load(TEX.bump,   onLoad, undefined, () => onError(TEX.bump));
        const specTex   = texLoader.load(TEX.spec,   onLoad, undefined, () => onError(TEX.spec));
        const cloudsTex = texLoader.load(TEX.clouds, onLoad, undefined, () => onError(TEX.clouds));

        // La textura nocturna se usa opcionalmente (no cuenta en TOTAL para no bloquear)
        const nightTex = texLoader.load(TEX.night, () => {}, undefined, () => {});

        dayTex.anisotropy    = renderer.capabilities.getMaxAnisotropy();
        bumpTex.anisotropy   = 4;
        cloudsTex.anisotropy = 4;

        /* ══════════════════════════════════════
           CONSTRUCCIÓN DEL PLANETA
           ══════════════════════════════════════ */
        function buildPlanet() {
            /* ── Esfera principal — tierra ── */
            const earthGeo = new THREE.SphereGeometry(1, 128, 128);
            const earthMat = new THREE.MeshPhongMaterial({
                map:         dayTex,
                bumpMap:     bumpTex,
                bumpScale:   0.06,
                specularMap: specTex,
                specular:    new THREE.Color(0x224488),
                shininess:   20,
            });
            const earthMesh = new THREE.Mesh(earthGeo, earthMat);
            earthGroup.add(earthMesh);

            /* ── Capa de nubes ── */
            const cloudGeo = new THREE.SphereGeometry(1.012, 64, 64);
            const cloudMat = new THREE.MeshPhongMaterial({
                map:         cloudsTex,
                transparent: true,
                opacity:     0.42,
                depthWrite:  false,
                blending:    THREE.NormalBlending,
            });
            const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
            earthGroup.add(cloudMesh);

            return { cloudMesh };
        }

        /* ── Atmósfera exterior (fresnel glow) ── */
        function buildAtmosphere() {
            const atmoGeo = new THREE.SphereGeometry(1.10, 64, 64);
            const atmoMat = new THREE.ShaderMaterial({
                uniforms: {
                    c:         { value: 0.18 },
                    p:         { value: 5.5  },
                    glowColor: { value: new THREE.Color(0x2277ff) },
                },
                vertexShader: `
                    varying vec3 vNormal;
                    void main(){
                        vNormal = normalize(normalMatrix * normal);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                    }`,
                fragmentShader: `
                    uniform float c, p;
                    uniform vec3 glowColor;
                    varying vec3 vNormal;
                    void main(){
                        float intensity = pow(c - dot(vNormal, vec3(0,0,1.0)), p);
                        intensity = clamp(intensity, 0.0, 1.0);
                        gl_FragColor = vec4(glowColor, intensity);
                    }`,
                side:        THREE.FrontSide,
                blending:    THREE.AdditiveBlending,
                transparent: true,
                depthWrite:  false,
            });
            const atmo = new THREE.Mesh(atmoGeo, atmoMat);
            scene.add(atmo); // fuera del earthGroup para que no rote con él
            return atmo;
        }

        /* ── Anillos orbitales decorativos ── */
        function buildRings() {
            const group = new THREE.Group();
            const configs = [
                { r: 1.22, color: 0x1E6BFF,  opacity: 0.18 },
                { r: 1.35, color: 0xD4AF37,  opacity: 0.12 },
                { r: 1.48, color: 0x1E6BFF,  opacity: 0.08 },
            ];
            configs.forEach(({ r, color, opacity }, i) => {
                const geo = new THREE.RingGeometry(r, r + 0.003, 160);
                const mat = new THREE.MeshBasicMaterial({
                    color, transparent: true, opacity,
                    side: THREE.DoubleSide, depthWrite: false,
                });
                const ring = new THREE.Mesh(geo, mat);
                ring.rotation.x = Math.PI / 2 + i * 0.15;
                ring.rotation.y = i * 0.25;
                group.add(ring);
            });
            scene.add(group);
            return group;
        }

        /* ── Puntos de ciudades ── */
        function buildCityDots() {
            const group = new THREE.Group();
            const cities = [
                [40.7,  -74.0],  // New York
                [51.5,   -0.1],  // London
                [48.8,    2.3],  // Paris
                [35.7,  139.7],  // Tokyo
                [22.3,  114.2],  // Hong Kong
                [-33.9,  18.4],  // Cape Town
                [55.7,   37.6],  // Moscow
                [ 4.6,  -74.1],  // Bogotá
                [-23.5, -46.6],  // São Paulo
                [28.6,   77.2],  // New Delhi
                [ 1.3,  103.8],  // Singapore
                [25.2,   55.3],  // Dubai
                [19.4,  -99.1],  // Ciudad de México
                [-34.6, -58.4],  // Buenos Aires
                [30.0,   31.2],  // El Cairo
            ];

            cities.forEach(([lat, lon]) => {
                const pos = latLonToVec3(lat, lon, 1.018);

                // Punto central
                const dotGeo = new THREE.SphereGeometry(0.010, 8, 8);
                const dotMat = new THREE.MeshBasicMaterial({ color: 0x00E5FF });
                const dot = new THREE.Mesh(dotGeo, dotMat);
                dot.position.copy(pos);
                group.add(dot);

                // Halo pulsante
                const haloGeo = new THREE.RingGeometry(0.016, 0.026, 16);
                const haloMat = new THREE.MeshBasicMaterial({
                    color: 0x4499ff, transparent: true, opacity: 0.6,
                    side: THREE.DoubleSide, depthWrite: false,
                });
                const halo = new THREE.Mesh(haloGeo, haloMat);
                halo.position.copy(pos);
                halo.lookAt(new THREE.Vector3(0, 0, 0));
                group.add(halo);
            });

            earthGroup.add(group);
            return group;
        }

        /* ── Arcos de conexión entre ciudades ── */
        function buildArcs() {
            const group = new THREE.Group();
            const pairs = [
                [[40.7,-74.0],[51.5,-0.1]],
                [[51.5,-0.1],[48.8,2.3]],
                [[48.8,2.3],[35.7,139.7]],
                [[4.6,-74.1],[25.2,55.3]],
                [[-23.5,-46.6],[4.6,-74.1]],
                [[35.7,139.7],[1.3,103.8]],
                [[55.7,37.6],[28.6,77.2]],
                [[-33.9,18.4],[25.2,55.3]],
                [[19.4,-99.1],[4.6,-74.1]],
                [[30.0,31.2],[51.5,-0.1]],
            ];

            const colors = [0x1E6BFF, 0x00D4FF, 0x4A8CFF, 0x00E5FF, 0x88ccff];

            pairs.forEach(([a, b], i) => {
                const p1  = latLonToVec3(a[0], a[1], 1.02);
                const p2  = latLonToVec3(b[0], b[1], 1.02);
                const mid = p1.clone().add(p2).normalize().multiplyScalar(1.0 + 0.5);

                const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
                const pts   = curve.getPoints(64);
                const geo   = new THREE.BufferGeometry().setFromPoints(pts);
                const mat   = new THREE.LineBasicMaterial({
                    color: colors[i % colors.length],
                    transparent: true,
                    opacity: 0.55,
                });
                group.add(new THREE.Line(geo, mat));
            });

            earthGroup.add(group);
            return group;
        }

        /* ── Estrellas ── */
        function buildStars() {
            const count     = 2000;
            const positions = new Float32Array(count * 3);
            const sizes     = new Float32Array(count);
            for (let i = 0; i < count; i++) {
                const r     = 9 + Math.random() * 15;
                const theta = Math.random() * Math.PI * 2;
                const phi   = Math.acos(2 * Math.random() - 1);
                positions[i*3]   = r * Math.sin(phi) * Math.cos(theta);
                positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
                positions[i*3+2] = r * Math.cos(phi);
                sizes[i] = 0.5 + Math.random() * 1.5;
            }
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

            const mat = new THREE.PointsMaterial({
                color: 0xbbd4ff, size: 0.025,
                transparent: true, opacity: 0.75,
                sizeAttenuation: true,
            });
            const stars = new THREE.Points(geo, mat);
            scene.add(stars);
            return stars;
        }

        /* ══════════════════════════════════════
           INTERACCIÓN
           ══════════════════════════════════════ */
        let isDragging = false;
        let prevX = 0, prevY = 0;
        let autoRotate  = true;
        let mouseX = 0, mouseY = 0;
        let velX = 0;

        container.style.cursor = 'grab';

        container.addEventListener('mousedown', e => {
            isDragging  = true;
            autoRotate  = false;
            prevX = e.clientX;
            prevY = e.clientY;
            container.style.cursor = 'grabbing';
        });
        window.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            container.style.cursor = 'grab';
            setTimeout(() => { autoRotate = true; }, 2500);
        });
        window.addEventListener('mousemove', e => {
            if (!isDragging) {
                mouseX = (e.clientX / W - 0.5) * 0.25;
                mouseY = (e.clientY / H - 0.5) * 0.10;
                return;
            }
            const dx = e.clientX - prevX;
            const dy = e.clientY - prevY;
            velX = dx * 0.006;
            earthGroup.rotation.y += velX;
            earthGroup.rotation.x = THREE.MathUtils.clamp(
                earthGroup.rotation.x + dy * 0.004, -0.9, 0.9
            );
            prevX = e.clientX;
            prevY = e.clientY;
        });

        // Touch
        let prevTX = 0, prevTY = 0;
        container.addEventListener('touchstart', e => {
            isDragging = true; autoRotate = false;
            prevTX = e.touches[0].clientX;
            prevTY = e.touches[0].clientY;
            e.preventDefault();
        }, { passive: false });
        container.addEventListener('touchend', () => {
            isDragging = false;
            setTimeout(() => { autoRotate = true; }, 2500);
        });
        container.addEventListener('touchmove', e => {
            if (!isDragging) return;
            const dx = e.touches[0].clientX - prevTX;
            const dy = e.touches[0].clientY - prevTY;
            earthGroup.rotation.y += dx * 0.006;
            earthGroup.rotation.x = THREE.MathUtils.clamp(
                earthGroup.rotation.x + dy * 0.004, -0.9, 0.9
            );
            prevTX = e.touches[0].clientX;
            prevTY = e.touches[0].clientY;
            e.preventDefault();
        }, { passive: false });

        /* ── Resize ── */
        window.addEventListener('resize', () => {
            W = container.clientWidth  || 420;
            H = container.clientHeight || 420;
            camera.aspect = W / H;
            camera.updateProjectionMatrix();
            renderer.setSize(W, H);
        });

        /* ══════════════════════════════════════
           ANIMACIÓN PRINCIPAL
           ══════════════════════════════════════ */
        function startAnimation() {
            const { cloudMesh }  = buildPlanet();
            const atmosphere     = buildAtmosphere();
            const rings          = buildRings();
            const cityDots       = buildCityDots();
            const arcs           = buildArcs();
            const stars          = buildStars();

            const clock = new THREE.Clock();
            let t = 0;

            function animate() {
                requestAnimationFrame(animate);
                const delta = clock.getDelta();
                t += delta;

                /* Autorotación suave */
                if (autoRotate) {
                    earthGroup.rotation.y += 0.0016;
                    // Parallax sutil por posición del mouse
                    earthGroup.rotation.x += (mouseY * 0.25 - earthGroup.rotation.x) * 0.03;
                }

                /* Nubes rotan independientemente */
                cloudMesh.rotation.y += 0.00035;

                /* Atmósfera sigue la rotación visual */
                atmosphere.rotation.copy(earthGroup.rotation);

                /* Pulso de los anillos */
                rings.children.forEach((ring, i) => {
                    ring.material.opacity = 0.08 + 0.06 * Math.sin(t * 0.6 + i * 1.4);
                });

                /* Pulso de los puntos de ciudad */
                cityDots.children.forEach((obj, i) => {
                    if (obj.geometry.type === 'RingGeometry') {
                        obj.material.opacity = 0.3 + 0.5 * Math.abs(Math.sin(t * 2.0 + i * 0.8));
                    }
                });

                /* Pulso de los arcos */
                arcs.children.forEach((arc, i) => {
                    arc.material.opacity = 0.25 + 0.4 * Math.abs(Math.sin(t * 1.0 + i * 0.65));
                });

                /* Rotación lenta de estrellas */
                stars.rotation.y += 0.00008;

                renderer.render(scene, camera);
            }

            animate();
        }

        /* ── Por si las texturas tardan demasiado: timeout de seguridad ── */
        setTimeout(() => {
            if (loadedCount < TOTAL) {
                loadedCount = TOTAL;
                loader.style.display = 'none';
                startAnimation();
            }
        }, 8000);
    });

    /* ── Utilidad: lat/lon → Vector3 sobre la esfera ── */
    function latLonToVec3(lat, lon, radius) {
        const phi   = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        return new THREE.Vector3(
            -radius * Math.sin(phi) * Math.cos(theta),
             radius * Math.cos(phi),
             radius * Math.sin(phi) * Math.sin(theta)
        );
    }

})();
