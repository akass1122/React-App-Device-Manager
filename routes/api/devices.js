const express = require('express');
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
    //console.log("req.body:", req.body);
    const {
      ip,
      owner,
      cpuPct,
      memBytes,
      networkRxBytes,
      networkTxBytes
    } = req.body;
    //Build device object
    const deviceFields = {};
    if (ip) deviceFields.ip = ip;
    if (owner) deviceFields.owner = owner;
    if (cpuPct) deviceFields.cpuPct = cpuPct;
    if (memBytes) deviceFields.memBytes = memBytes;
    if (networkRxBytes) deviceFields.networkRxBytes = networkRxBytes;
    if (networkTxBytes) deviceFields.networkTxBytes = networkTxBytes;

    let device = await Device.findOne({ _id: req.body._id });
    if (device) {
      //Update
      device = await Device.findOneAndUpdate(
        { _id: req.body._id },
        { $set: deviceFields },
        { new: true }
      );
      //console.log("route: ", device);
      return res.json(device);

    } else {
      //Create new device in DB:

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
// Use POST request for delete because with POST request
// we can send data to Server, we delete request Server 
// will not accept request body  req.body
router.post('/delete', async (req, res) => {
  try {
    console.log("delete ID:", req.body._id);
    console.log("req.body: ", req.body);
    //Remove device in DB
    await Device.findOneAndRemove({ _id: req.body._id });
    console.log("deleted");
    res.json({ msg: 'Device deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
