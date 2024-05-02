"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Form,
  Input,
  Popconfirm,
  Table,
  Tabs,
  Select,
  Tooltip,
} from "antd";
import {
  SaveOutlined,
  CloseSquareOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { TabsProps } from "antd/lib";
import FormItem from "antd/es/form/FormItem";
import { DeleteOutlined } from "@ant-design/icons";

type EditableTableProps = Parameters<typeof Table>[0];
type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const App: React.FC = () => {
  const [dataSource, setDataSource] = useState<any>([]);
  const [form] = Form.useForm();
  const [tab_key, setTabKey] = useState<string>("1");
  const [repeat_data, setRepeatData] = useState<any>([]);
  const [scrap_data, setScrapData] = useState<any>([]);
  const [repeat_ng_data, setRepeatNgData] = useState<any>([]);
  const [editingKey, setEditingKey] = useState("");


  //delete
  const handleDelete = (key: React.Key) => {
    let currentData;
    if (tab_key === "1") {
      currentData = [...repeat_data];
    } else if (tab_key === "2") {
      currentData = [...scrap_data];
    } else if (tab_key === "3") {
      currentData = [...repeat_ng_data];
    } else {
      return;
    }

    const updatedData = currentData.filter((item: any) => item.key !== key);
    if (tab_key === "1") {
      setRepeatData(updatedData);
      console.log("repeat_data");
    } else if (tab_key === "2") {
      setScrapData(updatedData);
      console.log("scrap_data");
    } else if (tab_key === "3") {
      setRepeatNgData(updatedData);
      console.log("repeat_ng_data");
    }
  };

  
  const isEditing = (record: Item) => record.key === editingKey;

  const handleEdit = (record: Partial<Item> & {key: React.Key}) => {
    form.setFieldsValue({
      mode: "",
      target_by_item:"",
      ...record
    });
    setEditingKey(record.key);
  };

  const handleCancel = () => {
    setEditingKey("");
  };

  const defaultColumns = [
    {
      title: "Mode",
      dataIndex: "mode",
      width: "70%",
      editable: true,
    },
    {
      title: "Target by item",
      dataIndex: "target_by_item",
      editable: true,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <div>
            <Tooltip title="Save">
              <Button className="button_edit" type="primary">
                <SaveOutlined style={{ fontSize: "25px" }} />
              </Button>
            </Tooltip>
            <Tooltip title="Cancle">
              <Popconfirm title="Sure to cancel?" onConfirm={handleCancel}>
                <Button className="button_delete" type="primary">
                  <CloseSquareOutlined style={{ fontSize: "25px" }} />
                </Button>
              </Popconfirm>
            </Tooltip>
          </div>
        ) : (
          <div className="action_button">
            <Tooltip title="Edit">
              <Button
                className="button_edit"
                type="primary"
                disabled={editingKey !== "" && editingKey !== record.key}
                onClick={() => handleEdit(record)}
              >
                <EditOutlined style={{ fontSize: "25px" }} />
              </Button>
            </Tooltip>

            <Popconfirm
              title="Sure to Delete?"
              onConfirm={() => handleDelete(record.key)}
              icon={<DeleteOutlined />}
            >
              <Tooltip title="Delete">
                <Button
                  className="button_delete"
                  disabled={editingKey !== "" && editingKey !== record.key}
                  type="primary"
                  danger
                >
                  <DeleteOutlined style={{ fontSize: "25px" }} />
                </Button>
              </Tooltip>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    } else {
      return {
        ...col,
        onCell: (record: any) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
        }),
      };
    }
  });

  const tab_items: TabsProps["items"] = [
    {
      key: "1",
      label: "Repeat",
      children: (
        <Table
          className="Repeat"
          //components={components}
          rowClassName={() => "editable-row"}
          bordered
          // style={{border:'1px solid black'}}
          pagination={false}
          dataSource={repeat_data}
          columns={columns as ColumnTypes}
          onRow={(record) => ({
            onClick: async () => {
              console.log(record);
            },
          })}
        />
      ),
    },
    {
      key: "2",
      label: "Scrap",
      children: (
        <Table
          className="Scrap"
          //components={components}
          pagination={false}
          rowClassName={() => "editable-row"}
          // style={{border:'1px solid black'}}
          bordered
          dataSource={scrap_data}
          columns={columns as ColumnTypes}
        />
      ),
    },
    {
      key: "3",
      label: "Repeat NG",
      children: (
        <Table
          className="Repeat ng."
          //components={components}
          pagination={false}
          rowClassName={() => "editable-row"}
          dataSource={repeat_ng_data}
          columns={columns as ColumnTypes}
          // style={{border:'1px solid black'}}
          bordered
        />
      ),
    },
  ];

  const handleAdd = () => {
    const newData: any = {
      key: String(dataSource.length + 1),
      mode: "0",
      target_by_item: "0",
    };

    if (tab_key === "1") {
      setRepeatData([...repeat_data, newData]);
    }
    if (tab_key === "2") {
      setScrapData([...scrap_data, newData]);
    }
    if (tab_key === "3") {
      setRepeatNgData([...repeat_ng_data, newData]);
    }
    setDataSource([...dataSource, newData]);
  };


  const onTabChange = (key: string) => {
    setTabKey(key);
  };

  return (
    <div style={{ margin: "5px" }}>
      {/* Header */}
      <Form
        form={form}
        layout="inline"
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "40px",
          margin: "10px",
        }}
      >
        <FormItem
          name="LineId"
          rules={[{ required: true, message: "Line id is required" }]}
          style={{ width: "30%" }}
          label={
            <span className="line id" style={{ fontSize: 25 }}>
              Line id
            </span>
          }
        >
          <Select />
        </FormItem>

        <FormItem
          name="PartNo"
          rules={[{ required: true, message: "Part no is required" }]}
          style={{ width: "30%" }}
          label={
            <span className="part no" style={{ fontSize: 25 }}>
              Part no
            </span>
          }
        >
          <Select />
        </FormItem>
      </Form>

      {/* admin record */}
      <Form style={{ padding: "20px", border: "1px solid black" }}>
        <Tabs
          style={{ paddingTop: "0.5rem" }}
          defaultActiveKey="1"
          type="card"
          items={tab_items}
          onChange={onTabChange}
          tabBarExtraContent={<Button onClick={handleAdd}> Add Mode </Button>}
        >
        </Tabs>

        <FormItem
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "10px",
          }}
        >
          <Button type="primary"> Save </Button>
        </FormItem>
      </Form>
    </div>
  );
};

export default App;
