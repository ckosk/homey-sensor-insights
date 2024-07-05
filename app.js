"use strict";
const Homey = require("homey");
const { HomeyAPI } = require("homey-api");
const fetch = require("node-fetch");

class MyApp extends Homey.App {
  values = { data: {}, timestamp: "", location: {}, homeyId: "" };
  doorWindowID = [];

  async getData() {
    try {
      // Clear previous data
      this.values.data = {};
      // Add current date/time
      this.values.timestamp = new Date().toISOString();
      // Add location data
      this.values.location.latitude = this.homey.geolocation.getLatitude();
      this.values.location.longitude = this.homey.geolocation.getLongitude();

      // Get Homey device ID
      const systemInfo = await this.homeyApi.system.getInfo();
      this.values.homeyId = systemInfo.cloudId;

      // Get all devices
      const devices = await this.homeyApi.devices.getDevices();
      // Loop through devices and process sensors
      for (const device of Object.values(devices)) {
        if (device.class === "sensor" && device.capabilitiesObj) {
          let deviceData = { deviceId: device.id, capabilities: {} };
          for (const [key, capability] of Object.entries(device.capabilitiesObj)) {
            deviceData.capabilities[capability.title] = capability.value;
            // Set up listeners for 'alarm_contact' capability
            if (capability.title === 'Contact alarm' && !this.doorWindowID.includes(device.id)) {
              this.log(`Found NEW device with 'alarm_contact' capability. Device ID: ${device.id}`);
              this.setupListener(device.id);
              this.doorWindowID.push(device.id); // Store device ID in array
            }
          }
          this.values.data[device.name] = deviceData;
        }
      }

      // Testing POST
      const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(this.values, null, 2),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
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
      // Create HomeyAPI instance once
      this.homeyApi = await HomeyAPI.createAppAPI({
        homey: this.homey,
      });
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
    }, 300000); // 5 minutes
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
          if (value) { await this.getData(); }});
    } catch (error) {
      this.log(`Error setting up listener for device ID ${doorWindowID}: ${error.message}`);
    }
  }
}

module.exports = MyApp;
