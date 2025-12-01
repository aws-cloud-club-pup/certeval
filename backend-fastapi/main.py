from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from typing import List, Optional
from uuid import UUID
import schemas
import utils

app = FastAPI(
    title="CERTEVAL API",
    description="Backend for AWS Cloud Club PUP Certificate Generator",
    version="0.0.1"
)

@app.get("/api/events/active", response_model=List[schemas.Event])
async def get_active_events():
    """
    Populates the dropdown.
    Returns events where event_date == NOW() AT TIME ZONE 'Asia/Manila'.
    """
    pass

@app.post("/api/claim")
async def submit_claim(
    event_id: UUID = Form(...),
    awscc_id: Optional[str] = Form(None),
    guest_name: Optional[str] = Form(None),
    proof_file: UploadFile = File(...)
):
    """
    Handles the claim submission.
    
    Logic:
    1. Validate input (Member vs Guest).
    2. Upload proof file.
    3. Log claim to database.
    4. Generate certificate.
    5. Return certificate file.
    """
    pass
