# Task 1: Weather Comparison Service

## Description

This service compares the weather conditions of two cities and returns the better location based on a specific condition (e.g., hot, cold, windy, etc.). The solution uses Express and Axios to fetch weather data from an external API.

## Setup and Run
1. Initialize the project:

```bash
npm init -y
npm install express axios
```

2. Create a file app.js and paste the code from the task.

3. Start the server:

```bash
node app.js
```

4. Use curl to test the weather comparison:

```bash
curl http://localhost:3000/compare-weather
```

## Key Functions
- **getCitiesAndCondition()**: Fetches the cities and condition to compare.
- **getCityWeather(cityName)**: Retrieves weather data for a given city.
- **getBetterLocation()**: Compares the weather based on the specified condition.

## Expected Output
The server will return a JSON response with the better location, weather details of both cities, and the submission result.

# Task 2: IP Address Extraction from Worded Text

## Description

This script extracts an IP address from a given text where numbers are represented in words (e.g., "one point zero point zero point one" for 1.0.0.1).

1. Setup and Run

2. Initialize the project:

```bash
npm init -y
npm install axios
```

3. Create a file app.js and paste the code from the task.

4. Run the script:

```bash
node app.js
```

## Key Functions
- **extractIPFromWords()**: Converts words representing numbers into digits and extracts the IP address.
- **isValidIP()**: Validates whether the extracted IP is correct.

## Expected Output
The script will print the extracted IP address or a message saying no valid IP was found, and will also submit the solution to the API.

# Task 3: Emoji Decryption

## Description

This script decrypts emoji-related data. It fetches an encrypted text from the API, decrypts it using the provided key, and converts Unicode representations (e.g., U+1F600) into actual emoji characters.

1. Setup and Run

2. Install required Python packages:

```bash
python3 -m venv myenv
source myenv/bin/activate
pip3 install cryptography requests beautifulsoup4
```

3. Create a Python file (e.g., script.py) and paste the code from the task.

4. Run the script:

```bash
python script.py
```

## Key Functions
- **get_encrypted_data()**: Fetches and parses the encrypted data from the API.
- **decrypt_and_process()**: Decrypts the data and converts Unicode to emoji.
- **submit_solution()**: Submits the decrypted answer back to the API.

## Expected Output
The script will print the decrypted text, along with the submission status and response.