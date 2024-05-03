"use client";
import React, { useState, useRef, useEffect } from "react";
import DrawerMode from "@/components/drawer_mode/drawer_mode";
import Modalshow from "@/components/modal/Modal";
import {
  Table,
  DatePicker,
  Button,
  Form,
  Select,
  Radio,
} from "antd";
import type { TableProps, DatePickerProps } from "antd";
import FormItem from "antd/es/form/FormItem";
import dayjs from "dayjs";
import DemoDualAxes from "@/components/chart/pareto";
import DemoDualAxesa from "@/components/chart/p_chart";
import html2canvas from "html2canvas";
import {
  SearchOutlined,
} from "@ant-design/icons";
import axiosInstance from "@/lib/axios";



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
  const [LineName, setLineName] = useState<any>([])
  const [Shift, setShift] = useState<any>([])
  const [PartNumber, setPartNumber] =useState<any>([])

  //dowload image chart
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
    return isUnique
  })
  
  const fetch_linename = async () => {
    try {
      const response_linename = await axiosInstance.get("/commons/get_linename");

      if (response_linename.status === 200 ){
        setLineName(response_linename.data);
      }
    } catch (err){
      console.log(err);
    }
  }

  useEffect(() => {
    fetch_linename();
  }, []);


  const LineNameChange = async (value: any) => {
    // console.log("Selected line name:", value);
    try {
      const response_shift = await axiosInstance.get("/commons/get_shift");

      if (response_shift.status === 200 ){
        setShift(response_shift.data);
      }
    } catch (err){
      console.log(err);
    }
  }


  const ShiftChange = async () => {
    try {
      const response_part = await axiosInstance.get("/commons/get_part_no");

      if (response_part.status === 200 ){
        setPartNumber(response_part.data);
      }
    } catch (err){
      console.log(err);
    }
  }
  
  //check value part number
  const handleSelectChange = (value: any) => {
    console.log("Selected Part Number:", value);
  };

  //switch chart
  const handleChangeChart = (value: any) => {
    setTypeChart(value.target.value);
  };
  
  //date
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
      onCell: (_, index) => {
        const indexcolspan = [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0];
        return { colSpan: indexcolspan[index as number] };
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
    },
  ];

  //TODO: Rotate text category
  //data in column
  const data: DataType[] = [
    { key: "1", category: "Prod. QTY(n)", item: "", target: "" },
    { key: "2", category: "Defect QTY(np)", item: "", target: "" },
    { key: "3", category: "Defect Ration", item: "", target: "" },
    { key: "4", category: "Finishing & Repeat", item: "", target: "" },
    { key: "5", category: "Mode Scrap", item: "", target: "" },
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
        <Form className="select_form" layout="inline">
          <FormItem name="date" label={<span className="title">Date</span>}>
            <DatePicker picker="month" onChange={onChangeMonth} />
          </FormItem>

          <FormItem
            name="line_name"
            label={<span className="title">Line Name</span>}
            rules={[{ 
              required: true, 
              message: "Please Select Line name!" 
            }]}
          >

            <Select
              showSearch
              allowClear
              style={{ width: 300 }}
              placeholder="Select Line Name"
              onChange={LineNameChange}
              onSelect={LineNameChange}
              optionLabelProp="children"
              filterOption = {(input, option) => 
                ((option?.label as string) ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
              }
            >
              {distinct_linename.map((item: any) => (
                <Select.Option
                  key = {item.line_id}
                  value = {item.line_id}
                  // lable = {item.line_name}
                  >
                    {item.line_name}
                </Select.Option>
              ))}
            </Select>
          </FormItem>

          <FormItem
            name="shift"
            label={<span className="title">Shift</span>}
            rules={[{ 
              required: true, 
              message: "Please Select Shift!" 
            }]}
          >
            <Select
              allowClear
              showSearch
              style={{ width: 150 }}
              placeholder="Select Shift"
              onChange={ShiftChange}
              onSelect={ShiftChange}
            >
              {Shift.map((shift: any) => (
                <Select.Option 
                  key={shift.shift_id} 
                  value={shift.shift_name}
                >
                  {shift.shift_name}
                </Select.Option>
              ))}
            </Select>
          </FormItem>

          {/* TODO: check rules when part_no === undefiled */}
          <FormItem
            name="part"
            label={<span className="title"> Part Number </span>}
            rules={[{
              required: true,
              message: "Please Select Part Number!" 
            }]}
          >
            <Select
              allowClear
              showSearch
              style={{ width: 200 }}
              placeholder="Select Part Number"
              onChange={(value) => handleSelectChange(value)}
              onSelect={(value) => handleSelectChange(value)}
            >
              {PartNumber.map((part: any) => (
                <Select.Option 
                  key={part.part_no} 
                  value={part.part_no}
                >
                  {part.part_no}
                </Select.Option>
              ))}
            </Select>
          
            {/* TODO: when click search button >>> show graph */}
            <Button
              type="primary"
              icon={<SearchOutlined />}
              style={{ width: "100px", marginLeft: "20px" }}
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
            <Radio.Button value="p_chart">P Chart</Radio.Button>
            <Radio.Button value="pareto">Pareto Chart</Radio.Button>
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
      <DrawerMode />
      {/* TODO: test modal */}
      {/* <Modalshow isOpen={{open}} /> */}
      <Table
        className="record_table"
        bordered
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ x: 500 }}
      />

      <Button type="primary" style={{ width: "100px", margin: "20px" }}>
        Save
      </Button>
    </>
  );
};
export default App;
