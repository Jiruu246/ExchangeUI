import { Limit } from './Limit';

export interface OrderBook {
    bidOrders: Limit[];
    askOrders: Limit[];
}