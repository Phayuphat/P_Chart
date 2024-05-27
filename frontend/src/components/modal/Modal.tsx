"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import {
  Modal,
  Input,
  Space,
  Switch,
  Button,
  Row,
  Col,
  Flex,
  Form,
} from "antd";
import {
  CloseSquareOutlined,
  ClearOutlined,
  PlusOutlined,
  MinusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";
import axiosInstance from "@/lib/axios";

//setup state for modalshow
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  part_no: string | null;
  line_id: number | null;
  date_record: any
  mode: string
}
//TODO: เขียน API เพื่อส่งค่าจำนวนของเสียไปบันทึกไว้ใน Database(pchart_record)
const Modalshow: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  part_no,
  line_id,
  date_record,
  mode
}) => {
  const [form] = Form.useForm();
  const [PartNo, setPartNo] = useState<any>([]);
  const [count, setCount] = useState(1);
  const [partnumber, setNamePart] = useState("");
  const [visible, setVisible] = useState(true);
  const [PartNoRecord, setPartNoRecord] = useState<any>([]);

  // console.log("part_number:", part_no);
  // console.log("line_id:", line_id);
  // console.log("date:", date_record);
  // console.log("modal:", isOpen);

  //*********************************** get part number in pchart_record tablr ***************
  const get_part_record = async () => {
    const date = moment(date_record)
    const mount = date.format("MM");
    const year = date.format("YYYY");
    
    try {
      const response_part = await axiosInstance.get(
        `/commons/get_part_record?line_id=${line_id}&mode=${mode}&mount=${mount}&year=${year}`
      );

      if (response_part.status === 200) {
        const part_no_record = response_part.data.map((item: any) => ({
          name: item.part_no,
        }));
        setPartNoRecord(part_no_record);
      }
    } catch (error) {
      console.log(error)
      return error;
    }
  };

  useEffect(() => {
    if (isOpen) {
      get_part_record();
    }
  }, [isOpen]);


  //******************************** save quantity defect to database ************************
  const save_np = async () => {
    try {
      const date = moment(date_record);
      const response_np = await axiosInstance.post("/commons/post_np", {
        mode: mode,
        part_no: partnumber,
        count: count,
        date_record: date.format("YYYY-MM-DD")
      });

      if (response_np.status === 200) {
        setCount(1);
      }
    } catch (error) {
      return error;
    }
  };

  //modal
  const handleOk = () => {
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  // select part no. for record
  useEffect(() => {
    if (isOpen) {
      setNamePart("");
    } else {
    }
  }, [onClose]);

  // save item.name in itemName
  const handleColor = (itemName: any) => {
    setNamePart(itemName);
  };

  //switch display
  const displayChange = () => {
    setVisible(!visible);
  };

  //numpad
  useEffect(() => {
    if (isOpen) {
      setCount(1);
    }
  }, [onClose]);

  const plus = () => {
    setCount(count + 1);
  };

  const minus = () => {
    let newCount = count - 1;
    if (newCount < 0) {
      return { newCount: 0 };
    } else {
      setCount(newCount);
    }
  };

  const handleClick = (button: any) => {
    setCount((prevCount) => parseInt(`${prevCount}${button.value}`));
  };

  const handleClear = () => {
    setCount(0);
  };

  const handleDelete = () => {
    setCount((prevCount: any) => {
      const countString = prevCount.toString();
      if (countString.length > 1) {
        return countString.slice(0, -1);
      } else {
        return 0;
      }
    });
  };

  return (
    <Modal
      className="modal"
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1500}
    >
      <span
        style={{ fontSize: "30px", display: "flex", justifyContent: "left" }}
      >
        Record
      </span>

      {/* search part no. */}
      <div>
        <div className="searchbox" style={{ padding: "5px", display: "flex" }}>
          <div className="search">
            <Form form={form}>
              <FormItem
                name="searchpart"
                label={
                  <span
                    className="line id"
                    style={{ fontSize: 25, justifyContent: "left" }}
                  >
                    {" "}
                    Part Number{" "}
                  </span>
                }
              >
                <Input
                  style={{ width: "300px" }}
                  placeholder="Search Part Number"
                ></Input>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  style={{ marginLeft: "5px" }}
                  onClick={get_part_record}
                ></Button>
              </FormItem>
            </Form>
          </div>

          {/* switch show numpad */}
          <div
            className="displaybox"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginLeft: "auto",
            }}
          >
            <Switch
              className="display"
              defaultChecked
              onChange={displayChange}
              size="default"
              style={{ width: "10px" }}
            />
          </div>
        </div>
      </div>

      {/* box show part no. */}
      <div
        className="boxpart"
        style={{ display: "flex", msFlexDirection: "row" }}
      >
        <div
          className="showpart"
          style={{
            border: "1px solid black",
            flex: visible ? "0 0 70%" : "0 0 100%",
            height: "300px",
          }}
        >
          <Flex wrap="wrap" gap="small">
            <Row gutter={[5, 5]}>
              {PartNoRecord.map((item: any) => (
                <Col
                  key={item.name}
                  className="gutter-row"
                  onClick={() => console.log(item.name)}
                >
                  <div
                    style={{
                      cursor: "default",
                      padding: "8px",
                      margin: "8px",
                      textAlign: "center",
                      width: "200px",
                      backgroundColor:
                        partnumber === item.name ? "red" : "#0092ff",
                    }}
                    onClick={() => handleColor(item.name)}
                  >
                    {item.name}
                  </div>
                </Col>
              ))}
            </Row>
          </Flex>
        </div>

        <div
          className="numpad"
          style={{
            display: visible ? "block" : "none",
            flex: "0 0 30%",
            flexDirection: "column",
            height: "300px",
          }}
        >
          <div className="row">
            <button type="button" onClick={() => handleClick({ value: 1 })}>
              1
            </button>
            <button type="button" onClick={() => handleClick({ value: 2 })}>
              2
            </button>
            <button type="button" onClick={() => handleClick({ value: 3 })}>
              3
            </button>
          </div>
          <div className="row">
            <button type="button" onClick={() => handleClick({ value: 4 })}>
              4
            </button>
            <button type="button" onClick={() => handleClick({ value: 5 })}>
              5
            </button>
            <button type="button" onClick={() => handleClick({ value: 6 })}>
              6
            </button>
          </div>
          <div className="row">
            <button type="button" onClick={() => handleClick({ value: 7 })}>
              7
            </button>
            <button type="button" onClick={() => handleClick({ value: 8 })}>
              8
            </button>
            <button type="button" onClick={() => handleClick({ value: 9 })}>
              9
            </button>
          </div>
          <div className="row">
            <button type="button" onClick={handleClear} title="Clear">
              <ClearOutlined />
            </button>
            <button type="button" onClick={() => handleClick({ value: 0 })}>
              0
            </button>
            <button type="button" onClick={handleDelete} title="Delete">
              <CloseSquareOutlined />
            </button>
          </div>
        </div>
      </div>

      {/* record data */}
      <div className="boxrecord">
        <div
          className="record"
          style={{ height: "60px", paddingTop: "10px", marginLeft: "250px" }}
        >
          <Form form={form}>
            <FormItem name="record_defect">
              <Space direction="horizontal">
                <Input
                  className="record_amount"
                  addonBefore="Amount:"
                  suffix="PC(s)"
                  value={count}
                />
                <Button
                  className="plus"
                  type="primary"
                  onClick={plus}
                  style={{ paddingLeft: "10px", height: "70px" }}
                >
                  <PlusOutlined />
                </Button>
                <Button
                  className="minus"
                  type="primary"
                  onClick={minus}
                  style={{ height: "70px" }}
                >
                  <MinusOutlined />
                </Button>
              </Space>
            </FormItem>
          </Form>
        </div>

        {/* Button save or close modal */}
        <div className="finalrecord">
          <Button
            className="save"
            type="primary"
            //TODO: เมื่อกด save ให้ทำการดึงข้อมูลออกมาเเสดงผลตามที่ทำการบันทึกไป
            onClick={() => 
              save_np
            }
            style={{ margin: "5px", marginLeft: "900px" }}
          >
            Save
          </Button>
          <Button className="close" type="primary" onClick={handleCancel}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Modalshow;
