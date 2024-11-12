const pipe = <T>(...fns: ((val: T) => T)[]) => (x: T) => fns.reduce((v, f) => f(v), x);
const map = <T>(fn: ((val: T) => T)) => (arr: T[]) => arr.map(fn);
const sort = <T>(compareFn: (a: T, b: T) => number) => (arr: T[]) => [...arr].sort(compareFn);

export {
  pipe,
  map,
  sort
}