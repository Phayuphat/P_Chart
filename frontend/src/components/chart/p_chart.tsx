"use client";
import React from "react";
import dynamic from "next/dynamic";
import type { DualAxesConfig } from "@ant-design/plots/es/components/dual-axes";
import { Empty } from "antd";

const DualAxes = dynamic(
  () => import("@ant-design/plots/es").then((mod) => mod.DualAxes),
  { ssr: false }
);

interface A1 {
  date: string;
  type: any;
  value: number;
}
interface UCL_ {
  data1: A1[];
}

interface A2 {
  date: string;
  type: any;
  value: number;
}
interface Pbar_ {
  data2: A2[];
}

interface A3 {
  date: string;
  type: any;
  value: number;
}
interface DefectRatio_ {
  data2: A3[];
}

interface A4 {
    date: string;
    type: any;
    value1: number;
}
interface Defect_ {
    data4: A4[];
}

interface referenceData {
  data1: any;
  data2: any;
  data3: any;
  data4: any;
}

export const DualPchart: React.FC<referenceData> = ({
  data1,
  data2,
  data3,
  data4,
}) => {
  console.log("data1:", data1);
  console.log("data2:", data2);
  console.log("data3:", data3);
  console.log("data4:", data4);

  const config: DualAxesConfig = {
    tooltip: {
      title: "date",
      items: [{ channel: "y" }],
    },
    xField: "date",
    axis: {
      x: {
        title: "Date",
        line: true,
        // lineStroke: "black", //"#000000"
        labelStroke: "#000",
        //labelFill:"black",
        lineLineWidth: 2,
        labelFontSize: 16,
        titleFontSize: 18,
        titleStroke: "black",
      },
      // y:{title: "Defect Ratio (%)",}
    },

    scale: {
      //? ucl, pbar last month, defect ratio, defect count
      color: { range: ["#F08080", "#000000", "#90EE90", "#1E90FF"] }, 
    },

    // legend: false,

    title: {
      title: "P-Chart (In-Line Defect)",
      style: {
        titleFontSize: 20,
      },
    },
    children: [
      {
        //UCL
        data: data1,
        type: "point", //point
        yField: "value", //value
        colorField: "type",
        axis: { y: false},
        // @ts-ignore
        sizeField: 10,
        shapeField: "hyphen", //line

        style: { lineWidth: 6 },
      },
      {
        //Pbar
        data: data2,
        type: "line",
        yField: "value",
        colorField: "type",
        //shapeField: 'line',
        axis: { y: false },
        // style: { lineWidth: 8,},
        //shapeField: "vh" ,
        style: { lineWidth: 4, lineDash: [25, 10] },
      },
      {
        //Defectratio
        data: data3,
        type: "line",
        yField: "value",
        colorField: "type",
        //shapeField: 'line',
        //axis: { y: false},
        style: { lineWidth: 4 },
        axis: {
          y: {
            title: "Defect Ratio (%)",
            line: true,
            lineLineWidth: 2,
            lineStroke: "#000000",
            labelStroke: "#000000",
            titleStroke: "black",
            labelFontSize: 16,
            titleFontSize: 18,
            // labelFormatter: (d: any) => `${d.toFixed(1)}`,
          },
        },
      },
      {
        //Defectratio
        data: data3,
        type: "point",
        yField: "value",
        colorField: "type",

        //@ts-ignore
        sizeField: 6,
        shapeField: "point", //line
        axis: { y: false },
      },
      {
        data: data4,
        type: "interval",
        yField: "value1",
        colorField:"type",
        axis: {
            y: {
              position: "right",
              title: "pc (s)",
              labelFontSize: 16,
              titleFontSize: 18,
              labelStroke: "black",
              titleStroke: "black",
              line: true,
              lineLineWidth: 2,
              grid: null,
            }, 
          },
        scale: {
          y: {
            type: "linear",
            domain: [0, 50], //fix scale
          },
        },
      },
    ],
  };

  return (
    <div>
      {data1.length !== 0 ? (
        <DualAxes {...config} />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={"Plese select the data and summit"}
        />
      )}
    </div>
  );
};