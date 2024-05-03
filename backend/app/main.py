import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from fastapi.staticfiles import StaticFiles

from app.routers import commons_routers, users_routers
from app.dependencies import get_common_pg_async_db

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_routers(get_common_pg_async_db), prefix="/api/users")
app.include_router(commons_routers(get_common_pg_async_db), prefix="/api/commons")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
