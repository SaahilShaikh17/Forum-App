const mongoose = require('mongoose');
const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const eventLogSchema = new mongoose.Schema({
  eventId: {
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
  message: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('EventLog', eventLogSchema);
