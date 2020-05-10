var express = require('express');
var router = express.Router();
var redis = require('redis'),
    clientredis = redis.createClient(6379,"35.237.178.105");
const mongo = require('mongodb').MongoClient
const url = 'mongodb://35.237.178.105/'
var str = [];
var objetos=[];
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET array casos por depto */
router.get('/casos', async function (req, res) {

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
function insertaredad(edad)
{
  objetos.push(edad);
      

}
router.get('/edades', function (req, res) {
  
  clientredis.keys('*', function (err, keys) {
    if (err){ return console.log(err);}
    //console.log(keys);
    objetos=[]
    for(var i = 0, len = keys.length; i < len; i++) {
      //console.log(keys[i]);
      clientredis.get(keys[i], function(err, data){
        //console.log(JSON.parse(data));
        var objeto = JSON.parse(data)
        insertaredad(parseInt(objeto['edad']));
      });
    }
    
  });
  
  console.log(objetos);
    res.send({response:objetos})
  //var result = objetos.reduce((r,c) => (r[c] = (r[c] || 0) + 1, r), {})

  //console.log(result)
  
  
})
module.exports = router;
