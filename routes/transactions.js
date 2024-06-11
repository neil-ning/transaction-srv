var express = require('express');
const {FindCursor, WithId, MongoClient} = require("mongodb");
var router = express.Router();

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'test';
const collectionName = 'transactions';

router.get('/', async function (req, res, next) {

  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  let pageNo = req.query.pageNo || 1;
  let pageSize = req.query.pageSize || 10

  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  let que = {Comments: { $nin: ["COMPLETED","IN PROGRESS","REJECTED"] }};

  //{createdAt:{$gte:ISODate(“2020-03-01”),$lt:ISODate(“2021-04-01”)}}

  if(startDate || endDate){
    if(startDate && endDate){
      que.date = {$gte: Number(startDate), $lte: Number(endDate)};
    }else if(startDate){
      que.date = {$lte: Number(startDate)};
    }else if(endDate){
      que.date = {$lte: Number(endDate)};
    }
  }

  let cursor = collection.find(que).sort( { date: 1 } )
      .skip((pageNo - 1) * pageSize).limit(pageSize);

  let house = await cursor.toArray();

  res.json(house);
});

router.get('/:id', async function (req, res, next) {

  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  let cursor = await collection.findOne({'id':req.params.id});

  res.json(cursor);
});

module.exports = router;
