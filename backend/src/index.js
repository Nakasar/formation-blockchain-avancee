const path = require('path');

const Koa = require('koa');
const Router = require('@koa/router');
const { ethers } = require('ethers');
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

const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');

const documentContract = new ethers.Contract('0x08302DEeEefEEd76B63a2b80c5Ca20873774AD79', ['event issuanceMade (string hash, address indexed sender)'], provider);

documentContract.on('issuanceMade', async (hash, sender, event) => {
  const block = await event.getBlock();

  console.log('Insert document event. You should check if document was already inserted!');

  await db.run('INSERT INTO documents VALUES (?, ?, ?, ?)', [hash, sender, "1", new Date(block.timestamp * 1000).toISOString()]);
});

const app = new Koa();

const router = new Router();

router.get('/network', async (ctx, next) => {
  ctx.body = {
    message: 'Connected to the following network.',
    chainId: (await provider.getNetwork()).chainId,
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
