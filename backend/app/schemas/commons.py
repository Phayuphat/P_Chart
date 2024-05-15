from pydantic import BaseModel
from typing import Optional, List, Dict, Any, Union
import datetime

class part_no(BaseModel):
    part_id:int
    part_no:str
    part_name:str

class LineName(BaseModel):
    line_id:int
    line_name:str

class LineName_data(BaseModel):
    value:List[LineName]

class DataAll(BaseModel):
    id: int
    line_id:int
    part_no:str
    mode:str
    category:str
    update_at:str

class Update(BaseModel):
    id: int
    mode:str
    target:int
    update_at:str

class data_table(BaseModel):
    id:int
    line_id:int
    part_no:str
    category:str
    mode:str
    target:int
    update_at:str

class PostData(BaseModel):
    line_id: int
    part_no: str
    category: str
    mode: str
    target: int
    update_at: str

class delete_a_row(BaseModel):
    id:Union[int, str]


# ? ================================ graph page ==============================================
class DataGraph(BaseModel):
    id: int
    line_id:int
    part_no:str
    mode:str
    category:str
    target:int
    update_at:str