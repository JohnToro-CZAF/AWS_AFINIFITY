import openai
import os
import time
import ast
openai.api_key = "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"
openai.Model.list()

prompt = """I want you to act like a rewriter assistant for the emotional supporter. Your response purpose is to improve the supporter's response to be more empathic, understanding the emotional seeker. For each of sentence which is separated by '.' of supporter message. You produce one of three following operations and reasoning why you do the operation:
1. {"operation": "<REPLACE>", "new_sentence": "", 'sentence': ""} meaning that this sentence is not appropriate and needs to change by the new sentence
2. {"operation": "<NOOP>", "sentence": ""} meaning that this sentence is already empathic and thoughtful, no changes is needed
3. {"operation": "<INSERT>", 'sentence': ""} and return a sentence that you this appropriate to insert to."""

prompt2 = """
  With the following conversation:
  seeker: "My job is becoming more and more stressful with each passing day. I dont know that to do"
  supporter: sentence 1: "don't worry!" , sentence 2: "I'm there for you."
  Here is the answer template that you should follow:
  [{"operation": "<REPLACE>", "sentence": "It must be a real struggle!", "old_sentence": "don't worry!", "explaination": "I replaced the original response with a more empathetic and understanding sentence that acknowledges the seeker's difficult situation."},
  {"operation": "<NOOP>", "sentence": "I'm there for you.", "explaination": "This sentence is already empathetic and understanding so I keep it"},
  {"operation": "<INSERT>", "sentence": "Have you tried talking to your boss?", "explaination": "I added a sentence that suggests a possible solution to the seeker's problem."},
  ]
"""

# seeker = """sentence 1: "I have a really bad day." sentence 2: "I want to die, really." sentence 3: "My parents are not happy about my final exam results. What i should do" """
# supporter = """sentence 1: "I know it is hard." sentence 2: "But you have to keep it going" """

prompt3 = """
  Here is the conversation:
  Emotional seeker: {seeker}
  Supporter: {supporter}
"""

def split_to_sentences(passage: str) -> str:
    sentences = passage.split(". ")
    res = ""
    for idx, sent in enumerate(sentences):
        res += "sentence {}: {} , ".format(idx+1, sent)
    print(res)
    return res

def infer(seeker, supporter):
    # Measure running time this function
    start = time.time()
