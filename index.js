const net = require('net');
const fs = require('fs');  // For logging

// Configuration (replace with your values)
const config = {
  deviceIp: '192.168.1.201',
  devicePort: 4370,
  pollingInterval: 5000,  // In milliseconds
  logFile: 'attendance.log'
};

// Establish connection to ZKTeco device
function connectToDevice() {
  return new Promise((resolve, reject) => {
    const socket = net.connect(config.devicePort, config.deviceIp, () => {
      console.log('Connected to ZKTeco device');
      resolve(socket);
    });

    socket.on('error', (err) => {
      console.error('Device connection error:', err);
      reject(err);
    });
  });
}

// Retrieve attendance data and log to file
async function getAndLogAttendanceData(socket) {
  try {
    const command = 'ATTLOG\t\n';
    socket.write(command);

    socket.on('data', (data) => {

        console.log('data', data);
      const attendanceData = processDeviceResponse(data);
      logAttendanceData(attendanceData);
    });
  } catch (error) {
    console.error('Error retrieving attendance data:', error);
    logError(error);
  }
}

// Process device response (adapt based on device documentation)
function processDeviceResponse(data) {
  // Implement parsing logic to extract attendance data
  console.log('Attendance data:', data);
  const attendanceData = data
  return attendanceData;
}

// Log attendance data to file
function logAttendanceData(data) {
    console.log(data);
  fs.appendFileSync(config.logFile, `${new Date().toISOString()} - Attendance Data: ${JSON.stringify(data)}\n`);
}

// Main loop
async function main() {
  try {
    const socket = await connectToDevice();
    setInterval(getAndLogAttendanceData, config.pollingInterval, socket);
  } catch (error) {
    console.error('Error in main loop:', error);
    logError(error);
  }
}

main();
