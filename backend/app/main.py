from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.core.logging import logger
from app.db.session import init_db
from app.api.router import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB schema
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION}...")
    try:
        await init_db()
    except Exception as e:
        logger.warning(f"Database auto-migration skipped or failed on startup: {e}")
    yield
    # Shutdown
    logger.info(f"Shutting down {settings.PROJECT_NAME}...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Unified Creator AI SaaS Platform API",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Secure CORS Middleware
origins = list(set([settings.FRONTEND_URL] + settings.ALLOWED_ORIGINS))
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Exception Handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": f"HTTP_{exc.status_code}",
                "message": exc.detail
            }
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        field = " -> ".join(str(loc) for loc in err.get("loc", []))
        errors.append(f"{field}: {err.get('msg')}")
    return JSONResponse(
        status_code=400,
        content={
            "success": False,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "; ".join(errors) or "Invalid request payload."
            }
        }
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    err_str = str(exc)
    if settings.AI_API_KEY and settings.AI_API_KEY in err_str:
        err_str = err_str.replace(settings.AI_API_KEY, "[REDACTED]")
    logger.error(f"Unhandled exception on {request.method} {request.url.path}: {err_str}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred. Please try again later."
            }
        }
    )

# Root Health Check
@app.get("/health", tags=["Health"])
async def root_health():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION
    }

# Mount API v1
app.include_router(api_router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
