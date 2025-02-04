import React from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Line } from 'react-chartjs-2';
import { PriceSimple } from '../interfaces/dto/PriceSimple';

ChartJS.register(
  CategoryScale,
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
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [65, 59, 80, 81, 56, 55, 40],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: [28, 48, 40, 19, 86, 27, 90],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

interface PriceLineChartProps {
    prices: PriceSimple[];
}

const PriceLineChart: React.FC<PriceLineChartProps> = ({prices}) => {
    const data = {
        labels: prices.map(price => price.timestamp),
        datasets: [
            {
                label: 'Price',
                data: prices.map(price => price.price),
                fill: false,
                backgroundColor: 'rgb(0, 255, 0)',
                borderColor: 'rgba(0, 255, 0, 0.2)',
            },
        ],
    };

    return <Line options={options} data={data} />;
}

export default PriceLineChart;
