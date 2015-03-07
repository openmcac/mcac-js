module.exports = function(app) {
  var express = require('express');
  var announcementsRouter = express.Router();

  announcementsRouter.get('/', function(req, res) {
    if (req.query.latest_for_group === '1') {
      res.send({
        "announcements": [{
          "id": "1",
          "description": "This is an announcement",
          "position": 1,
          "links": {
            "bulletin": "1",
            "post": "1"
          }
        }, {
          "id": "2",
          "description": "This is the second announcement",
          "position": 2,
          "links": {
            "bulletin": "1",
            "post": "1"
          }
        }, {
          "id": "3",
          "description": "This is the third announcement",
          "position": 3,
          "links": {
            "bulletin": "1",
            "post": "1"
          }
        }]
      });
    } else {
      res.send({
        'announcements': []
      });
    }
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

  app.use('/api/v1/announcements', announcementsRouter);
};
