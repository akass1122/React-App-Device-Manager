import React, { Component, Fragment } from "react";
import bytesToStr from "../helper";
const SmallPage = ({
  devices,
  columnName
}) => {
  const clonedDevices = devices.map(a => ({ ...a }));
  let topDevices;
  let propertyName;
  const sortColumn = (devices, columnName, rowNum) => {

    switch (columnName) {
      case "CPU":
        propertyName = "cpuPct";

        devices.sort(function (a, b) {
          return b.cpuPct - a.cpuPct;
        });
        //console.log("Sorted: ", devices);
        break;
      case "Mem":
        propertyName = "memBytes";
        devices.sort(function (a, b) {
          return b.memBytes - a.memBytes;
        });
        break;
      case "TX":
        propertyName = "networkTxBytes";

        devices.sort(function (a, b) {
          return b.networkTxBytes - a.networkTxBytes;
        });

        break;
      case "RX":
        propertyName = "networkRxBytes";
        devices.sort(function (a, b) {
          return b.networkRxBytes - a.networkRxBytes;
        });
        break;
      default:
    }
    let tDevices = devices.slice(0, rowNum);
    return tDevices;
  }

  let size = Math.min(devices.length, 5);
  topDevices = sortColumn(clonedDevices, columnName, size);
  let topDevices1 = topDevices.map(device => ({ ip: device.ip, owner: device.owner, [propertyName]: device[propertyName] }));

  return (
    <Fragment>
      <div>
        Top 5 devices in {columnName}
        <table className="table table-bordered table-condensed table-striped table-hover">
          <thead>
            <tr>
              <th className="col-md-2">IP</th>
              <th className="col-md-2">Owner</th>
              {columnName === "CPU" && (<th className="col-md-2">CPU</th>)}
              {columnName === "Mem" && (<th className="col-md-2">Mem</th>)}

              {/* <th className="col-md-2">Mem</th> */}
              {columnName === "TX" && (<th className="col-md-2">TX</th>)}
              {columnName === "RX" && (<th className="col-md-2">RX</th>)}
              {/* <th className="col-md-2">TX</th>
              <th className="col-md-2">RX</th> */}
            </tr>
          </thead>
          <tbody>
            {topDevices1.map((device, i) => (
              // <div key={device._id}>
              <tr key={i}>
                <td>{device.ip}</td>
                <td>{device.owner}</td>
                {columnName === "CPU" && (<td>{device.cpuPct}%</td>)}
                {columnName === "Mem" && (< td > {bytesToStr(device.memBytes)}</td>)}
                {columnName === "TX" && (<td>{bytesToStr(device.networkTxBytes)}</td>)}
                {columnName === "RX" && (<td>{bytesToStr(device.networkRxBytes)}</td>)}

              </tr>
              // </div>
            ))}
            {/* <tr ng-show="!devices.length">
        <td colspan="6">No device info available</td>
    </tr> */}
          </tbody>
        </table>
      </div>


    </Fragment >
  );
}



export default SmallPage;

