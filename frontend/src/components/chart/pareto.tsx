"use client"
import { DualAxes } from '@ant-design/plots';
import React from 'react';
import ReactDOM from 'react-dom';

const DemoDualAxes = () => {
  const config = {
    scale: { y: { nice: false } },
    data: {
      type: 'inline',
      value: [
        { x: 'Parking Difficult', value: 95 },
        { x: 'Sales Rep was Rude', value: 60 },
        { x: 'Poor Lighting', value: 45 },
        { x: 'Layout Confusing', value: 37 },
        { x: 'Sizes Limited', value: 30 },
        { x: 'Clothing Faded', value: 27 },
        { x: 'Clothing Shrank', value: 18 },
      ],
      transform: [
        {
          type: 'custom',
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
    xField: 'x',
    children: [
      {
        type: 'interval',
        yField: 'value',
        scale: { x: { padding: 0.5 }, y: { domainMax: 312, tickCount: 5 } },
        style: { fill: (d: any) => (d.percentage < 0.1 ? '#E24B26' : '#78B3F0') },
        axis: { x: { title: null }, y: { title: 'Defect frequency' } },
        labels: [
          {
            text: (d: any) => `${(d.percentage * 100).toFixed(1)}%`,
            textBaseline: 'bottom',
          },
        ],
      },
      {
        type: 'line',
        yField: 'accumulate',
        scale: { y: { domainMin: 0, tickCount: 5 } },
        axis: {
          y: {
            position: 'right',
            title: 'Cumulative Percentage',
            grid: null,
            labelFormatter: (d: any) => `${(d * 100).toFixed(0)}%`,
          },
        },
        tooltip: {
          items: [{ channel: 'y', valueFormatter: (d: any) => `${(d * 100).toFixed(2)}%` }],
        },
      },
      {
        type: 'point',
        yField: 'accumulate',
        shapeField: 'diamond',
        scale: { y: { domainMin: 0 } },
        axis: { y: false },
        tooltip: false,
      },
    ],
    title: 'Pareto Chart of Customer Complaints',
  };
  return <DualAxes {...config} />;
};


export default DemoDualAxes;