from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from src.router.user_router import user_router
from src.router.screening_router import screening_router

app = FastAPI(
    title="AI Screening API",
    version="1.0.0",
    docs_url="/api/v1/docs",     
    redoc_url="/api/v1/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(user_router, prefix="/api/v1/user", tags=["user"])
app.include_router(screening_router, prefix="/api/v1/screening", tags=["screening"])

@app.get("/api/v1")
def read_root():
    return {"message": "Welcome to the AI Screening API!"}

if __name__ == "__main__":
    uvicorn.run("src.main:app", host="127.0.0.1", port=8000, reload=True)
