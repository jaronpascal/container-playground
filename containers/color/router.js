const express = require('express');
const Colors = require('./colors.js');

const router = express.Router();

// Define the version
const version = process.env.VERSION || 'v1';

// Generate a color to start
const colors = new Colors();

// Set home page
router.get('/', (req, res) => {
  // When clicked on the button, the page is reloaded with an paramater
  if (req.query !== {}) colors.generateColor();

  res.render('index.html', { color: colors.currentColor, version });
});

// Returns current color
router.get('/color', (req, res) => {
  res.send({ color: colors.currentColor });
});

module.exports = router;
