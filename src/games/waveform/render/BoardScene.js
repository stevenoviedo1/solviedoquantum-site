import * as THREE from 'three';

const TILE = 1.05;
const COLORS = {
  floor: 0x12141c,
  cover: 0x1a2740,
  blocked: 0x0a0a0e,
  extract: 0x0d3328,
  beacon: 0x2a1a40,
  spawn: 0x12141c,
  player: 0x3dd6c6,
  enemy: 0xe85d75,
  ghost: 0x8b7cff,
  select: 0xf0e68c,
  move: 0x3b82f6,
  attack: 0xef4444,
  observe: 0xa78bfa,
  entangle: 0x22d3ee,
  gridLine: 0x2a2f45,
};

/**
 * 2D rules, 3D presentation. WebGL renderer with high-performance GPU preference.
 * WebGPU attempted when available via dynamic import.
 */
export class BoardScene {
  /**
   * @param {HTMLElement} container
   * @param {{ quality?: 'high'|'medium'|'low' }} [opts]
   */
  constructor(container, opts = {}) {
    this.container = container;
    this.quality = opts.quality || 'high';
    this.backend = 'webgl';
    this.width = 8;
    this.height = 7;
    this.disposed = false;
    this.particles = [];
    this.clock = new THREE.Clock();
    this.hover = null;
    this.highlights = [];
    this.entangleLines = [];
    this.onTileClick = null;
    this.onTileHover = null;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x05060a);
    this.scene.fog = new THREE.Fog(0x05060a, 18, 42);

    const aspect = container.clientWidth / Math.max(1, container.clientHeight);
    this.camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
    this._fitCamera(8, 7);

    this.root = new THREE.Group();
    this.scene.add(this.root);

    this.tileGroup = new THREE.Group();
    this.unitGroup = new THREE.Group();
    this.ghostGroup = new THREE.Group();
    this.fxGroup = new THREE.Group();
    this.hlGroup = new THREE.Group();
    this.root.add(this.tileGroup, this.unitGroup, this.ghostGroup, this.fxGroup, this.hlGroup);

    // Lights
    const amb = new THREE.AmbientLight(0x6a7aaa, 0.55);
    const dir = new THREE.DirectionalLight(0xffffff, 1.15);
    dir.position.set(6, 14, 8);
    dir.castShadow = this.quality === 'high';
    if (dir.castShadow) {
      dir.shadow.mapSize.set(1024, 1024);
      dir.shadow.camera.near = 1;
      dir.shadow.camera.far = 40;
    }
    const rim = new THREE.PointLight(0x7c5cff, 0.9, 30);
    rim.position.set(-4, 6, -4);
    const fill = new THREE.PointLight(0x3dd6c6, 0.35, 24);
    fill.position.set(8, 4, 4);
    this.scene.add(amb, dir, rim, fill);
    this.dirLight = dir;

