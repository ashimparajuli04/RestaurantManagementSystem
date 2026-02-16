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
    "https://restaurant-management-frontend.vercel.app",
    "http://localhost:3000",  # for local dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

