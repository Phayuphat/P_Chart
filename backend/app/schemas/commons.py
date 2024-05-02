from pydantic import BaseModel
from  typing import List, Optional
import datetime


class line_name_data(BaseModel):
  line_id_data: int
  line_name_data: str

class line_name(BaseModel):
  line_name: List[line_name_data]