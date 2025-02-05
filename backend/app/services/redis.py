import redis.asyncio as redis
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

redis_client = None


async def init_redis():
    global redis_client
    redis_client = redis.from_url(
        os.getenv("REDIS_URL"), decode_responses=True)


async def close_redis():
    await redis_client.close()


async def get_redis():
    return redis_client
