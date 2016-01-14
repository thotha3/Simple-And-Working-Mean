var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');

var app = express();
var mongoClient = require('mongodb').MongoClient;
var db, itemsCollection;
mongoClient.connect('mongodb://127.0.0.1:27017/demo', function(err, database) {
    if (err) throw err;

    db = database;
    itemsCollection = db.collection('items');

    app.listen(3000);
    console.log('Server listening on 3000');
});

var router = express.Router();
router.use(bodyParser.json());

// Setup the collection routes
router.route('/')
    .get(function(req, res, next) {
        itemsCollection.find().toArray(function(err, docs) {
           res.send({
              status: 'Items found',
               items: docs
           });
        });
    })
    .post(function(req, res, next) {
        var item = req.body;
        itemsCollection.insert(item, function(err, docs) {
            res.send({
                status: 'Item added',
                itemId: item._id
            });
        });
    })

// Setup the item routes
router.route('/:id')
    .delete(function(req, res, next) {
        var id = req.params['id'];
        var lookup = { _id: new mongodb.ObjectID(id) };
        itemsCollection.remove(lookup, function(err, results) {
           res.send({ status: 'Item cleared' });
        });
    });

app.use(express.static(__dirname + '/public'))
    .use('/todo', router);
