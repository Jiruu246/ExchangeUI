import React from 'react';

import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

import { Line } from 'react-chartjs-2';
import { Price } from '../interfaces/dto/Price';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
  scales: {
    x: {
      type : 'time' as const,
      ticks: {
        source: 'data' as const,
        callback: (value: any) => 
          new Date(roundToMinute(Number(value)) * 1000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }),
        // autoSkip: true,
      }
    }
  }
};

interface PriceLineChartProps {
    prices: Price[];
}

const roundToMinute= (timestamp: number): number => {
  return Math.round(timestamp / 60) * 60;
}

const PriceLineChart: React.FC<PriceLineChartProps> = ({prices}) => {
    const data = {
        labels: prices.map(price => price.Timestamp),
        datasets: [
            {
                label: 'Price',
                data: prices.map(price => price.Close),
                fill: false,
                backgroundColor: 'rgb(0, 255, 0)',
                borderColor: 'rgba(0, 255, 0, 0.2)',
            },
        ],
    };

    return <Line options={options} data={data} />;
}

export default PriceLineChart;
