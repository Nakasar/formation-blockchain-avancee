const path = require('path');

const Koa = require('koa');
const Router = require('@koa/router');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

let db;
sqlite
  .open({
    filename: path.join(__dirname, '../data/db.sqlite'),
    driver: sqlite3.Database
  })
  .then(async dBase => {
    db = dBase;
  });

const app = new Koa();

const router = new Router();

router.get('/network', async (ctx, next) => {
  // @TODO Get Chain ID.
  ctx.body = {
    message: 'Connected to the following network.',
    chainId: 'GET CHAIN ID',
  };
});

router.get('/documents', async (ctx, next) => {
  const documents = await db.all('SELECT * FROM documents');

  ctx.body = documents;
});

router.get('/init', async (ctx, next) => {
  await db.run("CREATE TABLE documents (hash TEXT, sender TEXT, status TEXT, issuance_date TEXT)");

  ctx.body = {
    message: 'Initialized database.'
  };
});

router.get('/reset', async (ctx, next) => {
  await db.run("DROP TABLE documents");

  ctx.body = {
    message: 'Dropped database.'
  };
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3080);
