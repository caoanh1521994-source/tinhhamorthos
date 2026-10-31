// Tinh hạm Orthos 3D – three.js; mỗi bộ phận là một khoang bấm được
window.SHIP3D = (function () {
  if (!window.THREE) return null;
  const T = THREE;
  const NAME = { train: 'Mô phỏng', lab: 'Tách lớp', ch1: 'K1 · Động cơ', ch2: 'K2 · Trung tuyến', ch3: 'K3 · Quan sát', ch4: 'K4 · Tiếp tuyến', ch5: 'K5 · Đường kính' };
  const SHORT = { train: 'MP', lab: 'TL', ch1: 'K1', ch2: 'K2', ch3: 'K3', ch4: 'K4', ch5: 'K5' };
  const COL = { train: 0xff4f9a, ch1: 0xff8a3d, ch2: 0x3fe0c5, ch3: 0xffc24d, ch4: 0x4fb4ff, ch5: 0xb26bff, lab: 0x7dffb0 };
  const RED = 0xff2a4a, DIM = 0x3c4258;
  // vị trí nhãn so với điểm neo (px trên khung rộng 980)
  const OFF = { train: [80, -90], ch1: [-110, -40], ch2: [-20, 140], ch3: [90, -120], ch4: [-110, 70], ch5: [-40, -150], lab: [150, 100] };
  let R = null, scene, cam, ship, Z = {}, flames = [], spin = [], stars;
  let host = null, labs = {}, lines = {}, svg, onPick = null, hover = null, raf = 0, failed = false;
  let rotY = -0.62, rotX = 0.2, tY = -0.62, tX = 0.2, drag = null, lastTouch = -99;
  const t0 = performance.now(), now = () => (performance.now() - t0) / 1000;
  const ray = new T.Raycaster(), mv = new T.Vector2();

  // ---------- vật liệu
  let M;
  function mats() {
    const S = (c, m, r, o) => new T.MeshStandardMaterial(Object.assign({ color: c, metalness: m, roughness: r, flatShading: true, side: T.DoubleSide }, o || {}));
    M = {
      hull: S(0x2b3244, 0.85, 0.3), plate: S(0x4b5672, 0.8, 0.36), light: S(0xaeb9d2, 0.75, 0.28), dark: S(0x0f121a, 0.6, 0.55),
      glass: S(0x0b1830, 1, 0.04, { emissive: 0x0c3a5c, emissiveIntensity: 1 }), stripe: new T.MeshBasicMaterial({ color: 0x39e6ff, toneMapped: false }),
    };
  }
  const acc = k => { const m = new T.MeshBasicMaterial({ color: COL[k], toneMapped: false }); Z[k].acc.push(m); return m; };
  const mesh = (g, m, p, r, s) => { const o = new T.Mesh(g, m); if (p) o.position.set(p[0], p[1], p[2]); if (r) o.rotation.set(r[0], r[1], r[2]); if (s) o.scale.set(s[0], s[1], s[2]); return o; };
  const box = (x, y, z) => new T.BoxGeometry(x, y, z);

  // thân tàu: nối các mặt cắt bát giác vát cạnh
  const oct = (w, h) => [[0, h], [0.6 * w, 0.8 * h], [w, 0.14 * h], [0.8 * w, -0.5 * h], [0, -0.74 * h], [-0.8 * w, -0.5 * h], [-w, 0.14 * h], [-0.6 * w, 0.8 * h]];
  function loft(S, mat) {
    const P = [], rings = S.map(s => oct(s.w, s.h).map(([z, y]) => new T.Vector3(s.x, y + (s.y || 0), z))), n = 8;
    const push = (...v) => v.forEach(q => P.push(q.x, q.y, q.z));
    for (let i = 0; i < rings.length - 1; i++) for (let j = 0; j < n; j++) { const a = rings[i][j], b = rings[i][(j + 1) % n], c = rings[i + 1][(j + 1) % n], d = rings[i + 1][j]; push(a, d, c); push(a, c, b); }
    [rings[0], rings[rings.length - 1]].forEach(r => { const c = r.reduce((m, v) => m.add(v), new T.Vector3()).multiplyScalar(1 / n); for (let j = 0; j < n; j++) push(c, r[j], r[(j + 1) % n]); });
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(P, 3)); g.computeVertexNormals();
    return new T.Mesh(g, mat);
  }
  const strip = (a, b, y, th, m) => { // thanh đèn nối 2 điểm (x,z)
    const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz);
    return mesh(box(L, th, th), m, [(a[0] + b[0]) / 2, y, (a[1] + b[1]) / 2], [0, -Math.atan2(dz, dx), 0]);
  };

  function build() {
    mats();
    ship = new T.Group();
    ['train', 'ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'lab'].forEach(k => { Z[k] = { g: new T.Group(), acc: [], anchor: new T.Vector3(), st: 'off' }; ship.add(Z[k].g); });
    // --- thân chính (không phải khoang)
    const H = new T.Group(); ship.add(H);
    H.add(loft([{ x: -4.0, w: 0.95, h: 0.62 }, { x: -3.4, w: 1.25, h: 0.88 }, { x: -1.5, w: 1.32, h: 0.92 }, { x: 0.6, w: 1.12, h: 0.82 }, { x: 2.0, w: 0.8, h: 0.6 }], M.hull));
    // giáp lưng
    H.add(loft([{ x: -3.3, w: 0.5, h: 0.12, y: 0.86 }, { x: -2.6, w: 0.62, h: 0.2, y: 0.9 }, { x: 0.4, w: 0.5, h: 0.18, y: 0.8 }, { x: 1.2, w: 0.2, h: 0.06, y: 0.68 }], M.plate));
    // dải đèn hai bên
    [1, -1].forEach(s => { H.add(strip([-3.6, s * 1.27], [0.4, s * 1.16], 0.12, 0.05, M.stripe)); H.add(strip([0.4, s * 1.16], [1.95, s * 0.84], 0.1, 0.05, M.stripe)); });
    // cửa hút gió
    [1, -1].forEach(s => { H.add(mesh(box(1.1, 0.34, 0.3), M.plate, [0.7, -0.22, s * 1.06], [0, s * 0.1, 0])); H.add(mesh(box(0.08, 0.24, 0.22), M.dark, [1.26, -0.22, s * 1.09])); });
    // vây đuôi xiên
    const fin = new T.Shape(); fin.moveTo(-4.1, 0); fin.lineTo(-2.8, 0); fin.lineTo(-3.5, 1.25); fin.lineTo(-4.35, 1.35); fin.closePath();
    const fg = new T.ExtrudeGeometry(fin, { depth: 0.07, bevelEnabled: false });
    [1, -1].forEach(s => { const f = mesh(fg, M.plate, [0, 0.55, s * 0.42], [s * -0.42, 0, 0]); H.add(f); });
    // nòng pháo lưng
    H.add(mesh(box(0.6, 0.22, 0.62), M.plate, [-0.6, 1.0, 0]));
    [0.16, -0.16].forEach(z => { H.add(mesh(new T.CylinderGeometry(0.055, 0.07, 1.4, 8), M.light, [0.15, 1.06, z], [0, 0, -Math.PI / 2])); });

    // --- K4: cánh xuôi + pháo đầu cánh
    {
      const W = Z.ch4.g, a = acc('ch4');
      const sh = new T.Shape(); sh.moveTo(1.0, 0.8); sh.lineTo(-1.5, 3.8); sh.lineTo(-2.6, 4.0); sh.lineTo(-3.0, 3.5); sh.lineTo(-2.7, 0.8); sh.closePath();
      const wg = new T.ExtrudeGeometry(sh, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 1 });
      [1, -1].forEach(s => {
        const side = new T.Group(); side.scale.z = s; side.rotation.x = s * 0.1; W.add(side);
        side.add(mesh(wg, M.hull, [0, -0.05, 0], [Math.PI / 2, 0, 0]));
        side.add(strip([1.0, 0.8], [-1.5, 3.8], 0.0, 0.06, a));
        side.add(strip([-0.6, 1.3], [-2.2, 3.3], -0.02, 0.035, a));
        side.add(mesh(box(1.6, 0.04, 0.5), M.plate, [-1.3, 0.04, 2.0], [0, 0.7, 0]));
        side.add(mesh(new T.CylinderGeometry(0.1, 0.12, 2.2, 10), M.light, [-2.0, -0.02, 3.92], [0, 0, -Math.PI / 2]));
        side.add(mesh(new T.CylinderGeometry(0.06, 0.06, 0.7, 8), M.dark, [-0.6, -0.02, 3.92], [0, 0, -Math.PI / 2]));
        side.add(mesh(new T.TorusGeometry(0.12, 0.03, 6, 16), a, [-0.92, -0.02, 3.92], [0, Math.PI / 2, 0]));
      });
      Z.ch4.anchor.set(-1.6, 0, 3.4);
    }
    // --- K1: ba động cơ + lửa
    {
      const E = Z.ch1.g, a = acc('ch1');
      [[0.02, 0.66, 0.42], [0.02, -0.66, 0.42], [0.66, 0, 0.3]].forEach(([y, z, r]) => {
        E.add(mesh(new T.CylinderGeometry(r, r * 1.12, 1.3, 12), M.plate, [-4.1, y, z], [0, 0, Math.PI / 2]));
        E.add(mesh(new T.CylinderGeometry(r * 1.18, r * 1.18, 0.16, 12), M.dark, [-3.6, y, z], [0, 0, Math.PI / 2]));
        E.add(mesh(new T.TorusGeometry(r * 1.05, 0.05, 8, 20), a, [-4.76, y, z], [0, Math.PI / 2, 0]));
        E.add(mesh(new T.CircleGeometry(r * 0.9, 20), a, [-4.77, y, z], [0, -Math.PI / 2, 0]));
        const f1 = new T.MeshBasicMaterial({ color: 0xff8a3d, transparent: true, opacity: 0.75, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false });
        const f2 = new T.MeshBasicMaterial({ color: 0xfff2c0, transparent: true, opacity: 0.9, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false });
        const c1 = mesh(new T.ConeGeometry(r * 0.85, 2.4, 16, 1, true), f1, [-4.78 - 1.2, y, z], [0, 0, Math.PI / 2]);
        const c2 = mesh(new T.ConeGeometry(r * 0.45, 1.2, 12, 1, true), f2, [-4.78 - 0.6, y, z], [0, 0, Math.PI / 2]);
        [c1, c2].forEach(c => { c.userData.flame = 1; c.raycast = () => {}; });
        E.add(c1, c2); flames.push({ c1, c2, r, y, z, f1 });
      });
      Z.ch1.anchor.set(-4.4, 0.9, 0.3);
    }
    // --- Mô phỏng: mũi tàu + buồng lái
    {
      const N = Z.train.g, a = acc('train');
      N.add(loft([{ x: 2.0, w: 0.8, h: 0.6 }, { x: 3.2, w: 0.44, h: 0.36, y: -0.05 }, { x: 4.5, w: 0.06, h: 0.05, y: -0.12 }], M.light));
      N.add(loft([{ x: 1.15, w: 0.02, h: 0.02, y: 0.6 }, { x: 1.8, w: 0.4, h: 0.26, y: 0.6 }, { x: 2.7, w: 0.3, h: 0.17, y: 0.44 }, { x: 3.2, w: 0.02, h: 0.02, y: 0.3 }], M.glass));
      [1, -1].forEach(s => N.add(strip([2.05, s * 0.81], [4.2, s * 0.1], -0.02, 0.045, a)));
      N.add(mesh(new T.CylinderGeometry(0.015, 0.03, 0.9, 6), M.light, [4.85, -0.12, 0], [0, 0, -Math.PI / 2]));
      N.add(mesh(new T.SphereGeometry(0.05, 8, 6), a, [5.3, -0.12, 0]));
      Z.train.anchor.set(3.4, 0.35, 0);
    }
    // --- K2: vòng xoay quanh thân
    {
      const G = Z.ch2.g, a = acc('ch2'), ring = new T.Group(); ring.position.x = -0.25; G.add(ring);
      ring.add(mesh(new T.TorusGeometry(1.5, 0.09, 8, 48), M.light, null, [0, Math.PI / 2, 0]));
      ring.add(mesh(new T.TorusGeometry(1.5, 0.035, 6, 48), a, [0.1, 0, 0], [0, Math.PI / 2, 0]));
      ring.add(mesh(new T.TorusGeometry(1.5, 0.035, 6, 48), a, [-0.1, 0, 0], [0, Math.PI / 2, 0]));
      for (let i = 0; i < 6; i++) { const t = i * Math.PI / 3; ring.add(mesh(box(0.3, 0.2, 0.2), M.plate, [0, 1.5 * Math.cos(t), 1.5 * Math.sin(t)], [t, 0, 0])); }
      spin.push({ o: ring, ax: 'x', v: 0.5 });
      Z.ch2.anchor.set(-0.25, -1.5, 0.2);
    }
    // --- K3: đài radar
    {
      const G = Z.ch3.g, a = acc('ch3');
      G.add(mesh(new T.CylinderGeometry(0.26, 0.34, 0.24, 8), M.plate, [1.0, 0.78, 0]));
      const rad = new T.Group(); rad.position.set(1.0, 0.92, 0); G.add(rad);
      rad.add(mesh(new T.CylinderGeometry(0.04, 0.05, 0.4, 6), M.light, [0, 0.2, 0]));
      const dish = mesh(new T.SphereGeometry(0.46, 18, 8, 0, Math.PI * 2, 0, 0.95), M.light, [0.1, 0.48, 0], [0, 0, -1.2]); rad.add(dish);
      rad.add(mesh(new T.SphereGeometry(0.47, 18, 1, 0, Math.PI * 2, 0.9, 0.06), a, [0.1, 0.48, 0], [0, 0, -1.2]));
      rad.add(mesh(new T.CylinderGeometry(0.015, 0.015, 0.5, 6), M.light, [0.32, 0.58, 0], [0, 0, -1.2]));
      rad.add(mesh(new T.SphereGeometry(0.06, 8, 6), a, [0.52, 0.68, 0]));
      spin.push({ o: rad, ax: 'y', v: 0.8 });
      Z.ch3.anchor.set(1.1, 1.6, 0);
    }
    // --- K5: lõi phản ứng (đường kính)
    {
      const G = Z.ch5.g, a = acc('ch5');
      G.add(mesh(new T.CylinderGeometry(0.58, 0.7, 0.3, 6), M.plate, [-2.2, 0.98, 0]));
      G.add(mesh(new T.SphereGeometry(0.32, 20, 14), a, [-2.2, 1.36, 0]));
      const rg = new T.Group(); rg.position.set(-2.2, 1.36, 0); G.add(rg);
      rg.add(mesh(new T.TorusGeometry(0.5, 0.04, 8, 32), a, null, [Math.PI / 2.4, 0, 0]));
      rg.add(mesh(box(1.12, 0.05, 0.05), M.light));
      spin.push({ o: rg, ax: 'y', v: 1.2 });
      Z.ch5.anchor.set(-2.2, 1.75, 0);
    }
    // --- Tách lớp: khoang thí nghiệm dưới bụng
    {
      const G = Z.lab.g, a = acc('lab');
      [-1.9, -0.5].forEach(x => G.add(mesh(box(0.18, 0.4, 0.3), M.plate, [x, -0.8, 0])));
      G.add(mesh(new T.CapsuleGeometry(0.38, 1.9, 6, 12), M.light, [-1.2, -1.12, 0], [0, 0, Math.PI / 2]));
      [-1.8, -1.2, -0.6].forEach(x => [1, -1].forEach(s => G.add(mesh(box(0.22, 0.12, 0.04), a, [x, -1.08, s * 0.38]))));
      G.add(mesh(new T.TorusGeometry(0.38, 0.03, 6, 20), a, [-2.1, -1.12, 0], [0, Math.PI / 2, 0]));
      Z.lab.anchor.set(-1.0, -1.55, 0.3);
    }
    Object.keys(Z).forEach(k => Z[k].g.traverse(o => { o.userData.k = k; }));
    // tia lửa cho khoang hỏng
    Object.keys(Z).forEach(k => {
      const g = new T.BufferGeometry(), N = 14, pos = new Float32Array(N * 3); g.setAttribute('position', new T.BufferAttribute(pos, 3));
      const sp = new T.Points(g, new T.PointsMaterial({ color: 0xffb35c, size: 0.09, transparent: true, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false }));
      sp.raycast = () => {}; sp.visible = false; ship.add(sp); Z[k].sp = sp;
    });
    ship.position.set(0.3, 0, 0);
    scene.add(ship);
  }

  function init() {
    if (R || failed) return !!R;
    try {
      const c = document.createElement('canvas');
      if (!(c.getContext('webgl2') || c.getContext('webgl'))) throw 0;
      R = new T.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    } catch (e) { failed = true; return false; }
    R.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    R.outputEncoding = T.sRGBEncoding; R.toneMapping = T.ACESFilmicToneMapping; R.toneMappingExposure = 1.15;
    scene = new T.Scene();
    cam = new T.PerspectiveCamera(30, 2.3, 0.1, 300);
    // môi trường phản chiếu: vài tấm sáng màu neon
    const pm = new T.PMREMGenerator(R), es = new T.Scene(); es.background = new T.Color(0x070a14);
    const L = (c, p, s) => es.add(mesh(box(1, 1, 1), new T.MeshBasicMaterial({ color: c, side: T.DoubleSide }), p, null, s));
    L(0xbfe4ff, [0, 9, 0], [16, 0.2, 16]); L(0xff4fd8, [10, 1, -2], [0.2, 7, 12]); L(0x39e6ff, [-10, 1, 2], [0.2, 7, 12]); L(0xffffff, [2, 3, 10], [7, 3, 0.2]); L(0xff9a4a, [0, -7, -4], [12, 0.2, 7]);
    scene.environment = pm.fromScene(es, 0.03).texture;
    scene.add(new T.HemisphereLight(0xbfd8ff, 0x1a1020, 0.5));
    const key = new T.DirectionalLight(0xffffff, 1.7); key.position.set(5, 9, 7); scene.add(key);
    const r1 = new T.DirectionalLight(0x39e6ff, 1.3); r1.position.set(-7, 2, -6); scene.add(r1);
    const r2 = new T.DirectionalLight(0xff4fd8, 1.0); r2.position.set(7, -2, -6); scene.add(r2);
    // sao + tinh vân
    const sg = new T.BufferGeometry(), sp = [];
    for (let i = 0; i < 900; i++) { const u = Math.random() * 2 - 1, th = Math.random() * 6.283, rr = 70 + Math.random() * 40, q = Math.sqrt(1 - u * u); sp.push(rr * q * Math.cos(th), rr * u, rr * q * Math.sin(th) - 30); }
    sg.setAttribute('position', new T.Float32BufferAttribute(sp, 3));
    stars = new T.Points(sg, new T.PointsMaterial({ color: 0xdfe8ff, size: 0.35, sizeAttenuation: true, transparent: true, opacity: 0.9 })); scene.add(stars);
    const tex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new T.CanvasTexture(c); })();
    build();
    return true;
  }

  function apply(stat) {
    Object.keys(Z).forEach(k => { const s = stat[k] || { open: false, d: 0, n: 1 }; Z[k].st = !s.open ? 'off' : s.d === s.n ? 'ok' : 'bad'; });
  }
  function frame(t) {
    rotY += (tY - rotY) * 0.08; rotX += (tX - rotX) * 0.08;
    if (!drag && t - lastTouch > 4) tY = -0.62 + Math.sin(t * 0.22) * 0.38;
    ship.rotation.set(rotX, rotY, Math.sin(t * 0.7) * 0.03); ship.position.y = Math.sin(t * 0.9) * 0.08;
    stars.rotation.y = t * 0.004;
    spin.forEach(s => { const k = Object.keys(Z).find(q => { let p = s.o; while (p) { if (p === Z[q].g) return true; p = p.parent; } return false; }); const f = Z[k].st === 'ok' ? 1 : Z[k].st === 'bad' ? 0.25 : 0; s.o.rotation[s.ax] += s.v * f * 0.016; });
    Object.keys(Z).forEach(k => {
      const z = Z[k], st = z.st, h = hover === k ? 1.7 : 1;
      let c;
      if (st === 'off') c = new T.Color(DIM);
      else if (st === 'bad') { const b = 0.35 + 0.65 * Math.abs(Math.sin(t * 3 + k.length)); c = new T.Color(RED).multiplyScalar(b * (Math.random() < 0.04 ? 0.2 : 1)); }
      else c = new T.Color(COL[k]).multiplyScalar(1 + 0.25 * Math.sin(t * 2 + k.length));
      c.multiplyScalar(h); z.acc.forEach(m => m.color.copy(c));
      // tia lửa
      z.sp.visible = st === 'bad';
      if (st === 'bad') { const a = z.sp.geometry.attributes.position; for (let i = 0; i < a.count; i++) { const q = (t * 1.6 + i / a.count) % 1; a.setXYZ(i, z.anchor.x + Math.sin(i * 12.9) * 0.3 * q, z.anchor.y - 0.25 + q * 0.5 + Math.cos(i * 7.1) * 0.1, z.anchor.z + Math.cos(i * 4.3) * 0.3 * q); } a.needsUpdate = true; z.sp.material.opacity = 0.5 + 0.5 * Math.random(); }
    });
    const e = Z.ch1.st;
    flames.forEach(f => { const on = e !== 'off', p = e === 'ok' ? 1 : 0.35, j = 0.85 + Math.random() * 0.3; f.c1.visible = f.c2.visible = on && !(e === 'bad' && Math.random() < 0.3);
      f.c1.scale.set(1, p * j, 1); f.c2.scale.set(1, p * (0.8 + Math.random() * 0.4), 1);
      f.c1.position.x = -4.78 - 1.2 * p * j; f.c2.position.x = -4.78 - 0.6 * p; f.f1.color.setHex(e === 'ok' ? 0xff8a3d : 0xff3a3a); });
  }
  function size(w, h) {
    R.setSize(w, h, false); cam.aspect = w / h;
    const d = 14 * Math.max(1, 2.25 / cam.aspect);
    cam.position.set(0, d * 0.26, d); cam.lookAt(0, -0.15, 0); cam.updateProjectionMatrix();
  }
  // ---------- nhãn HTML bám theo bộ phận
  const v3 = new T.Vector3();
  function place() {
    const w = host.clientWidth, h = host.clientHeight, sc = Math.max(0.55, Math.min(1, w / 980));
    Object.keys(Z).forEach(k => {
      v3.copy(Z[k].anchor); ship.localToWorld(v3); v3.project(cam);
      const ax = (v3.x * 0.5 + 0.5) * w, ay = (-v3.y * 0.5 + 0.5) * h, el = labs[k];
      const bw = el.offsetWidth, bh = el.offsetHeight;
      let lx = ax + OFF[k][0] * sc, ly = ay + OFF[k][1] * sc;
      lx = Math.max(bw / 2 + 6, Math.min(w - bw / 2 - 6, lx)); ly = Math.max(bh / 2 + 6, Math.min(h - bh / 2 - 6, ly));
      el.style.transform = `translate(${lx - bw / 2}px,${ly - bh / 2}px)`;
      const L = lines[k]; L.setAttribute('x1', ax); L.setAttribute('y1', ay); L.setAttribute('x2', lx); L.setAttribute('y2', ly);
      lines[k + 'd'].setAttribute('cx', ax); lines[k + 'd'].setAttribute('cy', ay);
    });
  }
  function loop() {
    if (!host || !host.isConnected || !R.domElement.isConnected) { raf = 0; return; }
    raf = requestAnimationFrame(loop);
    const w = host.clientWidth, h = host.clientHeight;
    if (w && (R.domElement.width !== Math.round(w * R.getPixelRatio()) || R.domElement.height !== Math.round(h * R.getPixelRatio()))) size(w, h);
    frame(now()); R.render(scene, cam); place();
  }
  function pickAt(e) {
    const r = R.domElement.getBoundingClientRect();
    mv.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(mv, cam);
    const hit = ray.intersectObject(ship, true).find(i => i.object.userData.k);
    return hit ? hit.object.userData.k : null;
  }
  function setHover(k) { hover = k; Object.keys(labs).forEach(q => labs[q].classList.toggle('hl', q === k)); if (R) R.domElement.style.cursor = drag && drag.m > 6 ? 'grabbing' : k ? 'pointer' : 'grab'; }
  function bind(cv) {
    cv.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, ry: tY, rx: tX, m: 0 }; lastTouch = now(); });
    cv.addEventListener('pointermove', e => {
      if (drag) { const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.m = Math.max(drag.m, Math.abs(dx) + Math.abs(dy)); if (drag.m > 6) { tY = drag.ry + dx * 0.01; tX = Math.max(-0.15, Math.min(0.7, drag.rx + dy * 0.006)); lastTouch = now(); } }
      else if (e.pointerType === 'mouse') setHover(pickAt(e));
    });
    const up = e => { if (!drag) return; const m = drag.m; drag = null; lastTouch = now(); if (m <= 6 && e.type === 'pointerup') { const k = pickAt(e); if (k && onPick) onPick(k); } };
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    cv.addEventListener('pointerleave', () => { drag = null; setHover(null); });
  }

  return {
    ok: () => init(),
    mount(el, stat, pick) {
      if (!init()) return false;
      host = el; onPick = pick; apply(stat);
      el.innerHTML = '';
      el.appendChild(R.domElement); R.domElement.className = 's3cv'; R.domElement.setAttribute('aria-hidden', 'true');
      if (!R.domElement.dataset.b) { bind(R.domElement); R.domElement.dataset.b = 1; }
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 's3ln'); el.appendChild(svg);
      const lay = document.createElement('div'); lay.className = 's3lay'; el.appendChild(lay);
      labs = {}; lines = {};
      Object.keys(NAME).forEach(k => {
        const s = stat[k], full = s.d === s.n, st = !s.open ? 'off' : full ? 'ok' : 'bad';
        const L = document.createElementNS('http://www.w3.org/2000/svg', 'line'); L.setAttribute('class', 'ln ' + st); svg.appendChild(L); lines[k] = L;
        const D = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); D.setAttribute('r', 3.5); D.setAttribute('class', 'dt ' + st); svg.appendChild(D); lines[k + 'd'] = D;
        const b = document.createElement('button'); b.className = 'zone s3lab ' + st; b.dataset.k = k;
        b.setAttribute('aria-label', NAME[k] + ' ' + (s.open ? s.d + '/' + s.n : 'khoá'));
        b.innerHTML = `<i></i><b><span class="nf">${NAME[k]}</span><span class="ns">${SHORT[k]}</span></b><em>${s.open ? s.d + '/' + s.n : '🔒'}</em>`;
        b.onmouseenter = () => setHover(k); b.onmouseleave = () => setHover(null);
        lay.appendChild(b); labs[k] = b;
      });
      const w = el.clientWidth || 980, h = el.clientHeight || 420; size(w, h);
      if (!raf) loop();
      return true;
    },
    // ảnh tĩnh cho cốt truyện
    snap(mode) {
      if (!init()) return '';
      const keep = {}; Object.keys(Z).forEach(k => { keep[k] = Z[k].st; Z[k].st = mode; });
      const pr = R.getPixelRatio(); R.setPixelRatio(1); size(900, 380);
      const ry = tY, rx = tX; tY = rotY = -0.5; tX = rotX = 0.22; lastTouch = now();
      frame(now()); ship.rotation.set(0.22, -0.5, 0); ship.position.y = 0; stars.visible = false;
      scene.children.forEach(o => { if (o.isSprite) o.visible = false; });
      R.render(scene, cam); const u = R.domElement.toDataURL('image/png');
      stars.visible = true; scene.children.forEach(o => { if (o.isSprite) o.visible = true; });
      Object.keys(Z).forEach(k => Z[k].st = keep[k]); tY = ry; tX = rx; R.setPixelRatio(pr);
      return u;
    },
  };
})();
