# Warehouse-13 Homey Application

## Overview

A Homey application designed to collect data from sensor devices connected to a Homey smart home system. It retrieves sensor data, organizes it into a structured format, and sends it to a specified endpoint for further processing. This application is built using the Homey SDK and Node.js.

## Prerequisites

Before running the application, ensure you have the following installed:

- [Homey CLI](https://github.com/athombv/homey-cli)
- [Docker](https://www.docker.com/)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-repo/here
   cd example-homey
   
2. **Install dependencies:**

   ```bash
   npm install
   
3. **Set Homey App Permissions:**
    
    Ensure the app has the homey:manager:api permission by configuring the .homeycompose/app.json file:
        
   ```bash
   {
    "permissions": ["homey:manager:api"]
   }
   
4. **Build and run the app:**

   ```bash
   homey app run
   
## Usage

Upon running, the application will:

1. Initialize and log the platform and version information.
2. Retrieve all devices connected to the Homey system.
3. Filter devices to include only those classified as sensors (e.g., Temperature/Humidity, Motion, and Door/Window sensors).
4. Collect data from these sensor devices and structure it into a JSON object.
5. Send the collected data to the specified endpoint.

## Example JSON Data

Below is an example of the structured JSON data collected from the sensor devices:
    
    {
      "data": {
        "Temperature and Humidity Sensor": {
          "capabilities": {
            "Battery alarm": false,
            "Humidity": 56.1,
            "Pressure": 996,
            "Temperature": 75,
            "Battery": 99
          }
        },
        "Motion Sensor P1": {
          "capabilities": {
            "Battery": 100,
            "Battery alarm": false,
            "Luminance": 245,
            "Motion alarm": false
          }
        },
        "Door and Window Sensor": {
          "capabilities": {
            "Battery": 100,
            "Battery alarm": false,
            "Contact alarm": false
          }
        }
      },
      "timestamp": "2024-06-26T18:59:43.361Z"
    }