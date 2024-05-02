"use client";
import React, { useState } from "react";
import {
  Table,
  Button,
  Form,
  Popconfirm,
  Drawer,
  Tabs,
  Tooltip,
  Space,
  Input,
} from "antd";
import { TabsProps } from "antd/lib";
import {
  SaveOutlined,
  CloseSquareOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";
import _ from "lodash";

const DrawerMode: React.FC= () => {
  const [DataSource, setDataSource] = useState<any>([]);
  const [Open, setOpen] = useState(false);
  const [TabKey, setTabKey] = useState<string>("1");
  const [RepeatData, setRepeatData] = useState<any>([]);
  const [ScrapData, setScrapData] = useState<any>([]);
  const [RepeatNG_Data, setRepeatNgData] = useState<any>([]);
  const [EditingKey, setEditingKey] = useState("");
  const [form] = Form.useForm();

  type EditableTableProps = Parameters<typeof Table>[0];
  type ColumnTypes = Exclude<EditableTableProps["columns"], any>;

  const showDrawer = () => {
    setOpen(true);
  };

  const onTabChange = (key: string) => {
    setTabKey(key);
  };

  const handleCancel = () => {
    setEditingKey("");
  };

  const handleDelete = (key: React.Key) => {
    let currentData;
    if (TabKey === "1") {
      currentData = [...RepeatData];
    } else if (TabKey === "2") {
      currentData = [...ScrapData];
    } else if (TabKey === "3") {
      currentData = [...RepeatNG_Data];
    } else {
      return;
    }
  };

  // const onDeleteButton = async (key: React.Key) => {

  // }


  const handleAdd = () => {
    const newData: any = {
      key: String(DataSource.length + 1),
      mode: "",
      target_by_item: "",
    };
    if (TabKey === "1") {
      setRepeatData([...RepeatData, newData]);
    }
    if (TabKey === "2") {
      setScrapData([...ScrapData, newData]);
    }
    if (TabKey === "3") {
      setRepeatNgData([...RepeatNG_Data, newData]);
    }
    setDataSource([...DataSource, newData]);
  };

  const isEditing = (record: Item) => record.key === EditingKey;

  const handleEdit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({
      mode: "",
      target_by_item: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const defaultColumns = [
    {
      title: "Mode",
      dataIndex: "mode",
      width: "65%",
      editable: true,
      render: (_:any, record:Item) => {
        const Editable = isEditing(record);
          return Editable ? (
            <FormItem
              name="mode"
              rules={[{
                required: true,
                message: "Please Input Defect Mode!"
              }]}>
                <Input /> 
            </FormItem>
          ) : (
            record.mode
          )
      }
    },
    {
      title: "Target by item",
      dataIndex: "target_by_item",
      editable: true,
      render: (_:any, record:Item) => {
        const Editable = isEditing(record);
        return Editable ? (
          <FormItem
          name="target_by_item"
          rules={[{
            required: true,
            message: "Please input Target By Item!"
          }]}>
            <Input />
          </FormItem>
        ) : (
          record.target_by_item
        )
      }
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
                disabled={EditingKey !== "" && EditingKey !== record.key}
                onClick={() => 
                  handleEdit(record)}
              >
                <EditOutlined style={{ fontSize: "25px" }} />
              </Button>
            </Tooltip>

            <Tooltip title="Delete">
              <Popconfirm
                title="Sure to Delete?"
                //icon={<DeleteOutlined />}
                onConfirm={() => handleDelete(record.key)}
                // onConfirm= {async () => {
                //   const ID = {
                //     id: record.id
                //   };
                //   onDeleteButton(record.key)
                //   delete_row(ID)
                // }}
              >
                  <Button
                    className="button_delete"
                    disabled={EditingKey !== "" && EditingKey !== record.key}
                    type="primary"
                    danger
                  >
                    <DeleteOutlined style={{ fontSize: "25px" }} />
                  </Button>
              </Popconfirm>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const columns_add_mode = defaultColumns.map((col) => {
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
          className="category_table"
          scroll={{y: 650}}
          //rowClassName={() => "editable-row"}
          bordered
          pagination={false}
          dataSource={RepeatData}
          columns={columns_add_mode as ColumnTypes}
          // onRow={(record) => ({
          //   onClick: async () => {
          //     console.log(record);
          //   },
          // })}
        />
      ),
    },
    {
      key: "2",
      label: "Scrap",
      children: (
        <Table
          className="category_table"
          scroll={{y: 650}}
          pagination={false}
          //rowClassName={() => "editable-row"}
          bordered
          dataSource={ScrapData}
          columns={columns_add_mode as ColumnTypes}
        />
      ),
    },
    {
      key: "3",
      label: "Repeat NG",
      children: (
        <Table
          className="category_table"
          scroll={{y: 650}}
          pagination={false}
          //rowClassName={() => "editable-row"}
          dataSource={RepeatNG_Data}
          columns={columns_add_mode as ColumnTypes}
          bordered
        />
      ),
    },
  ];

  return (
    <>
      <Button
          type="primary"
          style={{ width: "200px", marginLeft: "20px" }}
          onClick={showDrawer}
        >
          Add Category
      </Button>
      <Drawer
          className="drawer_category"
          title={<span className="title"> Create Category </span>}
          width={1500}
          closable={false}
          open={Open}
      >
          <Tabs
            onChange={onTabChange}
            type="card"
            items={tab_items}
            tabBarExtraContent={
              <Button 
                type="primary"
                // disabled
                onClick={handleAdd}>
                  Add Mode 
              </Button>
            }
            
          />
          <Space className="button_save_mode">
            <Button onClick={() => setOpen(false)} type="primary">
              Save
            </Button>
            <Button onClick={() => setOpen(false)}> 
              Cancel 
            </Button>
          </Space>
      </Drawer>
    </>
  )
}
export default DrawerMode;