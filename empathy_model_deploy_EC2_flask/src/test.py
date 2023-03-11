import csv
import pandas as pd
import argparse
import codecs

import torch
from empathy_classifier import EmpathyClassifier

'''
Example:
'''

parser = argparse.ArgumentParser("Test")
parser.add_argument("--seeker_post", type=str, help="")
parser.add_argument("--response_post", type=str, help="")

parser.add_argument("--ER_model_path", type=str, default="output/EX.pth")
parser.add_argument("--IP_model_path", type=str, default="output/EX.pth")
parser.add_argument("--EX_model_path", type=str, default="output/EX.pth")

args = parser.parse_args()

if torch.cuda.is_available():
	device = torch.device("cuda")
else:
	print('No GPU available, using the CPU instead.')
	device = torch.device("cpu")


seeker_post = args.seeker_post
response_post = args.response_post

empathy_classifier = EmpathyClassifier(device,
						ER_model_path = args.ER_model_path)


(logits_empathy_ER, logits_rationale_ER) = empathy_classifier.predict_empathy([seeker_post], [response_post])
print(logits_empathy_ER)