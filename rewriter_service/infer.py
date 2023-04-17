import openai
import os
import time
import ast
# openai.api_key =
openai.Model.list()

prompt = """I want you to act like a rewriter assistant for the emotional supporter. Your response purpose is to improve the supporter's response to be more empathic, understanding the emotional seeker. For each of sentence which is separated by '.' of supporter message. You produce one of three following operations and reasoning why you do the operation:
    1. {"operation": "<REPLACE>", "new_sentence": "", 'sentence': ""} meaning that this sentence is not appropriate and needs to change by the new_sentence
    2. {"operation": "<NOOP>", "sentence": ""} meaning that this sentence is already empathic and thoughtful, no changes is needed
    3. {"operation": "<INSERT>", 'sentence': ""} and return a sentence that you this appropriate to insert to."""

prompt1 = """
With the following conversation:
seeker: "My job is becoming more and more stressful with each passing day. I dont know that to do"
supporter: "Don't worry! I'm here for you."
"""
prompt2 = """
[
{"operation": "<REPLACE>", "sentence": "It must be a real struggle!", "old_sentence": "Don't worry!", "explaination": "I replaced the original response with a more empathetic and understanding sentence that acknowledges the seeker's difficult situation."},
{"operation": "<NOOP>", "sentence": "I'm here for you.", "explaination": "This sentence is already empathetic and understanding so I keep it"},
{"operation": "<INSERT>", "sentence": "Have you tried talking to your boss?", "explaination": "I added a sentence that suggests a possible solution to the seeker's problem."},
]
"""

prompt3 = """
Here is the conversation:
Seeker: "I have a really bad day. I want to die, really. My parents are not happy about my final exam results. What i should do?"
Supporter: "Why don't you ask your friends how good they are? You better to be stronger."
"""

prompt4 = """
[
{"operation": "<REPLACE>", "sentence": "I'm so sorry to hear that you're going through a difficult time.", "old_sentence": "Why don't you ask your friends how good they are?", "explaination": "This sentence acknowledges the Seeker's feelings and shows empathy towards their situation. It's important to let the Seeker know that their feelings are valid and that you care about them."},
{"operation": "<INSERT>", "sentence": "It can be really hard to deal with disappointment from loved ones.", "explaination": "This sentence validates the Seeker's experience and lets them know that they're not alone in feeling this way. It's important to acknowledge that the Seeker's parents' disappointment is having an impact on their emotional well-being."},
{"operation": "<REPLACE>", "sentence": "Remember that you are strong and capable of getting through this.", "old_sentence": "You better to be stronger.", "explaination": "This sentence offers encouragement and support. It's important to remind the Seeker that they have the strength and resilience to overcome this challenge."}
]
"""

prompt5 = """
Here is the conversation:
Seeker: "I have a really bad day."
Supporter: "How it is going?"
"""

prompt6 = """
[
{"operation": "<REPLACE>", "sentence": "Would you like to talk about what's been going on and how you're feeling",   "old_sentence": "How it is going?",
"explaination": "Instead of short sentence, we should offer a compassionate response, indicating a willingness to listen and provide support."},
]
"""

prompt7 = """
  Here is the conversation:
  Emotional seeker: {seeker}
  Supporter: {supporter}
"""

def split_to_sentences(passage: str) -> str:
    sentences = passage.split(". ")
    res = ""
    for idx, sent in enumerate(sentences):
        res += "sentence {}: {} , ".format(idx+1, sent)
    return res

def infer(seeker, supporter):
    # Measure running time this function
  response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
          {"role": "user", "content": prompt},
          {"role": "user", "content": prompt1},
          {"role": "assistant", "content": prompt2},
          {"role": "user", "content": prompt3},
          {"role": "assistant", "content": prompt4},
          {"role": "user", "content": prompt5},
          {"role": "assistant", "content":prompt6},
          {"role": "user", "content": prompt7.format(seeker=split_to_sentences(seeker), supporter=split_to_sentences(supporter))},
      ]
  )
  res = eval(response['choices'][0]['message']['content'], {'__builtins__':None}, {})
  return res

# if __name__ == "__main__":
#   response = infer("I have a really bad day. I want to die, really. My parents are not happy about my final exam results. What i should do", "I know it is hard. But you have to keep it going")
#   print(response)