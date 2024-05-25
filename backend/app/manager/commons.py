from sqlalchemy.ext.asyncio import AsyncSession
from app.crud import CommonsCRUD
from app.schemas.commons import (
LineName, part_no, DataAll, data_table, delete_a_row, Update, DataGraph, Approval, data_mode, Post_np, Qty,  part_record
)
import json
from typing import Optional, List, Dict, Any, Union
import datetime


class CommonsManager:
    def __init__(self) -> None:
        self.crud = CommonsCRUD()

# ? ================================ admin page ==============================================
    async def get_linename(
            self,
            db: AsyncSession = None,
        ):
            res = await self.crud.get_linename(db=db)
            return_list = []
            for r in res:
                key_index = r._key_to_index
                return_list.append(
                    LineName(
                        line_id=r[key_index["line_id"]],
                        line_name=r[key_index["line_name"]],
                    )
                )
            return return_list

    async def get_part_no(
                self,
                line_id=str,
                db: AsyncSession = None,
            ):
                res = await self.crud.get_part_no(line_id=line_id, db=db)
                return_list = []
                for r in res:
                    print(r)
                    key_index = r._key_to_index
                    return_list.append(
                        part_no(
                            part_id = r[key_index["part_id"]],
                            part_no = r[key_index["part_no"]],
                            part_name = r[key_index["part_name"]],
                        )
                    )
                return return_list


    async def get_data_all(
            self,
            db: AsyncSession = None,
        ):
            res = await self.crud.get_data_all(db=db)
            return_list = []
            for r in res:
                key_index = r._key_to_index
                return_list.append(
                    DataAll(
                        id = r[key_index["id"]],
                        line_id = r[key_index["line_id"]],
                        part_no = r[key_index["part_no"]],
                        mode = r[key_index["mode"]],
                        category = r[key_index["category"]],
                        
                    )
                )
            return return_list

    async def get_data_table(
            self,
            line_id=str,
            part_no=str,
            category=str,
            db: AsyncSession = None,
        ):
            res = await self.crud.get_data_table(db=db, line_id=line_id, part_no=part_no, category=category)
            return_list = []
            for r in res:
                print(r)
                key_index = r._key_to_index
                return_list.append(
                    data_table(
                        id = r[key_index["id"]],
                        line_id = r[key_index["line_id"]],
                        part_no = r[key_index["part_no"]],
                        category = r[key_index["category"]],
                        mode = r[key_index["mode"]],
                        target = r[key_index["target"]],
                        
                    )
                )
            return return_list

    async def post_row_data(
            self,
            item: data_table,
            db: AsyncSession = None,
        ):
            
            await self.crud.post_row_data(db=db, item=item)
            return True

    async def delete_row(
            self,
            item:delete_a_row,
            db:AsyncSession = None,
        ):
            print("delete",item)
            await self.crud.delete_row(db=db, item=item)
            return True

    
    async def put_update_data(
            self,
            item:Update,
            db:AsyncSession = None,
    ):
        await self.crud.put_update_data(db=db, item=item)
        return True
    

# ? ================================ graph page ==============================================
    async def get_data_mode(
            self,
            year=str,
            mount=str,
            line_id=str,
            part_no=str,
            db: AsyncSession = None,
        ):
            res = await self.crud.get_data_mode(year=year, mount=mount, db=db, line_id=line_id, part_no=part_no)
            return_list = []
            for r in res:
                print(r)
                key_index = r._key_to_index
                return_list.append(
                    data_mode(
                        id = r[key_index["id"]],
                        line_id = r[key_index["line_id"]],
                        part_no = r[key_index["part_no"]],
                        category = r[key_index["category"]],
                        mode = r[key_index["mode"]],
                        target = r[key_index["target"]],
                        quantity = r[key_index["quantity"]],
                        record_date = r[key_index["record_date"]]
                    )
                )
            return return_list
        
    async def get_data_approval(
            self,
            year=str,
            mount=str,
            line_id=str,
            
            db: AsyncSession = None,
        ):
            res = await self.crud.get_data_approval(year=year, mount=mount, db=db, line_id=line_id)
            return_list = []
            for r in res:
                print(r)
                key_index = r._key_to_index
                return_list.append(
                    Approval(
                        id = r[key_index["id"]],
                        name = r[key_index["name"]],
                        approval_date = r[key_index["approval_date"]],
                        type = r[key_index["type"]],
                        
                    )
                )
            return return_list
        
    async def get_data_qty(
            self,
            year=str,
            mount=str,
            
            db: AsyncSession = None,
        ):
            res = await self.crud.get_data_qty(year=year, mount=mount, db=db)
            return_list = []
            for r in res:
                print(r)
                key_index = r._key_to_index
                return_list.append(
                    Qty(
                        id = r[key_index["id"]],
                        qty = r[key_index["qty"]],
                        date = r[key_index["date"]]     
                    )
                )
            return return_list
# ? ================================ modal for record quantity =======================================
    async def post_np(
                self,
                
                item:Post_np,
                db: AsyncSession = None,
            ):
                
                await self.crud.post_np(db=db, item=item)
                return True
    
    async def get_part_record(
                self,
                line_id=str,
                mode=str,
                mount= str,
                year=str,
                db: AsyncSession = None,
            ):
                res = await self.crud.get_part_record(line_id=line_id, mount=mount, year=year, mode=mode,db=db)
                return_list = []
                for r in res:
                    print(r)
                    key_index = r._key_to_index
                    return_list.append(
                        part_record(
                            part_no = r[key_index["part_no"]],
                            category = r[key_index["category"]],
                            # mode = r[key_index["mode"]],
                        )
                    )
                return return_list