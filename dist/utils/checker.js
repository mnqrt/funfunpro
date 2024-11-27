"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.determineWinner = exports.isBust = exports.stand = exports.hit = exports.determineRank = exports.isNKind = exports.isStraight = exports.isFlush = void 0;
const comparator_1 = require("./comparator");
const convert_1 = require("./convert");
const consecutiveFactory = (base) => (numConsecutive) => {
    return (checker) => {
        return (values) => {
            if (numConsecutive <= 0) {
                return true;
            }
            if (values.length < 2) {
                return false;
            }
            const [cur, next, ...rest] = values;
            if (checker(cur)(next)) {
                return consecutiveFactory(base)(numConsecutive - 1)(checker)([next, ...rest]);
            }
            return consecutiveFactory(base)(base)(checker)([next, ...rest]);
        };
    };
};
const consecutiveWithBase = (n) => consecutiveFactory(n)(n);
const isFlush = (cards) => {
    const sortedSuites = cards.map(card => card.suite).sort((a, b) => (0, convert_1.suiteRank)(b) - (0, convert_1.suiteRank)(a));
    return consecutiveWithBase(4)((0, comparator_1.not)(comparator_1.isNotEqual))(sortedSuites);
};
exports.isFlush = isFlush;
const isStraight = (cards) => {
    const sortedValues = (0, convert_1.uniqueValues)(cards.map(convert_1.getValue));
    return consecutiveWithBase(4)(comparator_1.isDiffOne)(sortedValues);
};
exports.isStraight = isStraight;
const isNKind = (n) => (cards) => {
    const sortedValues = cards.map(card => card.value);
    return consecutiveWithBase(n - 1)((0, comparator_1.not)(comparator_1.isNotEqual))(sortedValues);
};
exports.isNKind = isNKind;
const determineRank = ({ isFlushHand, isStraightHand, valueCounts, highCard }) => {
    const rankConditions = [
        { rank: 10, condition: () => isFlushHand && isStraightHand && highCard.value === 13 },
        { rank: 9, condition: () => isFlushHand && isStraightHand },
        { rank: 8, condition: () => valueCounts[0].count === 4 },
        { rank: 7, condition: () => { var _a; return valueCounts[0].count === 3 && ((_a = valueCounts[1]) === null || _a === void 0 ? void 0 : _a.count) === 2; } },
        { rank: 6, condition: () => isFlushHand },
        { rank: 5, condition: () => isStraightHand },
        { rank: 4, condition: () => valueCounts[0].count === 3 },
        { rank: 3, condition: () => { var _a; return valueCounts[0].count === 2 && ((_a = valueCounts[1]) === null || _a === void 0 ? void 0 : _a.count) === 2; } },
        { rank: 2, condition: () => valueCounts[0].count === 2 },
        { rank: 1, condition: () => true }
    ];
    return { rank: rankConditions.find(({ condition }) => condition()).rank, highCard };
};
exports.determineRank = determineRank;
const hit = (hand, deck) => {
    const [first, ...rest] = deck;
    const result = [...hand, first];
    return [result, rest];
};
exports.hit = hit;
const hitUntil = (stop) => (hand, deck) => {
    const [result, rest] = hit(hand, deck);
    if ((0, convert_1.getSum)(result) < stop) {
        return hitUntil(stop)(result, rest);
    }
    return [result, rest];
};
const stand = (dealer, deck) => {
    return hitUntil(17)(dealer, deck);
};
exports.stand = stand;
const isBust = (hand) => (0, convert_1.getSum)(hand) > 21;
exports.isBust = isBust;
const determineWinner = (player, dealer) => {
    const playerPoint = (0, convert_1.getSum)(player);
    const dealerPoint = (0, convert_1.getSum)(dealer);
    const isPlayerBust = isBust(player);
    const isDealerBust = isBust(dealer);
    if (isPlayerBust) {
        return "Dealer Wins";
    }
    if (isDealerBust) {
        return "Player Wins";
    }
    if (playerPoint > dealerPoint) {
        return "Player Wins";
    }
    if (playerPoint < dealerPoint) {
        return "Dealer Wins";
    }
    return "Tie";
};
exports.determineWinner = determineWinner;
//# sourceMappingURL=checker.js.map