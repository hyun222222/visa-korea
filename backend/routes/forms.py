from fastapi import APIRouter

router = APIRouter()

@router.post("/generate")
async def generate_pdf():
    """Generate filled PDF form"""
    return {"message": "PDF generation endpoint - to be implemented"}

@router.get("/templates")
async def list_templates():
    """List available form templates"""
    return {"message": "List templates - to be implemented"}
