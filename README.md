# NJ's Café & Restaurant — Service Management API

A FastAPI backend powering a full restaurant service management system — handling everything from table sessions and order tracking to customer history and menu administration. Built from a real brief: a friend in hospitality described what a proper café management system should actually do, and this is the result.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | FastAPI |
| ORM | SQLModel (SQLAlchemy + Pydantic) |
| Database | PostgreSQL |
| Migrations | Alembic |
| Auth | JWT via OAuth2 password flow |
| Runtime | Python 3.14 (via `uv`) |
| Containerization | Docker / Docker Compose |

---

## Features

- **Table & Session Management** — Tables have types (indoor, rooftop, takeaway). Opening a session links a table to an optional customer and tracks all orders under it. Closing a session freezes the final bill and increments customer stats.
- **Order Lifecycle** — Orders are created under a session, start as `pending`, and are toggled to `served` when delivered. Toggling to served snapshots the final total; toggling back unfreezes it.
- **Smart Order Items** — Adding an item that already exists in an order (same `menu_item_id` + `note`) increments quantity instead of creating a duplicate. Prices are snapshotted at order time, so menu price changes don't affect historical orders.
- **Menu Administration** — Full CRUD for menu items, categories, and subcategories behind `/admin` routes.
- **Customer Tracking** — Customers are identified by phone number. Each closed session increments their `visit_count` and adds to `total_spent` automatically.
- **Role-Based Access** — Users are either `admin` or `employee`. Admin routes are protected separately from standard authenticated routes.
- **Paginated Session History** — Table session history is available paginated for reporting and review.

---

## Project Structure

```
.
├── app.py                  # FastAPI app entry point
├── routers.py              # Central router registration
├── database.py             # DB engine & session setup
├── base.py                 # SQLModel metadata base
├── alembic/                # Migration environment
│   └── versions/           # Auto-generated migration files
│
├── auth/                   # JWT auth — token generation & verification
│   ├── models/
│   ├── routers/
│   ├── services/
│   └── utils/
│
├── user/                   # User accounts & roles (admin / employee)
│   ├── models/
│   ├── routers/
│   ├── schemas/
│   └── services/
│
├── customer/               # Customer profiles, visit count, spend tracking
│   ├── models/
│   ├── routers/
│   ├── schemas/
│   └── services/
│
├── menu/                   # Menu items, categories, subcategories
│   ├── models/
│   ├── routers/
│   ├── schemas/
│   └── services/
│
└── service_flow/           # Core restaurant operations
    ├── diningtable/        # Table model (number, type, occupancy)
    ├── tablesession/       # Session lifecycle (open → orders → close)
    ├── order/              # Order model (pending / served toggle)
    └── orderitem/          # Line items with price snapshots
```

Each module follows the same internal structure: `models/`, `routers/`, `schemas/`, `services/` — keeping database logic, API layer, validation, and business logic clearly separated.

---

## Data Model Overview

```
Customer
  └── TableSession (many)
        └── DiningTable (one)
        └── Order (many)
              └── OrderItem (many)
                    └── MenuItem (one)
```

**Key design decisions:**

- `price_at_time` on `OrderItem` — menu prices can change freely without corrupting order history.
- `final_total` on `Order` and `final_bill` on `TableSession` — totals are frozen on serve/close so live recalculation doesn't alter settled records.
- Cascade deletes — deleting a session deletes its orders; deleting an order deletes its items.
- `table_id` is set to `None` on session close — freeing the table without deleting the session history.

---

## API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/token` | Login and receive JWT access token |

### Users
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/users/signup` | Public | Create a new user account |
| GET | `/users/me` | Auth | Get current user's profile |
| GET | `/users/by-id/{user_id}` | Auth | Get a user by ID |
| GET | `/admin/users` | Admin | List all users |
| PATCH | `/admin/users/{user_id}` | Admin | Update a user |
| DELETE | `/admin/users/{user_id}` | Admin | Delete a user |

### Menu Items
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/menu-items` | Public | List all menu items |
| POST | `/admin/menu-items/` | Admin | Create a menu item |
| PATCH | `/admin/menu-items/{item_id}` | Admin | Update a menu item |
| DELETE | `/admin/menu-items/{item_id}` | Admin | Delete a menu item |

### Menu Categories
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/menu-categories` | Public | List all categories |
| POST | `/admin/menu-categories/` | Admin | Create a category |
| PATCH | `/admin/menu-categories/{category_id}` | Admin | Update a category |
| DELETE | `/admin/menu-categories/{category_id}` | Admin | Delete a category |

### Menu Subcategories
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/menu-subcategories` | Public | List all subcategories |
| POST | `/admin/menu-subcategories/` | Admin | Create a subcategory |
| PATCH | `/admin/menu-subcategories/{subcategory_id}` | Admin | Update a subcategory |
| DELETE | `/admin/menu-subcategories/{subcategory_id}` | Admin | Delete a subcategory |

### Tables
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/tables/` | Auth | List all tables with occupancy status |
| POST | `/tables/add-table` | Auth | Add a table |
| DELETE | `/tables/{table_number}` | Auth | Remove a table |
| POST | `/admin/tables/add-table` | Admin | Add a table (admin) |
| DELETE | `/admin/tables/{table_number}` | Admin | Remove a table (admin) |

### Table Sessions
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/table-sessions` | Auth | Open a new session for a table |
| GET | `/table-sessions/{session_id}` | Auth | Get session details with all orders |
| PATCH | `/table-sessions/{table_session_id}` | Auth | Update a session |
| DELETE | `/table-sessions/{table_session_id}` | Auth | Delete a session |
| POST | `/table-sessions/{session_id}/close` | Auth | Close session and freeze final bill |
| POST | `/table-sessions/{table_session_id}/orders` | Auth | Create an order under a session |
| GET | `/table-sessions/history/paginated` | Auth | Paginated session history |

### Orders
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/order` | Auth | List all orders |
| DELETE | `/order/{id}` | Auth | Delete an order |
| PATCH | `/order/{order_id}/toggle-status` | Auth | Toggle order between pending / served |
| POST | `/order/{order_id}/items` | Auth | Add a single item to an order |
| POST | `/order/{order_id}/items/bulk` | Auth | Add multiple items at once |

### Order Items
| Method | Endpoint | Access | Description |
|---|---|---|---|
| DELETE | `/orderitem/{id}` | Auth | Remove a line item from an order |

### Customers
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/customer/` | Auth | Create a customer profile |
| GET | `/customer/by-phone/{number}` | Auth | Look up customer by phone number |
| GET | `/customer/by-id/{id}` | Auth | Look up customer by ID |
| GET | `/admin/customer/{id}/info` | Admin | Full customer info including session history |

---

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Or: Python 3.12+, PostgreSQL, and [`uv`](https://github.com/astral-sh/uv)

### With Docker

```bash
git clone https://github.com/your-username/njs-cafe-api.git
cd njs-cafe-api
cp .env.example .env        # Fill in your values
docker compose up --build
```

### Without Docker

```bash
# Install dependencies
uv sync

# Set up environment
cp .env.example .env        # Fill in your values

# Run migrations
uv run alembic upgrade head

# Start the server
uv run fastapi dev app.py
```

The API will be available at `http://localhost:8000`.  
Interactive docs: `http://localhost:8000/docs`

### Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/njs_cafe
SECRET_KEY=your-jwt-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## Database Migrations

```bash
# Create a new migration after changing models
uv run alembic revision --autogenerate -m "describe your change"

# Apply migrations
uv run alembic upgrade head

# Roll back one step
uv run alembic downgrade -1
```
