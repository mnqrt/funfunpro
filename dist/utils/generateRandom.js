"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffleDeck = void 0;
const convert_1 = require("./convert");
const comparator_1 = require("./comparator");
const getTime_1 = require("./getTime");
const deterministicSeed = (seed = 1) => BigInt(seed);
const nextXorshift64 = (state) => {
    const a = state ^ (state << BigInt(13));
    const b = a ^ (a >> BigInt(7));
    return b ^ (b << BigInt(17));
};
const nextMod = (mod) => {
    return (state) => {
        const bigMod = BigInt(mod);
        if (state + bigMod > 52) {
            const nxt = state % bigMod + BigInt(1);
            return nxt;
        }
        return state + bigMod;
    };
};
const generateRandomList = (generator, state, count, transform = (value) => value) => {
    if (count == 0)
        return [];
    const nextState = generator(state);
    return [transform(nextState), ...generateRandomList(generator, nextState, count - 1, transform)];
};
const moduloBy = (value, modulus) => value % BigInt(modulus);
const shuffleDeck = (deck, rngGen = nextXorshift64, state = deterministicSeed((0, getTime_1.getCurrentTime)())) => {
    const n = deck.length;
    if (n == 0)
        return [];
    const nextState = rngGen(state);
    console.log("Now: ", state);
    const el = deck[Number(moduloBy(nextState, n))];
    return [el, ...shuffleDeck(deck.filter((0, comparator_1.isNotEqual)(el)), rngGen, nextState)];
};
exports.shuffleDeck = shuffleDeck;
const deck = (0, convert_1.generateDeck)();
console.log("Deck: ", deck.map(convert_1.formatCard));
/* This utilizes Xorshift64 as randomization algorithm */
console.log("Shuffled: ", shuffleDeck(deck, nextXorshift64, BigInt((0, getTime_1.getTommorow)())).map(convert_1.formatCard));
//                                              Note: can also use getCurrentTime()
/* This utilizes (+4) mod as "randomization" algorithm */
console.log("Shuffled Mod 4: ", shuffleDeck(deck, nextMod(4), deterministicSeed(1)).map(convert_1.formatCard));
//# sourceMappingURL=generateRandom.js.map