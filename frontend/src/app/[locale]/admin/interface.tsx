interface Item {
    id: number;
    key: string;
    mode: string;
    target_by_item: number;
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