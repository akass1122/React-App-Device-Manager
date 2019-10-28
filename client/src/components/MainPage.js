import React from "react";
import SmallPage from "./SmallPage";
import bytesToStr from "../helper";

import axios from "axios";

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      index: 0
    }

  }
  onChangeName = (event, id) => {
    const deviceIndex = this.state.devices.findIndex(device => { return device._id === id });

    const chosenDeviceCopy = { ...this.state.devices[deviceIndex] }
    chosenDeviceCopy.owner = event.target.value;
    const devicesCopy = [...this.state.devices];
    devicesCopy[deviceIndex] = chosenDeviceCopy; // a copy of array of devices with changed name
    this.setState({ devices: devicesCopy, index: deviceIndex });
  }
  onSubmitName = e => {
    e.preventDefault();
    const postDevices = async () => {
      try {
        const changedDevice = this.state.devices[this.state.index]
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        const res = await axios.post('/api/devices', changedDevice, config);
        console.log('status: ', res.status);
        console.log(res.data);
      } catch (err) {
        console.log("Error posting data");
      }
    };
    postDevices();
  }

  componentWillMount() {
    const getDevices = async () => {
      try {

        const res = await axios.get('/api/devices');
        this.setState({ devices: res.data });
        if (res.data.length > 0) {
          this._id = res.data[0]._id;
        }

        console.log(this.state.devices);
      } catch (err) {
        console.log("Error getting data");
      }
    };
    getDevices();
  }

  render() {

    return (
      <div>
        <form onSubmit={this.onSubmitName}>
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
              {this.state.devices.map((device, i) => (
                <tr key={i}>
                  <td>{device.ip}</td>
                  <td><input type="text" name="ownwer" defaultValue={device.owner} onChange={(event) => this.onChangeName(event, device._id)} /></td>
                  <td>{device.cpuPct}%</td>
                  <td>{bytesToStr(device.memBytes)}</td>
                  <td>{bytesToStr(device.networkTxBytes)}</td>
                  <td>{bytesToStr(device.networkRxBytes)}</td>
                </tr>
              ))}

            </tbody>
          </table>
          <input type="submit" value="Submit last changed person" className='btn btn-dark' />
        </form>
        <br />
        <br />

        <SmallPage devices={this.state.devices} columnName="CPU" />
        <SmallPage devices={this.state.devices} columnName="Mem" />
        <SmallPage devices={this.state.devices} columnName="TX" />
        <SmallPage devices={this.state.devices} columnName="RX" />

      </div>
    )
  }
}
export default MainPage;