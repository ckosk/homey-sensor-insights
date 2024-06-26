A Homey application designed to collect data from sensor devices connected to a Homey smart home system. 
It retrieves sensor data, organizes it into a structured format, and sends it to a specified endpoint for further processing.

Upon running, the application will:

1. Initialize and log the platform and version information.
2. Retrieve all devices connected to the Homey system.
3. Filter devices to include only those classified as sensors (e.g., Temperature/Humidity, Motion, and Door/Window sensors).
4. Collect data from these sensor devices and structure it into a JSON object.
5. Send the collected data to the specified endpoint.
