const express = require('express');

const Colors = require('./colors.js');

const app = express();
const port = 80;

// Set view engine to ejs
app.set('views', `${__dirname}/html`);
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');

// Generate a color to start
const colors = new Colors();

// Set home page
app.get('/', (req, res) => {
  if (req.query !== {}) colors.generateColor();

  res.render('index.html', { color: colors.currentColor });
});

// Returns current color
app.get('/color', (req, res) => {
  res.send({ color: colors.currentColor });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
