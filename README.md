# Warehouse-13 Homey Application

## Overview

A Homey application designed to collect data from sensor devices connected to a Homey smart home system. It retrieves sensor data, organizes it into a structured format, and sends it to a specified endpoint for further processing. This application is built using the Homey SDK and Node.js.

## Prerequisites

Before running the application, ensure you have the following installed:

- Homey CLI
  ```bash
  npm install --global --no-optional homey
- [Docker](https://www.docker.com/)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ckosk/homey-sensor-insights.git
   cd homey-sensor-insights
   
2. **Install dependencies:**

   ```bash
   npm install
   
3. **Set Homey App Permissions:**
    
    Ensure the app has the homey:manager:api permission as well as the homey:manager:geolocation permission by configuring the .homeycompose/app.json file:
        
   ```bash
   {
    "permissions": [
    "homey:manager:api",
    "homey:manager:geolocation"]
   }
   
4. **Build and run the app:**

   ```bash
   homey app run
   
## Usage

Upon running, the application will:

1. Initialize and log the platform and version information.
2. Retrieve all devices connected to the Homey system.
3. Filter devices to include only those classified as sensors (e.g., Temperature/Humidity, Motion, and Door/Window sensors).
4. Collect data from these sensor devices every 5 minutes and structure it into a JSON object.
5. Collect data from these sensor devices when a device capability changes and structure it into a JSON object.
6. Send the collected data to the specified endpoint.

## Example JSON Data

Below is an example of the structured JSON data collected from the sensor devices:
    
    {
    "data": {
      "Door and Window Sensor": {
        "deviceId": "381e7dd8-655c-4fa0-a19d-579ec84ea251",
        "capabilities": {
          "Contact alarm": true,
          "Battery alarm": false,
          "Battery": 100
        }
      },
      "Temperature and Humidity Sensor": {
        "deviceId": "4f184f36-866c-459b-8143-11093bfe66d4",
        "capabilities": {
          "Battery": 97,
          "Temperature": 73,
          "Pressure": 993,
          "Humidity": 52.8,
          "Battery alarm": false
        }
      },
      "Door/Window sensor 2": {
        "deviceId": "bdb936c8-cea9-4f1f-b8f4-58ac89e099c1",
        "capabilities": {
          "Battery": 99,
          "Contact alarm": false,
          "Tamper alarm": true,
          "Temperature": 72
        }
      },
      "Motion Sensor P1": {
        "deviceId": "f55c871f-e9b7-45a6-814f-79299302f650",
        "capabilities": {
          "Motion alarm": true,
          "Luminance": 276,
          "Battery alarm": false,
          "Battery": 100
        }
      }
    },
    "timestamp": "2024-07-05T17:02:34.064Z",
    "location": {
      "latitude": 38.89767,
      "longitude": -77.03655
    },
    "homeyId": "abc123def456"
  }