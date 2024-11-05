import { Card } from "../types/type";
import { generateDeck, formatCard } from "./convertNumber";
import { isNotEqual } from "./comparator";
import { getCurrentTime, getTommorow } from "./getTime";

type RandState = bigint;
type Xorshift64State = RandState;

const deterministicSeed = (seed: number = 1): RandState => BigInt(seed);

const nextXorshift64 = (state: Xorshift64State): Xorshift64State => {
  const a = state ^ (state << BigInt(13));
  const b = a ^ (a >> BigInt(7));
  return b ^ (b << BigInt(17));
}

const nextMod = (mod: number) => {
  return (state: RandState): RandState => {
    const bigMod = BigInt(mod)
    if (state + bigMod > 52) {
      const nxt = state % bigMod + BigInt(1)
      return nxt
    }
    return state + bigMod
  }
}

const generateRandomList = (
  generator: (state: RandState) => RandState,
  state: RandState,
  count: number,
  transform: (value: bigint) => bigint = (value) => value
): bigint[] => {
  if (count == 0) return [];
  const nextState = generator(state);
  return [transform(nextState), ...generateRandomList(generator, nextState, count-1, transform)]
}

const moduloBy = (value: bigint, modulus: number): bigint => value % BigInt(modulus)

const shuffleDeck = (
  deck: Card[],
  rngGen: (state: RandState) => RandState = nextXorshift64,
  state: RandState = deterministicSeed(getCurrentTime())
): Card[] => {
  const n = deck.length;
  if (n == 0) return [];
  const nextState = rngGen(state);
  console.log("Now: ", state)
  const el = deck[Number(moduloBy(nextState, n))];
  return [el, ...shuffleDeck(deck.filter(isNotEqual(el)), rngGen, nextState)];
}

const deck = generateDeck();
console.log("Deck: ", deck.map(formatCard));

/* This utilizes Xorshift64 as randomization algorithm */
console.log("Shuffled: ", shuffleDeck(deck, nextXorshift64, BigInt(getTommorow())).map(formatCard))
//                                              Note: can also use getCurrentTime()


/* This utilizes (+4) mod as "randomization" algorithm */
console.log("Shuffled Mod 4: ", shuffleDeck(deck, nextMod(4), deterministicSeed(1)).map(formatCard))
export {
  shuffleDeck,
}
