import pypdf
from io import BytesIO


def extract_text_from_pdf(file):
    try:
        # Ensure the file is in bytes format
        if isinstance(file, bytes):
            file = BytesIO(file)

        # Use PdfReader to read the file
        pdf_reader = pypdf.PdfReader(file)
        text = ""

        # Extract text from each page
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:  # Ensure text is not None
                text += page_text + "\n"  # Add a newline between pages

        if not text.strip():  # Check if text is empty
            raise ValueError(
                "No text could be extracted from the PDF. It might be a scanned document or contain only images.")

        return text
    except Exception as e:
        raise ValueError(f"Failed to extract text from PDF: {str(e)}")


def chunk_text(text, chunk_size=500, overlap=50):
    tokens = text.split()
    chunks = []
    start = 0
    while start < len(tokens):
        end = start + chunk_size
        chunk = ' '.join(tokens[start:end])
        chunks.append(chunk)
        start = end - overlap
    return chunks
