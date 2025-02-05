from fastapi import APIRouter, Depends, HTTPException
from uuid import uuid4
from app.services.redis import get_redis

router = APIRouter()

@router.post("/sessions")
async def create_session(redis=Depends(get_redis)):
    session_id = str(uuid4())
    await redis.set(session_id, "", ex=86400)  # 24h TTL
    return {"session_id": session_id}


@router.delete("/sessions/{session_id}")
async def delete_session(session_id: str, redis=Depends(get_redis)):
    await redis.delete(session_id)
    return {"status": "success"}
