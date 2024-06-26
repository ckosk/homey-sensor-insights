"use strict";
const Homey = require("homey");
const { HomeyAPI } = require("homey-api");
const fetch = require("node-fetch");

class MyApp extends Homey.App {
  values = { data: {}, timestamp: "" };

  async getData() {
    try {
      // Clear previous data, if we were to set this on interval
      this.values.data = {};
      // Add current date/time
      this.values.timestamp = new Date().toISOString();

      // Create a HomeyAPI instance. App must have the `homey:manager:api` permission! (Set in .homeycompose\app.json)
      this.homeyApi = await HomeyAPI.createAppAPI({
        homey: this.homey,
      });

      // Get all devices
      const devices = await this.homeyApi.devices.getDevices();
      // Loop devices
      for (const device of Object.values(devices)) {
        // If device not available, skip
        if (!device.capabilitiesObj) continue;
        // If device is a sensor (class) | Sensors in class include Temp/Humidity, Motion, and Door/Window
        if (device.class === "sensor") {
          //this.log(`=== ${device.name} ===`);
          let deviceData = { capabilities: {} };
          for (const capability of Object.values(device.capabilitiesObj)) {
            //this.log(`${capability.title}: ${capability.value}`);
            deviceData.capabilities[capability.title] = capability.value;
          }
          this.values.data[device.name] = deviceData;
        }
      }
      // Print JSON object
      this.log(JSON.stringify(this.values, null, 2));
      //this.log(JSON.stringify(this.values.data["Motion Sensor P1"].capabilities["Motion alarm"]))
      // Testing POST
      const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify(this.values, null, 2),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      const body = await res.json();
      //this.log(body);
    } catch (error) {
      this.log("Error in getData: ", error.message);
    }
  }

  async onInit() {
    this.log("Application has been initialized");
    this.log(this.homey.platform + " Version: " + this.homey.version);
    // Run getData() initially
    await this.getData();

    // Run getData() every minute
    setInterval(() => {
      this.getData().catch((error) =>
        this.log("Error in interval getData:", error.message)
      );
    }, 60000); // 1 minute
  }
}

module.exports = MyApp;