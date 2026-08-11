import os
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Supabase Client instance
supabase: Client = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Error initializing Supabase client: {e}")

DB_URI = os.getenv("DATABASE_URL") or os.getenv("SUPABASE_DB_URL")

def get_db_connection():
    """Create database connection for PostgreSQL / Supabase"""
    try:
        if DB_URI:
            connection = psycopg2.connect(DB_URI, cursor_factory=RealDictCursor)
            return connection
            
        db_password = os.getenv("DB_PASSWORD")
        if db_password:
            host = os.getenv("DB_HOST")
            if not host and SUPABASE_URL and "supabase.co" in SUPABASE_URL:
                project_ref = SUPABASE_URL.split("//")[1].split(".")[0]
                host = f"db.{project_ref}.supabase.co"
            elif not host:
                host = "localhost"
                
            connection = psycopg2.connect(
                host=host,
                database=os.getenv("DB_NAME", "postgres"),
                user=os.getenv("DB_USER", "postgres"),
                password=db_password,
                port=int(os.getenv("DB_PORT", 5432)),
                cursor_factory=RealDictCursor
            )
            return connection
        return None
    except Exception as e:
        print(f"Error connecting to Database: {e}")
        return None

