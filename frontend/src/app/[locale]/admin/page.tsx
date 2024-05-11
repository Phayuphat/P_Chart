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
import type * as antd from "antd";
// import environment from "@/app/utils/environment";
import axiosInstance from "@/lib/axios";
import { TabsProps } from "antd/lib";
import { error } from "console";
import { update } from "lodash";
//import { data } from "autoprefixer";

const App: React.FC = () => {
  const [form] = Form.useForm();
  const [LineName, setLineName] = useState<any>([]);
  const [PartNo, setPartNo] = useState<any>([]);
  const [MaxId, setMaxId] = useState<number>(0);
  const [EditingKey, setEditingKey] = useState("");
  const [TabKey, setTabKey] = useState<string>("Repeat");
  const [Repeat, setRepeat] = useState<any>([]);
  const [Scrap, setScrap] = useState<any>([]);
  const [RepeatNG, setRepeatNG] = useState<any>([]);
  const [AddRowClick, setAddRowClick] = useState(false);
  // const [Disable, setDisable] = useState(true)
  
  const { Search } = Input;
  const [DataSource, setDataSource] = useState<any>([]);
  const [Data, setData] = useState<Item[]>([]);
  const [DefaultImage, setDefultImage] = useState<any>([]);
  const [Category, setCategory] = useState<any>([]);



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



  //********************** get_linename **************************
  const fetch_linename = async () => {
    try {
      const response = await axiosInstance.get("/commons/get_linename");
      if (response.status === 200) {
        setLineName(response.data);
        console.log("linename", response.data);
      }
    } catch (error) {
      return error
    }
  };

  useEffect(() => {
    fetch_linename();
  }, []);

  //********************** get_part_number **************************
  const LineNameChange = async (value: number) => {
    try {
      const response_part_no = await axiosInstance.get(
        `/commons/get_part_no?line_id=${value}`
      );
      if (response_part_no.status === 200) {
        setPartNo(response_part_no.data);
        console.log(response_part_no.data);
      }
    } catch (error) {
      return error
    }
  };

  // useEffect(() => {
  //   if (form.getFieldValue("LineName") === undefined) {
  //     form.resetFields(["Part Number"]);
  //   } else {
  //     form.resetFields(["Part Number"]);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [form.getFieldValue("LineName")]);

  //************************** GET mode, target by item on edit-table ************
  const showData = async () => {
    setEditingKey("");
    
    const line_id = form.getFieldValue("LineName") || "0";
    const part_no = form.getFieldValue("Part Number") || "0";
    console.log("line_id", line_id)
    const category = TabKey;

    const response_wi = await axiosInstance.get("/commons/get_wi_data");
    console.log("res_wi", response_wi.data);

    const responsedata = await axiosInstance.get("/commons/get_wi_table", {
      params: {
        line_id: line_id,
        part_no: part_no,
        category: category,
      },
    });

    if (responsedata.status === 200 && line_id != 0 && part_no != 0) {
      
      const dataWithKeys = responsedata.data.map(
        (item: any, index: number) => ({
          key: (index + 1).toString(),
          // key: (index + 1),
          ...item,
        })
      );
      console.log("dataWithKeys", dataWithKeys)

      //TODO: MaxId is NaN
      const maxId = Math.max(...response_wi.data.map((item: Item) => item.mode_id));
            setMaxId(maxId);
            console.log("maxID", maxId);


      if (TabKey === "Repeat") {
        setRepeat(dataWithKeys);
        //setDisable(false)
      }
      if (TabKey === "Scrap") {
        setScrap(dataWithKeys);
        // setDisable(false)
      }
      if (TabKey === "Repeat_NG") {
        setRepeatNG(dataWithKeys);
        //setDisable(false)
      }
    }

    // if (response_wi.status === 200 ) {
    //   const maxId = Math.max(...response_wi.data.map((item: Item) => item.mode_id));
    //   setMaxId(maxId);
    //   console.log("maxID", maxId);
    // }
  };

  //TODO: check function
  //**************** Add mode, target *******************
  const onAddButtonClick = () => {
    form.resetFields(["mode", "target"]);


    
    
  //TODO: mode_id, id no reset realtime(newId is NaN)
    if (!EditingKey) {
      const newId = MaxId + 1;

      if (TabKey === "Repeat") {
        const newData: Item = {
          key: String(Repeat.length + 1),
          id: newId,
          category: TabKey,
          mode_id:newId,
          mode: "",
          target: 0,
          update_at: time_thai,
        };
        setRepeat([...Repeat, newData]);
        setEditingKey(newData.key);
      }
      if (TabKey === "Scrap") {
        const newData: Item = {
          key: String(Scrap.length + 1),
          id: newId,
          category: TabKey,
          mode_id:newId,
          mode: "",
          target: 0,
          update_at: time_thai,
        };
        setScrap([...Scrap, newData]);
        setEditingKey(newData.key);
      }
      if (TabKey === "Repeat_NG") {
        const newData: Item = {
          key: String(RepeatNG.length + 1),
          id: newId,
          category: TabKey,
          mode_id:newId,
          mode: "",
          target: 0,
          update_at: time_thai,
        };
        setRepeatNG([...RepeatNG, newData]);
        setEditingKey(newData.key);
      }
    }
  };

  //****************** cancle if no data >>> delete row
  const cancle = async (record: number) => {
    setEditingKey("");
  };

  const onDeleteButtonClick = (key: React.Key) => {
    let Current_Data;
    if (TabKey === "Repeat") {
      Current_Data = [...Repeat];
    } else if (TabKey === "Scrap") {
      Current_Data = [...Scrap];
    } else if (TabKey === "Repeat_NG") {
      Current_Data = [...RepeatNG];
    } else {
      return;
    }

    const update_data = Current_Data.filter((item: any) => item.key !== key);
    if (TabKey === "Repeat") {
      setRepeat(update_data);
    } else if (TabKey === "Scrap") {
      setScrap(update_data);
    } else if (TabKey === "Repeat_NG") {
      setRepeatNG(update_data);
    }
  };

  //********************** edit data on table ***************************
  const isEditing = (record: Item) => record.key === EditingKey;
  //edit mode, target on table only
  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({
      mode: "",
      target: 0,
      ...record,
    });
    setEditingKey(record.key);
  };

  //********************** delete data all row in database **************************
  const delete_row = async (record: any) => {
    console.log("recordToDelete", record)

    try {
      const response = await axiosInstance.post("/commons/delete_row", record);
      if (response.status === 200) {
        message.success("Delete successfully");
      }
    } catch (error) {
      console.error("Error delete data:", error);
    }
  };

  //************** tab change ********************************
  const onTabChange = (key: string) => {
    setEditingKey("");
    setTabKey(key);
    console.log(key);
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


  //********************* save data row by row to database **************************
  const saveToDatabase = async (saveItem: any) => {
    const line_id = form.getFieldValue("LineName");
    const part_no = form.getFieldValue("Part Number");
    const upsertItem = {
      line_id: line_id,
      part_no: part_no,
      category: saveItem.category,
      mode_id:saveItem.mode_id,
      mode: saveItem.mode,
      target:saveItem.target,
      update_at: time_thai 
    };
    
  
    const editItem = {
      mode_id: saveItem.mode_id,
      mode: saveItem.mode,
      // target:saveItem.target,
      update_at: time_thai
    }
    console.log("id", saveItem.id)


    if (AddRowClick) {
      save_to_database(upsertItem)
      setAddRowClick(false)
      setEditingKey("");
    } else {
      update_row(editItem)
    }
  };

  const update_row = async (upsertItem: Updata) => {
    console.log("update_data", upsertItem)
    try {
      const response_update_data = await axiosInstance.put("/commons/put_edit_data", upsertItem);
    
      if (response_update_data.status === 200) {
        message.success("Updata Success")
      }
    }
    catch (error) {
      return error
    }
  }

  
  const save = async (key: React.Key) => {
    setEditingKey("");

    try {
      const row_data = await form.validateFields();
      console.log("row_data", row_data);
  
      const newData = {
        "Repeat": [...new Set(Repeat)] as Item[],
        "Scrap": [...new Set(Scrap)] as Item[],
        "Repeat_NG": [...new Set(RepeatNG)] as Item[]
      }[TabKey];
      console.log("new_data", newData);
  
      if (newData) {
        const index = newData.findIndex((item: Item) => key === item.key);
        if (index !== -1) {
          const item = newData[index];
          console.log("item", item);
  
          const updateItem = { ...item, ...row_data };
          console.log("update_item", updateItem);
          
          // //TODO: check function
          // const uniqueCheck = newData.every(
          //   (item) => key !== item.key || item.mode !== updateItem.mode
          // );
          
          // if (uniqueCheck) {
          //   message.error("Please Change Defect Mode, it must be unique!");
          // } else {
          //   return;
          // }
  
          const { key: omitKey, ...saveItem } = updateItem;
          console.log("save_item", saveItem);
  
          newData.splice(index, 1, saveItem);
          if (TabKey === "Repeat") {
            setRepeat(newData);
            saveToDatabase(saveItem);
          }
          if (TabKey === "Scrap") {
            setScrap(newData);
            saveToDatabase(saveItem);
          }
          if (TabKey === "Repeat_NG") {
            setRepeatNG(newData);
            saveToDatabase(saveItem);
          }
        }
      }
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    if (form.getFieldValue("mode") !== undefined) {
      showData();
    }
  }, [])

  const save_to_database = async (upsertItem: EditData) => {
    try {
      const response_post = await axiosInstance.post("/commons/post_edit_data", upsertItem);

      if (response_post.status === 200){
        message.success("Upload Data Success")
      } else {
        return ("Upload Error")
      }
    }
    catch (error) {
      return error;
    }
  }






  const columns = [
    {
      title: "Mode",
      dataIndex: "mode",
      editable: true,
      render: (text: string, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="mode"
            rules={[
              {
                required: true,
                message: `Please Input Mode`,
              },
            ]}
          >
            <Input />
          </Form.Item>
        ) : (
          record.mode
        );
      },
    },
    {
      title: "Target by Item",
      dataIndex: "target",
      editable: true,
      render: (text: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="target"
            rules={[
              {
                required: true,
                message: `Please Input Target by Item`,
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
    {
      title: "Update Time",
      dataIndex: "update_at",
      width: 250,
      render: (_: any, record: Item) => (
        <div className="update_at"> {record.update_at} </div>
      ),
    },

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
                    //disabled={Disable}
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
                      // const ID = {
                      //   id: record.id,
                      // };
                      if (record.mode !== "" && record.target !== 0) {
                        cancle(record.id);
                      } else {
                        onDeleteButtonClick(record.key);
                        delete_row(record.id);
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
                    // disabled={EditingKey === "" && EditingKey !== record.key}
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
                        id: record.mode_id,
                      };
                      onDeleteButtonClick(record.key);
                      delete_row(ID);
                      console.log("row_id", record.mode_id)
                    }}
                  >
                    <Button
                      type="primary"
                      danger
                      // disabled={EditingKey !== "" && EditingKey !== record.key}
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
          columns={mergedColumns as any}
          rowClassName="editable-row"
          pagination={false}
          scroll={{ y: 590 }}
          rowKey={(record: any) => record.key}
          style={{ paddingBottom: "0.5rem" }}
          onRow={(record: Item) => ({
            onClick: async () => {
              console.log("tarrrrrrrrr",record);
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
          columns={mergedColumns as any}
          rowClassName="editable-row"
          pagination={false}
          scroll={{ y: 590 }}
          rowKey={(record: any) => record.key}
          onRow={(record: Item) => ({
            onClick: async () => {
              console.log(record);
            },
          })}
          style={{ paddingBottom: "0.5rem" }}
        />
      ),
    },
    {
      key: "Repeat_NG",
      label: "Repeat NG",
      children: (
        <Table
          className="edit_table"
          dataSource={RepeatNG}
          columns={mergedColumns as any}
          rowClassName="editable-row"
          pagination={false}
          scroll={{ y: 590 }}
          rowKey={(record: any) => record.key}
          onRow={(record: Item) => ({
            onClick: async () => {
              console.log(record);
            },
          })}
          style={{ paddingBottom: "0.5rem" }}
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
            // onFinish={(x) => console.log(x)}
          >
            <FormItem
              name="LineName"
              rules={[
                {
                  required: true,
                  message: "Line Name is required",
                },
              ]}
              label={<span className="label_name"> Line Name </span>}
            >
              <Select
                showSearch
                placeholder="Select a LineName"
                style={{ width: 450 }}
                onSelect={(value) => LineNameChange(value)}
                onChange={(value) => LineNameChange(value)}
                allowClear
              >
                {distinct_line_name.map((item: any) => (
                  <Select.Option
                    key={item.line_id}
                    value={item.line_id}
                    // label={item.line_name}
                  >
                    {item.line_name}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>

            <FormItem
              name="Part Number"
              rules={[
                {
                  required: true,
                  message: "Part Number is required",
                },
              ]}
              label={<span className="label_name"> Part Number </span>}
            >
              <Select
                showSearch
                allowClear
                placeholder="Select a Part Number"
                style={{ width: 350 }}
                // onSelect={PartNoChange}
                // onChange={PartNoChange}
                // disabled={distinct_process < 1}
              >
                {distinct_part_no.map((item: any) => (
                  <Select.Option
                    key={item.part_id}
                    value={item.part_no}
                    // label={item.part_no}
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
          className="tab_category"
          // component={false}
        >
          <Tabs
            type="card"
            defaultActiveKey="Repeat"
            items={items}
            style={{ paddingTop: "0.5rem" }}
            onChange={onTabChange}
            tabBarExtraContent={
              <FormItem className="form_add_image">
                <Tooltip title="Add Defect Mode">
                  <Button
                    type="primary"
                    onClick={() => {
                      onAddButtonClick();
                      setAddRowClick(true);
                    }}
                    style={{ boxShadow: "3px 3px 10px 0px" }}
                    icon={<PlusOutlined />}
                    // disabled={IsDisabled}
                  >
                    Add
                  </Button>
                </Tooltip>
              </FormItem>
            }
          ></Tabs>
        </Form>
      </div>
    </div>
  );
};
export default App;
