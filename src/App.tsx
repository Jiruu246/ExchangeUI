import { useEffect, useState } from 'react'
import './App.css'
import { OrderBook } from './interfaces/dto/OrderBook'
import OrderBookChart from './components/OrderBookChart'

const API_URL = import.meta.env.VITE_API_URL

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [userId, setUserId] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null)
  const [isBuy, setIsBuy] = useState<boolean>(true)
  const [marketOrder, setMarketOrder] = useState<boolean>(false)
  const [limit, setLimit] = useState<number>(0)
  const [unit, setUnit] = useState<number>(0)

  useEffect(() => {
    const eventSource = new EventSource(`${API_URL}/order-book/stream`)

    eventSource.onmessage = (event) => {
      const data : OrderBook = JSON.parse(event.data)
      setOrderBook(data)
    }

    eventSource.onerror = (event) => {
      setOrderBook(null)
      console.error(event)
      eventSource.close()
    }

    return () => {
      eventSource.close()
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
          <div className='h-96 w-[100rem]'>
            <OrderBookChart orderBook={orderBook}/>
          </div> :
          <h1>Loading...</h1>}
        
        {loggedIn ?
          <div className='flex flex-col gap-3 items-start'>
            <div className='flex flex-row'>
              <p>Logged in as {userId}</p>
              <button onClick={() => {
                setLoggedIn(false)
                setUserId('')}}>Log out</button>
            </div>
            <p className='font-bold text-2xl'>Place order</p>
            <label>
              <input className='mr-3' type='checkbox' checked={isBuy} onChange={() => setIsBuy(!isBuy)}/> 
              Buy Order</label>
            <label>
              <input className='mr-3' type='checkbox' checked={marketOrder} onChange={() => setMarketOrder(!marketOrder)}/>
              Market Order</label>
            <label>
              Unit:
              <input
                className='ml-3'
                type='number'
                value={unit}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setUnit(Number(event.target.value))}}/>
            </label>
            {marketOrder ?
              <p>Price will be determined at market price</p> :
              <label>
                Limit:
                <input
                  className='ml-3'
                  type='number'
                  value={limit}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setLimit(Number(event.target.value))}}/>
              </label>}
            <button onClick={placeOrder}>Place order</button>
          </div> :
          <div className='flex flex-col gap-3'>
            <input
              type='text'
              value={userId}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setUserId(event.target.value)}}/>
            <div className='flex flex-row gap-3'>
              <button onClick={handleLogin}>Log in</button>
              <button onClick={handleCreateAccount}>Create new account</button>
            </div>
          </div>}
        {error && <p>{error}</p>}
      </div>
    </>
  )
}

export default App
