import uvicorn
from fastapi import FastAPI
from routers import router as ml_router

app = FastAPI(title="RuTrip ML Module")

app.include_router(ml_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)