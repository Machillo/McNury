import { useState } from 'react'
import { ArrowLeft, Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import { formatCRC } from '../utils/currency'

export default function CartSheet({ open, onClose }) {
  const { cart, cartTotal, changeCartQuantity, placeOrder } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState('cart')
  const [form, setForm] = useState({ customer: '', phone: '', pickupTime: 'Lo antes posible', payment: 'Pagar al recoger' })

  if (!open) return null

  const checkout = (event) => {
    event.preventDefault()
    placeOrder(form)
    onClose()
    navigate('/pedido')
  }

  return (
    <div className="modal-backdrop modal-backdrop--right" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="cart-sheet" role="dialog" aria-modal="true" aria-label="Tu pedido">
        <header className="sheet-header">
          {step === 'checkout' ? <button className="icon-button" onClick={() => setStep('cart')}><ArrowLeft /></button> : <span className="sheet-header__icon"><ShoppingBag /></span>}
          <div><h2>{step === 'cart' ? 'Tu pedido' : 'Confirmar pedido'}</h2><p>Solo para recoger</p></div>
          <button className="icon-button" onClick={onClose}><X /></button>
        </header>

        {step === 'cart' && (
          <>
            <div className="cart-sheet__items">
              {cart.length === 0 && <div className="empty-state"><span>🍟</span><h3>Tu carrito está vacío</h3><p>Agregá algo rico del menú.</p></div>}
              {cart.map((item) => (
                <div className="cart-item" key={item.lineId}>
                  <div className={`cart-item__emoji visual--${item.product.color}`}>{item.product.emoji}</div>
                  <div className="cart-item__detail">
                    <h3>{item.product.name}</h3>
                    {item.selections.length > 0 && <p>{item.selections.map((choice) => choice.name).join(', ')}</p>}
                    {item.notes && <p>“{item.notes}”</p>}
                    <strong>{formatCRC(item.unitPrice * item.quantity)}</strong>
                  </div>
                  <div className="quantity-control quantity-control--small">
                    <button onClick={() => changeCartQuantity(item.lineId, -1)}><Minus size={14} /></button>
                    <strong>{item.quantity}</strong>
                    <button onClick={() => changeCartQuantity(item.lineId, 1)}><Plus size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
            <footer className="sheet-footer">
              <div className="total-row"><span>Total</span><strong>{formatCRC(cartTotal)}</strong></div>
              <button className="primary-button primary-button--full" disabled={!cart.length} onClick={() => setStep('checkout')}>Continuar</button>
            </footer>
          </>
        )}

        {step === 'checkout' && (
          <form className="checkout-form" onSubmit={checkout}>
            <label><span>Nombre</span><input required value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} placeholder="¿A nombre de quién?" /></label>
            <label><span>Teléfono</span><input required inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="8888-8888" /></label>
            <label><span>Hora de recogida</span><select value={form.pickupTime} onChange={(e) => setForm({ ...form, pickupTime: e.target.value })}><option>Lo antes posible</option><option>En 30 minutos</option><option>En 45 minutos</option><option>En 1 hora</option></select></label>
            <fieldset className="payment-options"><legend>¿Cómo querés pagar?</legend>{['Pagar al recoger', 'SINPE al recoger', 'Tarjeta en la app'].map((method) => <label key={method} className={form.payment === method ? 'payment-card payment-card--selected' : 'payment-card'}><input type="radio" name="payment" value={method} checked={form.payment === method} onChange={(e) => setForm({ ...form, payment: e.target.value })} /><span><strong>{method}</strong><small>{method === 'Tarjeta en la app' ? 'Disponible en una próxima versión' : 'Efectivo o SINPE al llegar'}</small></span></label>)}</fieldset>
            <div className="checkout-summary"><span>Total del pedido</span><strong>{formatCRC(cartTotal)}</strong></div>
            <button className="primary-button primary-button--full" type="submit">Confirmar pedido</button>
          </form>
        )}
      </aside>
    </div>
  )
}
