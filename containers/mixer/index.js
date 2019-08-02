const express = require('express');

const router = require('./router.js');

const app = express();
const port = 80;

// Set view engine to ejs
app.set('views', `${__dirname}/html`);
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');

app.use('/', router);

app.listen(port);