    // Ground plane for raycast
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.pickPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 80),
      new THREE.MeshBasicMaterial({ visible: false }),
    );
    this.pickPlane.rotation.x = -Math.PI / 2;
    this.pickPlane.position.y = 0.01;
    this.scene.add(this.pickPlane);

    this.renderer = new THREE.WebGLRenderer({
      antialias: this.quality !== 'low',
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, this.quality === 'high' ? 2 : 1.25),
    );
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = this.quality === 'high';
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(this.renderer.domElement);

    this._tryWebGPU();

    this._onResize = () => this.resize();
    this._onPointer = (e) => this._pointer(e);
    this._onClick = (e) => this._click(e);
    window.addEventListener('resize', this._onResize);
    this.renderer.domElement.addEventListener('pointermove', this._onPointer);
    this.renderer.domElement.addEventListener('pointerdown', this._onClick);

    this._animate = this._animate.bind(this);
    this.raf = requestAnimationFrame(this._animate);
  }

  async _tryWebGPU() {
    try {
      if (!navigator.gpu) return;
      // Feature-detect only; Three WebGPU is a separate entry — keep WebGL stable for production.
      // Expose backend label as webgpu-capable host even when drawing with WebGL for reliability.
      const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
      if (adapter) {
        this.backend = 'webgl+gpu-adapter';
        this.gpuAdapterName = adapter.info?.device || 'WebGPU adapter';
      }
    } catch {
      /* ignore */
    }
  }

  getBackendLabel() {
    if (this.backend === 'webgl+gpu-adapter') return 'WebGL · GPU high-performance';
    return 'WebGL';
  }

  _fitCamera(w, h) {
    const cx = ((w - 1) * TILE) / 2;
    const cz = ((h - 1) * TILE) / 2;
    this.boardCenter = new THREE.Vector3(cx, 0, cz);
    const dist = Math.max(w, h) * 1.35 + 4;
    this.camera.position.set(cx + dist * 0.55, dist * 0.85, cz + dist * 0.7);
    this.camera.lookAt(cx, 0, cz);
  }

  /**
   * @param {import('../engine/types.js').MissionState} state
   * @param {{x:number,y:number}[]} [highlights]
   * @param {string} [hlMode]
   */
  sync(state, highlights = [], hlMode = 'move') {
    this.width = state.width;
    this.height = state.height;
    this._fitCamera(state.width, state.height);

    // Tiles
    while (this.tileGroup.children.length) {
      const c = this.tileGroup.children[0];
      this.tileGroup.remove(c);
      c.geometry?.dispose?.();
      c.material?.dispose?.();
    }

    for (const t of state.tiles) {
      const h = t.type === 'blocked' ? 0.85 : t.type === 'cover' ? 0.45 : 0.18;
      const geo = new THREE.BoxGeometry(0.95, h, 0.95);
      const color = COLORS[t.type] || COLORS.floor;
      const mat = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.25,
        roughness: 0.55,
        emissive: t.type === 'beacon' ? 0x4c1d95 : t.type === 'extract' ? 0x064e3b : 0x000000,
        emissiveIntensity: t.type === 'beacon' || t.type === 'extract' ? 0.35 : 0,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(t.x * TILE, h / 2, t.y * TILE);
      mesh.castShadow = this.quality === 'high';
      mesh.receiveShadow = true;
      mesh.userData = { tileX: t.x, tileY: t.y };
      this.tileGroup.add(mesh);

      // rim
      if (t.type !== 'blocked') {
        const edge = new THREE.LineSegments(
          new THREE.EdgesGeometry(geo),
          new THREE.LineBasicMaterial({ color: COLORS.gridLine, transparent: true, opacity: 0.35 }),
        );
        edge.position.copy(mesh.position);
        this.tileGroup.add(edge);
      }
    }

    // Units
    while (this.unitGroup.children.length) {
      const c = this.unitGroup.children[0];
      this.unitGroup.remove(c);
      c.traverse?.((o) => {
        o.geometry?.dispose?.();
        if (o.material) {
          if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
          else o.material.dispose?.();
        }
      });
    }

    for (const u of state.units) {
      if (u.hp <= 0) continue;
      const g = new THREE.Group();
      const isPlayer = u.team === 'player';
      const bodyMat = new THREE.MeshStandardMaterial({
        color: isPlayer ? COLORS.player : COLORS.enemy,
        metalness: 0.45,
        roughness: 0.35,
        emissive: isPlayer ? 0x0d3d38 : 0x3f1520,
        emissiveIntensity: 0.4,
      });
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.55, 12), bodyMat);
      body.position.y = 0.45;
      body.castShadow = true;
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 12, 12),
        new THREE.MeshStandardMaterial({
          color: 0xf8fafc,
          metalness: 0.2,
          roughness: 0.4,
          emissive: isPlayer ? COLORS.player : COLORS.enemy,
          emissiveIntensity: 0.15,
        }),
      );
      head.position.y = 0.85;
      g.add(body, head);

      // HP bar
      const pct = u.hp / u.maxHp;
      const barBg = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.06, 0.06),
        new THREE.MeshBasicMaterial({ color: 0x111111 }),
      );
      barBg.position.y = 1.15;
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(0.56 * pct, 0.05, 0.05),
        new THREE.MeshBasicMaterial({ color: pct > 0.4 ? 0x4ade80 : 0xf87171 }),
      );
      bar.position.set(-(0.56 - 0.56 * pct) / 2, 1.15, 0);
      g.add(barBg, bar);

      // selection ring
      if (state.selectedUnitId === u.id) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.42, 0.035, 8, 24),
          new THREE.MeshBasicMaterial({ color: COLORS.select }),
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.08;
        g.add(ring);
      }

      g.position.set(u.x * TILE, 0.18, u.y * TILE);
      g.userData = { unitId: u.id, baseY: 0.18 };
      this.unitGroup.add(g);
    }

    // Ghosts
    while (this.ghostGroup.children.length) {
      const c = this.ghostGroup.children[0];
      this.ghostGroup.remove(c);
      c.traverse?.((o) => {
        o.geometry?.dispose?.();
        o.material?.dispose?.();
      });
    }

    for (const u of state.units) {
      if (u.hp <= 0) continue;
      for (const gh of u.ghosts) {
        const mat = new THREE.MeshStandardMaterial({
          color: COLORS.ghost,
          transparent: true,
          opacity: 0.45,
          metalness: 0.3,
          roughness: 0.2,
          emissive: COLORS.ghost,
          emissiveIntensity: 0.5,
          depthWrite: false,
        });
        const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), mat);
        mesh.position.set(gh.x * TILE, 0.75, gh.y * TILE);
        mesh.userData = { ghost: true, spin: true };
        this.ghostGroup.add(mesh);

        // path ribbon line from unit to ghost
        const points = [
          new THREE.Vector3(u.x * TILE, 0.5, u.y * TILE),
          new THREE.Vector3(gh.x * TILE, 0.7, gh.y * TILE),
        ];
        const line = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(points),
          new THREE.LineBasicMaterial({ color: COLORS.ghost, transparent: true, opacity: 0.55 }),
        );
        this.ghostGroup.add(line);
      }
    }

    // Entangle arcs
    for (const link of state.entanglements) {
      const a = state.units.find((u) => u.id === link.a);
      const b = state.units.find((u) => u.id === link.b);
      if (!a || !b || a.hp <= 0 || b.hp <= 0) continue;
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(a.x * TILE, 0.6, a.y * TILE),
        new THREE.Vector3(((a.x + b.x) / 2) * TILE, 1.6, ((a.y + b.y) / 2) * TILE),
        new THREE.Vector3(b.x * TILE, 0.6, b.y * TILE),
      );
      const pts = curve.getPoints(16);
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: COLORS.entangle, transparent: true, opacity: 0.75 }),
      );
      this.ghostGroup.add(line);
    }

    // Highlights
    while (this.hlGroup.children.length) {
      const c = this.hlGroup.children[0];
      this.hlGroup.remove(c);
      c.geometry?.dispose?.();
      c.material?.dispose?.();
    }
    const hlColor =
      hlMode === 'attack'
        ? COLORS.attack
        : hlMode === 'observe'
          ? COLORS.observe
          : hlMode === 'ghost'
            ? COLORS.ghost
            : COLORS.move;
    for (const h of highlights) {
      const m = new THREE.Mesh(
        new THREE.CircleGeometry(0.38, 20),
        new THREE.MeshBasicMaterial({
          color: hlColor,
          transparent: true,
          opacity: 0.4,
          depthWrite: false,
        }),
      );
      m.rotation.x = -Math.PI / 2;
      m.position.set(h.x * TILE, 0.22, h.y * TILE);
      this.hlGroup.add(m);
    }

    // Process FX events
    for (const ev of state.events || []) {
      this._fx(ev);
    }
  }

  _fx(ev) {
    if (this.quality === 'low') return;
    const count = this.quality === 'high' ? 28 : 12;
    if (ev.type === 'collapse' || ev.type === 'force_collapse' || ev.type === 'damage') {
      const payload = ev.payload || {};
      // find position from unit id if possible — use event payload coords if any
      let x = 0;
      let z = 0;
      if (payload.to) {
        x = payload.to.x * TILE;
        z = payload.to.y * TILE;
      }
      this._burst(x, 0.6, z, ev.type === 'damage' ? COLORS.enemy : COLORS.ghost, count);
    }
    if (ev.type === 'observe') {
      this._burst(0, 1, 0, COLORS.observe, count / 2);
    }
    if (ev.type === 'decohere') {
      this._burst(0, 0.5, 0, 0x64748b, 10);
    }
  }

  _burst(x, y, z, color, count) {
    for (let i = 0; i < count; i++) {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 6, 6),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 }),
      );
      m.position.set(x, y, z);
      const v = new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        Math.random() * 2.5,
        (Math.random() - 0.5) * 3,
      );
      this.fxGroup.add(m);
      this.particles.push({ mesh: m, v, life: 0.6 + Math.random() * 0.4 });
    }
  }

  /** Public FX for collapse at tile */
  burstAt(tx, ty, color = COLORS.ghost) {
    this._burst(tx * TILE, 0.7, ty * TILE, color, this.quality === 'high' ? 36 : 16);
  }

  _pointer(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    const tile = this._pickTile();
    this.hover = tile;
    if (this.onTileHover) this.onTileHover(tile);
  }

  _click(e) {
    if (e.button !== 0) return;
    const tile = this._pickTile();
    if (tile && this.onTileClick) this.onTileClick(tile.x, tile.y);
  }

  _pickTile() {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObject(this.pickPlane);
    if (!hits.length) return null;
    const p = hits[0].point;
    const x = Math.round(p.x / TILE);
    const y = Math.round(p.z / TILE);
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return null;
    return { x, y };
  }

  resize() {
    if (!this.container) return;
    const w = this.container.clientWidth;
    const h = Math.max(1, this.container.clientHeight);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  _animate() {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this._animate);
    const dt = Math.min(0.05, this.clock.getDelta());
    const t = this.clock.elapsedTime;

    // idle float units
    for (const child of this.unitGroup.children) {
      const base = child.userData.baseY || 0.18;
      child.position.y = base + Math.sin(t * 2 + child.position.x) * 0.04;
    }
    for (const child of this.ghostGroup.children) {
      if (child.userData?.spin) {
        child.rotation.y += dt * 1.8;
        child.position.y = 0.75 + Math.sin(t * 3 + child.position.x) * 0.08;
      }
    }

    // particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      p.v.y -= 4 * dt;
      p.mesh.position.addScaledVector(p.v, dt);
      p.mesh.material.opacity = Math.max(0, p.life);
      if (p.life <= 0) {
        this.fxGroup.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
        this.particles.splice(i, 1);
      }
    }

    // gentle camera sway
    if (this.boardCenter) {
      const c = this.boardCenter;
      const dist = Math.max(this.width, this.height) * 1.35 + 4;
      this.camera.position.x = c.x + dist * 0.55 + Math.sin(t * 0.15) * 0.15;
      this.camera.position.z = c.z + dist * 0.7 + Math.cos(t * 0.12) * 0.12;
      this.camera.lookAt(c.x, 0.2, c.z);
    }

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this._onResize);
    this.renderer.domElement.removeEventListener('pointermove', this._onPointer);
    this.renderer.domElement.removeEventListener('pointerdown', this._onClick);
    this.renderer.dispose();
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
