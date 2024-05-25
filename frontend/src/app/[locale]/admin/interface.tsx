interface Item {
    key: string;
    id: number;
    mode: string;
    target:number
    
}

// interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
//     editing: boolean;
//     dataIndex: string;
//     title: any;
//     inputType: "number" | "text";
//     record: Item;
//     index: number;
//     children: React.ReactNode;
// }

interface EditData  {
    line_id: number;
    part_no: string;
    mode: string;
    category:string;
    target:number
};

interface UpData {
    id: number;
    mode: string;
    target:number
};

interface id_row  {
    id: number;
};