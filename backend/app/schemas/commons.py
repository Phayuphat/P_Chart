from pydantic import BaseModel
from  typing import List, Optional
import datetime


class line_name(BaseModel):
  line_id: int
  line_name: str

class shift(BaseModel):
  shift_id:int
  shift_name:str

class part_no(BaseModel):
  part_no:str