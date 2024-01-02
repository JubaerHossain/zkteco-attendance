const ZKJUBAER = require("zk-jubaer");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const runMachine = async () => {
  while (true) {
    const obj = new ZKJUBAER("10.10.1.10", 4370, 5200, 100000);

    try {
      await obj.createSocket();

      // machine info
    //   const info = await obj.getInfo();
    //   console.log("Machine info:", info);

      // Get all users
      //   const users = await obj.getUsers();
      //   console.log(users);

    //   try {
    //     const logs = await obj.getAttendances(function () {
    //       console.log("Very cool!");
    //     });
    //     console.log(logs);
    //   } catch (error) {
    //     console.log(error);
    //   }

      // Read real-time logs
      await obj.getRealTimeLogs((realTimeLog) => {
        console.log("Real-time Log:", realTimeLog);
      });

      // Disconnect the machine
    //   await obj.disconnect();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      // Always make sure to close the connection, even in case of an error
      try {
        console.log("Disconnecting...");
        // await obj.disconnect();
      } catch (disconnectError) {
        console.error("Error during disconnect:", disconnectError);
      }

      // Adjust the delay time based on your requirements
      await delay(5000);
    }
  }
};

// Run the machine in a more controlled manner
const startMachine = async () => {
  try {
    await runMachine();
  } catch (startupError) {
    console.error("Error during machine startup:", startupError);
  }
};

// Run the machine as a service or daemon
startMachine();
