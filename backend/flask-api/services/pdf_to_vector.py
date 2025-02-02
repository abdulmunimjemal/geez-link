import PyPDF2
from sentence_transformers import SentenceTransformer

# Load the fine-tuned Amharic retrieval model
model = SentenceTransformer("abdulmunimjemal/xlm-r-retrieval-am-v5")

def pdf_to_vectors(pdf_file):
    """
    Reads a PDF file, extracts text, splits it into 500-character chunks,
    and returns the embedding vectors.

    Args:
        pdf_file (file-like): PDF file object.

    Returns:
        list: List of embedding vectors (numpy arrays) with shape (N, 768).
    """
    # Extract text from PDF
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    full_text = " ".join([page.extract_text() for page in pdf_reader.pages if page.extract_text()])

    # Split text into 500-character chunks
    chunks = [full_text[i:i + 500] for i in range(0, len(full_text), 500)]

    # Generate embeddings for each chunk
    embeddings = model.encode(chunks)  # Shape: (num_chunks, 768)

    return embeddings
