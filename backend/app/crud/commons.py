from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import text
# from app.schemas.commons import (DataInitals, DataWi, delete_a_row, PostMonitor)

def convert_result(res):
    return [{c: getattr(r, c) for c in res.keys()} for r in res]
class CommonsCRUD:
    def __init__(self):
        pass
    
    async def get_linename(
        self,db: AsyncSession,
    ):
        
        try:
            stmt = f"""
        SELECT line_id, line_name FROM main_line
        """
            rs = await db.execute(text(stmt))
            return rs
        except Exception as e:
            raise e
        
    async def get_shift(
            self,
            db :AsyncSession
    ):
        try:
            stmt = f"""
            SELECT shift_id, shift_name FROM main_shift
            """
            rs = await db.execute(text(stmt))
            return rs
        except Exception as e:
            raise e

    async def get_part_no(
            self,
            db :AsyncSession
    ):
        try:
            stmt = f"""
            SELECT part_no FROM main_part
            """
            rs = await db.execute(text(stmt))
            return rs
        except Exception as e:
            raise e