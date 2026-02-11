from app.menu.routers import (
    menuitems_routes,
    menucategories_routes,
    menusubcategories_routes,
    menucategoriesadmin_routes,
    menusubcategoriesadmin_routes,
    menuitemsadmin_routes,
)
from app.user.routers import user_routes, useradmin_routes
from app.auth.routers import auth_routes
from app.service_flow.diningtable.routers import diningtable_routes, diningtableadmin_routes
from app.service_flow.tablesession.routers import tablesession_routes, tablesessionadmin_routes
from app.service_flow.order.routers import order_routes

routers = [
    menuitems_routes,
    menucategories_routes,
    menusubcategories_routes,
    menucategoriesadmin_routes,
    menusubcategoriesadmin_routes,
    menuitemsadmin_routes,
    user_routes,
    useradmin_routes,
    auth_routes,
    diningtable_routes,
    diningtableadmin_routes,
    tablesession_routes,
    tablesessionadmin_routes,
    order_routes,
]