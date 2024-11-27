"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sort = exports.map = exports.pipe = void 0;
const pipe = (...fns) => {
    return (x) => fns.reduce((value, fn) => fn(value), x);
};
exports.pipe = pipe;
const map = (fn) => (arr) => arr.map(fn);
exports.map = map;
const sort = (compareFn) => (arr) => [...arr].sort(compareFn);
exports.sort = sort;
//# sourceMappingURL=combine.js.map