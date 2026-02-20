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

origins = [
    "http://localhost:3000",
    "https://njseatery.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # important
    allow_methods=["*"],
    allow_headers=["*"],
)

