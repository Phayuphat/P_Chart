from pydantic import BaseModel
from typing import Optional, List, Dict, Any, Union
from datetime import date
from datetime import datetime

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
    

class Update(BaseModel):
    id: int
    mode:str
    target:int
    

class data_table(BaseModel):
    id:int
    line_id:int
    part_no:str
    category:str
    mode:str
    target:int
    
    


class PostData(BaseModel):
    line_id: int
    part_no: str
    category: str
    mode: str
    target: int
    

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
    
class Approval(BaseModel):
    id: int
    name:str
    approval_date: date
    type:str

class Qty(BaseModel):
    id: int
    qty:int
    date: date
    
class data_mode(BaseModel):
    id:int
    line_id:int
    part_no:str
    category:str
    mode:str
    target:int
    quantity:int
    record_date: Optional[date]
    
# ? ================================ modal for record quantity ==============================================
class Post_np(BaseModel):
    mode: str
    date_record: str
    part_no: str
    count: int
    
class part_record(BaseModel):
    part_no: str
    category: str
    # mode: str