const express = require('express');
const request = require('request');
//const config = require('config');
const router = express.Router();
// const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');


const Device = require('../../models/Device');



//@route GET api/devices/
//@desc Get all devices
//@access public
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
//@access private

router.post(
  '/',

  // [
  //   check('ip', 'IP is required')
  //     .not()
  //     .isEmpty(),
  //   check('owner', 'Owner is required')
  // ],
  async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }
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
    try {
      let device = await Device.findOne({ _id: req.body._id });
      if (device) {
        //Update
        device = await Device.findOneAndUpdate(
          { _id: req.body._id },
          { $set: deviceFields },
          { new: true }
        );
        return res.json(device);
      }
      //Create
      device = new Device(deviceFields);
      await device.save();
      res.json(device);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
    res.send('Hello');
  }
);
module.exports = router;
