import { Card } from "../types/type";
import { generateDeck } from "./convert";
import { shuffleDeck } from "./generateRandom";

const generateHand = (playerCount: number) => (deck: Card[]): [Card[][], Card[]] => {
  const hands = Array.from({ length: playerCount }, (_, player) => 
    [deck[player * 2], deck[player * 2 + 1]]
  );

  const remainingDeck = deck.reduce((acc: Card[], card, index) => {
    return index >= playerCount * 2 ? [...acc, card] : acc;
  }, []);

  return [hands, remainingDeck];
};

const generateBoard = (deck: Card[]): [Card[], Card[]] => {
  const [card1, card2, card3, card4, card5, ...rest] = deck;
  return [[card1, card2, card3, card4, card5], rest];
}

const deck = shuffleDeck(generateDeck());
const [hand, rest] = generateHand(5)(deck);
const [board, _] = generateBoard(rest)
console.log(hand)
console.log(board)

export {
  generateHand,
  generateBoard
}
