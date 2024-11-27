"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareHandsFactory = void 0;
const combine_1 = require("./combine");
const checker_1 = require("./checker");
const convert_1 = require("./convert");
const comparator_1 = require("./comparator");
const rankHand = (0, combine_1.pipe)(convert_1.sortCards, convert_1.processSortedCards, checker_1.determineRank);
const compareHandsFactory = (board) => (hand1, hand2) => {
    const fullHand1 = [hand1.card1, hand1.card2, board.card1, board.card2, board.card3, board.card4, board.card5];
    const fullHand2 = [hand2.card1, hand2.card2, board.card1, board.card2, board.card3, board.card4, board.card5];
    const rank1 = rankHand(fullHand1);
    const rank2 = rankHand(fullHand2);
    if (rank1.rank > rank2.rank) {
        return "Hand1";
    }
    if (rank2.rank > rank1.rank) {
        return "Hand2";
    }
    const compareCardValue = (0, comparator_1.compareCard)(rank1.highCard, rank2.highCard);
    if (compareCardValue < 0) {
        return "Hand1";
    }
    if (compareCardValue > 0) {
        return "Hand2";
    }
    return "Tie";
};
exports.compareHandsFactory = compareHandsFactory;
const hand1 = {
    card1: { value: 10, suite: "Heart" },
    card2: { value: 11, suite: "Heart" }
};
const hand2 = {
    card1: { value: 10, suite: "Spade" },
    card2: { value: 11, suite: "Spade" }
};
const board = {
    card1: { value: 9, suite: "Heart" },
    card2: { value: 12, suite: "Heart" },
    card3: { value: 13, suite: "Heart" },
    card4: { value: 2, suite: "Spade" },
    card5: { value: 5, suite: "Club" }
};
const notStraight = [
    { value: 9, suite: "Heart" },
    { value: 13, suite: "Heart" },
    { value: 6, suite: "Heart" },
    { value: 2, suite: "Spade" },
    { value: 5, suite: "Club" },
    { value: 13, suite: "Spade" },
    { value: 1, suite: "Club" },
];
const straight = [
    { value: 12, suite: "Heart" },
    { value: 11, suite: "Heart" },
    { value: 11, suite: "Heart" },
    { value: 10, suite: "Spade" },
    { value: 9, suite: "Club" },
    { value: 13, suite: "Spade" },
    { value: 1, suite: "Club" },
];
const result = compareHandsFactory(board)(hand1, hand2);
console.log("Winner:", result);
const card1 = { value: 13, suite: "Spade" };
const card2 = { value: 13, suite: "Diamond" };
const card3 = { value: 12, suite: "Heart" };
console.log((0, comparator_1.compareCard)(card2, card1));
console.log((0, comparator_1.compareCard)(card1, card3));
const fourKind = [
    { value: 12, suite: "Heart" },
    { value: 9, suite: "Heart" },
    { value: 1, suite: "Club" },
    { value: 9, suite: "Diamond" },
    { value: 9, suite: "Spade" },
    { value: 13, suite: "Spade" },
    { value: 9, suite: "Club" },
];
const sortedNotStraight = (0, convert_1.sortCards)(notStraight);
const sortedStraight = (0, convert_1.sortCards)(straight);
const sortedFourKind = (0, convert_1.sortCards)(fourKind);
console.log((0, checker_1.isStraight)(sortedNotStraight));
console.log((0, checker_1.isStraight)(sortedStraight));
console.log((0, checker_1.isNKind)(4)(sortedStraight));
console.log((0, checker_1.isNKind)(4)(sortedFourKind));
//# sourceMappingURL=compareHand.js.map