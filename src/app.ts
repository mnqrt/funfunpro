import express from 'express';
import { generateDeck, formatCard, unformatCard, getSum } from './utils/convert';
import { shuffleDeck } from './utils/generateRandom';
import { generateHand, generateBoard } from "./utils/generateHandAndBoard";
import { blackJackDetermineWinner, pokerDetermineWinner } from './utils/compareHand';
import { hit, isBust, stand } from './utils/checker';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/generate', (req, res) => {
  res.send(JSON.stringify(generateDeck().map(formatCard)))
});

app.patch('/shuffle', (req, res) => {
  res.send(JSON.stringify(shuffleDeck(JSON.parse(req.body).map(unformatCard)).map(formatCard)))
});

app.post('/generate/hand', (req, res) => {
  const body = JSON.parse(req.body);
  const players = body.players;
  const deck = body.deck.map(unformatCard);
  const [hands, rest] = generateHand(players)(deck);
  res.send(JSON.stringify({hands: hands.map(hand => hand.map(formatCard)), deck: rest.map(formatCard)}));
});

app.post('/generate/board', (req, res) => {
  const body = JSON.parse(req.body);
  const deck = body.deck.map(unformatCard);
  const [board, rest] = generateBoard(deck);
  res.send(JSON.stringify({board: board.map(formatCard), deck: rest.map(formatCard)}));
});

app.post('/compare', (req, res) => {
  const body = JSON.parse(req.body);
  const { hand1, hand2, board } = body;
  res.send(JSON.stringify({hand1: hand1, hand2: hand2, board: board, winner: pokerDetermineWinner(board)(hand1, hand2)}));
});

app.post('/hit', (req, res) => {
  const { player, dealer, deck } = JSON.parse(req.body);
  const [result, rest] = hit(player.map(unformatCard), deck.map(unformatCard));
  if (isBust(result)) {
    res.send(JSON.stringify({player: result.map(formatCard), dealer: dealer, deck: rest.map(formatCard), result: "Dealer wins"}));
  } else {
    res.send(JSON.stringify({player: result.map(formatCard), dealer: dealer, deck: rest.map(formatCard), result: "N/A"}));
  }
});

app.post('/stand', (req, res) => {
  const { player, dealer, deck } = JSON.parse(req.body);
  const [dealerFinal, rest] = stand(dealer.map(unformatCard), deck.map(unformatCard));
  const playerCards = (player as string[]).map(unformatCard)
  const winner = blackJackDetermineWinner(playerCards, dealerFinal);
  res.send(JSON.stringify({player: player.map(formatCard), dealer: dealerFinal.map(formatCard), deck: rest.map(formatCard), result: winner}));
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});