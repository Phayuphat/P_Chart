"use client";
import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import Modalshow from "@/components/modal/Modal";
import { Table, DatePicker, Button, Form, Select, Radio, Input } from "antd";
import type { TableProps, DatePickerProps } from "antd";
import FormItem from "antd/es/form/FormItem";
import ParetoChart from "@/components/chart/pareto";
import P_Chart from "@/components/chart/p_chart";
import html2canvas from "html2canvas";
import { SearchOutlined } from "@ant-design/icons";
import axiosInstance from "@/lib/axios";

import { toInteger, values } from "lodash";
import { count } from "console";
import { text } from "stream/consumers";
import Item from "antd/es/list/Item";

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
    total: number | null;
  }

  //? set state
  const ChartRef = useRef<HTMLDivElement>(null);
  const [form] = Form.useForm();
  const [ChangeChart, setTypeChart] = useState("p_chart");
  const [LineName, setLineName] = useState<any>([]);
  const [PartNo, setPartNo] = useState<any>([]);
  const [ModalOpen, setIsModalOpen] = useState(false);
  const [DataRepeat, setDataRepeat] = useState<any>([]);
  const [DataScrap, setDataScrap] = useState<any>([]);
  const [DataRepeatNG, setDataRepeatNG] = useState<any>([]);
  const [Approval, setApproval] = useState<any>([]);
  const [QTY, setQTY] = useState<any>([]);
  const [DateRecord, setDateRecord] = useState<any>([]);
  const [ModeRecord, setModeRecord] = useState<string>("");
  const [DataMode, setDataMode] = useState<any>([]);

  //? *********************** function download chart to file .jpg ************************
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
      } catch (error) {
        return error;
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

  const part_prop = PartNo.map((part: any) => part.part_no);

  //? ************************************** get line name(api) ***************************
  const fetch_linename = async () => {
    try {
      const response_linename = await axiosInstance.get(
        "/commons/get_linename"
      );

      if (response_linename.status === 200) {
        setLineName(response_linename.data);
      }
    } catch (error) {
      return error;
    }
  };

  //? useEffect ===> fetch line name when open website for first time
  useEffect(() => {
    fetch_linename();
  }, []);

  //? ****************************************** get part number(api) **********************
  const ShiftChange = async () => {
    try {
      const line_id = form.getFieldValue("LineName") || "0";

      const response_part = await axiosInstance.get(
        `/commons/get_part_no?line_id=${line_id}`
      );

      if (response_part.status === 200) {
        setPartNo(response_part.data);
      }
    } catch (err) {
      return err;
    }
  };

  //? ****************************************** get all data in database(api) **********************
  const get_data = async () => {
    const shift = form.getFieldValue("Shift");
    const date = form.getFieldValue("Date");

    //TODO:why don't use rules in form.item
    if (!date) {
      form.setFields([
        {
          name: "Date",
          errors: ["Please select Date"],
        },
      ]);
      return;
    }

    //? get prod.QTY(n)
    const line_id = form.getFieldValue("LineName") || "0";
    const part_no = form.getFieldValue("Part Number") || "0";
    const response_qty = await axiosInstance.get(
      `/commons/get_data_qty?mount=${date.format("MM")}&year=${date.format(
        "YYYY"
      )}`
    );
    setQTY(response_qty.data);

    //? get approval name
    const response_approval = await axiosInstance.get(
      "/commons/get_data_approval",
      {
        params: {
          year: date.format("YYYY"),
          mount: date.format("MM"),
          line_id: line_id,
        },
      }
    );
    setApproval(response_approval.data);

    //? get defect mode
    const response_data_all = await axiosInstance.get(
      "/commons/get_data_mode",
      {
        params: {
          year: date.format("YYYY"),
          mount: date.format("MM"),
          line_id: line_id,
          part_no: part_no,
        },
      }
    );

    if (response_data_all.status === 200) {
      setDataMode(response_data_all.data);
    }
    console.log("data mode:", DataMode);

    if (response_data_all.status === 200) {
      const data_repeat = response_data_all.data.filter(
        (item: { category: string }) => item.category === "Repeat"
      );
      setDataRepeat(data_repeat);

      const data_scrap = response_data_all.data.filter(
        (item: { category: string }) => item.category === "Scrap"
      );
      setDataScrap(data_scrap);

      const data_repeat_ng = response_data_all.data.filter(
        (item: { category: string }) => item.category === "Repeat NG"
      );
      setDataRepeatNG(data_repeat_ng);
    }
  };

  //? ************************************ function switch chart ********************************
  const handleChangeChart = (value: any) => {
    setTypeChart(value.target.value);
  };

  //? *********************************** function open modal ***************************
  const showModal = (day: number, mode: string) => {
    const date = form.getFieldValue("Date");
    const date_record = date.format("YYYY-MM-") + day;
    const mode_record = mode;
    setIsModalOpen(true);
    setDateRecord(date_record);
    setModeRecord(mode_record);
  };

  const CloseModal = () => {
    setIsModalOpen(false);
  };

  //TODO: ค่าที่เป็นการเเสดงผล,การคำนวณต่างๆ ควรเอามาไว้ข้างนอกเเล้วค่อยเรียกใช้เพื่อลดจำนวนวนลูป
  //? varible show in total column
  const dateColumns: any = [];
  let totalDefectQTY = 0;
  let totalProdQTY = 0;
  let totalDefectRatio = 0;
  let totalNumberCount = 0;

  // //? Calculate total defect row by row
  const total_quantity: any = {};
  DataMode.forEach((data: any) => {
    if (!total_quantity[data.id]) {
      total_quantity[data.id] = 0; //? สร้าง key ใหม่ในกรณีที่ยังไม่มี
    }
    total_quantity[data.id] += data.quantity;
  });


  for (let i = 1; i <= 31; i++) {
    let DefectQTY = 0;
    let ProdQTY = 0;
    let DefectRatio = 0;
    let NumberCount = 0;

    //TODO: สามารถใช้ค่า DataMode เเล้วเพิ่มเงื่อนไขในการวนลูปแทนได้ไหม
    //? Calculate varible in total colume ==> 1.Prod.QTY(n) 2.Defect.QTY(np) 3.DefectRation 4.Count Defect mode 5.MC Setup 6.Quality Test
    DataRepeat.forEach((data: any) => {
      const approval_date = new Date(data.record_date);
      if (approval_date.getDate() === i) {
        DefectQTY += data.quantity;
      }
    });

    //? forEach ===> loop all array
    DataScrap.forEach((data: any) => {
      const approval_date = new Date(data.record_date);
      if (approval_date.getDate() === i) {
        DefectQTY += data.quantity;
      }
    });

    DataRepeatNG.forEach((data: any) => {
      const approval_date = new Date(data.record_date);
      if (approval_date.getDate() === i) {
        DefectQTY += data.quantity;
      }
    });
    totalDefectQTY += DefectQTY;

    QTY.forEach((data: any) => {
      const approval_date = new Date(data.date);
      if (approval_date.getDate() === i) {
        ProdQTY += data.qty;
        if (data.qty !== 0) {
          NumberCount++;
        }
      }
    });
    totalProdQTY += ProdQTY;
    totalNumberCount += NumberCount;

    //? Calculate Defect Ratio per day === (n/np)*100
    QTY.forEach((data: any) => {
      const approval_date = new Date(data.date);
      if (approval_date.getDate() === i) {
        const calculatedRatio = ((DefectQTY / data.qty) * 100).toFixed(2);
        DefectRatio = parseFloat(calculatedRatio);
      }
    });
    totalDefectRatio += DefectRatio;

    //? Show data in table (i === date)
    dateColumns.push({
      title: `${i}`,
      dataIndex: `${i}`,
      width: 60,
      key: `${i}`,
      render: (_: any, item: any) => {
        if (
          item.category === "React" ||
          item.category === "Scrap" ||
          item.category === "Repeat NG"
        ) {
        }

        //? show Prod.QTY(n) in table
        const qty = QTY.find((data: any) => {
          const approval_date = new Date(data.date);
          return (
            item.category === "Prod. QTY(n)" && approval_date.getDate() === i
          );
        });

        if (qty) {
          return <span> {qty.qty} </span>;
        }

        //? show Defect.QTY(n) for mode in table
        const np_repeat = DataRepeat.find((data: any) => {
          const approval_date = new Date(data.record_date);
          return (
            item.category === data.category &&
            item.mode_id === data.id &&
            approval_date.getDate() === i
          );
        });

        if (np_repeat && item.category === "Repeat") {
          return (
            <a onClick={() => showModal(i, item.mode)}>
              {" "}
              {np_repeat.quantity}{" "}
            </a>
          );
        }

        const np_scrap = DataScrap.find((data: any) => {
          const approval_date = new Date(data.record_date);
          return (
            item.category === data.category &&
            item.mode_id === data.id &&
            approval_date.getDate() === i
          );
        });

        if (np_scrap && item.category === "Scrap") {
          return (
            <a onClick={() => showModal(i, item.mode)}> {np_scrap.quantity} </a>
          );
        }

        const np_repeat_ng = DataRepeatNG.find((data: any) => {
          const approval_date = new Date(data.record_date);
          return (
            item.category === data.category &&
            item.mode_id === data.id &&
            approval_date.getDate() === i
          );
        });

        if (np_repeat_ng && item.category === "Repeat NG") {
          return (
            <a onClick={() => showModal(i, item.mode)}>
              {np_repeat_ng.quantity}
            </a>
          );
        }

        //? show data approval in table
        const Data_Record = Approval.find((data: any) => {
          const approval_date = new Date(data.approval_date);
          return (
            item.category === "Record by:" + data.type &&
            approval_date.getDate() === i
          );
        });

        if (Data_Record) {
          return <span> {Data_Record.name} </span>;
        }

        const Data_Review = Approval.find((data: any) => {
          const approval_date = new Date(data.approval_date);
          return (
            item.category === "Review by:" + data.type &&
            approval_date.getDate() === i
          );
        });

        if (Data_Review) {
          return <span> {Data_Review.name} </span>;
        }

        if (
          item.category === "Repeat" ||
          item.category === "Scrap" ||
          item.category === "Repeat NG"
        ) {
          return <a onClick={() => showModal(i, item.mode)}> 0 </a>;
        } else if (
          item.category === "MC Set Up" ||
          item.category === "Quality Test"
        ) {
          return <span> </span>;
        } else if (item.category === "Defect Ratio") {
          return <span> {DefectRatio} </span>;
        } else if (item.category === "Prod. QTY(n)") {
          return <span> 0 </span>;
        } else if (item.category === "Defect QTY(np)") {
          return <span> {DefectQTY} </span>;
        }
        return null;
      },
    });
  }

  //? make array Repeat from DataRepeat for make object
  const Repeat =
    DataRepeat.length > 0
      ? Array.from(new Set(DataRepeat.map((item: any) => item.id))).map(
          (id, index) => {
            const item = DataRepeat.find((item: any) => item.id === id);
            return {
              key: (index + 4).toString(),
              category: "Repeat",
              mode_id: item.id,
              mode: item.mode || "",
              target: item.target || 0,
              total: total_quantity[item.id],
            };
          }
        )
      : [
          {
            key: "4",
            category: "Repeat",
            mode_id: null,
            mode: "",
            target: 0,
            total: 0,
          },
        ];

  const Scrap =
    DataScrap.length > 0
      ? Array.from(new Set(DataScrap.map((item: any) => item.id))).map(
          (id, index) => {
            const item = DataScrap.find((item: any) => item.id === id);
            return {
              key: (index + Repeat.length + 5).toString(),
              category: "Scrap",
              mode_id: item.id,
              mode: item.mode || "",
              target: item.target || 0,
              total: total_quantity[item.id],
            };
          }
        )
      : [
          {
            key: (Repeat.length + 5).toString(),
            category: "Scrap",
            mode_id: null,
            mode: "",
            target: 0,
            total: 0,
          },
        ];

  const RepeatNG =
    DataRepeatNG.length > 0
      ? Array.from(new Set(DataRepeatNG.map((item: any) => item.id))).map(
          (id, index) => {
            const item = DataRepeatNG.find((item: any) => item.id === id);
            return {
              key: (index + Repeat.length + Scrap.length + 6).toString(),
              category: "Repeat NG",
              mode_id: item.id,
              mode: item.mode || "",
              target: item.target || 0,
              total: total_quantity[item.id],
            };
          }
        )
      : [
          {
            key: (Repeat.length + Scrap.length + 6).toString(),
            category: "Repeat NG",
            mode_id: null,
            mode: "",
            target: 0,
            total: 0,
          },
        ];

  //TODO: ทำให้โค้ดสั้นลง และเข้าใจง่ายกว่านี้ ตรวจสอบการเขียนอีกครั้งหนึ่ง
  //? title column
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Defective Item",
      colSpan: 3,
      dataIndex: "category",
      key: "catogory",
      rowScope: "row",
      fixed: "left",
      width: "100px",
      onCell: (item: any, index) => {
        if (index === 0 || index === 1 || index === 2) {
          return { rowSpan: 1, colSpan: 3 };
        } else if (
          item.category === "MC Set Up" ||
          item.category === "Quality Test" ||
          item.category === "Record by:LL&TL" ||
          item.category === "Review by:TL" ||
          item.category === "Review by:AM-MGR" ||
          item.category === "Review by:AGM-GM"
        ) {
          return { rowSpan: 1, colSpan: 3 };
        } else if (Repeat.length === 0) {
          return { colSpan: 1 };
        } else if (index === 3) {
          return { rowSpan: Repeat.length };
        } else if (index === 3 + Repeat.length) {
          return { rowSpan: Scrap.length };
        } else if (index === 3 + Repeat.length + Scrap.length) {
          return { rowSpan: RepeatNG.length };
        } else {
          return { rowSpan: 0 };
        }
      },
    },
    {
      title: "Category",
      colSpan: 0,
      dataIndex: "mode",
      key: "catogory",
      // rowScope: "row",
      fixed: "left",
      width: "100px",
      onCell: (item: any, index) => {
        if (index === 0 || index === 1 || index === 2) {
          return { colSpan: 0 };
        } else if (
          item.category === "MC Set Up" ||
          item.category === "Quality Test" ||
          item.category === "Record by:LL&TL" ||
          item.category === "Review by:TL" ||
          item.category === "Review by:AM-MGR" ||
          item.category === "Review by:AGM-GM"
        ) {
          return { rowSpan: 1, colSpan: 0 };
        } else if (
          item.category === "Repeat" ||
          item.category === "Scrap" ||
          item.category === "Repeat NG"
        ) {
          return { rowSpan: 1, colSpan: 1 };
        }
        return {};
      },
    },
    {
      title: "Target",
      key: "target",
      dataIndex: "target",
      fixed: "left",
      colSpan: 0, //delete title table
      width: "70px",
      onCell: (item: any, index) => {
        if (index === 0 || index === 1 || index === 2) {
          return { colSpan: 0 };
        } else if (
          item.category === "MC Set Up" ||
          item.category === "Quality Test" ||
          item.category === "Record by:LL&TL" ||
          item.category === "Review by:TL" ||
          item.category === "Review by:AM-MGR" ||
          item.category === "Review by:AGM-GM"
        ) {
          return { rowSpan: 1, colSpan: 0 };
        }
        return {};
      },
    },
    ...dateColumns,
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: "80px",
    },
  ];

  //? calculate p-bar, n_bar, k, ucl, lcl
  let p_bar = (totalDefectQTY / totalProdQTY) * 100;
  //console.log("p bar:", p_bar);

  let k = ((p_bar * (100 - p_bar)) / totalProdQTY) ** (1 / 3);
  //console.log("k:", k)

  let n_bar = (totalProdQTY / totalNumberCount).toFixed(2);
  //console.log("n_bar:", n_bar)

  let ucl_p = parseFloat(p_bar.toFixed(2)) + parseFloat(k.toFixed(2));
  //console.log("ucl:", ucl_p)

  let lcl_p = parseFloat(p_bar.toFixed(2)) - parseFloat(k.toFixed(2));
  //console.log("lcl:", lcl_p)

  //TODO: หมุนตัวอักษรให้เป้นแนวตั้งของแต่ละ category
  //? data in table
  const data: DataObject[] = [
    {
      key: "1",
      category: "Prod. QTY(n)",
      mode: "",
      target: 0,
      total: totalProdQTY,
    },
    {
      key: "2",
      category: "Defect QTY(np)",
      mode: "",
      target: 0,
      total: totalDefectQTY,
    },
    {
      key: "3",
      category: "Defect Ratio",
      mode: "",
      target: 0,
      total: totalDefectRatio,
    },
    ...Repeat,
    ...Scrap,
    ...RepeatNG,
    {
      key: (Repeat.length + Scrap.length + RepeatNG.length + 7).toString(),
      category: "MC Set Up",
      mode: "",
      target: 0,
      total: 0,
    },
    {
      key: (Repeat.length + Scrap.length + RepeatNG.length + 8).toString(),
      category: "Quality Test",
      mode: "",
      target: 0,
      total: 0,
    },
    {
      key: (Repeat.length + Scrap.length + RepeatNG.length + 9).toString(),
      category: "Record by:LL&TL",
      mode: "",
      target: 0,
      total: null,
    },
    {
      key: (Repeat.length + Scrap.length + RepeatNG.length + 10).toString(),
      category: "Review by:TL",
      mode: "",
      target: 0,
      total: null,
    },
    {
      key: (Repeat.length + Scrap.length + RepeatNG.length + 11).toString(),
      category: "Review by:AM-MGR",
      mode: "",
      target: 0,
      total: null,
    },
    {
      key: (Repeat.length + Scrap.length + RepeatNG.length + 12).toString(),
      category: "Review by:AGM-GM",
      mode: "",
      target: 0,
      total: null,
    },
  ];

  //!==============================
  //console.log("mode:", DataMode)

  return (
    <>
      <div className="header" style={{ margin: "30px" }}>
        <Form className="select_form" layout="inline" form={form}>
          <Form.Item
            name="Date"
            label={<span className="title"> Date </span>}
            rules={[
              {
                required: true,
                message: "Pless Select Date!",
              },
            ]}
          >
            <DatePicker
              picker="month"
              onChange={(date) => console.log("date:", date.format("YYYY-MM"))}
            />
          </Form.Item>

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
              // onSelect={(value) => console.log("Selected line_id:", value)}
              // onChange={(value) => console.log("Selected line_id:", value)}
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
              // onSelect={(value) => {
              //   console.log("Selected part number:", value);
              // }}
              // onChange={(value) => {
              //   console.log("Changed part number:", value);
              // }}
            >
              {distinct_part_no.map((item: any) => (
                <Select.Option key={item.part_no} value={item.part_no}>
                  {item.part_no}
                </Select.Option>
              ))}
            </Select>
          </FormItem>

          <FormItem>
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
          <ParetoChart 
            datamode={DataMode} />
        </div>
      ) : (
        <div
          ref={ChartRef}
          style={{ backgroundColor: "white", margin: "10px" }}
        >
          {/* TODOL: นำค่ามาใส่ในตาราง */}
          <P_Chart 
            // data1={dataUCL}
            // data2={dataPbar}
            // data3={dataDefectRatio}
            // data4={dataDF}
            />
        </div>
      )} 

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

      {/* TODO: useSearchParams */}
      <Modalshow
        isOpen={ModalOpen}
        onClose={CloseModal}
        part_no={part_prop.toString("")}
        line_id={form.getFieldValue("LineName")}
        date_record={DateRecord}
        mode={ModeRecord}
      />
      {/* <Button type="primary" style={{ width: "100px", margin: "20px" }}>
        Save
      </Button> */}
    </>
  );
};
export default App;
