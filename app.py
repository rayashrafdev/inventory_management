import pandas as pd
import torch
import os
from PIL import Image
import torchvision.transforms as transforms
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load model
model = torch.hub.load('pytorch/vision:v0.10.0', 'mobilenet_v2', pretrained=True)
model.classifier[1] = torch.nn.Linear(model.classifier[1].in_features, 61)
model.load_state_dict(torch.load('Model.pth', map_location=torch.device('cpu')))
model.eval()

# Define your image transformations
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# List of class names (example)
class_names = [
    'water', 'pizza-margherita-baked', 'broccoli', 'salad-leaf-salad-green', 'egg', 'butter',
    'bread-white', 'apple', 'dark-chocolate', 'white-coffee-with-caffeine', 'sweet-pepper',
    'mixed-salad-chopped-without-sauce', 'tomato-sauce', 'cucumber', 'cheese', 'pasta-spaghetti',
    'rice', 'zucchini', 'salmon', 'mixed-vegetables', 'espresso-with-caffeine', 'banana',
    'strawberries', 'mayonnaise', 'almonds', 'bread-wholemeal', 'wine-white', 'hard-cheese',
    'ham-raw', 'tomato', 'french-beans', 'mandarine', 'wine-red', 'potatoes-steamed', 'croissant',
    'carrot', 'salami', 'boisson-au-glucose-50g', 'biscuits', 'corn', 'leaf-spinach', 'tea-green',
    'chips-french-fries', 'parmesan', 'beer', 'bread-french-white-flour', 'coffee-with-caffeine',
    'chicken', 'soft-cheese', 'tea', 'avocado', 'bread-sourdough', 'gruyere', 'sauce-savoury',
    'honey', 'mixed-nuts', 'jam', 'bread-whole-wheat', 'water-mineral', 'onion', 'pickle'
]

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['file']
    img = Image.open(file.stream).convert('RGB')
    img_t = transform(img)
    batch_t = torch.unsqueeze(img_t, 0)
    
    with torch.no_grad():
        out = model(batch_t)
        _, index = torch.max(out, 1)
        predicted_class = class_names[index.item()]
    
    return jsonify({'predicted_class': predicted_class})

if __name__ == '__main__':
    app.run(debug=True)
