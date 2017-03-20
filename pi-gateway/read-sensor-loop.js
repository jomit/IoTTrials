var ThunderboardReact = require('node-thunderboard-react');
var thunder = new ThunderboardReact();

thunder.init((error) => {
  thunder.startDiscovery((device) => {
    console.log('- Found ' + device.localName);
    thunder.stopDiscovery();
    device.connect((error) => {
      console.log('- Connected ' + device.localName);
      startMonitorOrientation(device);
    });
  });
});

// Monitor the sensored data
function startMonitorOrientation(device) {
  // Start to monitor the orientation of the device
  device.startMonitorOrientation((error) => {
    if(error) {
      console.log(error.toString());
      process.exit();
    }
  });

  // Set a listener for orientation events fired on the ThunderboardReactDevice object
  device.on('orientation', (res) => {
    // Show the event data
    console.log('- Orientation:');
    console.log('  - alpha :' + res.alpha + '°');
    console.log('  - beta  :' + res.beta + '°');
    console.log('  - gamma :' + res.gamma + '°');
  });

  // Stop to monitor and disconnect the device in 5 seconds
  setTimeout(() => {
    device.stopMonitorOrientation((error) => {
      // Disconnect the device
      device.disconnect(() => {
        console.log('- Disconnected ' + device.localName);
        process.exit();
      });
    });
  }, 10000);
}