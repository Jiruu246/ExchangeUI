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
import { Price } from '../interfaces/dto/Price';

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
  // scales: {
  //   x: {
  //     type: 'linear',
  //     ticks: {
  //       stepSize: 10,
  //     }
  //   }
  // }
};

interface PriceLineChartProps {
    prices: Price[];
}

const PriceLineChart: React.FC<PriceLineChartProps> = ({prices}) => {
    const data = {
        labels: prices.map(price => price.timestamp),
        datasets: [
            {
                label: 'Price',
                data: prices.map(price => price.close),
                fill: false,
                backgroundColor: 'rgb(0, 255, 0)',
                borderColor: 'rgba(0, 255, 0, 0.2)',
            },
        ],
    };

    return <Line options={options} data={data} />;
}

export default PriceLineChart;
