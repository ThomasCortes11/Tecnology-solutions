/**
 * TECNOLOGY SOLUTIONS — Globe 3D Realista
 * Canvas a pantalla completa del hero-visual para eliminar el cuadro negro
 */

(function () {
    'use strict';

    const TEX = {
        day:    'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
        clouds: 'https://unpkg.com/three-globe/example/img/earth-clouds.png',
        bump:   'https://unpkg.com/three-globe/example/img/earth-topology.png',
        spec:   'https://unpkg.com/three-globe/example/img/earth-water.png',
    };

    document.addEventListener('DOMContentLoaded', function () {
        const wrapper = document.getElementById('globe-canvas-container');
        if (!wrapper) return;

        /* ─── El canvas ocupa TODO el wrapper (hero-visual) ─── */
        wrapper.style.position = 'relative';
        wrapper.style.overflow = 'hidden';

        /* ─── Dimensiones ─── */
        let W = wrapper.clientWidth  || 500;
        let H = wrapper.clientHeight || 500;

        /* ─── Renderer con fondo negro del hero ─── */
        // En vez de transparente, usamos exactamente el mismo color del hero
        // para que se funda de forma perfecta
        const HERO_BG = 0x0a0e1a; // coincide con el gradient del hero

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(W, H);
        renderer.setClearColor(HERO_BG, 1);

        /* Canvas ocupa todo el contenedor sin margen */
        const cv = renderer.domElement;
        cv.style.cssText = `
            display:block; width:100%; height:100%;
            border:none; outline:none; box-shadow:none;
            background:transparent; margin:0; padding:0;
        `;
        wrapper.appendChild(cv);

        /* ─── Escena & Cámara ─── */
        const scene  = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 1000);
        camera.position.z = 2.8;

        /* ─── Iluminación ─── */
        scene.add(new THREE.AmbientLight(0x334466, 0.8));
        const sun = new THREE.DirectionalLight(0xfff5e0, 2.4);
        sun.position.set(5, 2, 4);
        scene.add(sun);
        const fill = new THREE.DirectionalLight(0x1a3a6e, 0.3);
        fill.position.set(-4, -1, -3);
        scene.add(fill);

        /* ─── Grupo del planeta ─── */
        const earthGroup = new THREE.Group();
        earthGroup.rotation.z = THREE.MathUtils.degToRad(23.5);
        scene.add(earthGroup);

        /* ─── Estrellas de fondo ─── */
        buildStars(scene);

        /* ─── Loader ─── */
        const loader = buildLoader(wrapper);

        /* ─── Texturas ─── */
        const tl = new THREE.TextureLoader();
        tl.crossOrigin = 'anonymous';
        let loaded = 0;
        const TOTAL = 3;
        function onLoad() {
            if (++loaded >= TOTAL) {
                loader.remove();
                buildPlanet();
                startLoop();
            }
        }
        function onErr() { onLoad(); }

        const dayTex   = tl.load(TEX.day,    onLoad, undefined, onErr);
        const bumpTex  = tl.load(TEX.bump,   onLoad, undefined, onErr);
        const cloudTex = tl.load(TEX.clouds, onLoad, undefined, onErr);
        const specTex  = tl.load(TEX.spec,   () => {}, undefined, () => {});

        dayTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

        /* ─── Construir planeta ─── */
        let cloudMesh;
        function buildPlanet() {
            /* Tierra */
            const geo = new THREE.SphereGeometry(1, 128, 128);
            const mat = new THREE.MeshPhongMaterial({
                map:         dayTex,
                bumpMap:     bumpTex,
                bumpScale:   0.06,
                specularMap: specTex,
                specular:    new THREE.Color(0x224488),
                shininess:   22,
            });
            earthGroup.add(new THREE.Mesh(geo, mat));

            /* Nubes */
            const cGeo = new THREE.SphereGeometry(1.014, 64, 64);
            const cMat = new THREE.MeshPhongMaterial({
                map: cloudTex, transparent: true, opacity: 0.40, depthWrite: false,
            });
            cloudMesh = new THREE.Mesh(cGeo, cMat);
            earthGroup.add(cloudMesh);

            /* Atmósfera glow */
            buildAtmo();

            /* Anillos orbitales */
            buildRings();

            /* Puntos ciudades + arcos */
            buildCities();
            buildArcs();
        }

        /* Atmósfera fresnel */
        function buildAtmo() {
            const geo = new THREE.SphereGeometry(1.10, 64, 64);
            const mat = new THREE.ShaderMaterial({
                uniforms: { c: { value: 0.18 }, p: { value: 5.5 }, glowColor: { value: new THREE.Color(0x2277ff) } },
                vertexShader: `varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
                fragmentShader: `uniform float c,p; uniform vec3 glowColor; varying vec3 vN; void main(){ float i=pow(c-dot(vN,vec3(0,0,1)),p); gl_FragColor=vec4(glowColor,clamp(i,0.,1.)); }`,
                side: THREE.FrontSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
            });
            scene.add(new THREE.Mesh(geo, mat));
        }

        function buildRings() {
            [[1.22, 0x1E6BFF, 0.15], [1.35, 0xD4AF37, 0.10], [1.48, 0x1E6BFF, 0.07]].forEach(([r, c, o], i) => {
                const m = new THREE.Mesh(
                    new THREE.RingGeometry(r, r + 0.003, 160),
                    new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, side: THREE.DoubleSide, depthWrite: false })
                );
                m.rotation.x = Math.PI / 2 + i * 0.15;
                m.rotation.y = i * 0.25;
                scene.add(m);
            });
        }

        function buildCities() {
            const g = new THREE.Group();
            [[40.7,-74],[51.5,-0.1],[48.8,2.3],[35.7,139.7],[4.6,-74.1],[-23.5,-46.6],[25.2,55.3],[1.3,103.8],[55.7,37.6],[28.6,77.2],[-33.9,18.4],[19.4,-99.1]].forEach(([lat,lon]) => {
                const p = ll2v(lat, lon, 1.018);
                const dot = new THREE.Mesh(new THREE.SphereGeometry(0.011,8,8), new THREE.MeshBasicMaterial({ color: 0x00E5FF }));
                dot.position.copy(p); g.add(dot);
                const halo = new THREE.Mesh(new THREE.RingGeometry(0.016,0.027,16), new THREE.MeshBasicMaterial({ color: 0x4499ff, transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false }));
                halo.position.copy(p); halo.lookAt(new THREE.Vector3(0,0,0)); g.add(halo);
            });
            earthGroup.add(g); return g;
        }

        function buildArcs() {
            const g = new THREE.Group();
            [[[40.7,-74],[51.5,-0.1]],[[51.5,-0.1],[48.8,2.3]],[[48.8,2.3],[35.7,139.7]],[[4.6,-74.1],[25.2,55.3]],[[-23.5,-46.6],[4.6,-74.1]],[[35.7,139.7],[1.3,103.8]],[[55.7,37.6],[28.6,77.2]]].forEach(([a,b],i) => {
                const p1 = ll2v(a[0],a[1],1.02), p2 = ll2v(b[0],b[1],1.02);
                const mid = p1.clone().add(p2).normalize().multiplyScalar(1.5);
                const pts = new THREE.QuadraticBezierCurve3(p1,mid,p2).getPoints(64);
                const line = new THREE.Line(
                    new THREE.BufferGeometry().setFromPoints(pts),
                    new THREE.LineBasicMaterial({ color: [0x1E6BFF,0x00D4FF,0x4A8CFF,0x00E5FF][i%4], transparent: true, opacity: 0.55 })
                );
                g.add(line);
            });
            earthGroup.add(g); return g;
        }

        /* ─── Interacción ─── */
        let drag = false, prevX = 0, prevY = 0, autoRot = true, mX = 0, mY = 0;
        wrapper.style.cursor = 'grab';
        wrapper.addEventListener('mousedown', e => { drag=true; autoRot=false; prevX=e.clientX; prevY=e.clientY; wrapper.style.cursor='grabbing'; });
        window.addEventListener('mouseup', () => { if(!drag) return; drag=false; wrapper.style.cursor='grab'; setTimeout(()=>{autoRot=true;},2500); });
        window.addEventListener('mousemove', e => {
            if (!drag) { mX=(e.clientX/W-.5)*.25; mY=(e.clientY/H-.5)*.10; return; }
            earthGroup.rotation.y += (e.clientX-prevX)*.006;
            earthGroup.rotation.x = THREE.MathUtils.clamp(earthGroup.rotation.x+(e.clientY-prevY)*.004,-.9,.9);
            prevX=e.clientX; prevY=e.clientY;
        });

        /* ─── Resize ─── */
        window.addEventListener('resize', () => {
            W=wrapper.clientWidth||500; H=wrapper.clientHeight||500;
            camera.aspect=W/H; camera.updateProjectionMatrix(); renderer.setSize(W,H);
        });

        /* ─── Loop ─── */
        function startLoop() {
            const clock = new THREE.Clock();
            (function loop() {
                requestAnimationFrame(loop);
                const t = clock.getElapsedTime();
                if (autoRot) {
                    earthGroup.rotation.y += 0.0016;
                    earthGroup.rotation.x += (mY*.25 - earthGroup.rotation.x)*.03;
                }
                if (cloudMesh) cloudMesh.rotation.y += 0.00035;
                renderer.render(scene, camera);
            })();
        }

        /* ─── Safety timeout ─── */
        setTimeout(() => { if (loaded < TOTAL) { loaded=TOTAL; loader.remove(); buildPlanet(); startLoop(); } }, 8000);
    });

    /* ─── Helpers ─── */
    function ll2v(lat, lon, r) {
        const phi = (90-lat)*Math.PI/180, theta=(lon+180)*Math.PI/180;
        return new THREE.Vector3(-r*Math.sin(phi)*Math.cos(theta), r*Math.cos(phi), r*Math.sin(phi)*Math.sin(theta));
    }

    function buildStars(scene) {
        const n=2000, pos=new Float32Array(n*3);
        for(let i=0;i<n;i++){
            const r=9+Math.random()*15, t=Math.random()*Math.PI*2, p=Math.acos(2*Math.random()-1);
            pos[i*3]=r*Math.sin(p)*Math.cos(t); pos[i*3+1]=r*Math.sin(p)*Math.sin(t); pos[i*3+2]=r*Math.cos(p);
        }
        const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
        scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color:0xbbd4ff, size:0.025, transparent:true, opacity:0.7 })));
    }

    function buildLoader(parent) {
        const d = document.createElement('div');
        d.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:5;';
        d.innerHTML = `<div style="color:rgba(100,160,255,0.8);font-family:Inter,sans-serif;font-size:0.8rem;text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px;">
            <svg width="36" height="36" viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="none" stroke="#1E6BFF" stroke-width="2" stroke-dasharray="60 40" style="animation:gs 1.2s linear infinite;transform-origin:center"/></svg>
            <span>Cargando globo...</span></div>
            <style>@keyframes gs{to{transform:rotate(360deg)}}</style>`;
        parent.appendChild(d);
        return d;
    }

})();
