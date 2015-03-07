var bodyParser = require('body-parser');

module.exports = function(app) {
  var express = require('express');
  var announcementsRouter = express.Router();
  app.use(bodyParser.json());

  var db = [{
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
  }];

  var announcementsByGroupMap = {"1": [[db[0], db[1], db[2]]]};

  announcementsRouter.get('/', function(req, res) {
    if (req.query.latest_for_group) {
      var groupAnnouncements = announcementsByGroupMap[req.query.latest_for_group];
      var announcements = groupAnnouncements ? groupAnnouncements[groupAnnouncements.length - 1] : null;
      res.send({ announcements: announcements });
    } else {
      res.send({ 'announcements': db });
    }
  });

  announcementsRouter.post('/', function(req, res) {
    var createdAnnouncement = req.body.announcements;
    createdAnnouncement.id = db.length + 1;
    db.push(createdAnnouncement);
    res.send({ announcements: createdAnnouncement }, 201);
  });

  announcementsRouter.get('/:id', function(req, res) {
    res.send({ 'announcements': db[parseInt(req.params.id)] });
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
