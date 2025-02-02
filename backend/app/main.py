from fastapi import FastAPI
from app.routes import sessions, chat
from app.services.redis import init_redis, close_redis
import uvicorn

app = FastAPI()

app.include_router(sessions.router, prefix="/api")
app.include_router(chat.router, prefix="/api")

@app.on_event("startup")
async def startup():
    await init_redis()

@app.on_event("shutdown")
async def shutdown():
    await close_redis()

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
