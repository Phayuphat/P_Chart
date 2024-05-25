"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Table,
  Form,
  Select,
  Popconfirm,
  message,
  Tooltip,
  Tabs,
} from "antd";
import FormItem from "antd/es/form/FormItem";
import {
  PlusOutlined,
  SaveOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import environment from "@/utils/environment";
import axiosInstance from "@/lib/axios";
import { TabsProps } from "antd/lib";

const App: React.FC = () => {
  const [form] = Form.useForm();
  const [TabKey, setTabKey] = useState<string>("Repeat");
  const [LineName, setLineName] = useState<any>([]);
  const [MaxId, setMaxId] = useState<number>(0);
  const [AddRowClick, setAddRowClick] = useState(false);
  const [EditingKey, setEditingKey] = useState("");
  const [PartNo, setPartNo] = useState<any>([]);
  const [Repeat, setRepeat] = useState<any>([]);
  const [Scrap, setScrap] = useState<any>([]);
  const [RepeatNG, setRepeatNG] = useState<any>([]);


  //********************** set time thailand ***************************
  const currentDate = new Date();
  const time_thai = `${String(currentDate.getDate()).padStart(2, "0")} ${
    [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ][currentDate.getMonth()]
  } ${currentDate.getFullYear()} ${String(currentDate.getHours()).padStart(
    2,
    "0"
  )}: ${String(currentDate.getMinutes()).padStart(2, "0")}: ${String(
    currentDate.getSeconds()
  ).padStart(2, "0")}`;

//********************** get linename **************************
const fetch_linename = async () => {
  try {
    const response = await axiosInstance.get("/commons/get_linename");
    if (response.status === 200) {
      setLineName(response.data);
    }
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  fetch_linename();
}, []);

  //********************** get part no **************************
  const GetPartNo = async (value: string) => {
    try {
      const response_process = await axiosInstance.get(
        `/commons/get_part_no?line_id=${value}`
      );
      if (response_process.status === 200) {
        setPartNo(response_process.data);
      
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (form.getFieldValue("LineName") === undefined) {
      form.resetFields(["Process"]);
    } else {
      form.resetFields(["Process"]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getFieldValue("LineName")]);

 //************************** GET mode, target by item on edit-table ************
  const showData = async () => {
    setEditingKey("");

    const line_id = form.getFieldValue("LineName") || "0";
      console.log("line id", line_id)
    const part_no = form.getFieldValue("Part Number") || "0";
      console.log("part no:", line_id)
    const category = TabKey
      console.log("category:", category )

    const response_data_all= await axiosInstance.get("/commons/get_data_all");
    const response_data_table = await axiosInstance.get("/commons/get_data_table", {
      params: {
        line_id: line_id,
        part_no: part_no,
        category: category
      },
    });

    if (response_data_table.status === 200 && line_id != 0 && part_no != 0) {
      const dataWithKeys = response_data_table.data.map(
        (item: any, index: number) => ({
          key: (index + 1).toString(),
          ...item,
        })
      );

      if (TabKey === "Repeat") {
        setRepeat(dataWithKeys);
        //setDisable(false)
      }
      if (TabKey === "Scrap") {
        setScrap(dataWithKeys);
        // setDisable(false)
      }
      if (TabKey === "Repeat NG") {
        setRepeatNG(dataWithKeys);
        //setDisable(false)
      }
    }

    if (response_data_all.status === 200) {
      const maxId = Math.max(...response_data_all.data.map((item: any) => item.id));
      setMaxId(maxId);
      console.log("max id:", maxId)
    }
  };

  //**************** Add mode, target *******************
  const onAddButtonClick = () => {
    form.resetFields(["mode", "target"]);

    if (!EditingKey) {
      const newId = MaxId + 1;

      if (TabKey === "Repeat") {
        const newData: Item = {
          key: String(Repeat.length + 1),
          id: newId,
          mode:"",
          target: 0,
          
        };
        setRepeat([...Repeat, newData]);
        setEditingKey(newData.key);
      }
      if (TabKey === "Scrap") {
        const newData: Item = {
          key: String(Scrap.length + 1),
          id: newId,
          mode:"",
          target: 0,
          
        };
        setScrap([...Scrap, newData]);
        setEditingKey(newData.key);
      }
      if (TabKey === "Repeat NG") {
        const newData: Item = {
          key: String(RepeatNG.length + 1),
          id: newId,
          mode:"",
          target: 0,
          
        };
        setRepeatNG([...RepeatNG, newData]);
        setEditingKey(newData.key);
      }
    }
  };

  const cancel = async () => {
    setEditingKey("");
  };

  //********************** delete row **************************************
  const onDeleteButtonClick = async (key: React.Key) => {
    if (TabKey === "Repeat") {
      const newData = Repeat.filter((item: any) => item.key !== key);
      const updatedData = newData.map((item: any, index: any) => ({
          ...item,
          key: String(index + 1),
        }));
      setRepeat(updatedData);
    } else if (TabKey === "Scrap") {
      const newData = Scrap.filter((item: any) => item.key !== key);
      const updatedData = newData.map((item: any, index: any) => ({
        ...item,
        key: String(index + 1),
      }));
      setRepeat(updatedData);
    } else if (TabKey === "Repeat NG") {
      const newData = RepeatNG.filter((item: any) => item.key !== key);
      const updatedData = newData.map((item: any, index: any) => ({
        ...item,
        key: String(index + 1),
      }));
      setRepeat(updatedData);
    }
  };

  //********************** API delete row **************************
  const delete_row = async (id: id_row) => {
    try {
      const response = await axiosInstance.post("/commons/delete_row", id);
      if (response.status === 200) {
        message.success("Delete successfully");
      }
    } catch (error) {
      console.error("Error delete data:", error);
    }
  };

  //********************** edit data on table ***************************
  const isEditing = (record: Item) => record.key === EditingKey;
  //edit part_number and plc_data only
  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({
      mode: "",
      target: 0,
      ...record,
    });
    setEditingKey(record.key);
  };

    //************** tab change ********************************
    const onTabChange = (key: string) => {
      setEditingKey("");
      setTabKey(key);
      console.log("category key:",key);
    };
  
  //save all data in 1 row to database
  const savetoDb = async (savedItem: any, _: any) => {
    const line_id = form.getFieldValue("LineName");
    const part_no = form.getFieldValue("Part Number");
    const category = TabKey

    const upsertItem = {
      line_id: line_id,
      part_no: part_no,
      category: category,
      mode: savedItem.mode,
      target: savedItem.target,
      
    };

    const editItem = {
      id: savedItem.id,
      line_id: line_id,
      part_no: part_no,
      category: category,
      mode: savedItem.mode,
      target: savedItem.target,
      
    };

    //if click add_row_click do post , if not do update
    if (AddRowClick) {
      post_edit_data(upsertItem);
      setAddRowClick(false);
      setEditingKey("");
    } else {
      update_row(editItem);
    }
  };

  const save = async (key: React.Key) => {
    setEditingKey("");
  
    try {
      const row = await form.validateFields();
      console.log("row_data", row);
      const newData = {
        "Repeat": [...new Set(Repeat)] as Item[],
        "Scrap": [...new Set(Scrap)] as Item[],
        "Repeat NG": [...new Set(RepeatNG)] as Item[]
      }[TabKey];
      console.log("new_data", newData);
  
      if (newData) {
        const index = newData.findIndex((item: Item) => key === item.key);
        console.log("index_data", index);

        if (index > -1) {
          const item = newData[index];
          const updatedItem = { ...item, ...row };
  
          const uniqueCheck = newData.every(
            (item) =>
              item.key === key || item.mode !== updatedItem.mode);
              
          if (!uniqueCheck) {
            const duplicateItem = newData.find(
              (item) => item.mode === updatedItem.mode && item.key !== key
            );
            
            if (duplicateItem) {
              message.error("Please change the mode, it must be unique!");
            }
            return
          }
  
          const { key: omitKey, ...savedItem } = updatedItem;
          newData.splice(index, 1, updatedItem);
          setEditingKey("")
          if (TabKey === "Repeat") {
            setRepeat(newData);
            savetoDb(savedItem, updatedItem);
          }
          if (TabKey === "Scrap") {
            setScrap(newData);
            savetoDb(savedItem, updatedItem);
          }
          if (TabKey === "Repeat NG") {
            setRepeatNG(newData);
            savetoDb(savedItem, updatedItem);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  //******* API post (post_edit_data) ********** condition for post use with add row (true) ***********
  const post_edit_data = async (upsertItem: EditData) => {
    try {
      const response = await axiosInstance.post(
        "/commons/post_row_data",
        upsertItem
      );
      if (response.status === 200) {
        showData()
        message.success("Upload successfully");
      } 
    } catch (error) {
      console.error("Error Upload data:", error);
    }
  };


  //****** API update (put_edit_wi) ***** condition for post use with edit (true), add row(false) **********
  const update_row = async (upsertItem: UpData) => {
    // console.log("Update Row:", upsertItem);
    try {
      const response = await axiosInstance.put(
        "/commons/put_update_data",
        upsertItem
      );
      if (response.status === 200) {
        message.success("Update successfully");
      }
    } catch (error) {
      console.error("Error delete data:", error);
    }
  };

  const unique = new Set();
  const distinct_line_name = LineName.filter((entry: any) => {
    const isUnique = !unique.has(entry.line_id);
    unique.add(entry.line_id);
    return isUnique;
  });

  const distinct_part_no = PartNo.filter((entry: any) => {
    const isUnique = !unique.has(entry.part_no);
    unique.add(entry.part_no);
    return isUnique;
  });

  const columns = [
    {
      title: "Mode",
      dataIndex: "mode",
      editable: true,
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="mode"
            rules={[
              {
                required: true,
                message: `Please Input Defect Mode`,
              },
            ]}
          >
            <Input />
          </Form.Item>
        ) : (
          record.mode
        );
      }
    },
    {
      title: "Target by Items",
      dataIndex: "target",
      editable: true,
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="target"
            rules={[
              {
                required: true,
                message: `Please Input Target by Items`,
              },
            ]}
          >
            <Input />
          </Form.Item>
        ) : (
          record.target
        );
      },
    },
    // {
    //   title: "Update Time",
    //   dataIndex: "update_at",
    //   width: 250,
    //   render: (update_at: string) => (
    //     <div className="update_at">
    //       {update_at}
    //     </div>
    //   ),
    // },

    {
      title: "Action",
      dataIndex: "action",
      width: 200,
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return (
          <span className="actions-group">
            {editable ? (
              <span>
                <Tooltip title="Save">
                  <Button
                    type="primary"
                    onClick={() => save(record.key)}
                    style={{
                      boxShadow: "3px 3px 10px ",
                      width: "50px",
                      marginRight: "10px",
                    }}
                  >
                    <SaveOutlined
                      style={{ fontSize: "20px", textAlign: "center" }}
                    />
                  </Button>
                </Tooltip>

                <Tooltip title="Cancel">
                  <Button
                    type="primary"
                    onClick={async () => {
                      const ID = {
                        id: record.id,
                      };
                      if (record.mode !== "") {
                        cancel();
                      } else {
                        onDeleteButtonClick(record.key);
                        delete_row(ID);
                        setEditingKey("");
                      }
                    }}
                    style={{
                      boxShadow: "3px 3px 10px 0px",
                      width: "50px",
                      marginLeft: "10px",
                    }}
                  >
                    <CloseOutlined style={{ fontSize: "20px" }} />
                  </Button>
                </Tooltip>
              </span>
            ) : (
              <span>
                <Tooltip title="Edit">
                  <Button
                    type="primary"
                    disabled={EditingKey !== "" && EditingKey !== record.key}
                    onClick={() => {
                      edit(record);
                    }}
                    style={{
                      boxShadow: "3px 3px 10px 0px",
                      width: "50px",
                      marginRight: "10px",
                    }}
                  >
                    <EditOutlined style={{ fontSize: "20px" }} />
                  </Button>
                </Tooltip>

                <Tooltip title="Delete">
                  <Popconfirm
                    title="Sure to delete?"
                    onConfirm={async () => {
                      const ID = {
                        id: record.id,
                      };
                      onDeleteButtonClick(record.key);
                      delete_row(ID);
                      console.log("row_id", record.id)
                    }}
                  >
                    <Button
                      type="primary"
                      danger
                      disabled={EditingKey !== "" && EditingKey !== record.key}
                      style={{
                        boxShadow: "3px 3px 10px 0px",
                        width: "50px",
                        marginLeft: "10px",
                      }}
                    >
                      <DeleteOutlined style={{ fontSize: "20px" }} />
                    </Button>
                  </Popconfirm>
                </Tooltip>
              </span>
            )}
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const items: TabsProps["items"] = [
    {
      key: "Repeat",
      label: "Repeat",
      children: (
        <Table
        className="edit_table"
        dataSource={Repeat}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={false}
        scroll={{ y: 590 }}
        rowKey={(record: any) => record.key}
        style={{ paddingBottom: "0.5rem" }}
        onRow={(record: Item) => ({
          onClick: async () => {
            console.log("row_repeat_data",record);
          },
        })}
      />
      ),
    },
    {
      key: "Scrap",
      label: "Scrap",
      children: (
        <Table
        className="edit_table"
        dataSource={Scrap}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={false}
        scroll={{ y: 590 }}
        rowKey={(record: any) => record.key}
        style={{ paddingBottom: "0.5rem" }}
        onRow={(record: Item) => ({
          onClick: async () => {
            console.log("row_scrap_data",record);
          },
        })}
      />
      ),
    },
    {
      key: "Repeat NG",
      label: "Repeat NG",
      children: (
        <Table
        className="edit_table"
        dataSource={RepeatNG}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={false}
        scroll={{ y: 590 }}
        rowKey={(record: any) => record.key}
        style={{ paddingBottom: "0.5rem" }}
        onRow={(record: Item) => ({
          onClick: async () => {
            console.log("row_repeat_ng_data",record);
          },
        })}
      />
      ),
    },
  ];


  return (
    <div>
      <div className="header">
        <div className="box_header">
          <Form
            className="form_selector"
            form={form}
            onFinish={(x) => console.log(x)}
          >
            <FormItem
              name="LineName"
              rules={[{ required: true, message: "LineName is required" }]}
              label={<span className="label_name">Line Name</span>}
            >
              <Select
                showSearch
                placeholder="Select a LineName"
                style={{ width: 450 }}
                onSelect={GetPartNo}
                onChange={GetPartNo}
                allowClear
              >
                {distinct_line_name.map((item: any) => (
                  <Select.Option
                    key={item.line_id}
                    value={item.line_id}
                    
                  >
                    {item.line_name}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>

            <FormItem
              name="Part Number"
              rules={[{ required: true, message: "Part Number is required" }]}
              label={<span className="label_name"> Part Number </span>}
            >
              <Select
                showSearch
                allowClear
                placeholder="Select a Part Number"
                style={{ width: 350 }}
              >
                {distinct_part_no.map((item: any) => (
                  <Select.Option
                    key={item.part_id}
                    value={item.part_no}
                  >
                    {item.part_no}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>

            <FormItem className="form_search">
              <Button
                type="primary"
                onClick={showData}
                htmlType="submit"
                style={{ fontSize: 15, boxShadow: "3px 3px 10px 0px " }}
              >
                Search
                <SearchOutlined />
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>

      <div>
        <Form 
          form={form} 
          component={false}
          >

          <div className="table_container">
            <Tabs 
              type="card"
              items={items}
              style={{paddingTop:"0.5rem"}}
              onChange={onTabChange}
              tabBarExtraContent={
                <FormItem className="form_add_mode">
                  <Tooltip title="Add Defect Mode">
                    <Button
                      type="primary"
                      onClick={() => {
                        onAddButtonClick();
                        setAddRowClick(true);
                      }}
                      style={{
                        boxShadow: "3px 3px 10px 0px",
                      }}
                      icon={<PlusOutlined />}
                      >
                        Add
                    </Button>
                  </Tooltip>
                </FormItem>
              }
              
              />
          </div>
        </Form>
      </div>
    </div>
  );
};
export default App;