const express = require('express');
const axios = require('axios');
const app = express();

// Constants
const BASE_URL = 'https://quest.squadcast.tech/api/4NI21IS073'; // Replace with your roll number
const ROLL_NO = '4NI21IS073'; // Replace with your roll number

// Helper function to parse HTML response
function parseHTMLResponse(html) {
    try {
        const city1Match = html.match(/City 1: ([^<]+)/);
        const city2Match = html.match(/City 2: ([^<]+)/);
        const conditionMatch = html.match(/Condition: ([^<]+)/);

        if (!city1Match || !city2Match || !conditionMatch) {
            throw new Error('Could not parse cities and condition from HTML');
        }

        return {
            city1: city1Match[1].trim(),
            city2: city2Match[1].trim(),
            condition: conditionMatch[1].trim()
        };
    } catch (error) {
        console.error('Error parsing HTML:', error);
        throw error;
    }
}

// Helper function to normalize weather data
function normalizeWeatherData(rawData, cityName) {
    return {
        city: cityName,
        temperature: rawData.main.temp - 273.15, // Convert Kelvin to Celsius
        wind: rawData.wind.speed,
        rain: rawData.rain?.value || 0,
        cloud: rawData.clouds.all
    };
}

// Helper function to get cities and condition
async function getCitiesAndCondition() {
    try {
        console.log('Fetching cities and condition...');
        const response = await axios.get(`${BASE_URL}/weather`);
        console.log('Received HTML response');
        
        const data = parseHTMLResponse(response.data);
        console.log('Parsed data:', data);
        
        return data;
    } catch (error) {
        console.error('Error in getCitiesAndCondition:', error.message);
        throw new Error(`Failed to fetch cities and condition: ${error.message}`);
    }
}

// Helper function to get weather details for a city
async function getCityWeather(cityName) {
    try {
        console.log(`Fetching weather for ${cityName}...`);
        const response = await axios.get(`${BASE_URL}/weather/get?q=${cityName}`);
        console.log(`Weather response for ${cityName}:`, response.data);
        
        return normalizeWeatherData(response.data, cityName);
    } catch (error) {
        console.error(`Error in getCityWeather for ${cityName}:`, error.message);
        throw new Error(`Failed to fetch weather for ${cityName}: ${error.message}`);
    }
}

// Function to determine better location based on condition
function getBetterLocation(city1Weather, city2Weather, condition) {
    console.log('Comparing weather for condition:', condition);
    console.log('City 1 Weather (normalized):', city1Weather);
    console.log('City 2 Weather (normalized):', city2Weather);
    
    switch (condition.toLowerCase()) {
        case 'hot':
            return city1Weather.temperature > city2Weather.temperature ? city1Weather.city : city2Weather.city;
        case 'cold':
            return city1Weather.temperature < city2Weather.temperature ? city1Weather.city : city2Weather.city;
        case 'windy':
            return city1Weather.wind > city2Weather.wind ? city1Weather.city : city2Weather.city;
        case 'rainy':
            return city1Weather.rain > city2Weather.rain ? city1Weather.city : city2Weather.city;
        case 'sunny':
            return city1Weather.cloud < city2Weather.cloud ? city1Weather.city : city2Weather.city;
        case 'cloudy':
            return city1Weather.cloud > city2Weather.cloud ? city1Weather.city : city2Weather.city;
        default:
            throw new Error('Invalid condition');
    }
}

// Main route to process weather comparison
app.get('/compare-weather', async (req, res) => {
    try {
        console.log('\n--- New Request to /compare-weather ---');
        
        // Get cities and condition
        const { city1, city2, condition } = await getCitiesAndCondition();
        console.log('Retrieved cities and condition:', { city1, city2, condition });

        // Get weather details for both cities
        const [city1Weather, city2Weather] = await Promise.all([
            getCityWeather(city1),
            getCityWeather(city2)
        ]);

        // Determine better location
        const betterLocation = getBetterLocation(city1Weather, city2Weather, condition);
        console.log('Better location determined:', betterLocation);

        // Get the source code for submission
        const sourceCode = `
// Weather Comparison Solution
const express = require('express');
const axios = require('axios');
const app = express();
${app.toString()}
`;

        // Submit the answer
        const submitUrl = `${BASE_URL}/submit/weather?answer=${betterLocation}&extension=js`;
        console.log('Submitting to:', submitUrl);
        
        const submitResponse = await axios.post(submitUrl, sourceCode, {
            headers: {
                'Content-Type': 'text/plain'
            }
        });

        // Send response
        res.json({
            betterLocation,
            condition,
            city1Weather,
            city2Weather,
            submitResponse: submitResponse.data
        });

    } catch (error) {
        console.error('Error in /compare-weather:', error.message);
        res.status(500).json({
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});