"use client";
import { DualAxes } from "@ant-design/plots";
import { values } from "lodash";
import React from "react";
import ReactDOM from "react-dom";

interface DataMode {
  id: number;
  line_id: number;
  part_no: string;
  category: string;
  mode: string;
  quantity: number;
}
interface ParetoChartProps {
  datamode: DataMode[];
}

const ParetoChart: React.FC<ParetoChartProps> = ({ datamode }) => {
  const mode_quantity: any = {};
  datamode.forEach((data: any) => {
    if (!mode_quantity[data.mode]) {
      mode_quantity[data.mode] = 0; //? สร้าง key ใหม่ในกรณีที่ยังไม่มี
    }
    mode_quantity[data.mode] += data.quantity;
  });

  //TODO: กราฟแท่งของแต่ละ Defect Mode ยังไม่เรียงลำดับจากมากไปหาน้อย
  const ModeQuantityData = Object.entries(mode_quantity).map(
    ([mode, quantity]) => ({
      x: mode,
      value: quantity,
    })
  );

  const config = {
    scale: { y: { nice: false } },
    data: {
      type: "inline",
      //? Defect mode and Count
      value: ModeQuantityData,
      transform: [
        {
          type: "custom",
          callback: (data: any) => {
            const sum = data.reduce((r: any, curr: any) => r + curr.value, 0);
            return data
              .map((d: any) => ({
                ...d,
                percentage: d.value / sum,
              }))
              .reduce((r: any, curr: any) => {
                const v = r.length ? r[r.length - 1].accumulate : 0;
                const accumulate = v + curr.percentage;
                r.push({
                  ...curr,
                  accumulate,
                });
                return r;
              }, []);
          },
        },
      ],
    },
    xField: "x",
    children: [
      {
        type: "interval",
        yField: "value",
        scale: { x: { padding: 0.5 }, y: { domainMax: 312, tickCount: 5 } },
        style: {
          fill: "#78B3F0",
        },
        axis: { x: { title: null }, y: { title: "Defect frequency" } },
        labels: [
          {
            text: (d: any) => `${(d.percentage * 100).toFixed(2)}%`,
            textBaseline: "bottom",
          },
        ],
      },
      {
        type: "line",
        yField: "accumulate",
        scale: { y: { domainMin: 0, tickCount: 5 } },
        axis: {
          y: {
            position: "right",
            title: "% of Defect",
            grid: null,
            labelFormatter: (d: any) => `${(d * 100).toFixed(0)}%`,
          },
        },
        tooltip: {
          items: [
            {
              channel: "y",
              valueFormatter: (d: any) => `${(d * 100).toFixed(2)}%`,
            },
          ],
        },
      },
      {
        type: "point",
        yField: "accumulate",
        shapeField: "diamond",
        scale: { y: { domainMin: 0 } },
        axis: { y: false },
        tooltip: false,
      },
    ],
    title: "Pareto Chart",
  };
  return <DualAxes {...config} />;
};

export default ParetoChart;
