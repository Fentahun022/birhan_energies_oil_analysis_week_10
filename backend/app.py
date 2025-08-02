from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import json
import os

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
CORS(app) # Enable CORS for development (important for React dev server)

# Paths to your pre-computed data and analysis results
PROCESSED_DATA_PATH = 'backend/results/oil_price_data_processed.json'
CHANGE_POINTS_PATH = 'backend/results/detected_change_points.json'
KEY_EVENTS_PATH = 'backend/data/key_events.csv'

# Load data once at startup
processed_oil_data = []
change_points_data = {}
key_events_data = []

try:
    with open(PROCESSED_DATA_PATH, 'r') as f:
        processed_oil_data = json.load(f)
    with open(CHANGE_POINTS_PATH, 'r') as f:
        change_points_data = json.load(f)
    key_events_df = pd.read_csv(KEY_EVENTS_PATH, parse_dates=['EventDate'])
    key_events_data = key_events_df.to_dict(orient='records')
except FileNotFoundError as e:
    print(f"Error loading data: {e}. Ensure analysis scripts were run.")

@app.route('/')
def serve_react_app():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/oil_prices', methods=['GET'])
def get_oil_prices():
    return jsonify(processed_oil_data)

@app.route('/api/change_points', methods=['GET'])
def get_change_points():
    # In a real scenario, this might return a list if multiple CPs are detected
    # For this simplified single CP example, it returns one object
    return jsonify(change_points_data)

@app.route('/api/key_events', methods=['GET'])
def get_key_events():
    return jsonify(key_events_data)

# Optional: API for more detailed model insights (e.g., posterior distributions)
# @app.route('/api/model_insights', methods=['GET'])
# def get_model_insights():
#     # Load and return more detailed results if saved from PyMC3 analysis
#     pass

if __name__ == '__main__':
    # Ensure the results directory exists
    os.makedirs('backend/results', exist_ok=True)
    app.run(debug=True, port=5000) # Run Flask app on port 5000