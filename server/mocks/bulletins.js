module.exports = function(app) {
  var express = require('express');
  var bulletinsRouter = express.Router();

  bulletinsRouter.get('/', function(req, res) {
    res.send({
      "bulletins": []
    });
  });

  bulletinsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  bulletinsRouter.get('/sunday', function(req, res) {
    res.send({
      "bulletin": {
        "id": 1,
        "publishedAt": "2014-12-21T13:58:27-05:00",
        "name": "Sunday Service",
        "serviceOrder": "This is the service order.",
        "description": "This is a service bulletin.",
        "group": {
          "id": 1,
          "name": "English Service",
          "createdAt": "2014-12-21T13:58:27-05:00"
        },
        "announcements": [
          {
            "id": 1,
            "description": "This is an announcement",
            "bulletinId": 1,
            "postId": 1,
            "position": 1
          }
        ]
      }
    });
  });

  bulletinsRouter.get('/:id', function(req, res) {
    res.send({
      "bulletin": {
        "id": 1,
        "publishedAt": "2014-12-21T13:58:27-05:00",
        "name": "Sunday Service",
        "serviceOrder": "This is the service order.",
        "description": "This is a service bulletin.",
        "group": {
          "id": 1,
          "name": "English Service",
          "createdAt": "2014-12-21T13:58:27-05:00"
        },
        "announcements": [
          {
            "id": 1,
            "description": "This is an announcement",
            "bulletinId": 1,
            "postId": 1,
            "position": 1
          }
        ]
      }
    });
  });

  bulletinsRouter.put('/:id', function(req, res) {
    res.send({
      "bulletins": {
        "id": req.params.id
      }
    });
  });

  bulletinsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/v1/bulletins', bulletinsRouter);
};
