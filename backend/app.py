from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db
from routers import routers

app = FastAPI()

@app.on_event("startup")
def on_startup():
    init_db()

for routes in routers:
    app.include_router(routes.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ allow all origins
    allow_credentials=False,  # must be False if allow_origins="*"
    allow_methods=["*"],
    allow_headers=["*"],
)

