from fastapi import APIRouter, File, UploadFile, Depends, HTTPException
from fastapi.concurrency import run_in_threadpool
from app.services.gemini_client import generate_gemini_response
import os
from app.services import redis, embeddings, pdf_processing, openai_client
import numpy as np
import json
import faiss
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()
router = APIRouter()


@router.post("/chat/upload")
async def upload_pdf(session_id: str, file: UploadFile = File(...), redis=Depends(redis.get_redis)):
    if not await redis.exists(session_id):
        raise HTTPException(status_code=404, detail="Session not found")

    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type")

    text = await run_in_threadpool(pdf_processing.extract_text_from_pdf, await file.read())
    chunks = pdf_processing.chunk_text(text)
    print("Extracted text from PDF and chunked it", len(chunks))
    chunk_embeddings = await run_in_threadpool(embeddings.generate_embeddings, chunks)

    # Store chunks and embeddings
    for chunk, embedding in zip(chunks, chunk_embeddings):
        data = json.dumps({"text": chunk, "embedding": embedding.tolist()})
        await redis.rpush(f"{session_id}:chunks", data)

    return {"status": "success", "chunks": len(chunks)}


@router.post("/chat")
async def chat_interaction(session_id: str, question: str, redis=Depends(redis.get_redis)):
    if not await redis.exists(session_id):
        raise HTTPException(status_code=404, detail="Session not found")

    # Retrieve history
    history = await redis.lrange(f"{session_id}:history", 0, -1)
    history = [json.loads(msg) for msg in history][-5:]  # Keep last 5

    # Embed question
    question_embedding = (await run_in_threadpool(embeddings.generate_embeddings, [question]))[0]

    # Retrieve chunks
    chunks_data = [json.loads(data) for data in await redis.lrange(f"{session_id}:chunks", 0, -1)]
    if not chunks_data:
        raise HTTPException(status_code=400, detail="Upload PDF first")

    # FAISS search
    embeddings_list = [np.array(chunk['embedding'], dtype=np.float32)
                       for chunk in chunks_data]
    index = faiss.IndexFlatL2(len(embeddings_list[0]))
    index.add(np.vstack(embeddings_list))
    _, indices = index.search(
        np.array([question_embedding], dtype=np.float32), k=3)
    context = [chunks_data[i]['text'] for i in indices[0]]

    # Prepare OpenAI prompt
    messages = [{"role": "system", "content": f"Context: {' '.join(context)}"}]
    for msg in history:
        messages.extend([
            {"role": "user", "content": msg['question']},
            {"role": "assistant", "content": msg['answer']}
        ])
    messages.append({"role": "user", "content": question})

    # Generate response
    model_provider = os.getenv("MODEL_PROVIDER", "openai").lower()

    if model_provider == "openai":
        response = await openai_client.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages
        )
        answer = response.choices[0].message.content
    elif model_provider == "gemini":
        # Convert messages to Gemini-friendly prompt
        gemini_prompt = "\n".join(
            [f"{msg['role'].capitalize()}: {msg['content']}"
             for msg in messages]
        )
        answer = await generate_gemini_response(gemini_prompt)
    else:
        raise HTTPException(status_code=400, detail="Invalid model provider")

    # Update history
    new_entry = json.dumps({"question": question, "answer": answer})
    await redis.rpush(f"{session_id}:history", new_entry)
    await redis.ltrim(f"{session_id}:history", -5, -1)  # Keep only last 5

    return {"answer": answer}
