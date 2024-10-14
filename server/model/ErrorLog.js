const mongoose = require('mongoose');
const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const errorLogSchema = new mongoose.Schema({
  errorId: {
    type: String,
    default: uuid,
    unique: true,
    required: true
  },
  timestamp: {
    type: String,
    default: () => format(new Date(), 'dd/MM/yyyy\tHH:mm:ss'),
    required: true
  },
  errorMessage: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('ErrorLog', errorLogSchema);