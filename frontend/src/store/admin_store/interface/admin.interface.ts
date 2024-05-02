//admin.interface.ts
interface data_item{
    [key:string]:any;
}

interface admin_data{
    line_id : string;
    part_no : string;
    mode_data:
        data_item[]
}

export interface AdminForm{
    data:admin_data[];
    setdata:(newDataArray : admin_data[])=> void;
}