import requests
from cryptography.fernet import Fernet
import re
from bs4 import BeautifulSoup

def get_encrypted_data():
    """Fetch the encrypted data from the API and parse the HTML response"""
    url = "https://quest.squadcast.tech/api/4NI21IS123/emoji"
    response = requests.get(url)
    
    if response.status_code == 200:
        # Parse HTML content
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find the code tags containing key and encrypted text
        code_tags = soup.find_all('code')
        
        key = None
        encrypted_text = None
        
        for code in code_tags:
            content = code.text.strip()
            if 'Key:' in content:
                key = content.split('Key:')[1].strip()
            elif 'EncryptedText:' in content:
                encrypted_text = content.split('EncryptedText:')[1].strip()
        
        if key and encrypted_text:
            return {'key': key, 'text': encrypted_text}
        
        raise Exception("Could not find key or encrypted text in response")
    
    raise Exception(f"Failed to fetch data: {response.status_code}")

def convert_unicode_to_emoji(text):
    """Convert U+XXXX format unicode to actual emoji characters"""
    def replace_unicode(match):
        code_point = int(match.group(1), 16)
        return chr(code_point)
    
    # Pattern matches U+XXXX format
    pattern = r'U\+([0-9A-Fa-f]{4,5})'
    return re.sub(pattern, replace_unicode, text)

def decrypt_and_process(encrypted_text, key):
    """Decrypt the text using Fernet and process emojis"""
    # Initialize Fernet with the key
    f = Fernet(key.encode())
    
    # Decrypt the text
    decrypted_bytes = f.decrypt(encrypted_text.encode())
    decrypted_text = decrypted_bytes.decode()
    
    # Convert U+XXXX format unicode to emojis
    final_text = convert_unicode_to_emoji(decrypted_text)
    
    return final_text

def submit_solution(answer, code):
    """Submit the solution to the API"""
    from urllib.parse import quote
    
    # URL encode the answer
    encoded_answer = quote(answer)
    
    # Construct submission URL
    submit_url = f"https://quest.squadcast.tech/api/4NI21IS123/submit/emoji?answer={encoded_answer}&extension=py"
    
    print(f"Submitting answer: {answer}")
    print(f"Encoded answer: {encoded_answer}")
    
    # Make POST request with code in body
    response = requests.post(submit_url, data=code)
    
    return response.status_code, response.text

def main():
    try:
        # Get encrypted data
        data = get_encrypted_data()
        
        print("Key:", data['key'])
        print("Encrypted text:", data['text'])
        
        # Decrypt and process
        decrypted_text = decrypt_and_process(data['text'], data['key'])
        
        print("Decrypted text:", decrypted_text)
        
        # Get the source code
        with open(__file__, 'r') as file:
            source_code = file.read()
        
        # Submit solution
        status, response = submit_solution(decrypted_text, source_code)
        
        print(f"Submission status: {status}")
        print(f"Response: {response}")
        
        return decrypted_text
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

if __name__ == "__main__":
    main()