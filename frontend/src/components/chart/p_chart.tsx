"use client";
import React from "react";
import dynamic from "next/dynamic";
import type { DualAxesConfig } from "@ant-design/plots/es/components/dual-axes";
import { Empty } from "antd";

const P_Chart = dynamic(
  () => import("@ant-design/plots/es").then((mod) => mod.DualAxes),
  { ssr: false }
);
interface DefectData {
  day: number
  Defect_QTY: number
}
interface ProductData {
  day: number
  Prod_QTY: number
}
interface DefectRatioData {
  day: number
  DefectRatoin: number
}
interface referenceData {
  Defect_QTY: DefectData[];
  Prod_QTY: ProductData[];
  DefectRatio: DefectRatioData[];
}

export const DualPchart: React.FC<referenceData> = ({
  Defect_QTY,
  Prod_QTY,
  DefectRatio,
}) => {
  
  const defectRatios = Defect_QTY.map((defect: any) => {
    const prod = Prod_QTY.find((p: any) => p.day === defect.day);
    if (prod) {
      let ratio = ((defect.Defect_QTY / prod.Prod_QTY) * 100).toFixed(2);
      let ratioValue = parseFloat(ratio);
      if (isNaN(ratioValue)) {
        ratioValue = 0;
      }
      return { day: defect.day, ratio: ratioValue };
    }
    return { day: defect.day, ratio: 0 };
  });
  


  const data4 = Defect_QTY;
  const data3 = defectRatios

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
      color: { range: ["#F08080", "#FFFFFF", "#90EE90", "#1E90FF","#1115"] }, //DefectRatio,Pbar,UCL,Pbar1,UCL1
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
        //data: data1,
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
        //data: data2,
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
            labelFormatter: (d: any) => `${d.toFixed(1)}`,
          },
        },
      },
      {
        //Defectratio
        //data: data3,
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
      {/* {data1.length !== 0 ? (
        <P_Chart {...config} />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={"Plese select the data and summit"}
        />
      )} */}
    </div>
  );
};

export default P_Chart;