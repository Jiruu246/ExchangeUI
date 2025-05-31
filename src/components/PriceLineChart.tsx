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
import { color } from 'chart.js/helpers';

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const baseOptions = {
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
      grid: {
        color: 'rgb(245,245,245)',
      },
      type : 'time' as const,
      ticks: {
        source: 'data' as const,
        callback: (value: any) => 
          new Date(Number(value) * 1000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }),
      }
    },
    y: {
      grid: {
        color: 'rgb(245,245,245)',
      },
      suggestedMin: 0,
      suggestedMax: 0,
    },
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
        labels: prices.map(price => roundToMinute(price.Timestamp)),
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

    const minPrice = Math.min(...prices.map(price => price.Close));
    const maxPrice = Math.max(...prices.map(price => price.Close));

    baseOptions.scales.y = {
        suggestedMin: minPrice * 0.9, // 10% margin below
        suggestedMax: maxPrice * 1.1, // 10% margin above
    };

    return <Line options={baseOptions} data={data} />;
}

export default PriceLineChart;
