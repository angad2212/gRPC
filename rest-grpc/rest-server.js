const express = require('express');

const app = express(); //our rest server
app.use(express.json()); 

const numbers = []; //temp database 

app.post('/number', (req, res) => {
  const num = req.body.number;
  numbers.push(num);
  res.json({ success: true, stored: num });
});

app.get('/numbers', (req, res) => {
  res.json({ numbers });
});

app.listen(3000, () => {
  console.log('REST server listening on http://localhost:3000');
});
