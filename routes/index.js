var express = require('express');
var router = express.Router();
var redis = require('redis'),
  clientredis = redis.createClient(6379, "35.237.178.105");
const mongo = require('mongodb').MongoClient
const url = 'mongodb://35.237.178.105/'
var str = [];
var objetos = [];
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET array casos por depto */
router.get('/casos', async function (req, res) {

  mongo.connect(url, function (err, client) {
    if (err) {
      return res.send(str)
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

router.get('/edades', function (req, res) {
  try {
    clientredis.keys('*', function (err, keys) {
      if (err) { return res.send({ response: objetos }) } else {
        //console.log(keys);
        //objetos=[]
        let objetos_ = [];
        for (var i = 0, len = keys.length; i < len; i++) {
          //console.log(keys[i]);
          clientredis.get('' + keys[i] + '', function (err, data) {
            //console.log(JSON.parse(data));
            if (err) {
              return res.send({ response: objetos })

            }
            var objeto = '';
            try {
              objeto = JSON.parse(data)
              objetos_.push(parseInt(objeto['edad']))

            } catch (error) {
            }
            //insertaredad();
          });
        }
        objetos = objetos_;
      }
    });
    console.log(objetos);
    res.send({ response: objetos })
  } catch (error) {
    return res.send({ response: objetos })
  }
})

router.get('/ultimo', async function (req, res) {
  try {
    var llave = ''
    mongo.connect(url, function (err, client) {
      const database = client.db('proyecto')
      database.collection('casos', function (err, collection) {
        collection
          .find()
          .sort({ $natural: -1 })
          .limit(1)
          .next()
          .then(
            function (doc) {
              llave = doc._id
              console.log(llave);
              clientredis.get('' + llave + '', function (err, data) {
                console.log(data);
                return res.send({ response: JSON.parse(data) })
              });
            },
            function (err) {
              return res.send({ response: {} })
            }
          );
      });
      client.close();
    });
  } catch (error) {
    return res.send({ response: {} })

  }
})
module.exports = router;
