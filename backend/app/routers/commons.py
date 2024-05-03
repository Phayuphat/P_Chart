from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import AsyncGenerator, List

from app.schemas.commons import (
    line_name, shift, part_no
)
from app.manager import CommonsManager
from app.functions import api_key_auth
from datetime import datetime

def commons_routers(db: AsyncGenerator) -> APIRouter:
    router = APIRouter()
    manager= CommonsManager()

    @router.get(
            "/get_linename",
            response_model=List[line_name],
            dependencies=[Depends(api_key_auth)],
        )
    async def get_linename(db: AsyncSession = Depends(db)):
            try:
                line_name = await manager.get_linename(db=db)
                return list(line_name)
            except Exception as e:
                raise HTTPException(
                    status_code=400, detail=f"Error during get data : {e}"
                )
            
    @router.get(
            "/get_shift",
            response_model=List[shift],
            dependencies=[Depends(api_key_auth)],
        )
    async def get_shift(db: AsyncSession = Depends(db)):
            try:
                shift = await manager.get_shift(db=db)
                return list(shift)
            except Exception as e:
                raise HTTPException(
                status_code=400, detail=f"Error during get data : {e}"
                )
            
    @router.get(
            "/get_part_no",
            response_model=List[part_no],
            dependencies=[Depends(api_key_auth)],
        )
    async def get_shift(db: AsyncSession = Depends(db)):
            try:
                part_no = await manager.get_part_no(db=db)
                return list(part_no)
            except Exception as e:
                raise HTTPException(
                status_code=400, detail=f"Error during get data : {e}"
                )

    return router