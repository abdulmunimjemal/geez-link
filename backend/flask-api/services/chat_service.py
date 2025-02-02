import redis
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from openai import OpenAI

client = redis.StrictRedis(host='localhost', port=6379, db=0)
model = SentenceTransformer('abdulmunimjemal/xlm-r-retrieval-am-v1')

def interact_with_chat(session_id, data):
    # Validate session
    if not client.exists(session_id):
        return {"message": "Invalid session ID"}
    
    # Embed question
    question = data.get("question")
    question_embedding = model.encode(question)

    # Get similar chunks from Redis (for simplicity, assume embeddings are stored)
    embeddings = np.array(client.get(session_id))  # This is a simplified example
    faiss_index = faiss.IndexFlatL2(embeddings.shape[1])
    faiss_index.add(embeddings)
    _, indices = faiss_index.search(np.array([question_embedding]), k=5)

    # Search for most relevant chunks (simplified)
    similar_chunks = [client.get(session_id)[i] for i in indices[0]]

    # Mock response (replace with OpenAI call)
    response = "This is a mock response based on your question."

    # Update history (simplified for now)
    client.rpush(session_id, {"question": question, "answer": response})

    return {"answer": response, "similar_chunks": similar_chunks}
