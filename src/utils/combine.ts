const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);
const map = (fn) => (arr) => arr.map(fn);
const sort = (compareFn) => (arr) => [...arr].sort(compareFn);
const plus2 = (x: number) => x+2
const times2 = (x: number) => x*2
const minus2 = (x: number) => x-2

const processX = (listF:((number) => number)[]) => {
  return (x: number) => {
    if (listF.length < 3) return 0
    const curN = listF[0]
    const Pr = listF[1]
    const nextN = listF[1](x)
    return listF[2](listF[1](listF[0](x)))
  }
}

export {
  pipe,
  map,
  sort,
  processX
}