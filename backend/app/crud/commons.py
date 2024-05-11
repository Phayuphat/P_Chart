from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import text
from app.schemas.commons import (delete_a_row, wi_table, Up_Data)
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

    async def get_part_no(self, db: AsyncSession):  
            
            # line_id = int(line_id)
            # print ("line_id", line_id)
            try:
                stmt = f"""
            SELECT part_id, part_no, part_name FROM main_part
            """
                rs = await db.execute(text(stmt))
                return rs
            except Exception as e:
                raise e
            


    async def get_wi_data(
            self,
            db: AsyncSession,
        ):
            try:
                stmt = f"""
            SELECT * FROM pchart_mode
            """
                rs = await db.execute(text(stmt))
                return rs
            except Exception as e:
                raise e
                
    async def get_wi_table(self, line_id:int, part_no:str, category:str,  db: AsyncSession,):
            line_id = int(line_id)
            part_no = str(part_no)
            try:
                stmt = f"""
            SELECT pchart_mode.line_id, pchart_mode.part_no, pchart_mode.category, pchart_mode.mode_id, pchart_mode.mode, pchart_mode_target.target, pchart_mode.update_at
            FROM pchart_mode
            JOIN pchart_mode_target 
            ON pchart_mode.mode_id=pchart_mode_target.mode_id
            WHERE line_id = :line_id AND part_no = :part_no AND category = :category;
            """
                rs = await db.execute(text(stmt),{"line_id": line_id, "part_no":part_no, "category":category})
                return rs
            except Exception as e:
                raise e

    #TODOL: sava data
    async def post_edit_data(self, db: AsyncSession, item: wi_table):
        try:
            stmt_1 = """
                INSERT INTO pchart_mode (line_id, part_no, category, mode, update_at) 
                VALUES (:line_id, :part_no, :category, :mode, :update_at )
                ON CONFLICT (mode_id)  
                DO UPDATE SET
                line_id = EXCLUDED.line_id,
                part_no = EXCLUDED.part_no,
                category = EXCLUDED.category,
                mode = EXCLUDED.mode,
                update_at = EXCLUDED.update_at
            """

            rs_1 = await db.execute(
                text(stmt_1),
                {
                    "line_id": item.line_id,
                    "part_no": item.part_no,
                    "category": item.category,
                    "mode": item.mode,
                    "update_at": item.update_at
                }
            )

            await db.commit()
            return rs_1
        except Exception as e:
            raise e
                

    async def delete_row(self,item:delete_a_row, db: AsyncSession):
        try:
            stmt = f"""
            DELETE FROM pchart_mode
            WHERE mode_id = :id;
            """
            # params ={"id":item.id}
            res = await db.execute(text(stmt), {"id":item.id})

            await db.commit()
            return res
        except Exception as e:
            raise e


    async def put_edit_data(self,item: Up_Data, db:AsyncSession):
        try:
            stmt = f"""
            UPDATE pchart_mode
            SET 
                mode = :mode,
                update_at = :update_at
            WHERE mode_id = :mode_id;
            """
            rs = await db.execute(
                    text(stmt),
                            {
                                "mode_id": item.mode_id,
                                "mode": item.mode,
                                # "target": item.target,
                                "update_at": item.update_at,
                                
                            }
                        )
            await db.commit()
            return rs
        except Exception as e:
            raise e

    # ? ========================= graph page ============================================== 

    async def get_data_table(self, line_id:int, part_no:str, db: AsyncSession,):
            line_id = int(line_id)
            part_no = str(part_no)
            try:
                stmt = f"""
            SELECT pchart_mode.line_id, pchart_mode.part_no, pchart_mode.category, pchart_mode.mode_id, pchart_mode.mode, pchart_mode_target.target, pchart_mode.update_at
            FROM pchart_mode
            JOIN pchart_mode_target 
            ON pchart_mode.mode_id=pchart_mode_target.mode_id
            WHERE line_id = :line_id AND part_no = :part_no;
            """
                rs = await db.execute(text(stmt),{"line_id": line_id, "part_no":part_no})
                return rs
            except Exception as e:
                raise e
