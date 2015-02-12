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

  announcementsRouter.get('/latest', function(req, res) {
    if (typeof req.query.group_id === 'undefined') {
      return res.status(500).end();
    }

    res.send({
      "announcements": [
        {
          "id": 1,
          "description": "This is the first announcement",
          "position": 1,
          "links": {
            "bulletin": "1"
          }
        },
        {
          "id": 2,
          "description": "This is the second announcement",
          "bulletin": 1,
          "position": 2,
          "links": {
            "bulletin": "1"
          }
        },
        {
          "id": 3,
          "description": "This is the third announcement",
          "bulletin": 1,
          "position": 3,
          "links": {
            "bulletin": "1"
          }
        }
      ]
    });
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

  app.use('/api/v1/announcements', announcementsRouter);
};
