from fastapi import FastAPI

from app.database import init_db
from app.menu.routers import menuitems_routes, menucategories_routes, menusubcategories_routes
from app.user.routers import user_routes
from app.auth.routers import auth_routes

app = FastAPI()


@app.on_event("startup")
def on_startup():
    init_db()


app.include_router(menuitems_routes.router)
app.include_router(menucategories_routes.router)
app.include_router(menusubcategories_routes.router)

app.include_router(user_routes.router)
app.include_router(auth_routes.router)