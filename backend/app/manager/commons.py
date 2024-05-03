from sqlalchemy.ext.asyncio import AsyncSession
from app.crud import CommonsCRUD
from app.schemas.commons import (
line_name, shift, part_no
)
import json
from typing import Optional, List, Dict, Any, Union
import datetime


class CommonsManager:
    def __init__(self) -> None:
        self.crud = CommonsCRUD()

    
    async def get_linename(
        self,
        db: AsyncSession = None,
    ):
        res = await self.crud.get_linename(db=db)
        return_list = []
        for r in res:
            key_index = r._key_to_index
            return_list.append(
                line_name(
                    line_id=r[key_index["line_id"]],
                    line_name=r[key_index["line_name"]],
                )
            )
        return return_list
    
    async def get_shift(
            self,
            db: AsyncSession = None
    ):
        res = await self.crud.get_shift(db=db)
        return_list = []
        for r in res:
            key_index = r._key_to_index
            return_list.append(
                shift(
                    shift_id=r[key_index["shift_id"]],
                    shift_name=r[key_index["shift_name"]]
                )
            )
        return return_list
    
    async def get_part_no(
            self,
            db: AsyncSession = None
    ):
        res = await self.crud.get_part_no(db=db)
        return_list = []
        for r in res:
            key_index = r._key_to_index
            return_list.append(
                part_no(
                    part_no=r[key_index["part_no"]]
                )
            )
        return return_list