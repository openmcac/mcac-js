var bodyParser = require('body-parser');

module.exports = function(app) {
  var express = require('express');
  var bulletinsRouter = express.Router();
  app.use(bodyParser.json());

  var group = {
    "id": "1",
    "name": "English Service",
    "createdAt": "2014-12-21T13:58:27-05:00"
  };

  var bulletins = [
    {
      "id": 1,
      "publishedAt": "2014-12-21T13:58:27-05:00",
      "name": "Sunday Service",
      "serviceOrder": "This is the service order.",
      "description": "This is a service bulletin.",
      "links": {
        "group": "1",
        "announcements": []
      }
    }
  ];

  bulletinsRouter.get('/', function(req, res) {
    res.send({
      "bulletins": bulletins,
      "linked": {
        "groups": [group]
      }
    });
  });

  bulletinsRouter.post('/', function(req, res) {
    var bulletin = req.body.bulletin;
    bulletin.id = bulletins.length + 1;
    bulletins.push(bulletin);

    res.send({ bulletin: bulletin }, 201);
  });

  bulletinsRouter.get('/:id', function(req, res) {
    res.send({
      bulletins: bulletins[parseInt(req.params.id) - 1],
      linked: {
        groups: group
      }
    });
  });

  bulletinsRouter.put('/:id', function(req, res) {
    var bulletin = req.body.bulletin;
    var id = req.params.id;
    bulletin.id = id;
    bulletins[id - 1] = bulletin;

    res.send({ bulletin: bulletin }, 201);
  });

  bulletinsRouter.delete('/:id', function(req, res) {
    delete bulletins[req.params.id - 1];
    res.status(204).end();
  });

  app.use('/api/v1/bulletins', bulletinsRouter);
};
