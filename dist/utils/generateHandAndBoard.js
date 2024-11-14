"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBoard = exports.generateHand = void 0;
const convert_1 = require("./convert");
const generateRandom_1 = require("./generateRandom");
const generateHand = (playerCount) => (deck) => {
    const hands = Array.from({ length: playerCount }, (_, player) => [deck[player * 2], deck[player * 2 + 1]]);
    const remainingDeck = deck.reduce((acc, card, index) => {
        return index >= playerCount * 2 ? [...acc, card] : acc;
    }, []);
    return [hands, remainingDeck];
};
exports.generateHand = generateHand;
const generateBoard = (deck) => {
    const [card1, card2, card3, card4, card5, ...rest] = deck;
    return [[card1, card2, card3, card4, card5], rest];
};
exports.generateBoard = generateBoard;
const deck = (0, generateRandom_1.shuffleDeck)((0, convert_1.generateDeck)());
const [hand, rest] = generateHand(5)(deck);
const [board, _] = generateBoard(rest);
console.log(hand);
console.log(board);
//# sourceMappingURL=generateHandAndBoard.js.map