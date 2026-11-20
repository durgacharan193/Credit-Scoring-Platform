# ── Stage 1: Install Python dependencies ─────────────────────
FROM python:3.11-slim AS builder

WORKDIR /install

COPY requirements.txt ./

RUN pip install --no-cache-dir --prefix=/install/packages -r requirements.txt

# ── Stage 2: Production runner ────────────────────────────────
FROM python:3.11-slim AS runner

# Create non-root group and user
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /install/packages /usr/local

# Copy application source
COPY ./app ./app

# Drop privileges
USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
