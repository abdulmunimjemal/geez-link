from flask import Flask, request, jsonify
from services.session_service import create_session, delete_session
from services.pdf_service import process_pdf
from services.chat_service import interact_with_chat

app = Flask(__name__)

# Configure Redis from environment
app.config.from_object('config.Config')

@app.route('/sessions', methods=['POST'])
def create_new_session():
    session_id = create_session()
    return jsonify({"session_id": session_id}), 201

@app.route('/sessions', methods=['DELETE'])
def delete_existing_session():
    session_id = request.json.get("session_id")
    success = delete_session(session_id)
    if success:
        return jsonify({"message": "Session deleted successfully"}), 200
    else:
        return jsonify({"message": "Session not found"}), 404

@app.route('/chat/upload', methods=['POST'])
def upload_pdf():
    file = request.files.get('file')
    session_id = request.form.get('session_id')
    if not file or not session_id:
        return jsonify({"message": "File and Session ID are required"}), 400
    pdf_text = process_pdf(file)
    # Assuming you generate embeddings and store them in Redis here
    return jsonify({"message": "PDF uploaded and processed", "text": pdf_text}), 200

@app.route('/chat', methods=['POST'])
def chat_interaction():
    session_id = request.json.get("session_id")
    if not session_id:
        return jsonify({"message": "Session ID is required"}), 400
    response = interact_with_chat(session_id, request.json)
    return jsonify(response), 200

if __name__ == "__main__":
    app.run(debug=True)
