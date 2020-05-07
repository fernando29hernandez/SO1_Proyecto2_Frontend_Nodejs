var express = require('express');
var router = express.Router();
const mongo = require('mongodb').MongoClient
const url = 'mongodb://35.237.232.19'
var str = [];
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET array casos por depto */
router.get('/casos', function (req, res) {
  mongo.connect(url, function (err, client) {
    if (err) {
      console.error(err)
      return
    }
    const database = client.db('proyecto')
    const collection = database.collection('casos').aggregate([
      {
        $group: {
          _id: "$departamento",
          totales: { $sum: 1 }
        }
      },
      {
          $sort: {
            totales: -1
          }
      }
    ])
    //var cursor = collection.find({});
    //var cursor = db.collection('casos').find();
    str = [];
    collection.toArray((err, items) => {
      console.log(items)
      items.forEach(item => {
        if (item != null) {
          //console.log(item);
          str.push([item._id, item.totales])
        }
      });
      res.send(str);
    })
    client.close();
  });
});
module.exports = router;
