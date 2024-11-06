import { Card, Hand, Board, Suite, Value } from "../types/type";
import { not, isDiffOne, isNotEqual } from "./comparator";

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

const countSame = <T>(list: T[], filter: ((a: T) => (b: T) => boolean)) => {
  return list.map(val => list.filter(filter(val)).length);
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

const consecutiveFactory = <T>(numConsecutive: number) => {
  return (checker: ((a: T) => (b: T) => boolean)) => {
    return (values: T[]): boolean => {
      if (numConsecutive <= 0) {
        return true
      }
      if (values.length < 2) {
        return false
      }
      
      const [cur, next, ...rest] = values;
      if (checker(cur)(next)) {
        return consecutiveFactory(numConsecutive - 1)(checker)([next, ...rest]);
      }
  
      return consecutiveFactory(numConsecutive)(checker)([next, ...rest])
    }
  }
}

const isStraight = (cards: FullHand): boolean => {
  const sortedValues = uniqueValues(cards.map(getValue));
  return consecutiveFactory(4)(not(isDiffOne))(sortedValues);
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

const consecutive = <T>(
  list: T[], 
  checker: ((a: T) => (b: T) => boolean),
  numConsecutive: number
): boolean => {
  if (numConsecutive <= 0) return true;
  if (list.length < 2) return false;
  
  const [cur, next, ...rest] = list;
  if (!checker(cur)(next)) return consecutive([next, ...rest], checker, numConsecutive);
  return consecutive([next, ...rest], checker, numConsecutive - 1);
}

const isFourKind = (cards: FullHand): boolean => {
  const sortedValues = cards.map(card => card.value);
  return consecutive(sortedValues, not(isNotEqual), 3);
}

const getValueCounts = (cards: FullHand): Record<number, { count: number, suiteNum: number }> => {
  const counts: Record<number, { count: number, suiteNum: number }> = {};
  cards.forEach(card => counts[card.value] = updateValue(counts[card.value], card));
  return counts;
};

const rankHand = (cards: FullHand): { rank: number, highCard: Card } => {
  const sortedCards = sortCards(cards);
  const isFlushHand = isFlush(sortedCards);
  const isStraightHand = isStraight(sortedCards);
  const valueCounts = Object.entries(getValueCounts(sortedCards))
    .map(([value, count]) => ({ value: parseInt(value), count }))
    .sort((a, b) => b.count.count - a.count.count || b.value - a.value || b.count.suiteNum - a.count.suiteNum);

  const counts = valueCounts.map(vc => vc.count);

  const highCard = {suite: sortedCards[0].suite, value: sortedCards[0].value}

  // Royal Flush
  if (isFlushHand && isStraightHand && highCard.value === 13) {
    return { rank: 10, highCard };
  }
  // Straight Kind
  if (isFlushHand && isStraightHand) {
    return { rank: 9, highCard };
  }
  // Four of a Kind
  if (counts[0].count === 4) {
    return { rank: 8, highCard };
  }
  // Full House
  if (counts[0].count === 3 && counts[1].count === 2) {
    return { rank: 7, highCard };
  }
  // Flush
  if (isFlushHand) {
    return { rank: 6, highCard };
  }
  // Straight
  if (isStraightHand) {
    return { rank: 5, highCard };
  }
   // Three of a Kind
  if (counts[0].count === 3) {
    return { rank: 4, highCard };
  }
  // Two Pair
  if (counts[0].count === 2 && counts[1].count === 2) {
    return { rank: 3, highCard };
  }
  // One Pair
  if (counts[0].count === 2) {
    return { rank: 2, highCard };
  }
  // High Card
  return { rank: 1, highCard };
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
  console.log(rank1.highCard)
  console.log(rank2.highCard)
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

// const result = compareHandsFactory(board)(hand1, hand2);
// console.log("Winner:", result);



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
console.log(isFourKind(sortedStraight));
console.log(isFourKind(sortedFourKind));

// const result = compareHands(hand1, hand2, board);
// console.log("Winner:", result);
