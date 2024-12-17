import { Card, Hand, Board, FullHand } from "../types/type";
import { pipe } from "./combine";
import { compareBlackJackCard, determineRank, isNKind, isStraight } from "./checker";
import { getSum, processSortedCards, sortCards } from "./convert";
import { compareCard } from "./comparator";
import { handFromArray } from "./convert";

type RankResult = { rank: number; highCard?: Card };
type Comparator = (a: Card | number, b: Card | number) => number;
type Ranker = (hand: Card[]) => RankResult | number;
type OptionalBustChecker = (hand: Card[]) => boolean | undefined;

const determineWinnerFactory = (
  ranker: Ranker,
  comparator: Comparator,
  isBust?: OptionalBustChecker 
) => (hand1: Card[], hand2: Card[]): string => {
  if (isBust) {
    const isHand1Bust = isBust(hand1);
    const isHand2Bust = isBust(hand2);

    if (isHand1Bust) {
      return "Hand2 Wins";
    }

    if (isHand2Bust) {
      return "Hand1 Wins";
    }
  }

  const rank1 = ranker(hand1);
  const rank2 = ranker(hand2);

  
  if (typeof rank1 === "number" && typeof rank2 === "number") {
    if (rank1 > rank2) return "Hand1 Wins";
    if (rank1 < rank2) return "Hand2 Wins";
  }

  
  if (typeof rank1 === "object" && typeof rank2 === "object") {
    if (rank1.rank > rank2.rank) return "Hand1 Wins";
    if (rank1.rank < rank2.rank) return "Hand2 Wins";

    
    if (rank1.highCard !== undefined && rank2.highCard !== undefined) {
      const tieBreaker = comparator(rank1.highCard, rank2.highCard);
      if (tieBreaker < 0) return "Hand2 Wins";
      if (tieBreaker > 0) return "Hand1 Wins";
    }
  }

  return "Tie";
};

const rankHandPoker = pipe<FullHand, RankResult>(
  sortCards,
  processSortedCards,
  determineRank
);

const pokerDetermineWinner = (board: Board) => (hand1: Hand, hand2: Hand): string => {
  const fullHand1: Card[] = [hand1.card1, hand2.card2, board.card1, board.card2, board.card3, board.card4, board.card5];
  const fullHand2: Card[] = [hand2.card1, hand2.card2, board.card1, board.card2, board.card3, board.card4, board.card5];

  return determineWinnerFactory(rankHandPoker, compareCard)(fullHand1, fullHand2);
};

const blackJackDetermineWinner = determineWinnerFactory(
  getSum,
  compareBlackJackCard
)

const hand1: [Card, Card] = [
  { value: 10, suite: "Heart" },
  { value: 11, suite: "Heart" }
];

const hand2: [Card, Card] = [
  { value: 10, suite: "Spade" },
  { value: 11, suite: "Spade" }
];

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

const result = pokerDetermineWinner(board)(handFromArray(hand1), handFromArray(hand2));
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
  pokerDetermineWinner,
  blackJackDetermineWinner
}
