import os
import requests

def test_anthropic_api():
    api_key = os.environ.get('ANTHROPIC_API_KEY')
    
    if not api_key:
        print("Error: ANTHROPIC_API_KEY not found in environment variables.")
        return
    
    url = "https://api.anthropic.com/v1/messages"
    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }
    data = {
        "model": "claude-3-sonnet-20240229",
        "max_tokens": 100,
        "messages": [
            {
                "role": "user",
                "content": "Hello, Claude. This is a test message. Please respond with a short greeting."
            }
        ]
    }

    try:
        response = requests.post(url, json=data, headers=headers)
        response.raise_for_status()  # Raises an HTTPError if the HTTP request returned an unsuccessful status code
        
        content = response.json()['content'][0]['text']
        print("API test successful. Claude's response:")
        print(content)
    except requests.exceptions.RequestException as e:
        print(f"Error occurred while testing the API: {e}")
        if response.text:
            print(f"Response content: {response.text}")

if __name__ == "__main__":
    test_anthropic_api()
