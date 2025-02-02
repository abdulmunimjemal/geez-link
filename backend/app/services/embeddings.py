from sentence_transformers import SentenceTransformer
import numpy as np
from functools import lru_cache

@lru_cache(maxsize=1)
def load_model():
    return SentenceTransformer('abdulmunimjemal/xlm-r-retrieval-am-v1')

def generate_embeddings(texts):
    model = load_model()
    return model.encode(texts, convert_to_numpy=True)
