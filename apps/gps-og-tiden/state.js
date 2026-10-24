(function (root) {
  'use strict';
  const defaults = () => ({chapter: 1, level: 1, days: 0, running: false, speed: 0.2,
    beta: 0.6, height: 20200, labDays: 1, gravity: true, motion: true,
    error: 38.5, receiver: {x: 390, y: 270}, bias: 20, rings: true});
  const state = defaults();
  function readURL() {
    const params = new URLSearchParams(location.hash.slice(1));
    state.chapter = Math.max(1, Math.min(7, Number(params.get('kapitel')) || 1));
    state.chapter = Math.floor(state.chapter);
    state.level = Math.max(1, Math.min(3, Math.floor(Number(params.get('niveau')) || 1)));
  }
  function saveURL() {
    const hash = `#kapitel=${state.chapter}&niveau=${state.level}`;
    try { history.replaceState(null, '', hash); } catch { location.hash = hash; }
  }
  function reset() { Object.assign(state, defaults()); saveURL(); }
  readURL();
  root.GPSState = {state, readURL, saveURL, reset};
})(globalThis);
