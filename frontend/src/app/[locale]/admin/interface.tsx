interface Item {
    key: string;
    id: number;
    mode: string;
    target:number
    update_at: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: "number" | "text";
    record: Item;
    index: number;
    children: React.ReactNode;
}

type EditData = {
    line_id: number;
    part_no: string;
    mode: string;
    category:string;
    target:number
    update_at: string;
};

type UpData = {
    id: number;
    mode: string;
    target:number
    update_at: string;
};

type id_row = {
    id: number;
};