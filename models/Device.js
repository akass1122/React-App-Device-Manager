const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  ip: {
    type: String
  },
  owner: {
    type: String
  },
  cpuPct: {
    type: Number
  },

  memBytes: {
    type: Number
  },
  networkRxBytes: {
    type: Number
  },
  networkTxBytes: {
    type: Number
  }
});

module.exports = Device = mongoose.model('device', DeviceSchema);
