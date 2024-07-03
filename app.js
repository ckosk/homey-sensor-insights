"use strict";
const Homey = require("homey");
const { HomeyAPI } = require("homey-api");
const fetch = require("node-fetch");

class MyApp extends Homey.App {
  values = { "data": {}, "timestamp": "", "location": {}, "homeyId": "" };
  doorWindowID = [];

  async getData() {
    try {
      // Clear previous data, if we were to set this on interval
      this.values.data = {};
      // Add current date/time
      this.values.timestamp = new Date().toISOString();
      // Add location data. App must have the 'homey:manager:geolocation' permission! (Set in .homeycompose\app.json)
      this.values.location.latitude = this.homey.geolocation.getLatitude();
      this.values.location.longitude = this.homey.geolocation.getLongitude();

      // Create a HomeyAPI instance. App must have the 'homey:manager:api' permission! (Set in .homeycompose\app.json)
      this.homeyApi = await HomeyAPI.createAppAPI({
        homey: this.homey,
      });

      // Get Homey device ID
      const systemInfo = await this.homeyApi.system.getInfo();
      this.values.homeyId = systemInfo.cloudId;

      // Get all devices
      const devices = await this.homeyApi.devices.getDevices();
      // Loop devices
      for (const device of Object.values(devices)) {
        // If device not available, skip
        if (!device.capabilitiesObj) continue;
        // If device is a sensor (class) | Sensors in class include Temp/Humidity, Motion, and Door/Window
        if (device.class === "sensor") {
          let deviceData = { "capabilities": {} };
          for (const capability of Object.values(device.capabilitiesObj)) {
            deviceData.capabilities[capability.title] = capability.value;
            
            // Find devices with 'alarm_contact' capability. Set up listeners.
            if (capability.title == 'Contact alarm' && !this.doorWindowID.includes(device.id)) {
              this.log(`Found NEW device with 'alarm_contact' capability. Device ID: ${device.id}`);
              this.setupListener(device.id);
              this.doorWindowID.push(device.id); // Store device ID in array
            }
          }
          this.values.data[device.name] = deviceData;
        }
      }
      // Temp
      //this.log(JSON.stringify(this.values.data["Motion Sensor P1"].capabilities["Motion alarm"]))
      //this.log(`Latitude: ${this.values.location.latitude}`);

      // Testing POST
      const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(this.values, null, 2),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }});
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);}
      const body = await res.json();
      this.log('POST request successful:', JSON.stringify(body, null, 2));
    } catch (error) {
      this.log('Error in getData:', error.message);}
  }

  async onInit() {
    try {
      this.log("Application has been initialized");
      this.log(this.homey.platform + " Version: " + this.homey.version);
      // Run getData() initially
      await this.getData();
    } catch (error) {
      this.log('Error in onInit:', error.message);
    }
    // Run getData() every 5 minutes
    setInterval(async () => {
      try {
        await this.getData();
      } catch (error) {
        this.log('Error in interval getData:', error.message);
      }
    }, 300000); // 5 minute
  }

  async setupListener(doorWindowID) {
    try {
      const device = await this.homeyApi.devices.getDevice({
        id: doorWindowID,
      });
      const listener = device.makeCapabilityInstance(
        "alarm_contact",
        async (value) => {
          this.log(`Contact Alarm (${device.id}): ${value}`);
          if (value) {await this.getData();}
        });
    } catch (error) {
      this.log(
        `Error setting up listener for device ID ${doorWindowID}: ${error.message}`
      );
    }
  }
}

module.exports = MyApp;
