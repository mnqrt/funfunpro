"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.boardFromArray = exports.handFromArray = exports.getSum = exports.processSortedCards = exports.getValueCounts = exports.sortCards = exports.uniqueValues = exports.getValue = exports.suiteRank = exports.unformatCard = exports.formatCard = exports.generateDeck = exports.convertNumber = void 0;
const type_1 = require("../types/type");
const checker_1 = require("./checker");
const combine_1 = require("./combine");
const comparator_1 = require("./comparator");
const convertNumber = (value) => {
    if (value == 1)
        return "A";
    if (value == 11)
        return "J";
    if (value == 12)
        return "Q";
    if (value == 13)
        return "K";
    return value.toString();
};
exports.convertNumber = convertNumber;
const unconvertNumber = (value) => {
    if (value == "A")
        return 1;
    if (value == "J")
        return 11;
    if (value == "Q")
        return 12;
    if (value == "K")
        return 13;
    return parseInt(value);
};
const generateDeck = () => {
    return type_1.suites.flatMap(suite => type_1.values.map(value => ({
        value,
        suite
    })));
};
exports.generateDeck = generateDeck;
const suiteRank = (suite) => {
    const ranking = {
        "Spade": 4,
        "Heart": 3,
        "Diamond": 2,
        "Club": 1,
    };
    return ranking[suite];
};
exports.suiteRank = suiteRank;
const formatCard = ({ value, suite }) => {
    return convertNumber(value) + " " + suite;
};
exports.formatCard = formatCard;
const unformatCard = (card) => {
    const [cardVal, cardSuite] = card.split(' ');
    return {
        suite: cardSuite,
        value: unconvertNumber(cardVal)
    };
};
exports.unformatCard = unformatCard;
const getValue = (card) => card.value;
exports.getValue = getValue;
const uniqueValues = (arr) => arr.filter((value, index, self) => self.indexOf(value) === index);
exports.uniqueValues = uniqueValues;
const sortCards = (cards) => [...cards].sort(comparator_1.compareCard);
exports.sortCards = sortCards;
const updateValue = (curValue, card) => {
    if (!curValue) {
        return { count: 0, suiteNum: suiteRank(card.suite) };
    }
    let { count, suiteNum } = curValue;
    count += 1;
    suiteNum = Math.max(suiteNum, suiteRank(card.suite));
    return { count, suiteNum };
};
const getValueCounts = (cards) => {
    const counts = {};
    cards.forEach(card => counts[card.value] = updateValue(counts[card.value], card));
    return counts;
};
exports.getValueCounts = getValueCounts;
const getSortedValueCounts = (sortedCards) => (0, combine_1.pipe)(getValueCounts, Object.entries, (0, combine_1.map)(([value, count]) => ({ value: parseInt(value), count })), (0, combine_1.sort)(comparator_1.compareValueCount))(sortedCards);
const processSortedCards = (sortedCards) => ({
    sortedCards,
    isFlushHand: (0, checker_1.isFlush)(sortedCards),
    isStraightHand: (0, checker_1.isStraight)(sortedCards),
    valueCounts: getSortedValueCounts(sortedCards),
    highCard: sortedCards[0]
});
exports.processSortedCards = processSortedCards;
const getSum = (hand) => hand.map(getValue).reduce((a, b) => a + b, 0);
exports.getSum = getSum;
const handFromArray = (array) => {
    const [card1, card2] = array;
    return { card1, card2 };
};
exports.handFromArray = handFromArray;
const boardFromArray = (array) => {
    const [card1, card2, card3, card4, card5] = array;
    return { card1, card2, card3, card4, card5 };
};
exports.boardFromArray = boardFromArray;
//# sourceMappingURL=convert.js.map