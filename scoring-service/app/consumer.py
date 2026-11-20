import asyncio
import json
import logging

import aio_pika
import asyncpg
import redis as redis_lib

from app.config import settings
from app.hash_validator import verify_hash_chain
from app.scoring_engine import CreditScoringEngine

logger = logging.getLogger(__name__)
engine = CreditScoringEngine()


async def process_transaction_verified(message: aio_pika.IncomingMessage) -> None:
    """
    Process a transaction.verified event:
    1. Parse event payload
    2. Verify SHA-256 hash chain for this specific transaction
    3. Run full scoring engine for the borrower
    4. Upsert CreditReport in PostgreSQL
    5. Cache score in Redis
    """
    async with message.process():
        try:
            body = json.loads(message.body.decode())
            logger.info(
                f"Processing transaction.verified event: {body.get('transactionId')}"
            )

            # Verify the hash for this specific transaction
            chain_valid = verify_hash_chain(
                previous_hash=body["previousHash"],
                borrower_id=body["borrowerId"],
                lender_id=body["lenderId"],
                amount=str(body["amount"]),
                tx_type=body["type"],
                timestamp=body["verifiedAt"],
                stored_hash=body["currentHash"],
            )

            if not chain_valid:
                logger.error(
                    f"Hash chain INVALID for transaction {body.get('transactionId')}!"
                    " Flagging borrower."
                )

            # Connect to DB and compute score
            conn: asyncpg.Connection = await asyncpg.connect(settings.database_url)
            try:
                report = await engine.compute_score(body["borrowerId"], conn)

                # Upsert CreditReport
                await conn.execute(
                    """INSERT INTO "CreditReport" (
                           id, "borrowerId", score, "riskTier", "punctualityPct",
                           "uniqueLenderCount", "totalLoans", "totalRepayments",
                           "collusionFlag", "hashChainValid",
                           "lastCalculatedAt", "createdAt", "updatedAt"
                       ) VALUES (
                           gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9,
                           NOW(), NOW(), NOW()
                       )
                       ON CONFLICT ("borrowerId") DO UPDATE SET
                           score                = EXCLUDED.score,
                           "riskTier"           = EXCLUDED."riskTier",
                           "punctualityPct"     = EXCLUDED."punctualityPct",
                           "uniqueLenderCount"  = EXCLUDED."uniqueLenderCount",
                           "totalLoans"         = EXCLUDED."totalLoans",
                           "totalRepayments"    = EXCLUDED."totalRepayments",
                           "collusionFlag"      = EXCLUDED."collusionFlag",
                           "hashChainValid"     = EXCLUDED."hashChainValid",
                           "lastCalculatedAt"   = NOW(),
                           "updatedAt"          = NOW()""",
                    report["borrower_id"],
                    report["score"],
                    report["risk_tier"],
                    report["punctuality_pct"],
                    report["unique_lender_count"],
                    report["total_loans"],
                    report["total_repayments"],
                    report["collusion_flag"],
                    report["hash_chain_valid"],
                )

                # Cache score in Redis (TTL: 24 hours)
                r = redis_lib.from_url(settings.redis_url, decode_responses=True)
                r.set(
                    f"score:{report['borrower_id']}",
                    report["score"],
                    ex=86400,
                )

                logger.info(
                    f"Score updated for borrower {report['borrower_id']}: "
                    f"{report['score']} ({report['risk_tier']})"
                )
            finally:
                await conn.close()

        except Exception as e:
            logger.error(f"Error processing message: {e}", exc_info=True)
            raise


async def start_consumer() -> None:
    """Start the RabbitMQ consumer and keep it running."""
    logger.info("Connecting to RabbitMQ...")
    connection = await aio_pika.connect_robust(settings.rabbitmq_url)

    async with connection:
        channel = await connection.channel()
        await channel.set_qos(prefetch_count=1)

        exchange = await channel.declare_exchange(
            "credit.events", aio_pika.ExchangeType.TOPIC, durable=True
        )
        queue = await channel.declare_queue("transaction.verified", durable=True)
        await queue.bind(exchange, routing_key="transaction.verified")

        logger.info("Waiting for transaction.verified events...")
        await queue.consume(process_transaction_verified)

        # Keep running indefinitely until cancelled
        await asyncio.Future()
