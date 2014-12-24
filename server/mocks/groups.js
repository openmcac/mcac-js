module.exports = function(app) {
  var express = require('express');
  var groupsRouter = express.Router();

  groupsRouter.get('/', function(req, res) {
    res.send({
      "groups": []
    });
  });

  groupsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  groupsRouter.get('/:id', function(req, res) {
    res.send({
      "group": {
        "id": req.params.id,
        "name": "English Service"
      }
    });
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
