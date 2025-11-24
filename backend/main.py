from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import visa, application, forms

app = FastAPI(
    title="Visa Korea API",
    description="Intelligent Korean Visa Application Platform API",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(visa.router, prefix="/api/visa", tags=["Visa"])
app.include_router(application.router, prefix="/api/applications", tags=["Applications"])
app.include_router(forms.router, prefix="/api/forms", tags=["Forms"])

@app.get("/")
async def root():
    return {"message": "Visa Korea API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
