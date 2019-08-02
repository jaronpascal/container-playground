const request = require('supertest');
const moxios = require('moxios');
const express = require('express');
const path = require('path');
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
    moxios.install();
  });
  afterEach(async () => {
    moxios.uninstall();
  });
  test('should return a background color that is the same color of the inputs, if the inputs are equal', async () => {
    const response = { color: '#001000' };
    moxios.stubRequest(/.*\/color/, {
      status: 200,
      response,
    });

    const res = await request(app).get('/');

    expect(res.statusCode).toEqual(200);
    expect(JSON.parse(res.text)).toHaveProperty('color1', '#001000');
    expect(JSON.parse(res.text)).toHaveProperty('color2', '#001000');
    expect(JSON.parse(res.text)).toHaveProperty('color3', '#001000');
  });
  test('should return a black background when both input are not reachable', async () => {
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 404,
      });
      moxios.wait(() => {
        request = moxios.requests.mostRecent();
        request.respondWith({
          status: 404,
        });
      });
    });

    const res = await request(app).get('/');

    expect(res.statusCode).toEqual(200);
    expect(JSON.parse(res.text)).toHaveProperty('color1', '#000000');
    expect(JSON.parse(res.text)).toHaveProperty('color2', '#000000');
    expect(JSON.parse(res.text)).toHaveProperty('color3', '#000000');
  });

  test('should return a background color when one of the output is not reachable', async () => {
    const response = { color: '#111111' };
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 404,
      });
      moxios.wait(() => {
        request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response,
        });
      });
    });

    const res = await request(app).get('/');

    expect(res.statusCode).toEqual(200);
    expect(JSON.parse(res.text)).toHaveProperty('color1', '#000000');
    expect(JSON.parse(res.text)).toHaveProperty('color2', '#111111');
    expect(JSON.parse(res.text).color3).toEqual(expect.stringMatching(/#[0-9a-f]{6}/));
  });
});
