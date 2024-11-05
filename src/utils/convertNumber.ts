import { values, suites, Card, Value, Suite } from "../types/type" 

const convertNumber = (value: Value): string => {
  if (value == 1) return "A";
  if (value == 11) return "J";
  if (value == 12) return "Q";
  if (value == 13) return "K";
  return value.toString();
}

const unconvertNumber = (value: string): Value => {
  if (value == "A") return 1;
  if (value == "J") return 11;
  if (value == "Q") return 12;
  if (value == "K") return 13;
  return parseInt(value) as Value;
}

const generateDeck = (): Card[] => {
  return suites.flatMap(suite => 
    values.map(value => ({
      value,
      suite
    }))
  );
}

const formatCard = ({value, suite}: Card): string => {
  return convertNumber(value) + " " + suite;
}

const unformatCard = (card: string): Card => {
  const [cardVal, cardSuite] = card.split(' ');
  return {
    suite: cardSuite as Suite,
    value: unconvertNumber(cardVal)
  }
}

export {
  convertNumber,
  generateDeck,
  formatCard,
  unformatCard
}
