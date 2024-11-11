const axios = require('axios');

async function extractIPFromWords(text) {
    // Dictionary for number words
    const numberWords = {
        'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
        'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9'
    };

    // Split text into words
    const words = text.toLowerCase().split(/\s+/);
    
    // Find potential IP segments
    let ipCandidate = '';
    let segments = [];
    let currentSegment = '';
    
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        
        // Check if it's a number word
        if (numberWords[word]) {
            currentSegment += numberWords[word];
        }
        // Check if it's the word "point" and we have a current segment
        else if (word === 'point' && currentSegment) {
            if (parseInt(currentSegment) >= 0 && parseInt(currentSegment) <= 255) {
                segments.push(currentSegment);
                currentSegment = '';
            } else {
                // Reset if segment is invalid
                segments = [];
                currentSegment = '';
            }
        }
        // If we hit a non-number word and it's not "point", check if we have a complete segment
        else if (currentSegment) {
            if (parseInt(currentSegment) >= 0 && parseInt(currentSegment) <= 255) {
                segments.push(currentSegment);
            }
            // Reset
            currentSegment = '';
            if (segments.length < 4) segments = [];
        }
        
        // Check if we have a complete IP address
        if (segments.length === 4) {
            ipCandidate = segments.join('.');
            // Validate IP format
            if (isValidIP(ipCandidate)) {
                return ipCandidate;
            }
            segments = [];
        }
    }
    
    return null;
}

function isValidIP(ip) {
    const parts = ip.split('.');
    if (parts.length !== 4) return false;
    
    return parts.every(part => {
        const num = parseInt(part);
        return num >= 0 && num <= 255 && part === num.toString();
    });
}

async function main() {
    try {
        // Replace with your actual API endpoint
        const response = await axios.get('https://quest.squadcast.tech/api/4NI21IS073/worded_ip');
        
        // Extract text content from HTML
        const text = response.data.replace(/<[^>]*>/g, ' ');
        
        // Find IP address
        const ip = await extractIPFromWords(text);
        
        if (ip) {
            console.log('Found IP:', ip);
            
            // Submit the answer
            const submitUrl = `https://quest.squadcast.tech/api/4NI21IS073/submit/worded_ip?answer=${ip}&extension=js`;
            const submitResponse = await axios.post(submitUrl, {
                // Include your code as the request body
                // You might want to read it from the current file
                code: "// Your code here"
            });
            
            console.log('Submission response:', submitResponse.data);
        } else {
            console.log('No valid IP address found in the text');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();