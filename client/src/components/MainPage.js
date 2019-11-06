import React from "react";
import SmallPage from "./SmallPage";
import axios from "axios";

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      newDevice: {
        ip: "",
        owner: "",
        cpuPct: 0,
        memBytes: 0,
        networkTxBytes: 0,
        networkRxBytes: 0
      }
    }
  }

  // This function postDevice make POST request to server 
  // to route  '/api/devices'     to update or add device
  postDevice = async (device) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const res = await axios.post('/api/devices', device, config);
      //console.log(res.data);
    } catch (err) {
      console.log("Error posting data");
    }
  }
  // Function deleteDevice send POST request to
  // Server at route   '/api/devices/delete'
  // We call axios POST because we need to send _id to server
  // If we use axios DELETE method then we cannot send data to server
  deleteDevice = async (idOfDeviceToDelete) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      await axios.post('/api/devices/delete', { _id: idOfDeviceToDelete }, config);
      console.log("idOfDeviceToDelete: ", idOfDeviceToDelete);
    } catch (err) {
      console.log("Error deleting");
    }

  }

  // used as a helper function for onChange in Main Table
  onChangeRow = (event, i) => {
    const chosenDeviceCopy = {
      ...this.state.devices[i],
      [event.target.name]: event.target.value
    }
    const devicesCopy = [...this.state.devices];
    devicesCopy[i] = chosenDeviceCopy;// changed i-th device in array copy
    this.setState({ ...this.state, devices: devicesCopy });
  }
  // onChange function in Add Table
  onChangeAdd = (event) => {
    const updatedDevice = {
      ...this.state.newDevice,
      [event.target.name]: event.target.value
    }
    const updatedState = {
      ...this.state,
      newDevice: updatedDevice
    }
    this.setState(updatedState);
  }

  // Helper function for onSubmit to submit a row in Main Table
  onSubmitRow = (event, i) => {
    event.preventDefault();
    const changedDevice = this.state.devices[i]
    const deviceToDB = { // copy change changedDevice and convert to Bytes
      ...changedDevice,
      memBytes: changedDevice.memBytes * 1024 * 1024 * 1024,
      networkTxBytes: changedDevice.networkTxBytes * 1024 * 1024,
      networkRxBytes: changedDevice.networkRxBytes * 1024 * 1024
    }
    this.postDevice(deviceToDB);  // Sends POST request to Server
    //console.log("SubmitRow: ", deviceToDB);
  }

  // used as a helper function for onSubmit Delete Row in Main Table
  onSubmitDeleteRow = (event, i) => {
    event.preventDefault();
    const deviceToDelete = this.state.devices[i]
    this.deleteDevice(deviceToDelete._id);// call function deleteDevice with this device's id
    let devicesCopy = this.state.devices.map(device => ({ ...device }));//deep copy of devices
    devicesCopy.splice(i, 1); // delete i-th device
    this.setState({ ...this.state, devices: devicesCopy });//update devices in state
  }

  onSubmitNewDevice = (event) => {
    event.preventDefault();
    const deviceToAdd = { //copy devices in state and convert to Bytes
      ...this.state.newDevice,
      memBytes: this.state.newDevice.memBytes * 1024 * 1024 * 1024,
      networkTxBytes: this.state.newDevice.networkTxBytes * 1024 * 1024,
      networkRxBytes: this.state.newDevice.networkRxBytes * 1024 * 1024
    }

    const devicesCopy = this.state.devices.map(device => ({ ...device }));//deep copy
    devicesCopy.push(this.state.newDevice);// add newDevice to copy of devices
    this.setState({ ...this.state, devices: devicesCopy });//update devices in state
    this.postDevice(deviceToAdd); // Sends  POST request to Server
    //console.log("deviceToAdd: ", deviceToAdd);
  }
  // This function makes GET request to server to 
  // route '/api/devices'  to get all devices
  getDevices = async () => { //use if show in bytes
    try {

      const res = await axios.get('/api/devices');
      // res.data contains array of all devices
      this.setState({ devices: res.data }); // 
      //console.log(res.data);

    } catch (err) {
      console.log("Error getting data");
    }
  };


  // This function makes GET request to server to 
  // route '/api/devices'  to get all devices,
  // then convert them to GB, MB before saving in state

  getAndConvertDevices = // use if show in GB, MB
    async () => {
      try {

        const res = await axios.get('/api/devices');
        // res.data contains array of all devices
        //Take from res.data and convert to GB, MB
        const convertedDevices = res.data.map(device => ({
          ...device,
          memBytes: device.memBytes / (1024.0 * 1024 * 1024).toFixed(2),
          networkTxBytes: device.networkTxBytes / (1024.0 * 1024).toFixed(2),
          networkRxBytes: device.networkRxBytes / (1024.0 * 1024).toFixed(2)
        }));

        this.setState({ devices: convertedDevices });//set state with these devices
        //console.log(res.data);
      } catch (err) {
        console.log("Error getting data");
      }
    };

  // This function is called before page rendering.
  // It calls getAndConvertDevices which sends 
  // GET request to server to 
  // route   '/api/devices'  to get all devices,
  // then convert them to GB, MB before saving in state
  componentWillMount() {
    //this.getDevices();   // use this line if no need to convert to GB, MB
    this.getAndConvertDevices(); // Sends GET request to Server, then convert to GB, MB
  }
  render() {
    return (
      <div>

        <p className="title"> All Devices </p>

        <table className="table table-bordered table-condensed table-striped table-hover">
          <thead>
            <tr>
              <th className="col-md-2">IP</th>
              <th className="col-md-2">Owner</th>
              <th className="col-md-2">CPU in Percent</th>
              <th className="col-md-2">Mem in GB</th>
              <th className="col-md-2">TX in MB</th>
              <th className="col-md-2">RX in MB</th>
              <th className="col-md-2"></th>

            </tr>
          </thead>
          <tbody>
            {this.state.devices.map((device, i) => (
              <tr key={i} >
                <td>
                  <input type="text" name="ip" defaultValue={device.ip} size="20" onChange={(event) => this.onChangeRow(event, i)} />
                </td>
                <td>
                  <input type="text" name="owner" defaultValue={device.owner} onChange={(event) => this.onChangeRow(event, i)} />
                </td>
                <td>
                  <input type="number" name="cpuPct" defaultValue={device.cpuPct} size="3" onChange={(event) => this.onChangeRow(event, i)} />
                </td>
                <td>
                  <input type="number" name="memBytes" defaultValue={device.memBytes} onChange={(event) => this.onChangeRow(event, i)} />
                </td>
                <td>
                  <input type="number" name="networkTxBytes" defaultValue={device.networkTxBytes} onChange={(event) => this.onChangeRow(event, i)} />
                </td>
                <td>
                  <input type="number" name="networkRxBytes" defaultValue={device.networkRxBytes} onChange={(event) => this.onChangeRow(event, i)} />
                </td>
                <td><form onSubmit={(event) => this.onSubmitRow(event, i)}><input type="submit" value="Submit Row" className='btn' /> </form></td>
                <td><form onSubmit={(event) => this.onSubmitDeleteRow(event, i)}><input type="submit" value="Delete Row" className='btn' /> </form></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="top1rem" />
        <p className="title"> Add Row </p>
        <form onSubmit={this.onSubmitNewDevice}>
          <table className="table table-bordered table-condensed table-striped table-hover">
            <thead>
              <tr>
                <th className="col-md-2">IP</th>
                <th className="col-md-2">Owner</th>
                <th className="col-md-2">CPU in Percent</th>
                <th className="col-md-2">Mem in GB</th>
                <th className="col-md-2">TX in MB</th>
                <th className="col-md-2">RX in MB</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input type="text" name="ip" defaultValue={this.state.newDevice.ip} onChange={this.onChangeAdd} /></td>
                <td><input type="text" name="owner" defaultValue={this.state.newDevice.owner} onChange={this.onChangeAdd} /></td>
                <td><input type="number" name="cpuPct" defaultValue={this.state.newDevice.cpuPct} onChange={this.onChangeAdd} /></td>
                <td><input type="number" name="memBytes" defaultValue={this.state.newDevice.memBytes} onChange={this.onChangeAdd} /></td>
                <td><input type="number" name="networkTxBytes" defaultValue={this.state.newDevice.networkTxBytes} onChange={this.onChangeAdd} /></td>
                <td><input type="number" name="networkRxBytes" defaultValue={this.state.newDevice.networkRxBytes} onChange={this.onChangeAdd} /></td>
              </tr>

            </tbody>
          </table>
          <input type="submit" value="Submit Added Row to Server" className='btn' />
        </form>
        <br />
        <br />

        <div className="panel-grid">
          <div className="panel-cpu">
            <SmallPage className="panel-grid" devices={this.state.devices} columnName="CPU" />
          </div>
          <div className="panel-mem">
            <SmallPage devices={this.state.devices} columnName="Mem" />
            <SmallPage devices={this.state.devices} columnName="TX" />
            <SmallPage devices={this.state.devices} columnName="RX" />
          </div>
        </div>
      </div>
    )
  }
}
export default MainPage;