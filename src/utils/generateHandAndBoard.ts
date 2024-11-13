import { Card } from "../types/type";
import { generateDeck } from "./convert";

const generateHand = (playerCount: number) => (deck: Card[]): [Card[][], Card[]] => {
  const hands = Array.from({ length: playerCount }, (_, player) => 
    [deck[player * 2], deck[player * 2 + 1]]
  );

  const remainingDeck = deck.reduce((acc: Card[], card, index) => {
    return index >= playerCount * 2 ? [...acc, card] : acc;
  }, []);

  return [hands, remainingDeck];
};

const deck = generateDeck();
console.log(generateHand(5)(deck))