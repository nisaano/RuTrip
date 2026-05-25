from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from auth.routers import router as auth_router
from ai.routers import router as ai_router
from map.routers import router as map_router


app = FastAPI(
    title="RuTrip API",
    description="API для путеводителя по России",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://127.0.0.1",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router, prefix="/api")
app.include_router(ai_router, prefix="/api")
app.include_router(map_router, prefix="/api")


@app.get("/")
def root():
    return {
        "message": "RuTrip API работает!",
        "status": "ok",
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )