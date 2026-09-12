import { createContext, useContext, useMemo, useState } from 'react'
import { initialInventory, initialOrders } from '../data/menu'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState(initialOrders)
  const [inventory, setInventory] = useState(initialInventory)
  const [storeOpen, setStoreOpen] = useState(true)
  const [lastOrder, setLastOrder] = useState(null)

  const addToCart = (product, selections = [], notes = '', quantity = 1) => {
    const extrasTotal = selections.reduce((sum, option) => sum + option.price, 0)
    setCart((current) => [
      ...current,
      {
        lineId: crypto.randomUUID(),
        product,
        selections,
        notes,
        quantity,
        unitPrice: product.price + extrasTotal,
      },
    ])
  }

  const changeCartQuantity = (lineId, delta) => {
    setCart((current) =>
      current
        .map((item) => item.lineId === lineId ? { ...item, quantity: item.quantity + delta } : item)
        .filter((item) => item.quantity > 0),
    )
  }

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cart],
  )

  const placeOrder = ({ customer, phone, pickupTime, payment }) => {
    const order = {
      id: Math.max(...orders.map((item) => item.id), 1042) + 1,
      customer,
      phone,
      pickupTime,
      payment,
      items: cart.map((item) => `${item.quantity} ${item.product.name}`).join(', '),
      detail: cart,
      total: cartTotal,
      status: 'new',
      time: pickupTime,
      source: 'App',
    }
    setOrders((current) => [order, ...current])
    setLastOrder(order)
    setCart([])
    return order
  }

  const updateOrderStatus = (id, status) => {
    setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order))
  }

  const updateStock = (id, delta) => {
    setInventory((current) => current.map((item) => item.id === id ? { ...item, stock: Math.max(0, item.stock + delta) } : item))
  }

  return (
    <AppContext.Provider value={{
      cart, orders, inventory, storeOpen, lastOrder, cartTotal,
      addToCart, changeCartQuantity, placeOrder, updateOrderStatus,
      updateStock, setStoreOpen,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
