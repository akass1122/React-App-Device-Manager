const express = require('express');
const request = require('request');
const router = express.Router();
const Device = require('../../models/Device');

//@route GET api/devices/
//@desc Get all devices
router.get('/', async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
//@route POST api/devices
//@desc Create or update device

router.post('/', async (req, res) => {
  try {
    let device = await Device.findOne({ _id: req.body._id });
    if (device) {
      //Update
      device = await Device.findOneAndUpdate(
        { _id: req.body._id },
        { $set: { owner: req.body.owner } },
        { new: true }
      );
      return res.json(device);
    } else {
      //Create
      const {
        ip,
        owner,
        cpuPct,
        memBytes,
        networkRxBytes,
        networkTxBytes
      } = req.body;
      //Build profile object
      const deviceFields = {};
      if (ip) deviceFields.ip = ip;
      if (owner) deviceFields.owner = owner;
      if (cpuPct) deviceFields.cpuPct = cpuPct;
      if (memBytes) deviceFields.memBytes = memBytes;
      if (networkRxBytes) deviceFields.networkRxBytes = networkRxBytes;
      if (networkTxBytes) deviceFields.networkTxBytes = networkTxBytes;
      device = new Device(deviceFields);
      await device.save();
    }
    res.json(device);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}
);
module.exports = router;
