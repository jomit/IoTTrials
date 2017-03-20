var ThunderboardReact = require('node-thunderboard-react');
var thunder = new ThunderboardReact();

// Initialize the ThunderboardReact object
thunder.init((error) => {
  // Discover the Thunderboard React Board Kit
  thunder.startDiscovery((device) => {
    console.log('- Found ' + device.localName);
    // Stop the discovery process
    thunder.stopDiscovery();
    // Connect to the found device
    device.connect((error) => {
      console.log('- Connected ' + device.localName);
      // Get the sensored data
      getEnvironmentalSensing(device);
    });
  });
});

// Get the sensored data
function getEnvironmentalSensing(device) {
  device.getEnvironmentalSensing((error, res) => {
    // Show the data
    console.log('- Sensored data:');
    console.log('  - Humidity    : ' + res.humidity + ' %');
    console.log('  - Temperature : ' + res.temperature + ' °C');
    console.log('  - UV Index    : ' + res.uvIndex);
    // Disconnect the device
    device.disconnect(() => {
      console.log('- Disconnected ' + device.localName);
      process.exit();
    });
  });
}
