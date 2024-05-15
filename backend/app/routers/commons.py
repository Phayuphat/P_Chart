from fastapi import APIRouter, Depends, HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from typing import AsyncGenerator, List, Optional, Annotated
import random
import json
import string
import os
from app.schemas.commons import (
    part_no, Update, LineName, data_table, delete_a_row, PostData, DataAll, DataGraph
)
from app.manager import CommonsManager
from app.functions import api_key_auth
from datetime import datetime
import time

def commons_routers(db: AsyncGenerator) -> APIRouter:
    router = APIRouter()
    manager = CommonsManager()

# ? ================================ admin page ==============================================
    @router.get(
            "/get_linename",
            response_model=List[LineName],
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
            "/get_part_no",
            response_model=List[part_no],
            dependencies=[Depends(api_key_auth)],
        )
        
    async def get_part_no( db: AsyncSession = Depends(db)):
            try:
                part_no = await manager.get_part_no(db=db)
                return list(part_no)
            except Exception as e:
                raise HTTPException(
                    status_code=400, detail=f"Error during get data : {e}"
                )

    @router.get(
            "/get_data_all",
            response_model=List[DataAll],
            dependencies=[Depends(api_key_auth)],
        )
    async def get_data_all(db: AsyncSession = Depends(db)):
            try:
                data_wi = await manager.get_data_all(db=db)
                return list(data_wi)
            except Exception as e:
                raise HTTPException(
                    status_code=400, detail=f"Error during get data : {e}"
                )

    @router.get(
        "/get_data_table",
        response_model=List[data_table],
        dependencies=[Depends(api_key_auth)],
    )
    async def get_data_table(line_id=str, part_no=str, category=str, db: AsyncSession = Depends(db)):
        try:
            data_table = await manager.get_data_table(line_id=line_id, part_no=part_no,category=category, db=db)
            return list(data_table)
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error during get data : {e}"
            )

    @router.post(
        "/post_row_data",
        dependencies=[Depends(api_key_auth)],
    )
    async def post_row_data(item:PostData, db: AsyncSession = Depends(db)):
        try:
            row_data = await manager.post_row_data(item=item,db=db)
            return {"success": True}
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error during update : {e}"
            )

    @router.post(
            "/delete_row",
            dependencies=[Depends(api_key_auth)],
        )
    async def delete_row(item:delete_a_row,db: AsyncSession = Depends(db)):
            try:
                delete_row = await manager.delete_row(item=item,db=db)
                return {"success": True}
            except Exception as e:
                raise HTTPException(
                    status_code=400, detail=f"Error during update : {e}"
                )

    @router.put(
        "/put_update_data",
        dependencies=[Depends(api_key_auth)],
    )
    async def put_update_data(item: Update, db: AsyncSession = Depends(db)):
        try:
            update_data = await manager.put_update_data(item=item, db=db)
            return {"success": True}
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error during update : {e}")


# ? ================================ graph page ==============================================
    @router.get(
        "/get_data_graph",
        response_model=List[data_table],
        dependencies=[Depends(api_key_auth)],
    )
    async def get_data_graph(line_id=str, part_no=str, db: AsyncSession = Depends(db)):
        try:
            data_graph = await manager.get_data_graph(line_id=line_id, part_no=part_no, db=db)
            return list(data_graph)
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error during get data : {e}"
            )

    # @router.get(
    #         "/get_data_table",
    #         response_model=List[data_table],
    #         dependencies=[Depends(api_key_auth)],
    #     )
    # async def get_data_table(line_id=str, part_no=str, category=str, db: AsyncSession = Depends(db)):
    #         try:
    #             data_table = await manager.get_data_table(line_id=line_id, part_no=part_no,category=category, db=db)
    #             return list(data_table)
    #         except Exception as e:
    #             raise HTTPException(
    #                 status_code=400, detail=f"Error during get data : {e}"
    #             )

    return router


    # @router.post("/upload", response_model=List[dict])
    # async def create_upload_file(file_uploads: list[UploadFile]):
    #     print(file_uploads)
    #     file_info_list = []
    #     for file_upload in file_uploads:
    #         try:
    #             data = await file_upload.read()
    #             rd = "".join(
    #                 random.SystemRandom().choice(string.ascii_uppercase + string.digits)
    #                 for _ in range(8)
    #             )
    #             file_name = f"{rd}_{file_upload.filename}"
    #             file_path = os.path.join("uploaded_files",file_name)
    #             # file_path = "\\\\192.168.2.115\\uploaded_files\\"+file_name
    #             print(file_path)
    #             with open(file_path, "wb") as f:
    #                 f.write(data)
    #             session = ftplib.FTP('192.168.2.115') 
    #             session.login()   
    #             file = open(file_path,'rb')         # file to send
    #             session.storbinary('STOR kitten.jpg', file)                # close file and FTP
    #             file.close()
    #             session.quit()
    #             url = f"/static/{file_name}"
    #             file_info = {"local_path": file_path, "url": url}
    #             file_info_list.append(file_info)
    #         except Exception as e:
    #             raise HTTPException(
    #                 status_code=500, detail=f"Error processing file: {str(e)}"
    #             )
    #     return file_info_list
    # return router
