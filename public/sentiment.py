
from transformers import pipeline
import json

pipe = pipeline("text-classification", model="Sigma/financial-sentiment-analysis")

result=pipe('stocks rallied and the British pound gained')
print( json.dumps(result))