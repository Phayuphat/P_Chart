from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import AsyncGenerator, List

import random
import string
import os

from app.schemas.commons import (line_name)
from app.manager import CommonsManager
from app.functions import api_key_auth
from datetime import datetime

def commons_router(db: AsyncGenerator) -> APIRouter:
  router = APIRouter()
  manager= CommonsManager()

  @router.get(
    "/get_line_name",
    response_model=List[line_name],
    dependencies=[Depends(api_key_auth)],
  )
  async def get_line_name(db: AsyncGenerator = Depends(db)):
    try:
      data = await manager.get_line_name(db=db)
      return list(data)
    except Exception as e:
      raise  HTTPException(
        status_code=400, detail=f"Error occured in getting line name : {e}"
      )