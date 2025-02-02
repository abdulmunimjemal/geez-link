import PyPDF2
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('abdulmunimjemal/xlm-r-retrieval-am-v1')

def process_pdf(file):
    # Read PDF file
    pdf_text = ""
    pdf_reader = PyPDF2.PdfReader(file)
    for page in pdf_reader.pages:
        pdf_text += page.extract_text()
    
    # Chunking and embedding (simple example, you can refine the chunking logic)
    chunks = pdf_text.split("\n\n")  # Split by paragraph
    embeddings = [model.encode(chunk) for chunk in chunks]
    
    # Store embeddings in Redis or another datastore
    # For simplicity, just returning the chunks and embeddings for now
    return chunks, embeddings
