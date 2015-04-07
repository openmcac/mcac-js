var bodyParser = require('body-parser');

module.exports = function(app) {
  var express = require('express');
  var bulletinsRouter = express.Router();
  app.use(bodyParser.json({ type: 'application/*+json' }));

  var db = [{
    "id": 1,
    "publishedAt": "2014-12-21T13:58:27-05:00",
    "name": "First Service",
    "serviceOrder": "This is the service order.",
    "description": "This is a service bulletin.",
    "links": {
      "group": "1",
      "announcements": ["1", "2", "3"]
    }
  }, {
    "id": 2,
    "publishedAt": "2014-12-24T13:58:27-05:00",
    "name": "Second Service",
    "serviceOrder": "This is the service order.",
    "description": "This is a service bulletin.",
    "links": {
      "group": "1",
      "announcements": ["1", "2", "3"]
    }
  }, {
    "id": 3,
    "publishedAt": "2014-12-25T13:58:27-05:00",
    "name": "Third Service",
    "serviceOrder": "This is the service order.",
    "description": "This is a service bulletin.",
    "links": {
      "group": "1",
      "announcements": ["1", "2", "3"]
    }
  }];

  bulletinsRouter.get('/', function(req, res) {
    if (req.query.latest_for_group) {
      res.send({ bulletins: [db[db.length - 1]] });
    } else {
      res.send({
        "bulletins": db,
      });
    }
  });

  bulletinsRouter.post('/', function(req, res) {
    console.log(req);
    var createdBulletin = req.body.bulletins;
    createdBulletin.id = db.length + 1;
    db.push(createdBulletin);
    res.send({ bulletins: createdBulletin }, 201);
  });

  bulletinsRouter.get('/:id', function(req, res) {
    res.send({ bulletins: db[parseInt(req.params.id) - 1] });
  });

  bulletinsRouter.put('/:id', function(req, res) {
    var updatedBulletin = req.body.bulletins;
    db[parseInt(updatedBulletin.id) - 1] = updatedBulletin;
    res.send({ bulletins: updatedBulletin }, 201);
  });

  bulletinsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/v1/bulletins', bulletinsRouter);
};
