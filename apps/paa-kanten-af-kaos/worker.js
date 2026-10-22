// A fresh worker for each view makes cancellation immediate via terminate().
self.onmessage = ({data: {view, width, height, burn, keep, initial, samples}}) => {
  const density = new Uint16Array(width * height);
  for (let col = 0; col < samples; col++) {
    const r = view.r0 + (col + 0.5) / samples * (view.r1 - view.r0);
    const px = Math.floor(col / samples * width);
    let x = initial;
    for (let n = 1; n <= burn + keep; n++) {
      x = r * x * (1 - x);
      if (n <= burn || x < view.x0 || x > view.x1) continue;
      const py = Math.min(height - 1, Math.floor((view.x1 - x) / (view.x1 - view.x0) * height));
      const i = py * width + px;
      if (density[i] < 65535) density[i]++;
    }
  }
  self.postMessage({density, width, height}, [density.buffer]);
};
