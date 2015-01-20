module.exports = function(app) {
  var express = require('express');
  var announcementsRouter = express.Router();

  announcementsRouter.get('/', function(req, res) {
    res.send({
      'announcements': []
    });
  });

  announcementsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  announcementsRouter.get('/:id', function(req, res) {
    res.send({
      'announcements': {
        id: req.params.id
      }
    });
  });

  announcementsRouter.put('/:id', function(req, res) {
    res.send({
      'announcements': {
        id: req.params.id
      }
    });
  });

  announcementsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/announcements', announcementsRouter);
};
