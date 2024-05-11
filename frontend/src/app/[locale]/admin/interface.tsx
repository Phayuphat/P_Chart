interface Item {
    key: string;
    id: number;
    category: string;
    mode_id:number
    mode: string;
    target:number;
    update_at: string;
}  

interface EditData {
    line_id: number;
    part_no: string;
    category: string;
    mode: string;
    target: number;
    update_at: string;
}

interface Updata {
    mode_id: number;
    mode: string;
    // target: number;
    update_at: string;
}

type id_row = {
    id: number
}





interface ItemA {
    line_id: number;
    key: string;
    line_name: string;
}

interface EditableRowProps {
    index: number;
}

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof Item;
    record: Item;
    handleSave: (record: Item) => void;
}

interface DataType {
    key: React.Key;
    mode: string;
    target_by_item: string;
}