const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

const searchGoogle = require('./searchGoogle');
app.get('/search', (request, response) => {
  const searchQuery = request.query.searchquery;
  if (searchQuery != null) {
    searchGoogle(searchQuery).then((results) => {
      response.status(200);
      response.json(results);
      //   console.log(results);
    });
  } else {
    response.end();
  }
});
app.get('/get-all-data', (req, res) => {
  const DataModel = require('./model/dataModel');
  DataModel.find({}, (err, data) => {
    res.status(200);
    res.json(data);
  });
});
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`App listening on port ${port}!`));
