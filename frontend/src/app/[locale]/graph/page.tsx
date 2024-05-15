"use client";
import React, { useState, useRef, useEffect } from "react";
import Modalshow from "@/components/modal/Modal";
import { Table, DatePicker, Button, Form, Select, Radio, Input } from "antd";
import type { TableProps, DatePickerProps } from "antd";
import FormItem from "antd/es/form/FormItem";
import dayjs from "dayjs";
import DemoDualAxes from "@/components/chart/pareto";
import DemoDualAxesa from "@/components/chart/p_chart";
import html2canvas from "html2canvas";
import { SearchOutlined } from "@ant-design/icons";
import axiosInstance from "@/lib/axios";

import DrawerMode from "@/components/drawer_mode/drawer_mode";
import { values } from "lodash";
import { count } from "console";
import { text } from "stream/consumers";

const App: React.FC = () => {
  interface DataType {
    key: string;
    category: string;
    item: string;
    target: string;
  }

  const [form] = Form.useForm();
  const [ChangeChart, setTypeChart] = useState("p_chart");
  const ChartRef = useRef<HTMLDivElement>(null);
  const [LineName, setLineName] = useState<any>([]);
  const [PartNo, setPartNo] = useState<any>([]);
  const [DataList, setDataList] = useState<string>("");
  const [ModalOpen, setIsModalOpen] = useState(false);

  //*********************** function download chart to .jpg ************************
  const downloadChart = async () => {
    if (ChartRef.current) {
      try {
        const canvas = await html2canvas(ChartRef.current);
        const dataUrl = canvas.toDataURL("image/jpeg");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "chart_image.jpg";
        link.click();
        await navigator.clipboard.writeText(dataUrl);
        console.log("Chart saved as JPEG!");
      } catch (error) {
        console.error("Error saving chart:", error);
      }
    }
  };

  const unique = new Set();
  const distinct_linename = LineName.filter((entry: any) => {
    const isUnique = !unique.has(entry.line_id);
    unique.add(entry.line_id);
    return isUnique;
  });

  const distinct_part_no = PartNo.filter((entry: any) => {
    const isUnique = !unique.has(entry.part_no);
    unique.add(entry.part_no);
    return isUnique;
  });

  //************************************** get line name(api) ***************************
  const fetch_linename = async () => {
    try {
      const response_linename = await axiosInstance.get(
        "/commons/get_linename"
      );

      if (response_linename.status === 200) {
        setLineName(response_linename.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetch_linename();
  }, []);

  //****************************************** get part number(api) **********************
  const ShiftChange = async () => {
    try {
      const response_part = await axiosInstance.get("/commons/get_part_no");

      if (response_part.status === 200) {
        setPartNo(response_part.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //****************************************** get all data in database(api) **********************
  const get_data = async () => {
    const line_id = form.getFieldValue("LineName") || "0";
    const part_no = form.getFieldValue("Part Number") || "0";
    console.log("line_id", line_id);
    console.log("part_no", part_no);

    const response_data_all = await axiosInstance.get(
      "/commons/get_data_graph",
      {
        params: {
          line_id: line_id,
          part_no: part_no,
        },
      }
    );

    if (response_data_all.status === 200) {
      const data_repeat = response_data_all.data.filter(
        (item: { category: string }) => item.category === "Repeat"
      );
      

      console.log("repeat_mode", data_repeat);

      const data_scrap = response_data_all.data.filter(
        (item: { category: string }) => item.category === "Scrap"
      );
      console.log("scrap_mode", data_scrap);

      const data_repeat_ng = response_data_all.data.filter(
        (item: { category: string }) => item.category === "Repeat NG"
      );
      console.log("repeat_ng_mode", data_repeat_ng);
      // setDataList()

      const repeat_Count = data_repeat.length;
      console.log("จำนวนข้อมูลที่มี mode ที่เป็น Repeat:", repeat_Count);

      const scrap_Count = data_scrap.length;
      console.log("จำนวนข้อมูลที่มี mode ที่เป็น Scrap:", scrap_Count);

      const repeatNG_Count = data_repeat_ng.length;
      console.log("จำนวนข้อมูลที่มี mode ที่เป็น Repea NG:", repeatNG_Count);
    }
  };

  //switch chart
  const handleChangeChart = (value: any) => {
    setTypeChart(value.target.value);
  };

  //*********************************** function open modal ***************************
  const showModal = () => {
    setIsModalOpen(true);
  };

  const CloseModal = () => {
    setIsModalOpen(false);
  };


  //*********************************** function show date  ***************************
  const onChangeMonth: DatePickerProps["onChange"] = (date, dateString) => {
    const dayjsDate = dayjs(date);
    console.log(dayjsDate.format("MMMM YYYY"));
  };

  //column date
  const dateColumns = [];
  for (let i: number = 1; i <= 31; i++) {
    dateColumns.push({
      title: `${i}`,
      dataIndex: `${i}`,
      width: 60,
      key: "date",
      render: (text: string, record: any) => {
        if (
          record.category === "Repeat" || record.category === "Scrap" || record.category === "Repeat NG"){
          return <a onClick={showModal}> 0 </a>;
        }
      },
    });
  }

  //TODO: colspan depend on count mode defect
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Category",
      colSpan: 0,
      dataIndex: "category",
      key: "catogory",
      rowScope: "row",
      fixed: "left",
      width: "100px",
      onCell: (_, index) => {
        const indexcolspan = [3, 3, 3, 1, 1, 1, 3, 3, 3, 3, 3, 3];
        return { colSpan: indexcolspan[index as number] };
      },
    },
    {
      title: "Defective Item",
      dataIndex: "item",
      colSpan: 3,
      key: "item",
      fixed: "left",
      width: "300px",
      onCell: (record, index) => {
        const index_colspan = [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0];

        return {
          colSpan: index_colspan[index as number],
          //rowSpan: record.item !== undefined ? record.item : 1,

        };
      },
    },
    {
      title: "Target",
      key: "target",
      dataIndex: "target",
      fixed: "left",
      colSpan: 0,
      width: "70px",
      onCell: (_, index) => {
        const indexcolspan = [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0];
        return { colSpan: indexcolspan[index as number] };
      },
    },
    ...dateColumns,
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: "80px",
      onCell: (_, index) => {
        const indexcolspan = [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0];
        return { colSpan: indexcolspan[index as number] };
      },
      render: () => {
        
        return <span> {DataList} </span>;
      },
    },
  ];


  //TODO: Rotate text category
  //data in column
  const data: DataType[] = [
    { key: "1", category: "Prod. QTY (n)", item: "", target: "" },
    { key: "2", category: "Defect QTY (np)", item: "", target: "" },
    { key: "3", category: "Defect Ration", item: "", target: "" },
    { key: "4", category: "Repeat", item: "", target: "" },
    { key: "5", category: "Scrap", item: "", target: "" },
    { key: "6", category: "Repeat NG", item: "", target: "" },
    { key: "7", category: "MC Set Up", item: "", target: "" },
    { key: "8", category: "Quality Test", item: "", target: "" },
    { key: "9", category: "Record by: LL & TL", item: "", target: "" },
    { key: "10", category: "Review by: TL", item: "", target: "" },
    { key: "11", category: "Review by: AM-Mgr", item: "", target: "" },
    { key: "12", category: "Review by: AGM-GM", item: "", target: "" },
  ];

  return (
    <>
      <div className="header" style={{ margin: "30px" }}>
        <Form className="select_form" layout="inline" form={form}>
          <FormItem name="date" label={<span className="title"> Date </span>}>
            <DatePicker picker="month" onChange={onChangeMonth} />
          </FormItem>

          <FormItem
            name="LineName"
            label={<span className="title">Line Name</span>}
            rules={[
              {
                required: true,
                message: "Please Select Line name!",
              },
            ]}
          >
            <Select
              showSearch
              allowClear
              style={{ width: 300 }}
              placeholder="Select Line Name"
              onSelect={(value) => console.log("Selected line_id:", value)}
              onChange={(value) => console.log("Selected line_id:", value)}
            >
              {distinct_linename.map((item: any) => (
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
            name="Shift"
            label={<span className="title"> Shift </span>}
            rules={[
              {
                required: true,
                message: "Please Select Shift!",
              },
            ]}
          >
            <Radio.Group
              defaultValue="a"
              buttonStyle="solid"
              onChange={ShiftChange}
            >
              <Radio.Button value="a"> A </Radio.Button>
              <Radio.Button value="b"> B </Radio.Button>
            </Radio.Group>
          </FormItem>

          {/* TODO: check rules when part_no === undefiled */}
          <FormItem
            name="Part Number"
            label={<span className="title"> Part Number </span>}
            rules={[
              {
                required: true,
                message: "Please Select Part Number!",
              },
            ]}
          >
            <Select
              allowClear
              showSearch
              style={{ width: 200 }}
              placeholder="Select Part Number"
              onSelect={(value) => {
                console.log("Selected part number:", value);
              }}
              onChange={(value) => {
                console.log("Changed part number:", value);
              }}
            >
              {distinct_part_no.map((item: any) => (
                <Select.Option key={item.part_no} value={item.part_no}>
                  {item.part_no}
                </Select.Option>
              ))}
            </Select>
          </FormItem>

          <FormItem>
            {/* TODO: when click search button >>> show graph */}
            <Button
              type="primary"
              icon={<SearchOutlined />}
              style={{ width: "100px", marginLeft: "20px" }}
              onClick={get_data}
            >
              Search
            </Button>
          </FormItem>
        </Form>
      </div>

      <div className="switch_chart">
        <span>
          <Button
            type="primary"
            style={{ width: "200px", margin: "0px" }}
            onClick={downloadChart}
          >
            Dowload Image Chart
          </Button>
        </span>
        <span>
          <Radio.Group
            defaultValue="p_chart"
            buttonStyle="solid"
            onChange={handleChangeChart}
          >
            <Radio.Button value="p_chart"> P Chart </Radio.Button>
            <Radio.Button value="pareto"> Pareto Chart </Radio.Button>
          </Radio.Group>
        </span>
      </div>
      {ChangeChart === "pareto" ? (
        <div
          ref={ChartRef}
          style={{ backgroundColor: "white", margin: "10px" }}
        >
          <DemoDualAxes />
        </div>
      ) : (
        <div
          ref={ChartRef}
          style={{ backgroundColor: "white", margin: "10px" }}
        >
          <DemoDualAxesa />
        </div>
      )}

      {/* <Modalshow isOpen={{open}} /> */}
      <Table
        className="record_table"
        bordered
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ x: 500 }}
      />

      <Modalshow isOpen={ModalOpen} onClose={CloseModal} />
      {/* <Button type="primary" style={{ width: "100px", margin: "20px" }}>
        Save
      </Button> */}
    </>
  );
};
export default App;
