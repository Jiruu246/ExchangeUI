import { useEffect, useState } from 'react'
import './App.css'
import { OrderBook } from './interfaces/dto/OrderBook'
import OrderBookChart from './components/OrderBookChart'
import SeNumberInput from './components/SeNumberInput'
import PriceLineChart from './components/PriceLineChart'
import { Price } from './interfaces/dto/Price'

const API_URL = import.meta.env.VITE_API_URL

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [userId, setUserId] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null)
  const [prices, setPrices] = useState<Price[]>([])
  const [isBuy, setIsBuy] = useState<boolean>(true)
  const [marketOrder, setMarketOrder] = useState<boolean>(false)
  const [limit, setLimit] = useState<number | string>(0)
  const [unit, setUnit] = useState<number | string>(0)

  useEffect(() => {
    const orderBookSteam = new EventSource(`${API_URL}/order-book/stream`)
    const priceSteam = new EventSource(`${API_URL}/order-book/price-history`)

    orderBookSteam.onmessage = (event) => {
      const data : OrderBook = JSON.parse(event.data)
      setOrderBook(data)
    }

    priceSteam.onmessage = (event) => {
      const data : Price[] = JSON.parse(event.data)
      console.log(data)
      setPrices(data)
    }

    orderBookSteam.onerror = (event) => {
      setOrderBook(null)
      console.error(event)
      orderBookSteam.close()
    }

    priceSteam.onerror = (event) => {
      setPrices([])
      console.error(event)
      priceSteam.close()
    }

    return () => {
      orderBookSteam.close()
      priceSteam.close()
    }
  }, [])

  const handleLogin = async () => {
    const res = await fetch(`${API_URL}/user-verify/${userId}`)
    if (!res.ok) {
      setError('Server error')
      return
    }
    const data = await res.json()
    if (data.exists) {
      setLoggedIn(true)
      setError('')
    } else {
      setError('User does not exist')
    }
  }

  const bidMarket = () => {
    return orderBook?.bidOrders[0]?.limit ?? 0
  }

  const askMarket = () => {
    return orderBook?.askOrders[0]?.limit ?? 0
  }

  const handleCreateAccount = async () => {
    const res = await fetch(`${API_URL}/register`)
    if (!res.ok) {
      setError('Server error')
      return
    }

    const data = await res.json()
    setUserId(data.userId)
    setLoggedIn(true)
    setError('')
  }

  const placeOrder = async () => {
    const res = await fetch(`${API_URL}/${marketOrder? 'market-order' : 'limit-order'}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        unit,
        limit,
        buy: isBuy,
        marketOrder
      })
    })
    

    if (!res.ok) {
      setError('Server error')
      return
    }

    setLimit(0)
    setUnit(0)
  }

  return (
    <>
      <div className='flex flex-row gap-8'>
        {orderBook ?
          <div className='h-96 w-[50rem]'>
            <OrderBookChart orderBook={orderBook}/>
            <PriceLineChart prices={prices}/>
            <p>{(new Date(Number(String(prices[0].Timestamp)) * 1000)).toLocaleTimeString()} from {prices[0].Timestamp}</p>
          </div> :
          <h1>Loading...</h1>}
        
        {loggedIn ?
          <div className='flex flex-col gap-3 items-start max-w-[20rem]'>
            <p>Logged in as {userId}</p>
            <button onClick={() => {
              setLoggedIn(false)
              setUserId('')}}>Log out</button>
            <p className='font-bold text-2xl'>Place order</p>
            <div className='flex justtify-around w-full h-9'>
              <div onClick={() => {
                  setIsBuy(true)
                  if (marketOrder) setLimit(askMarket())}} 
                className={`flex-1 cursor-pointer flex items-center justify-center
                  ${isBuy ? 'bg-green-500 font-bold' : 'bg-[#333333] text-gray-500'}`}>BUY</div>
              <div onClick={() => {
                  setIsBuy(false)
                  if (marketOrder) setLimit(bidMarket())}} 
                className={`flex-1 cursor-pointer flex items-center justify-center
                  ${isBuy ? 'bg-[#333333] text-gray-500' : 'bg-red-500 font-bold'}`}>SELL</div>
            </div>
            <div className="flex w-full py-2">
              <div
                className={`px-4 py-2 relative cursor-pointer flex-1 ${
                  marketOrder
                    ? "text-white after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-[2px] after:bg-white"
                    : "text-gray-500"
                }`}
                onClick={() => {
                  setMarketOrder(true)
                  setLimit(isBuy? askMarket() : bidMarket())}}
              >
                Market
              </div>
              <div
                className={`px-4 py-2 relative cursor-pointer flex-1 ${
                  !marketOrder
                    ? "text-white after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-[2px] after:bg-white "
                    : "text-gray-500"
                }`}
                onClick={() => setMarketOrder(false)}
              >
                Limit
              </div>
            </div>
            <div>
              <p className='font-bold'><span className='text-green-500'>Bid ${bidMarket()}</span> / 
              <span className='text-red-500'>Ask ${askMarket()}</span></p>
            </div>
            <SeNumberInput 
              label="($) Price"
              value={limit}
              onChange={setLimit}
              className='w-full'
              disabled={marketOrder}/>
            <SeNumberInput
              label='(#) Unit'
              value={unit}
              onChange={setUnit}
              className='w-full'/>
            <hr className='w-full'/>
            <SeNumberInput
              label='($) Amount'
              value={(Number(limit) * Number(unit))}
              className='w-full'
              readOnly={true}/>
            <button onClick={placeOrder} className='w-full'>Place order</button>
          </div> :
          <div className='flex flex-col gap-3'>
            <p>Your user id:</p>
            <input
              type='text'
              value={userId}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setUserId(event.target.value)}}/>
            <div className='flex flex-row gap-3'>
              <button onClick={handleLogin}>Log in</button>
              <button onClick={handleCreateAccount}>Create new</button>
            </div>
          </div>}
        {error && <p>{error}</p>}
      </div>
    </>
  )
}

export default App
