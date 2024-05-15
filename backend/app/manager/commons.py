from sqlalchemy.ext.asyncio import AsyncSession
from app.crud import CommonsCRUD
from app.schemas.commons import (
LineName, part_no, DataAll, data_table, delete_a_row, Update, DataGraph
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
                
                db: AsyncSession = None,
            ):
                res = await self.crud.get_part_no(db=db)
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
                        update_at = r[key_index["update_at"]],
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
                        update_at = r[key_index["update_at"]],
                    )
                )
            return return_list

    async def post_row_data(
            self,
            item: data_table,
            db: AsyncSession = None,
        ):
            print("edit",item)
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
    async def get_data_graph(
            self,
            line_id=str,
            part_no=str,
            db: AsyncSession = None,
        ):
            res = await self.crud.get_data_graph(db=db, line_id=line_id, part_no=part_no)
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
                        update_at = r[key_index["update_at"]],
                    )
                )
            return return_list