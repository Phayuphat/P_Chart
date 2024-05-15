from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import text
from app.schemas.commons import (Update, delete_a_row, data_table)

def convert_result(res):
    return [{c: getattr(r, c) for c in res.keys()} for r in res]
class CommonsCRUD:
    def __init__(self):
        pass

# ? ================================ admin page ==============================================
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
            try:
                stmt = f"""
            SELECT part_id, part_no, part_name FROM main_part
            """
                rs = await db.execute(text(stmt))
                return rs
            except Exception as e:
                raise e

    async def get_data_all(
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

    async def get_data_table(self, line_id:int, part_no:str, category:str,  db: AsyncSession,):
                line_id = int(line_id)
                part_no = str(part_no)
                try:
                    stmt = f"""
                SELECT pchart_mode.id, pchart_mode.line_id, pchart_mode.part_no, pchart_mode.category, pchart_mode.id, pchart_mode.mode, pchart_mode_target.target, pchart_mode.update_at
                FROM pchart_mode
                JOIN pchart_mode_target 
                ON pchart_mode.id=pchart_mode_target.mode_id
                WHERE line_id = :line_id AND part_no = :part_no AND category = :category;
                """
                    rs = await db.execute(text(stmt),{"line_id": line_id, "part_no":part_no, "category":category})
                    return rs
                except Exception as e:
                    raise e

    async def post_row_data(self,db: AsyncSession,item:data_table):
        try:
            stmt_1 = """
                INSERT INTO pchart_mode (line_id, part_no, category, mode, update_at) 
                VALUES (:line_id, :part_no, :category, :mode, :update_at )
                ON CONFLICT (id)  
                DO UPDATE SET
                    line_id = EXCLUDED.line_id,
                    part_no = EXCLUDED.part_no,
                    category = EXCLUDED.category,
                    mode = EXCLUDED.mode,
                    update_at = EXCLUDED.update_at
                RETURNING id
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
            
            # Fetch the id from the result
            mode_id = rs_1.scalar()
            stmt_2 = """
            INSERT INTO pchart_mode_target (mode_id, target)
            VALUES (:mode_id, :target)
            """
            rs_2 = await db.execute(
                            text(stmt_2),
                            {
                                "mode_id": mode_id,
                                "target": item.target
                            }
                        )

            await db.commit()
            return rs_1, rs_2
        except Exception as e:
            raise e

    async def delete_row(self,item:delete_a_row, db: AsyncSession):
            try:
                stmt_1 = f"""
                DELETE FROM pchart_mode
                WHERE id IN (:id) ;
                """

                stmt_2 = f"""
                DELETE FROM pchart_mode_target
                WHERE mode_id IN (:id) ;
                """

                params ={"id":item.id}
                res_1 = await db.execute(text(stmt_1), params)
                res_2 = await db.execute(text(stmt_2), params)
                await db.commit()
                return res_1, res_2
            except Exception as e:
                raise e


    async def put_update_data(self,item:Update, db:AsyncSession):
        try:
            stmt_1 = f"""
            UPDATE pchart_mode
            SET 
                mode = :mode,
                update_at = :update_at
            WHERE id = :id
            """
            rs_1 = await db.execute(
                    text(stmt_1),
                            {
                                "id": item.id,
                                "mode": item.mode,
                                "update_at": item.update_at,
                            }
                        )
            
            stmt_2 = f"""
            UPDATE pchart_mode_target
            SET 
                target = :target
            WHERE mode_id = :id
            """
            rs_2 = await db.execute(
                    text(stmt_2),
                            {
                                "id": item.id,
                                "target": item.target,
                            }
                        )

            await db.commit()
            return rs_1, rs_2
        except Exception as e:
            raise e
        
# ? ================================ graph page ==============================================
    async def get_data_graph(self, line_id:int, part_no:str, db: AsyncSession,):
                    line_id = int(line_id)
                    part_no = str(part_no)
                    try:
                        stmt = f"""
                    SELECT pchart_mode.id, pchart_mode.line_id, pchart_mode.part_no, pchart_mode.category, pchart_mode.id, pchart_mode.mode, pchart_mode_target.target, pchart_mode.update_at
                    FROM pchart_mode
                    JOIN pchart_mode_target 
                    ON pchart_mode.id=pchart_mode_target.mode_id
                    WHERE line_id = :line_id AND part_no = :part_no;
                    """
                        rs = await db.execute(text(stmt),{"line_id": line_id, "part_no":part_no})
                        return rs
                    except Exception as e:
                        raise e