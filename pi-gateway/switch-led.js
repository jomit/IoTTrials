var ThunderboardReact = require('node-thunderboard-react');
var thunder = new ThunderboardReact();

thunder.init((error) => {
  thunder.startDiscovery((device) => {
    console.log('- Found ' + device.localName);
    thunder.stopDiscovery();
    device.connect((error) => {
      // Turn on/off the LEDs
      turnOnOffLeds(device, true);
    });
  });
});

// Turn on/off the LEDs
function turnOnOffLeds(device, flag) {
  // Send a message for Turning on/off the LEDs
  var status = {'led0': flag, 'led1': !flag};
  device.setLedStatus(status, (error) => {
    // Recall this method in 500 ms
    setTimeout(() => {
      turnOnOffLeds(device, !flag);
    }, 500);
  });
}