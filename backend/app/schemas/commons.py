from pydantic import BaseModel
from typing import Optional, List, Dict, Any, Union
import datetime

class LineName(BaseModel):
    line_id:int
    line_name:str

class part_no(BaseModel):
    part_id:int
    part_no:str
    part_name:str

class Data(BaseModel):
    
    mode_id: int
    mode:str

class Up_Data(BaseModel):
    mode_id: int
    mode: str
    # target: int
    update_at: str

class wi_table(BaseModel):
    line_id:int
    part_no:str
    category:str
    mode_id:int
    mode:str
    target:int
    update_at:str
    
class delete_a_row(BaseModel):
    id:Union[int, str]
    # id: int









class DataInitals(BaseModel):
    id: int
    part_no:str
    plc_data:str
    updated_at:Optional[datetime.datetime]
    created_at:Optional[datetime.datetime]
    image_path:Optional[List[Dict[str,Any]]] = None
    
class DataInitalsResponse(BaseModel):
    data:List[DataInitals]

class PostData(BaseModel):
    line_id: int
    part_no: str
    category: str
    # mode_id:int
    mode: str
    target: int
    update_at: str

# class DataWi(BaseModel):
#     mode_id: int
#     mode:str
#     update_at:str

# class Display(BaseModel):
#     display_name:str
# class ListDataWi(BaseModel):
#     data:List[DataWi]
#################################################
    









# class wi_table(BaseModel):
#     id: int
#     part_no:str
#     plc_data:str
#     image_path:Optional[List[Dict[str,Any]]] = None
#     # image_path:str
#     update_at:str
