# Empathy in Text-based Mental Health Support
This repository build on the [EMNLP 2020 publication](https://arxiv.org/pdf/2009.08441) on understanding empathy expressed in text-based mental health support.

```bash
@inproceedings{sharma2020empathy,
    title={A Computational Approach to Understanding Empathy Expressed in Text-Based Mental Health Support},
    author={Sharma, Ashish and Miner, Adam S and Atkins, David C and Althoff, Tim},
    year={2020},
    booktitle={EMNLP}
}
```

## Quickstart

### 1. Prerequisites

Our framework can be compiled on Python 3 environments. The modules used in our code can be installed using:
```
$ pip install -r requirements.txt
```

### 2.Pull our team Trained model

```
$ wget https://drive.google.com/file/d/1dlQhab6o6NUIS11BOa9xzlvGR61UzjY-/view?usp=sharing
```

### 3.Run Flask app
```
$ cd src
python3 app.py
```