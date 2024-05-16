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
    mode: string;
    target: number;
  }
  interface DataObject {
    key: string;
    category: string;
    mode: string | string[];
    target: number | number[];
  }

  const [form] = Form.useForm();
  const [ChangeChart, setTypeChart] = useState("p_chart");
  const ChartRef = useRef<HTMLDivElement>(null);
  const [LineName, setLineName] = useState<any>([]);
  const [PartNo, setPartNo] = useState<any>([]);
  const [ModalOpen, setIsModalOpen] = useState(false);
  const [DataRepeat, setDataRepeat] = useState([]);
  const [DataScrap, setDataScrap] = useState([]);
  const [DataRepeatNG, setDataRepeatNG] = useState([]);
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
      setDataRepeat(data_repeat);

      const data_scrap = response_data_all.data.filter(
        (item: { category: string }) => item.category === "Scrap"
      );
      console.log("scrap_mode", data_scrap);
      setDataScrap(data_scrap);

      const data_repeat_ng = response_data_all.data.filter(
        (item: { category: string }) => item.category === "Repeat NG"
      );
      console.log("repeat_ng_mode", data_repeat_ng);
      setDataRepeatNG(data_repeat_ng);

      const repeat_Count = data_repeat.length;
      console.log("Count Repeat Mode:", repeat_Count);

      const scrap_Count = data_scrap.length;
      console.log("Count Scrap Mode:", scrap_Count);

      const repeatNG_Count = data_repeat_ng.length;
      console.log("Count Repeat NG Mode:", repeatNG_Count);
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
      render: (text: any, record: any) => {
        if (record.category === "Repeat" && `${i}` === "15") {
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
        if (index === 3 || index === 6 || index === 7) {
          return { colSpan: 1 };
        } else if (index === 4) {
          return { colSpan: 1 };
        } else if (index === 5) {
          return { colSpan: 1 };
        } else {
          return { colSpan: 3 };
        }
      },
    },
    {
      title: "Defective Item",
      dataIndex: "mode",
      colSpan: 3,
      key: "mode",
      fixed: "left",
      width: "300px",
      onCell: (_, index) => {
        if (index === 3 || index === 4 || index === 5 || index === 6 || index === 7) {
          return { colSpan: 1 };
        } else {
          return { colSpan: 0 };
        }
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
        if (index === 3 || index === 4 || index === 5 || index === 6 || index === 7) {
          return { colSpan: 1 };
        } else {
          return { colSpan: 0 };
        }
      },
    },
    ...dateColumns,
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: "80px",
      onCell: (_, index) => {
        if (index === 8 || index === 9 || index === 10 || index === 11) {
          return { colSpan: 1 };
        } else {
          return { colSpan: 1 };
        }
      },
    },
  ];

  //TODO: Rotate text category
  const data: DataObject[] = [
    { key: "1", category: "Prod. QTY(n)", mode: "", target: 0 },
    { key: "2", category: "Defect QTY(np)", mode: "", target: 0 },
    { key: "3", category: "Defect Ratio", mode: "", target: 0 },
  
    ...(DataRepeat && DataRepeat.length > 0
      ? DataRepeat.map((item: any, index) => ({
          key: (index + 4).toString(),
          category: "Repeat",
          mode: item.mode || "",
          target: item.target || 0,
        }))
      : [
          {
            key: "4",
            category: "Repeat",
            mode: "",
            target: 0,
          },
        ]),
  
    ...(DataScrap && DataScrap.length > 0
      ? DataScrap.map((item: any, index) => ({
          key: (index + DataRepeat.length + 5).toString(),
          category: "Scrap",
          mode: item.mode || "",
          target: item.target || 0,
        }))
      : [
          {
            key: (DataRepeat.length + 5).toString(),
            category: "Scrap",
            mode: "",
            target: 0,
          },
        ]),
  
    ...(DataRepeatNG && DataRepeatNG.length > 0
      ? DataRepeatNG.map((item: any, index) => ({
          key: (index + DataRepeat.length + DataScrap.length + 6).toString(),
          category: "Repeat NG",
          mode: item.mode || "",
          target: item.target || 0,
        }))
      : [
          {
            key: (DataRepeat.length + DataScrap.length + 6).toString(),
            category: "Repeat NG",
            mode: "",
            target: 0,
          },
        ]),
  
    { key: (DataRepeat.length + DataScrap.length + DataRepeatNG.length + 7).toString(), category: "MC Set Up", mode: "", target: 0 },
    { key: (DataRepeat.length + DataScrap.length + DataRepeatNG.length + 8).toString(), category: "Quality Test", mode: "", target: 0 },
    { key: (DataRepeat.length + DataScrap.length + DataRepeatNG.length + 9).toString(), category: "Record by: LL & TL", mode: "", target: 0 },
    { key: (DataRepeat.length + DataScrap.length + DataRepeatNG.length + 10).toString(), category: "Review by: TL", mode: "", target: 0 },
    { key: (DataRepeat.length + DataScrap.length + DataRepeatNG.length + 11).toString(), category: "Review by: AM-Mgr", mode: "", target: 0 },
    { key: (DataRepeat.length + DataScrap.length + DataRepeatNG.length + 12).toString(), category: "Review by: AGM-GM", mode: "", target: 0 },
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
                <Select.Option key={item.line_id} value={item.line_id}>
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
              defaultValue=""
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
          {/* <Button
            type="primary"
            style={{ width: "200px", margin: "0px" }}
            onClick={downloadChart}
          >
            Dowload Image Chart
          </Button> */}
        </span>
        <span>
          {/* <Radio.Group
            defaultValue="p_chart"
            buttonStyle="solid"
            onChange={handleChangeChart}
          >
            <Radio.Button value="p_chart"> P Chart </Radio.Button>
            <Radio.Button value="pareto"> Pareto Chart </Radio.Button>
          </Radio.Group> */}
        </span>
      </div>
      {/* {ChangeChart === "pareto" ? (
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
      )} */}

      {/* <Modalshow isOpen={{open}} /> */}
      <Table
        className="record_table"
        bordered
        columns={columns as any}
        dataSource={data}
        pagination={false}
        scroll={{ x: 500 }}
        onRow={(record) => ({
          onClick: () => console.log("datarow:", record),
        })}
      />

      <Modalshow isOpen={ModalOpen} onClose={CloseModal} />
      {/* <Button type="primary" style={{ width: "100px", margin: "20px" }}>
        Save
      </Button> */}
    </>
  );
};
export default App;
