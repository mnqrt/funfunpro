import express from 'express';
import { generateDeck, formatCard, unformatCard } from './utils/convertNumber';
import { shuffleDeck } from './utils/generateRandom';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/generate', (req, res) => {
  res.send(JSON.stringify(generateDeck().map(card => formatCard(card))))
});

app.patch('/shuffle', (req, res) => {
  res.send(JSON.stringify(shuffleDeck(JSON.parse(req.body).map(card => unformatCard(card)))))
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});