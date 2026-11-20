import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.consumer import start_consumer
from app.config import settings
import asyncpg
import redis as redis_lib

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("scoring-service")

consumer_task = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global consumer_task
    logger.info("Initializing Credit Scoring Engine...")
    
    # Start RabbitMQ consumer in background task with retry logic
    async def run_consumer_safe():
        retries = 10
        while retries > 0:
            try:
                await start_consumer()
                break
            except Exception as e:
                logger.warning(f"RabbitMQ consumer connection failed: {e}. Retrying in 5 seconds...")
                retries -= 1
                await asyncio.sleep(5)
    
    consumer_task = asyncio.create_task(run_consumer_safe())
    yield
    if consumer_task:
        consumer_task.cancel()
        try:
            await consumer_task
        except asyncio.CancelledError:
            pass
    logger.info("Credit Scoring Service stopped.")

app = FastAPI(
    title="Alternative Credit Scoring Engine",
    description="Real-time event-driven credit scoring for New-To-Credit (NTC) cash borrowers",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Health check endpoint for Docker and ECS Fargate ALB"""
    health = {
        "status": "healthy",
        "service": "credit-scoring-service",
        "version": "1.0.0"
    }

    # Verify Database connectivity
    try:
        conn = await asyncpg.connect(settings.database_url, timeout=3.0)
        await conn.fetchval("SELECT 1")
        await conn.close()
        health["database"] = "connected"
    except Exception as e:
        health["database"] = f"error: {str(e)}"
        health["status"] = "degraded"

    # Verify Redis connectivity
    try:
        r = redis_lib.from_url(settings.redis_url, decode_responses=True, socket_timeout=3.0)
        r.ping()
        health["redis"] = "connected"
    except Exception as e:
        health["redis"] = f"error: {str(e)}"
        health["status"] = "degraded"

    return health

@app.get("/score/{borrower_id}")
async def get_score(borrower_id: str):
    """Fetch cached credit score from Redis"""
    try:
        r = redis_lib.from_url(settings.redis_url, decode_responses=True)
        cached = r.get(f"score:{borrower_id}")
        if cached is not None:
            return {
                "borrower_id": borrower_id,
                "score": int(cached),
                "cached": True
            }
    except Exception as e:
        logger.error(f"Redis lookup error: {e}")

    # Fallback to DB
    try:
        conn = await asyncpg.connect(settings.database_url)
        row = await conn.fetchrow(
            """SELECT score, "riskTier", "punctualityPct", "uniqueLenderCount", 
                      "collusionFlag", "hashChainValid" 
               FROM "CreditReport" WHERE "borrowerId" = $1""",
            borrower_id
        )
        await conn.close()
        if row:
            return {
                "borrower_id": borrower_id,
                "score": row["score"],
                "risk_tier": row["riskTier"],
                "punctuality_pct": float(row["punctualityPct"]),
                "unique_lender_count": row["uniqueLenderCount"],
                "collusion_flag": row["collusionFlag"],
                "hash_chain_valid": row["hashChainValid"],
                "cached": False
            }
    except Exception as e:
        logger.error(f"Database lookup error: {e}")

    return {
        "borrower_id": borrower_id,
        "score": 300,
        "risk_tier": "UNRATED",
        "cached": False,
        "message": "No credit history found"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
