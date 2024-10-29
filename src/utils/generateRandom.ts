import { Card } from "../types/type";
import { generateDeck, formatCard } from "./convertNumber";

type RandState = bigint;
type Xorshift64State = RandState;

const deterministicSeed = (seed: number = 1): Xorshift64State => BigInt(seed);

const xorshift64Step = (state: Xorshift64State): Xorshift64State => {
  let x = state;
  x ^= x << BigInt(13);
  x ^= x >> BigInt(7);
  x ^= x << BigInt(17);
  return x;
}

const next = (state: Xorshift64State): [bigint, Xorshift64State] => {
  const newState = xorshift64Step(state);
  return [newState, newState];
}

const generateRandomList = (
  generator: (state: RandState) => [bigint, RandState],
  state: RandState,
  count: number,
  transform: (value: bigint) => bigint = (value) => value
): bigint[] => {
  if (count == 0) return [];
  const [val, nextState] = generator(state);
  return [transform(val), ...generateRandomList(generator, nextState, count-1, transform)]

  // let sequence = [];
  // let state = initialState;
  // for (let i = 0; i < count; i++) {
  //   const [randomValue, newState] = generator(state);
  //   sequence.push(transform(randomValue))
  //   state = newState;
  // }

  // return sequence;
}

// const seed = deterministicSeed(42);

// const randomSequence = generateRandomList(next, seed, 60);

const moduloBy = (value: bigint, modulus: number): bigint => value % BigInt(modulus)

const shuffleDeck = (deck: Card[]): Card[] => {
  const n = deck.length;
  if (n == 0) return [];

  const [idx, _] = next(deterministicSeed(Date.now()));
  const el = deck[Number(moduloBy(idx, n))];
  return [el, ...shuffleDeck(deck.filter((x) => x != el))];
}

const deck = generateDeck();
console.log("Deck: ", deck.map(card => formatCard(card)));
console.log("Shuffled: ", shuffleDeck(deck).map(card => formatCard(card)))

// console.log("Random sequence of 64-bit numbers:", randomSequence.map(n => moduloBy(n, 13).toString()));

// const doubledSequence = generateCustomSequence(
//   next, 
//   seed, 
//   5, 
//   (value) => value * BigInt(2)
// );
// console.log("Doubled random sequence of 64-bit numbers:", doubledSequence.map(n => n.toString()));

// const squaredSequence = generateCustomSequence(
//   next,
//   seed,
//   5,
//   (value) => value * value
// );
// console.log("Squared random sequence of 64-bit numbers:", squaredSequence.map(n => n.toString()));
