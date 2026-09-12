import { Check, ChefHat, Clock3, MapPin, ReceiptText } from 'lucide-react'
import { Link } from 'react-router-dom'
import Brand from '../components/Brand'
import { useApp } from '../state/AppContext'
import { formatCRC } from '../utils/currency'

export default function TrackOrderPage() {
  const { lastOrder } = useApp()
  if (!lastOrder) return <div className="tracking-page"><div className="tracking-card"><Brand /><h1>No hay un pedido reciente</h1><Link className="primary-button" to="/">Volver al menú</Link></div></div>

  return (
    <div className="tracking-page">
      <div className="tracking-card">
        <Brand />
        <div className="success-icon"><Check /></div>
        <p className="eyebrow">Pedido #{lastOrder.id}</p>
        <h1>¡Recibimos tu pedido!</h1>
        <p>Te avisaremos cuando esté listo para recoger.</p>
        <div className="order-progress">
          <div className="progress-step progress-step--active"><span><ReceiptText /></span><div><strong>Pedido recibido</strong><small>Lo estamos revisando</small></div></div>
          <div className="progress-line" />
          <div className="progress-step"><span><ChefHat /></span><div><strong>En preparación</strong><small>Pronto comenzaremos</small></div></div>
          <div className="progress-line" />
          <div className="progress-step"><span><Check /></span><div><strong>Listo para recoger</strong></div></div>
        </div>
        <div className="tracking-detail"><div><Clock3 /><span><small>Recogida</small><strong>{lastOrder.pickupTime}</strong></span></div><div><MapPin /><span><small>Lugar</small><strong>Contiguo a Cabinas Figurin</strong></span></div></div>
        <div className="total-row"><span>Total · {lastOrder.payment}</span><strong>{formatCRC(lastOrder.total)}</strong></div>
        <Link className="secondary-button secondary-button--full" to="/">Volver al menú</Link>
      </div>
    </div>
  )
}
