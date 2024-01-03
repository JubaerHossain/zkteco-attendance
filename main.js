const ZKJUBAER = require("zk-jubaer");
const axios = require('axios');

const ip = "192.168.1.250";
const port = 4370;
const timeout = 5200;
const inport = 1000;

// REST API Parameters
const API_URL = 'https://your-api-endpoint.com/attendance';
const API_KEY = 'your-api-key';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const subscribeToRealTimeLogs = async (zkjubaer) => {
    return new Promise(async (resolve, reject) => {
        zkjubaer.getRealTimeLogs(async (realTimeLog) => {
            console.log("Real-time Log:", realTimeLog);
            
            // Assuming realTimeLog contains user_id and event_time properties
            const { userId, attTime } = realTimeLog;

            try {
                // Send attendance data to the REST API
                // await axios.post(API_URL, {
                //     user_id,
                //     event_time,
                // }, {
                //     headers: {
                //         'Authorization': `Bearer ${API_KEY}`,
                //         'Content-Type': 'application/json',
                //     },
                // });

                console.log(`Attendance data for user ${userId} sent to the API at ${attTime}`);
                resolve();
            } catch (apiError) {
                reject(apiError);
            }
        }, (error) => {
            reject(error);
        }, () => {
            resolve();
        });
    });
};

const createAndConnect = async () => {
    const zkjubaer = new ZKJUBAER(ip, port, timeout, inport);

    try {
        await zkjubaer.createSocket();
        return zkjubaer;
    } catch (error) {
        console.error("Error creating socket:", error);
        throw error;
    }
};

const disconnect = async (zkjubaer) => {
    try {
        if (zkjubaer._socket) {
            zkjubaer._socket.end();
        }
    } catch (disconnectError) {
        console.error("Error during disconnect:", disconnectError);
    }
};

const runMachine = async () => {
    try {
        while (true) {
            const zkjubaer = await createAndConnect();

            try {
                await subscribeToRealTimeLogs(zkjubaer);

                // Wait for a specific duration (adjust as needed)
                await delay(5000);
            } catch (operationError) {
                console.error("Error during operations:", operationError);
            } finally {
                await disconnect(zkjubaer);
            }
        }
    } catch (initializationError) {
        console.error("Error during initialization:", initializationError);
    }
};

process.on('SIGINT', () => {
    console.log("Script terminated by user.");
    process.exit();
});

runMachine();