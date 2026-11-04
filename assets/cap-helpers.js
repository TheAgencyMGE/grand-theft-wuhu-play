// Trailer capture helpers (dev only). Loaded via: await import('/cap-helpers.js')
const g = window.__game;
const T = g.THREE;
window.__gtwTest = true;
g.renderer.setPixelRatio(1);
const W = 1920, H = 1080;
const C = {
  g, T,
  async frame(dir, i) {
    const r = g.renderer;
    if (r.domElement.width !== W) r.setSize(W, H, false);
    g.camera.aspect = W / H;
    g.camera.updateProjectionMatrix();
    r.render(g.scene, g.camera);
    const url = r.domElement.toDataURL('image/jpeg', 0.82);
    await fetch(`http://localhost:5199/?d=${dir}&n=${String(i).padStart(4, '0')}`, { method: 'POST', body: url });
  },
  hide() { g.player.mii.root.visible = false; },
  look(px, py, pz, tx, ty, tz) { g.camera.position.set(px, py, pz); g.camera.lookAt(tx, ty, tz); },
  lerp(a, b, t) { return a + (b - a) * t; },
  ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; },
  immortal() { g.player.health = 100; g.player.alive = true; g.player.damage = () => {}; },
  /** Run a shot: setup() once, then per frame: step sim, per(i, t) sets camera, then capture. */
  async shot(dir, frames, per, { sub = 2, dt = 1 / 60, start = 0 } = {}) {
    for (let i = start; i < frames; i++) {
      g.step(sub, dt);
      this.immortal();
      per(i, i / Math.max(1, frames - 1));
      await this.frame(dir, i);
    }
  },
};
window.C = C;
export default C;
