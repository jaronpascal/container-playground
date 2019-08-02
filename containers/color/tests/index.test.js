const request = require('supertest');
const express = require('express');
const router = require('../router.js');

const initServer = () => {
  const app = express();

  app.set('views', `${__dirname}`);
  app.engine('html', require('ejs').renderFile);

  app.set('view engine', 'html');

  app.use(router);
  return app;
};

describe('GET /', () => {
  let app;

  beforeEach(async () => {
    app = await initServer();
  });

  test('should return a background color', async () => {
    const res = await request(app).get('/');

    const backgroundColor1 = JSON.parse(res.text).color;

    expect(res.statusCode).toEqual(200);
    expect(backgroundColor1).toEqual(expect.stringMatching(/#[0-9a-f]{6}/));
  });

  test('should change color when parameter is given', async () => {
    let res = await request(app).get('/');

    const backgroundColor1 = JSON.parse(res.text).color;

    res = await request(app).get('/?param=1');

    const backgroundColor2 = JSON.parse(res.text).color;

    expect(res.statusCode).toEqual(200);
    expect(backgroundColor2).toEqual(expect.stringMatching(/#[0-9a-f]{6}/));
    expect(backgroundColor1).not.toEqual(backgroundColor2);
  });
});

describe('GET /color', () => {
  let app;

  beforeEach(async () => {
    app = await initServer();
  });

  test('should return the color in hexadecimals', async () => {
    const res = await request(app).get('/color');

    expect(res.statusCode).toEqual(200);
    expect(JSON.parse(res.text).color).toEqual(expect.stringMatching(/#[0-9a-f]{6}/));
  });
});
