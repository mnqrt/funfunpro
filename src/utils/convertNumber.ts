import { values, suites, Card } from "../types/type" 

const convertNumber = (value: number) => {
  if (value == 1) return "A";
  if (value <= 10) return value.toString();
  if (value == 11) return "J";
  if (value == 12) return "Q";
  if (value == 13) return "K";
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

export {
  convertNumber,
  generateDeck,
  formatCard
}
