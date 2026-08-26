import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

# The test suite is deliberately written to never need a live database --
# every test that would touch the DB mocks SessionLocal/db.query instead
# (see tests/test_scheduler.py, tests/test_rbac.py for the pattern). But
# app/database.py calls create_engine(DATABASE_URL) at IMPORT time, and
# create_engine(None) raises immediately -- so without a .env file present,
# just importing any module that imports app.database (nearly all of them)
# crashes collection before a single test runs, regardless of whether that
# test needs a real DB.
#
# create_engine() is lazy -- it doesn't open a connection until something
# actually queries -- so a syntactically valid but unreachable Postgres URL
# is enough to satisfy import-time construction without Postgres running.
os.environ.setdefault("DATABASE_URL", "postgresql://test:test@localhost:5432/experimentx_test")
os.environ.setdefault("SECRET_KEY", "test-secret-key-not-for-production")
os.environ.setdefault("GROQ_API_KEY", "test-groq-key-not-for-production")