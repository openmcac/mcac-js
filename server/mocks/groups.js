module.exports = function(app) {
  var express = require('express');
  var groupsRouter = express.Router();

  var englishService = {
    "group": {
      "id": 1,
      "name": "English Service",
      "slug": "english-service"
    }
  };

  groupsRouter.get('/', function(req, res) {
    var groups = [];

    if (!!req.query || req.query.slug === 'english-service') {
      groups.push(englishService.group);
    }

    res.send({
      "groups": groups
    });
  });

  groupsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  groupsRouter.get('/:id', function(req, res) {
    res.send(englishService);
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
