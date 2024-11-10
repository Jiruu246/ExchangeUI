import React from "react";
import { Line } from "react-chartjs-2";
import { OrderBook } from "../interfaces/dto/OrderBook";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

interface OrderBookChartProps {
    orderBook: OrderBook;
}

const OrderBookChart: React.FC<OrderBookChartProps> = ({orderBook}) => {
    const bidOrders = [...orderBook.bidOrders].sort((a, b) => a.limit - b.limit);
    const askOrders = [...orderBook.askOrders].sort((a, b) => a.limit - b.limit);

    const bidPrices = bidOrders.map(order => order.limit.toFixed(2));
    const bidAmounts = bidOrders.map(order => order.volume);

    const askPrices = askOrders.map(order => order.limit.toFixed(2));
    const askAmounts = askOrders.map(order => order.volume);

    const data = {
        labels: [...bidPrices, ...askPrices],
        datasets: [
            {
                label: 'Bids',
                data: [...bidAmounts, ...Array(askPrices.length).fill(null)],
                fill: false,
                backgroundColor: 'rgb(0, 255, 0)',
                borderColor: 'rgba(0, 255, 0, 0.2)',
            },
            {
                label: 'Asks',
                data: [...Array(bidPrices.length).fill(null), ...askAmounts],
                fill: false,
                backgroundColor: 'rgb(255, 0, 0)',
                borderColor: 'rgba(255, 0, 0, 0.2)',
            },
        ],
    };

    return (
        <div className="w-full h-full">
            <Line 
                data={data} 
                options={{
                    responsive: true,
                    scales: {
                        x: {title: {display: true, text: 'Price'}},
                        y: {title: {display: true, text: 'Volume'}}
                    }}}/>
        </div>
    );
} 

export default OrderBookChart;