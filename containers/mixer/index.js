const express = require('express');

const axios = require('axios');

const app = express();
const port = 80;

const color1Url = process.env.COLOR_1;
const color2Url = process.env.COLOR_2;

// Set view engine to ejs
app.set('views', `${__dirname}/html`);
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : null;
}

function mix(color1, color2) {
  const rgbColor1 = hexToRgb(color1);
  const rgbColor2 = hexToRgb(color2);

  const newColor = {};

  newColor.r = Math.floor(rgbColor1.r - (rgbColor1.r - rgbColor2.r) / 2);
  newColor.g = Math.floor(rgbColor1.g - (rgbColor1.g - rgbColor2.g) / 2);
  newColor.b = Math.floor(rgbColor1.b - (rgbColor1.b - rgbColor2.b) / 2);

  return `#${((1 << 24) + (newColor.r << 16) + (newColor.g << 8) + newColor.b)
    .toString(16)
    .slice(1)}`;
}

// Set home page
app.get('/', async (req, res) => {
  const color1 = (await axios.get(`${color1Url}/color`)).data.color;
  const color2 = (await axios.get(`${color2Url}/color`)).data.color;
  console.log(color1);
  const color3 = mix(color1, color2);

  console.log(color3);

  res.render('index.html', { color1, color2, color3 });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
