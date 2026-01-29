from fastapi import FastAPI

from app.database import init_db
from app.routers import menuitems

app = FastAPI()


@app.on_event("startup")
def on_startup():
    init_db()


app.include_router(menuitems.router)