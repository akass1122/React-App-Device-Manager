import React from "react";
import SmallPage from "./SmallPage";
import bytesToStr from "../helper";
import axios from "axios";

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      index: 0,
      newDevice: {
        ip: "",
        owner: "",
        memBytes: 0,
        networkTxBytes: 0,
        networkRxBytes: 0
      }
    }
  }
  postDevice = async (device) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const res = await axios.post('/api/devices', device, config);
      //console.log('status: ', res.status);
      console.log(res.data);
    } catch (err) {
      console.log("Error posting data");
    }

  }

  onChangeRow = (event, i) => {
    const chosenDeviceCopy = {
      ...this.state.devices[i],
      [event.target.name]: event.target.value
    }
    const devicesCopy = [...this.state.devices];
    devicesCopy[i] = chosenDeviceCopy; // a copy of array of devices with changed name
    this.setState({ ...this.state, devices: devicesCopy, index: i });
  }

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

  onSubmitName = e => {
    e.preventDefault();
    const changedDevice = this.state.devices[this.state.index]
    this.postDevice(changedDevice);
  }

  onSubmitRow = (event, i) => {
    event.preventDefault();
    const changedDevice = this.state.devices[i]
    this.postDevice(changedDevice);
  }

  onSubmitNewDevice = (event) => {
    event.preventDefault();
    const deviceToAdd = {
      ...this.state.newDevice,
      memBytes: this.state.newDevice.memBytes * 1024 * 1024 * 1024,
      networkTxBytes: this.state.newDevice.networkTxBytes * 1024 * 1024,
      networkRxBytes: this.state.newDevice.networkRxBytes * 1024 * 1024
    }

    const devicesCopy = this.state.devices.map(device => ({ ...device }));
    devicesCopy.push(deviceToAdd);
    this.setState({ ...this.state, devices: devicesCopy });
    this.postDevice(deviceToAdd);
    console.log("deviceToAdd: ", deviceToAdd);
  }

  getDevices = async () => {
    try {

      const res = await axios.get('/api/devices');
      this.setState({ devices: res.data });
      console.log(res.data);

    } catch (err) {
      console.log("Error getting data");
    }
  };
  getAndConvertDevices =
    async () => {
      try {

        const res = await axios.get('/api/devices');
        const convertedDevices = res.data.map(device => ({
          ...device,
          memBytes: device.memBytes / (1024.0 * 1024 * 1024).toFixed(2),
          networkTxBytes: device.networkTxBytes / (1024.0 * 1024).toFixed(2),
          networkRxBytes: device.networkRxBytes / (1024.0 * 1024).toFixed(2)
        }));

        this.setState({ devices: convertedDevices });
        console.log(res.data);

      } catch (err) {
        console.log("Error getting data");
      }
    };

  componentWillMount() {
    //this.getDevices();
    this.getAndConvertDevices();
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
              <th className="col-md-2">CPU</th>
              <th className="col-md-2">Mem</th>
              <th className="col-md-2">TX</th>
              <th className="col-md-2">RX</th>
              <th className="col-md-2"></th>

            </tr>
          </thead>
          <tbody>
            {this.state.devices.map((device, i) => (

              <tr key={i} >

                {/* <td>{device.ip}</td> */}

                <td>

                  <input type="text" name="ip" defaultValue={device.ip} size="20" onChange={(event) => this.onChangeRow(event, i)} />

                </td>
                <td>

                  <input type="text" name="owner" defaultValue={device.owner} onChange={(event) => this.onChangeRow(event, i)} />

                </td>
                <td>

                  <input type="number" name="cpuPct" defaultValue={device.cpuPct} size="3" onChange={(event) => this.onChangeRow(event, i)} />

                </td>
                {/* <td>{device.cpuPct}%</td> */}
                <td>

                  <input type="number" name="memBytes" defaultValue={device.memBytes} onChange={(event) => this.onChangeRow(event, i)} />

                </td>
                {/* <td>{device.memBytes} GB</td> */}
                <td>{device.networkTxBytes} MB</td>
                <td>{device.networkRxBytes} MB</td>
                <td><form><input type="submit" value="Submit Row" className='btn' /> </form></td>


              </tr>

            ))}
          </tbody>
        </table>
        <p className="top1rem" />
        <form onSubmit={this.onSubmitName}>
          <input type="submit" value="Submit Last Change to Server" className='btn' />
        </form>
        <form onSubmit={this.onSubmitNewDevice}>
          <table className="table table-bordered table-condensed table-striped table-hover">
            <thead>
              <tr>
                <th className="col-md-2">IP</th>
                <th className="col-md-2">Owner</th>
                <th className="col-md-2">CPU</th>
                <th className="col-md-2">Mem</th>
                <th className="col-md-2">TX</th>
                <th className="col-md-2">RX</th>
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