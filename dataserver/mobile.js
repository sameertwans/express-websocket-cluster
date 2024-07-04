function sendLocation(latitude, longitude) {
  const data = {
    lat: latitude,
    lng: longitude,
    device_id: 'your_device_id', // Replace with your actual device ID
  };

  // Assuming your server endpoint for WebSocket is ws://localhost:3000
  const ws = new WebSocket('ws://localhost:3000');

  ws.onopen = () => {
    console.log('WebSocket connection established.');
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed.');
  };

  ws.send(JSON.stringify(data));
}

// Function to get current location and send it to the server
function getLocationAndSend() {
  const randomLatitude = (Math.random() * 180) - 90; // Random latitude between -90 and 90
  const randomLongitude = (Math.random() * 360) - 180; // Random longitude between -180 and 180
  sendLocation(randomLatitude, randomLongitude);
  // navigator.geolocation.getCurrentPosition(
  //   (position) => {
  //     const latitude = position.coords.latitude;
  //     const longitude = position.coords.longitude;
  //     sendLocation(latitude, longitude);
  //   },
  //   (error) => {
  //     console.error('Error getting location:', error);
  //   }
  // );
}

// Send location data every 5 seconds
setInterval(getLocationAndSend, 5000); // 5000 ms = 5 seconds