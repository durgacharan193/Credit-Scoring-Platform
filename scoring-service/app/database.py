import asyncpg
from app.config import settings

# Module-level pool, set during application startup
pool: asyncpg.Pool | None = None


async def get_connection() -> asyncpg.Connection:
    return await asyncpg.connect(settings.database_url)


async def get_pool() -> asyncpg.Pool:
    return await asyncpg.create_pool(settings.database_url, min_size=2, max_size=10)
