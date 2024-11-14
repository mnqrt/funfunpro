"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTommorow = exports.getCurrentTime = void 0;
const getCurrentTime = () => {
    return Date.now();
};
exports.getCurrentTime = getCurrentTime;
const getTommorow = () => {
    return Date.now() + 24 * 60 * 60 * 1000;
};
exports.getTommorow = getTommorow;
//# sourceMappingURL=getTime.js.map