const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataModelSchema = new Schema({
  title: {
    type: String,
  },
  url: {
    type: String,
  },
});

module.exports = mongoose.model('DataModel', dataModelSchema);