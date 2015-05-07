module.exports = function(app) {
  var express = require('express');
  var usersRouter = express.Router();

  usersRouter.post('/sign_in', function(req, res) {
    res.send({
      users: {
        email: 'test@example.com',
        apiKey: '7389ef416044f7270fd346c92dffec60'
      }
    });
  });

  usersRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/users', usersRouter);
};
