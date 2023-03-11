from flask import Flask, flash, request, request, jsonify, abort
from flask_cors import CORS, cross_origin
import csv
import pandas as pd
import numpy as np
import argparse
import codecs
import requests
import json

import torch
from empathy_classifier import EmpathyClassifier

'''
Example:
'''
parser = argparse.ArgumentParser("Test")

parser.add_argument("--ER_model_path", type=str, default="../output/EX.pth")
parser.add_argument("--IP_model_path", type=str, default="../output/EX.pth")
parser.add_argument("--EX_model_path", type=str, default="../output/EX.pth")

args = parser.parse_args()

if torch.cuda.is_available():
	device = torch.device("cuda")
else:
	print('No GPU available, using the CPU instead.')
	device = torch.device("cpu")

empathy_classifier = EmpathyClassifier(device,
						ER_model_path = args.ER_model_path)


app = Flask(__name__)

@app.route('/predict',methods=['POST'])
def predict():
    message = request.json
    seeker_post, response_post = (message['seeker'], message['supporter'])
    if response_post=="" or seeker_post=="":
        return jsonify({"score": 2}) 
    respone = empathy_classifier.predict_empathy([seeker_post], [response_post])
    max_index = np.argmax(respone, axis=-1)
    #print(max_index)
    return jsonify({"score": max_index.tolist()[0]})
@app.route('/generate',methods=['POST'])
def generate():
    message = request.json
    payload = json.dumps(message)
    response = requests.post("https://d34hkraigsyoa9.cloudfront.net", data=payload)
    return response.text

cors = CORS(app, expose_headers='Authorization')
app.config['CORS_HEADERS'] = 'Content-Type'
app.run(debug=True, host="0.0.0.0", use_reloader=False, port=5000)