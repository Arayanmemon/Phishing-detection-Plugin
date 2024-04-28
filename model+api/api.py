# Dependencies
from flask import Flask, request, jsonify
import traceback
import numpy as np
import torch
import torch.nn as nn
import numpy as np
from urllib.parse import urlparse

# URL


def urlToArray(url):
# Parse the URL
    parsed_url = urlparse(url)

# Features
    url_length = len(url)
    domain_length = len(parsed_url.netloc)
    is_domain_ip = 1 if parsed_url.netloc.replace('.', '').isdigit() else 0
    tld_length = len(parsed_url.netloc.split('.')[-1])
    no_of_subdomain = len(parsed_url.netloc.split('.')) - 2  # Subtract 2 for 'www' and TLD
    no_of_letters_in_url = sum(c.isalpha() for c in url)
    letter_ratio_in_url = no_of_letters_in_url / url_length
    no_of_digits_in_url = sum(c.isdigit() for c in url)
    digit_ratio_in_url = no_of_digits_in_url / url_length
    no_of_equals_in_url = url.count('=')
    no_of_qmark_in_url = url.count('?')
    no_of_ampersand_in_url = url.count('&')
    is_https = 1 if parsed_url.scheme == 'https' else 0

    # Create numpy array
    input_data = np.array([
        [url_length, domain_length, is_domain_ip, tld_length, no_of_subdomain,
        no_of_letters_in_url, letter_ratio_in_url, no_of_digits_in_url,
        digit_ratio_in_url, no_of_equals_in_url, no_of_qmark_in_url,
        no_of_ampersand_in_url,  is_https]
    ])
    
    return input_data



class NeuralNetwork(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(NeuralNetwork, self).__init__()
        self.fc1 = nn.Linear(input_size, hidden_size)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(hidden_size, output_size)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        out = self.fc1(x)
        out = self.relu(out)
        out = self.fc2(out)
        out = self.sigmoid(out)
        return out
      
# Function to make predictions
def predict_with_model(input_data, model_path):
    # Load the model
    model = NeuralNetwork(input_size=13, hidden_size=64, output_size=1)  # Modify input_size accordingly
    model.load_state_dict(torch.load(model_path))
    model.eval()

    # Convert input_data to tensor and reshape it
    input_tensor = torch.tensor(input_data, dtype=torch.float32).view(1, -1)

    # Make prediction
    with torch.no_grad():
        prediction = model(input_tensor).item()

    return prediction



# Your API definition
app = Flask(__name__)

@app.route('/predict', methods=['get'])
def predict():
    url = request.args.get("url")
    inputData = urlToArray(url)
    probability = predict_with_model(inputData , "./model.pth")
    return {
        "status": 200,
        "probability": probability 
    }
  

if __name__ == '__main__':
    try:
        port = 4444 # This is for a command-line input
    except:
        port = 12345 # If you don't provide any port the port will be set to 12345

    app.run(port=port, debug=True)