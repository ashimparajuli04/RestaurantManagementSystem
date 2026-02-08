from dotenv import load_dotenv
import os
from sqlmodel import create_engine, SQLModel, Session

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# PostgreSQL engine (no connect_args needed)
engine = create_engine(DATABASE_URL, echo=False)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session