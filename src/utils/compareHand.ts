import { Card, Hand, Board, FullHand, RankResult } from "../types/type";
import { pipe } from "./combine";
import { determineRank, isNKind, isStraight } from "./checker";
import { processSortedCards, sortCards } from "./convert";
import { compareCard } from "./comparator";

const rankHand = pipe<FullHand, RankResult>(
  sortCards,
  processSortedCards,
  determineRank
);


const compareHandsFactory = (board: Board) => (hand1: Hand, hand2: Hand): "Hand1" | "Hand2" | "Tie" => {
  const fullHand1: FullHand = [hand1.card1, hand1.card2, board.card1, board.card2, board.card3, board.card4, board.card5];
  const fullHand2: FullHand = [hand2.card1, hand2.card2, board.card1, board.card2, board.card3, board.card4, board.card5];

  const rank1 = rankHand(fullHand1);
  const rank2 = rankHand(fullHand2);

  if (rank1.rank > rank2.rank) {
    return "Hand1";
  } 
  
  if (rank2.rank > rank1.rank) {
    return "Hand2";
  } 

  const compareCardValue = compareCard(rank1.highCard, rank2.highCard)
  if (compareCardValue < 0) {
    return "Hand1"
  }

  if (compareCardValue > 0) {
    return "Hand2"
  }

  return "Tie"
};

const hand1: Hand = {
  card1: { value: 10, suite: "Heart" },
  card2: { value: 11, suite: "Heart" }
};

const hand2: Hand = {
  card1: { value: 10, suite: "Spade" },
  card2: { value: 11, suite: "Spade" }
};

const board: Board = {
  card1: { value: 9, suite: "Heart" },
  card2: { value: 12, suite: "Heart" },
  card3: { value: 13, suite: "Heart" },
  card4: { value: 2, suite: "Spade" },
  card5: { value: 5, suite: "Club" }
};

const notStraight: FullHand = [
  { value: 9, suite: "Heart" },
  { value: 13, suite: "Heart" },
  { value: 6, suite: "Heart" },
  { value: 2, suite: "Spade" },
  { value: 5, suite: "Club" },
  { value: 13, suite: "Spade" },
  { value: 1, suite: "Club" },
]

const straight: FullHand = [
  { value: 12, suite: "Heart" },
  { value: 11, suite: "Heart" },
  { value: 11, suite: "Heart" },
  { value: 10, suite: "Spade" },
  { value: 9, suite: "Club" },
  { value: 13, suite: "Spade" },
  { value: 1, suite: "Club" },
]

const result = compareHandsFactory(board)(hand1, hand2);
console.log("Winner:", result);

const card1: Card = {value: 13, suite: "Spade"}
const card2: Card = {value: 13, suite: "Diamond"}
const card3: Card = {value: 12, suite: "Heart"}

console.log(compareCard(card2, card1))

console.log(compareCard(card1, card3))

const fourKind: FullHand = [
  { value: 12, suite: "Heart" },
  { value: 9, suite: "Heart" },
  { value: 1, suite: "Club" },
  { value: 9, suite: "Diamond" },
  { value: 9, suite: "Spade" },
  { value: 13, suite: "Spade" },
  { value: 9, suite: "Club" },
]

const sortedNotStraight = sortCards(notStraight);
const sortedStraight = sortCards(straight);
const sortedFourKind = sortCards(fourKind);

console.log(isStraight(sortedNotStraight));
console.log(isStraight(sortedStraight))
console.log(isNKind(4)(sortedStraight));
console.log(isNKind(4)(sortedFourKind));

// const result = compareHands(hand1, hand2, board);
// console.log("Winner:", result);

export {
  compareHandsFactory
}
