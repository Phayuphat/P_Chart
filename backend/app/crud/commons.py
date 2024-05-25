from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import text
from app.schemas.commons import (Update, delete_a_row, data_table, Post_np)
from sqlalchemy import text, func
# from sqlalchemy.dialects.postgresql import insert as pg_insert
from datetime import datetime

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

    async def get_part_no(self, db: AsyncSession, line_id: str):
        line_id = int(line_id)
        try:
            stmt = f"""
                SELECT part_id, part_no, part_name FROM main_part
                WHERE line_id = :line_id
            """
            rs = await db.execute(text(stmt), {'line_id': line_id})
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
                SELECT pchart_mode.id, pchart_mode.line_id, pchart_mode.part_no, pchart_mode.category, pchart_mode.id, pchart_mode.mode, pchart_mode_target.target
                FROM pchart_mode
                JOIN pchart_mode_target 
                ON pchart_mode.id=pchart_mode_target.mode_id
                WHERE line_id = :line_id AND part_no = :part_no AND category = :category;
                """
                    rs = await db.execute(text(stmt),{"line_id": line_id, "part_no":part_no, "category":category})
                    return rs
                except Exception as e:
                    raise e

    async def post_row_data(self,db: AsyncSession, item:data_table):
        try:
            stmt_1 = f"""
            INSERT INTO pchart_mode (line_id, part_no, category, mode) 
            VALUES (:line_id, :part_no, :category, :mode)
            ON CONFLICT (id)  
            DO UPDATE SET
                line_id = EXCLUDED.line_id,
                part_no = EXCLUDED.part_no,
                category = EXCLUDED.category,
                mode = EXCLUDED.mode
            RETURNING id
            """
            rs_1 = await db.execute(text(stmt_1),
                            
                    {
                        "line_id": item.line_id,
                        "part_no": item.part_no,
                        "category": item.category,
                        "mode": item.mode,
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
            
            stmt_3 = """
            INSERT INTO pchart_record (mode_id, quantity)
            VALUES (:mode_id, 0)
            """
            rs_3 = await db.execute(
                            text(stmt_3),
                            {
                                "mode_id": mode_id,
                                
                            }
                        )

            await db.commit()
            return rs_1, rs_2, rs_3
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
            SET mode = :mode
            WHERE id = :id
            """
            rs_1 = await db.execute(
                    text(stmt_1),
                            {
                                "id": item.id,
                                "mode": item.mode,
                               
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
        
        
                        #! pchart_record.quantity, 
                        #! pchart_record.record_date, 
                        #! JOIN pchart_record ON pchart_record.mode_id = pchart_mode.id
        
# ? ================================ graph page ==============================================
    async def get_data_mode(self, line_id:int, part_no:str, year:str, mount:str, db: AsyncSession):
                    line_id = int(line_id)
                    part_no = str(part_no)
                    try:
                        stmt_1 = f"""
                        SELECT 
                        pchart_mode.id, 
                        pchart_mode.line_id, 
                        pchart_mode.part_no, 
                        pchart_mode.category,
                        pchart_mode.mode, 
                        
                        pchart_mode_target.target, 
                        
                        pchart_record.quantity, 
                        pchart_record.record_date
            
                        
                        FROM pchart_mode
                        JOIN pchart_mode_target ON pchart_mode.id = pchart_mode_target.mode_id
                        JOIN pchart_record ON pchart_record.mode_id = pchart_mode.id
                        WHERE 
                            EXTRACT(YEAR FROM pchart_mode.update_at) = :year AND 
                            EXTRACT(MONTH FROM pchart_mode.update_at) = :mount AND 
                            line_id = :line_id AND 
                            part_no = :part_no;

                
                        """
                        rs_1 = await db.execute(text(stmt_1),
                                {
                                "line_id": line_id, 
                                "part_no":part_no,
                                "year":year, 
                                "mount":mount
                                }
                            )
                        
                        return rs_1
                    except Exception as e:
                        raise e
    
    async def get_data_approval(self, line_id:int, year:str, mount:str, db: AsyncSession):
                    line_id = int(line_id)
                    
                    try:
                        stmt_1 = f"""
                    SELECT id, name, approval_date, type FROM pchart_approval
                    WHERE 
                        EXTRACT(YEAR FROM approval_date) = :year AND 
                        EXTRACT(MONTH FROM approval_date) = :mount AND 
                        line_id = :line_id ;
                    """
                        rs_1 = await db.execute(text(stmt_1),
                                {
                                    "line_id": line_id, 
                                    "year":year, 
                                    "mount":mount
                                }
                            )
                        
                        return rs_1
                    except Exception as e:
                        raise e
                    
    async def get_data_qty(self, year:str, mount:str, db: AsyncSession):
                    try:
                        stmt_1 = f"""
                    SELECT * FROM qty
                    WHERE 
                        EXTRACT(YEAR FROM date) = :year AND 
                        EXTRACT(MONTH FROM date) = :mount 
                    """
                        rs_1 = await db.execute(text(stmt_1),
                                {
                                    
                                    "year":year, 
                                    "mount":mount
                                }
                            )
                        
                        return rs_1
                    except Exception as e:
                        raise e
                    
                    
# ? ================================ modal for record quantity =======================================
    # TODO: check function insert np 
    async def post_np(self, db: AsyncSession, item:Post_np,):
        try:
            # แปลง string เป็น datetime object
            date_obj = datetime.strptime(item.date_record, '%Y-%m-%d')
            
            stmt_2 = f"""
            INSERT INTO pchart_record (record_date, mode_id, quantity)
            VALUES (
                    :date_record, 
                    (SELECT id FROM pchart_mode WHERE part_no = :part_no AND mode = :mode),
                    :count
                    )
            ON CONFLICT (record_date, mode_id) 
            DO UPDATE 
            SET quantity = EXCLUDED.quantity,
                record_date = EXCLUDED.record_date
            """
            rs_2 = await db.execute(text(stmt_2), 
                    {   
                        "mode": item.mode,
                        "part_no": item.part_no,
                        "count": item.count,
                        "date_record": date_obj
                    }
                )                
            await db.commit()
            return rs_2
        except Exception as e:
            raise e
    
    async def get_part_record(self, db: AsyncSession, line_id=str, mount= str, year=str, mode=str):      
        line_id = int(line_id)
        try:
            stmt = f"""
                SELECT part_no, category FROM pchart_mode
                WHERE 
                    line_id = :line_id AND
                    mode = :mode AND
                    EXTRACT(YEAR FROM update_at) = :year AND
                    EXTRACT(MONTH FROM update_at) = :mount
            """
            rs = await db.execute(text(stmt), 
                                {
                                    'line_id': line_id,
                                    'mode': mode,
                                    'year': year,
                                    'mount': mount
                                }
                            )
            return rs
        except Exception as e:
            raise e