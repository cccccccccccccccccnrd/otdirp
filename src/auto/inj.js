const ofs = [
  {
    o: HTMLCanvasElement.prototype,
    f: 'toDataURL'
  },
  {
    o: CanvasRenderingContext2D.prototype,
    f: 'fillText'
  },
  /* {
    o: CanvasRenderingContext2D.prototype,
    f: 'fill'
  },
  {
    o: CanvasRenderingContext2D.prototype,
    f: 'fillRect'
  },
  {
    o: CanvasRenderingContext2D.prototype,
    f: 'measureText'
  },
  {
    o: CanvasRenderingContext2D.prototype,
    f: 'arc'
  },
  {
    o: CanvasRenderingContext2D.prototype,
    f: 'createLinearGradient'
  } */
]

ofs.forEach(of => {
  const o = of.o[of.f]
  of.o[of.f] = function () {
    const r = o.apply(this, arguments)
    const s = Error().stack.split('\n').map((l) => l.trim()).slice(1)
    d1ff3r3nc3(of.f, arguments, r, s)
    return r
  }
})
