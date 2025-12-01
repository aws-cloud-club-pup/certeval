from supabase import Client

def get_supabase_client() -> Client:
    """
    Initializes and returns the Supabase client.
    """
    pass

def verify_member(awscc_id: str) -> bool:
    """
    Verifies if the AWSCC ID exists in the sbd_members table.
    """
    pass

def upload_proof_to_storage(file_content: bytes, file_name: str) -> str:
    """
    Uploads the proof file to Supabase Storage or S3/Drive and returns the public URL.
    """
    pass

def generate_certificate(name: str, event_name: str, date: str) -> bytes:
    """
    Generates a PDF certificate using Pillow/ReportLab.
    Returns the binary content of the PDF.
    """
    pass

def log_claim(event_id: str, proof_url: str, awscc_id: str = None, guest_name: str = None):
    """
    Inserts the claim record into the event_claims table.
    """
    pass