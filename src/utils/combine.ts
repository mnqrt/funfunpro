const pipe = <T, R>(...fns: [(x: T) => any, ...Array<(x: any) => any>]): (x: T) => R => {
  return (x: T) => fns.reduce((value, fn) => fn(value), x) as R;
};

const map = <T>(fn: ((val: T) => T)) => (arr: T[]) => arr.map(fn);
const sort = <T>(compareFn: (a: T, b: T) => number) => (arr: T[]) => [...arr].sort(compareFn);

export {
  pipe,
  map,
  sort
}