var bodyParser = require('body-parser');

module.exports = function(app) {
  var express = require('express');
  var groupsRouter = express.Router();
  app.use(bodyParser.json({ type: 'application/*+json' }));

  var englishService = {
    "id": 1,
    "name": "English Service",
    "slug": "english-service"
  };

  var groups = [englishService];

  groupsRouter.get('/', function(req, res) {
    if (typeof req.query.slug === 'undefined') {
      return res.send({ groups: groups });
    }

    var filteredGroups = [];

    for (var i = 0; i < groups.length; i++) {
      var group = groups[i];

      if (req.query.slug === group.slug) {
        filteredGroups.push(group);
      }
    }

    res.send({ "groups": filteredGroups });
  });

  groupsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  groupsRouter.get('/:id', function(req, res) {
    res.send({ "groups": englishService });
  });

  groupsRouter.put('/:id', function(req, res) {
    res.send({
      "groups": {
        "id": req.params.id
      }
    });
  });

  groupsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/v1/groups', groupsRouter);
};
