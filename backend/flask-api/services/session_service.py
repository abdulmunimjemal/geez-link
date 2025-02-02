import redis
import uuid

client = redis.StrictRedis(host='localhost', port=6379, db=0)

def create_session():
    session_id = str(uuid.uuid4())
    client.set(session_id, 'active')  # You can store more session info if needed
    return session_id

def delete_session(session_id):
    if client.exists(session_id):
        client.delete(session_id)
        return True
    return False
