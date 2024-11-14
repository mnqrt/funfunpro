"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareCard = exports.compareValueCount = exports.not = exports.isDiffOne = exports.isNotEqual = void 0;
const convert_1 = require("./convert");
const isNotEqual = (item) => {
    return (value) => {
        return item !== value;
    };
};
exports.isNotEqual = isNotEqual;
const not = (comparator) => {
    return (val1) => {
        return (val2) => {
            return !comparator(val1)(val2);
        };
    };
};
exports.not = not;
const compareValueCount = (a, b) => b.count - a.count || b.value - a.value;
exports.compareValueCount = compareValueCount;
const compareCard = (a, b) => b.value - a.value || (0, convert_1.suiteRank)(b.suite) - (0, convert_1.suiteRank)(a.suite);
exports.compareCard = compareCard;
const isDiffOne = (a) => (b) => (a - 1) === b;
exports.isDiffOne = isDiffOne;
//# sourceMappingURL=comparator.js.map