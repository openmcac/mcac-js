module.exports = function(app) {
  var express = require('express');
  var sundayRouter = express.Router();

  sundayRouter.get('/', function(req, res) {
    res.send({
      "bulletin": {
        "id": 1,
        "publishedAt": "2014-12-21T09:30:00-05:00",
        "name": "Sunday Service",
        "serviceOrder": " - Call to Worship\n" +
                        " - Praise & Worship\n" +
                        " - Announcements\n" +
                        " - Offering\n" +
                        " - Sermon\n" +
                        " - Holy Communion\n" +
                        " - Doxology\n" +
                        " - Benediction",
        "description": "This is a service bulletin.",
        "group": 1,
        "announcements": [1]
      },
      "group": {
        "id": 1,
        "slug": "english-service",
        "name": "English Service"
      }
    });
  });

  app.use('/api/v1/sunday', sundayRouter);
};
