import { Card, Hand, Board, Suite, Value } from "../types/type";
import { pipe, map, sort } from "./combine";

type FullHand = Card[];

const getValue = (card: Card): Value => card.value
const uniqueValues = <T>(arr: T[]): T[] => arr.filter((value, index, self) => self.indexOf(value) === index);

const sortCards = (cards: FullHand): Card[] => {
  return [...cards].sort(compareCard);
};

const suiteRank = (suite: Suite): number => {
  const ranking = {
    "Spade": 4,
    "Heart": 3,
    "Diamond": 2,
    "Club": 1,
  };
  return ranking[suite];
};

const compareCard = (a: Card, b: Card) => {
  return b.value - a.value || suiteRank(b.suite) - suiteRank(a.suite)
}

const isFlush = (cards: FullHand): boolean => {
  if (cards.length < 5) {
    return false
  }

  const firstSuite = cards[0].suite;
  const sameSuite = cards.filter(card => card.suite === firstSuite);
  if (sameSuite.length >= 5) {
    return true
  }

  return isFlush(cards.slice(1))
};

const consecutiveFactory = (numConsecutive: number) => {
  return (values: Value[]): boolean => {
    if (numConsecutive <= 0) {
      return true
    }
    if (values.length < 2) {
      return false
    }
    
    if (values[0] - 1 === values[1]) {
      return consecutiveFactory(numConsecutive - 1)(values.slice(1))
    }

    return consecutiveFactory(4)(values.slice(1))
  }
}

const isStraight = (cards: FullHand): boolean => {
  const sortedValues = uniqueValues(cards.map(getValue));
  return consecutiveFactory(4)(sortedValues);
};

const updateValue = (curValue: { count: number, suiteNum: number }, card: Card) => {
  if (!curValue) {
    return { count: 0, suiteNum: suiteRank(card.suite) }
  }

  let { count, suiteNum } = curValue
  count += 1
  suiteNum = Math.max(suiteNum, suiteRank(card.suite))
  return { count, suiteNum } 
}

const getValueCounts = (cards: FullHand): Record<number, { count: number, suiteNum: number }> => {
  const counts: Record<number, { count: number, suiteNum: number }> = {};
  cards.forEach(card => counts[card.value] = updateValue(counts[card.value], card));
  return counts;
};

const rankHand = (cards: Card[]) => {
  const sortedCards = sortCards(cards);
  const isFlushHand = isFlush(sortedCards);
  const isStraightHand = isStraight(sortedCards);
  const valueCounts = pipe(
    getValueCounts,
    Object.entries,
    map(([value, count]) => ({ value: parseInt(value), count })),
    sort((a, b) => b.count - a.count || b.value - a.value)
  )(sortedCards);

  const highCard = ({ suite, value }) => ({ suite, value });
  const highCardObj = highCard(sortedCards[0]);

  const rankConditions = [
    { condition: () => isFlushHand && isStraightHand && highCardObj.value === 13, rank: 10 },
    { condition: () => isFlushHand && isStraightHand, rank: 9 },
    { condition: () => valueCounts[0].count === 4, rank: 8 },
    { condition: () => valueCounts[0].count === 3 && valueCounts[1]?.count === 2, rank: 7 },
    { condition: () => isFlushHand, rank: 6 },
    { condition: () => isStraightHand, rank: 5 },
    { condition: () => valueCounts[0].count === 3, rank: 4 },
    { condition: () => valueCounts[0].count === 2 && valueCounts[1]?.count === 2, rank: 3 },
    { condition: () => valueCounts[0].count === 2, rank: 2 },
    { condition: () => true, rank: 1 },
  ];

  const rank = rankConditions.find(({ condition }) => condition()).rank;
  return { rank, highCard: highCardObj };
};

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

console.log(isStraight(sortCards(straight)))
console.log(isStraight(sortCards(notStraight)))

const result = compareHandsFactory(board)(hand1, hand2);
console.log("Winner:", result);



const card1: Card = {value: 13, suite: "Spade"}
const card2: Card = {value: 13, suite: "Diamond"}
const card3: Card = {value: 12, suite: "Heart"}

console.log(compareCard(card2, card1))

console.log(compareCard(card1, card3))
