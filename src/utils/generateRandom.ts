type Xorshift64State = bigint;

function deterministicSeed(seed: number = 1): Xorshift64State {
  return BigInt(seed);
}

function xorshift64Step(state: Xorshift64State): Xorshift64State {
  let x = state;
  x ^= x << BigInt(13);
  x ^= x >> BigInt(7);
  x ^= x << BigInt(17);
  return x;
}

function next(state: Xorshift64State): [bigint, Xorshift64State] {
  const newState = xorshift64Step(state);
  return [newState, newState];
}

function generateCustomSequence(
  generator: (state: Xorshift64State) => [bigint, Xorshift64State],
  initialState: Xorshift64State,
  count: number,
  transform: (value: bigint) => bigint = (value) => value
): bigint[] {
  const sequence: bigint[] = [];
  let state = initialState;

  for (let i = 0; i < count; i++) {
    const [randomValue, newState] = generator(state);
    sequence.push(transform(randomValue))
    state = newState;
  }

  return sequence;
}

const seed = deterministicSeed(42);

const randomSequence = generateCustomSequence(next, seed, 60);

const moduloBy = (value: bigint, modulus: number): bigint => {
  return (value % BigInt(modulus))
}

console.log("Random sequence of 64-bit numbers:", randomSequence.map(n => moduloBy(n, 13).toString()));

const doubledSequence = generateCustomSequence(
  next, 
  seed, 
  5, 
  (value) => value * BigInt(2)
);
console.log("Doubled random sequence of 64-bit numbers:", doubledSequence.map(n => n.toString()));

const squaredSequence = generateCustomSequence(
  next,
  seed,
  5,
  (value) => value * value
);
console.log("Squared random sequence of 64-bit numbers:", squaredSequence.map(n => n.toString()));
