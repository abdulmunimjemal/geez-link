from pydantic import BaseModel
from typing import List, Optional

# Schema for creating a session
class SessionCreateResponse(BaseModel):
    session_id: str

# Schema for deleting a session
class SessionDeleteResponse(BaseModel):
    status: str

# Schema for uploading a PDF
class PDFUploadResponse(BaseModel):
    status: str
    chunks: int

# Schema for chat interaction request
class ChatRequest(BaseModel):
    session_id: str
    question: str

# Schema for chat interaction response
class ChatResponse(BaseModel):
    answer: str

# Schema for storing chat history
class ChatHistory(BaseModel):
    question: str
    answer: str

# Schema for storing PDF chunk data in Redis
class PDFChunk(BaseModel):
    text: str
    embedding: List[float]
