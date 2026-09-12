import { useMemo, useState } from 'react'
import {
  AlertTriangle, ArrowLeft, BarChart3, Bell, Check, ChevronRight, CircleDollarSign,
  ClipboardList, Clock3, Minus, Package, Plus, ReceiptText, ShoppingBag, Store, WalletCards,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Brand from '../components/Brand'
import { useApp } from '../state/AppContext'
import { formatCRC } from '../utils/currency'

const statusMeta = {
  new: { label: 'Nuevo', next: 'preparing', action: 'Aceptar y preparar', tone: 'red' },
  preparing: { label: 'Preparando', next: 'ready', action: 'Marcar como listo', tone: 'amber' },
  ready: { label: 'Listo', next: 'completed', action: 'Entregar y cobrar', tone: 'green' },
  completed: { label: 'Entregado', next: null, action: '', tone: 'gray' },
}

const sections = [
  { id: 'today', label: 'Hoy', icon: BarChart3 },
  { id: 'orders', label: 'Pedidos', icon: ClipboardList },
  { id: 'inventory', label: 'Inventario', icon: Package },
  { id: 'cash', label: 'Caja', icon: CircleDollarSign },
]

export default function AdminPage() {
  const { orders, inventory, storeOpen, setStoreOpen, updateOrderStatus, updateStock } = useApp()
  const [section, setSection] = useState('today')
  const [showQuickSale, setShowQuickSale] = useState(false)

  const stats = useMemo(() => {
    const sales = orders.reduce((sum, order) => sum + order.total, 0)
    return { sales, count: orders.length, average: orders.length ? sales / orders.length : 0, lowStock: inventory.filter((item) => item.stock <= item.minimum).length }
  }, [orders, inventory])

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <Brand />
        <nav>{sections.map(({ id, label, icon: Icon }) => <button key={id} className={section === id ? 'admin-nav-item admin-nav-item--active' : 'admin-nav-item'} onClick={() => setSection(id)}><Icon size={21} /><span>{label}</span>{id === 'orders' && <b>{orders.filter((order) => order.status !== 'completed').length}</b>}</button>)}</nav>
        <Link to="/" className="admin-sidebar__back"><ArrowLeft size={19} /> Ver menú público</Link>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div><p className="eyebrow">Panel del negocio</p><h1>Buenos días, Nury 👋</h1></div>
          <div className="admin-topbar__actions">
            <button className="notification-button"><Bell /><span>{orders.filter((order) => order.status === 'new').length}</span></button>
            <button className={storeOpen ? 'store-toggle store-toggle--open' : 'store-toggle'} onClick={() => setStoreOpen(!storeOpen)}><span />{storeOpen ? 'Recibiendo pedidos' : 'Pedidos pausados'}</button>
          </div>
        </header>

        {section === 'today' && <TodaySection stats={stats} orders={orders} inventory={inventory} onNavigate={setSection} onQuickSale={() => setShowQuickSale(true)} />}
        {section === 'orders' && <OrdersSection orders={orders} onUpdate={updateOrderStatus} />}
        {section === 'inventory' && <InventorySection inventory={inventory} onUpdate={updateStock} />}
        {section === 'cash' && <CashSection stats={stats} />}
      </main>

      <nav className="admin-bottom-nav">{sections.map(({ id, label, icon: Icon }) => <button key={id} className={section === id ? 'active' : ''} onClick={() => setSection(id)}><Icon /><span>{label}</span></button>)}</nav>
      {showQuickSale && <QuickSaleModal onClose={() => setShowQuickSale(false)} />}
    </div>
  )
}

function TodaySection({ stats, orders, inventory, onNavigate, onQuickSale }) {
  return (
    <div className="admin-content">
      <section className="stat-grid">
        <StatCard icon={CircleDollarSign} label="Ventas de hoy" value={formatCRC(stats.sales)} detail="Meta diaria: ₡100.000" tone="green" />
        <StatCard icon={ShoppingBag} label="Pedidos" value={stats.count} detail={`${orders.filter((order) => order.status !== 'completed').length} todavía activos`} tone="red" />
        <StatCard icon={WalletCards} label="Pedido promedio" value={formatCRC(stats.average)} detail="Por cada venta" tone="amber" />
        <StatCard icon={AlertTriangle} label="Inventario bajo" value={stats.lowStock} detail="Requieren atención" tone="purple" />
      </section>

      <section className="quick-actions">
        <button onClick={onQuickSale}><span className="quick-action__icon quick-action__icon--red"><Plus /></span><span><strong>Venta rápida</strong><small>Local, llamada o WhatsApp</small></span><ChevronRight /></button>
        <button onClick={() => onNavigate('orders')}><span className="quick-action__icon quick-action__icon--amber"><ReceiptText /></span><span><strong>Ver pedidos</strong><small>Aceptar, preparar y entregar</small></span><ChevronRight /></button>
        <button onClick={() => onNavigate('cash')}><span className="quick-action__icon quick-action__icon--green"><CircleDollarSign /></span><span><strong>Cerrar el día</strong><small>Contar caja y revisar ganancias</small></span><ChevronRight /></button>
      </section>

      <div className="admin-columns">
        <section className="panel-card">
          <div className="panel-card__header"><div><p className="eyebrow">En cocina</p><h2>Pedidos activos</h2></div><button onClick={() => onNavigate('orders')}>Ver todos</button></div>
          <div className="mini-orders">{orders.map((order) => <div className="mini-order" key={order.id}><span className={`status-dot status-dot--${statusMeta[order.status].tone}`} /><div><strong>#{order.id} · {order.customer}</strong><small>{order.items}</small></div><span>{order.time}</span></div>)}</div>
        </section>
        <section className="panel-card">
          <div className="panel-card__header"><div><p className="eyebrow">Atención</p><h2>Inventario bajo</h2></div><button onClick={() => onNavigate('inventory')}>Ver inventario</button></div>
          <div className="stock-alerts">{inventory.filter((item) => item.stock <= item.minimum).map((item) => <div key={item.id}><span><AlertTriangle /></span><div><strong>{item.name}</strong><small>Quedan {item.stock} {item.unit}</small></div><b>Comprar</b></div>)}</div>
        </section>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, detail, tone }) {
  return <article className={`stat-card stat-card--${tone}`}><span className="stat-card__icon"><Icon /></span><div><p>{label}</p><strong>{value}</strong><small>{detail}</small></div></article>
}

function OrdersSection({ orders, onUpdate }) {
  return (
    <div className="admin-content">
      <div className="section-heading"><div><p className="eyebrow">Operación</p><h2>Pedidos de hoy</h2></div><span>{orders.length} pedidos</span></div>
      <div className="order-board">
        {['new', 'preparing', 'ready'].map((status) => (
          <section className="order-column" key={status}>
            <header><span className={`status-dot status-dot--${statusMeta[status].tone}`} /><h3>{statusMeta[status].label}</h3><b>{orders.filter((order) => order.status === status).length}</b></header>
            {orders.filter((order) => order.status === status).map((order) => (
              <article className="order-card" key={order.id}>
                <div className="order-card__top"><strong>#{order.id}</strong><span>{order.source}</span></div>
                <h3>{order.customer}</h3><p>{order.items}</p>
                <div className="order-card__meta"><span><Clock3 />{order.time}</span><span>{order.payment}</span></div>
                <div className="total-row"><span>Total</span><strong>{formatCRC(order.total)}</strong></div>
                <button className={`order-action order-action--${statusMeta[status].tone}`} onClick={() => onUpdate(order.id, statusMeta[status].next)}>{statusMeta[status].action}<ChevronRight /></button>
              </article>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}

function InventorySection({ inventory, onUpdate }) {
  return (
    <div className="admin-content">
      <div className="section-heading"><div><p className="eyebrow">Existencias</p><h2>Inventario</h2></div><button className="primary-button"><Plus size={18} /> Registrar compra</button></div>
      <section className="inventory-table">
        <header><span>Ingrediente</span><span>Existencia</span><span>Costo unitario</span><span>Estado</span><span>Ajustar</span></header>
        {inventory.map((item) => {
          const low = item.stock <= item.minimum
          return <div className="inventory-row" key={item.id}><span><b>{item.name}</b><small>Mínimo: {item.minimum} {item.unit}</small></span><strong>{item.stock} <small>{item.unit}</small></strong><span>{formatCRC(item.cost)}</span><span className={low ? 'stock-status stock-status--low' : 'stock-status'}>{low ? 'Bajo' : 'Suficiente'}</span><span className="quantity-control"><button onClick={() => onUpdate(item.id, -1)}><Minus /></button><button onClick={() => onUpdate(item.id, 1)}><Plus /></button></span></div>
        })}
      </section>
    </div>
  )
}

function CashSection({ stats }) {
  const ingredientCost = Math.round(stats.sales * 0.39)
  const expenses = 6800
  const estimatedProfit = stats.sales - ingredientCost - expenses
  return (
    <div className="admin-content cash-content">
      <div className="section-heading"><div><p className="eyebrow">Resumen diario</p><h2>Cierre de caja</h2></div><span>Hoy</span></div>
      <div className="cash-layout">
        <section className="panel-card cash-summary"><h3>Dinero de hoy</h3><div><span>Ventas totales</span><strong>{formatCRC(stats.sales)}</strong></div><div><span>Ingredientes utilizados</span><strong>-{formatCRC(ingredientCost)}</strong></div><div><span>Otros gastos</span><strong>-{formatCRC(expenses)}</strong></div><div className="cash-summary__profit"><span>Ganancia estimada</span><strong>{formatCRC(estimatedProfit)}</strong></div></section>
        <section className="panel-card cash-count"><h3>Revisión de caja</h3><label><span>Efectivo al abrir</span><input value="₡20.000" readOnly /></label><label><span>Ventas en efectivo esperadas</span><input value="₡7.000" readOnly /></label><label><span>¿Cuánto efectivo contaste?</span><input inputMode="numeric" placeholder="₡ Escribí el monto" /></label><button className="primary-button primary-button--full"><Check /> Confirmar y cerrar el día</button></section>
      </div>
    </div>
  )
}

function QuickSaleModal({ onClose }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="quick-sale-modal"><div className="quick-sale-modal__icon"><ShoppingBag /></div><h2>Venta rápida</h2><p>Esta pantalla permitirá registrar en segundos una venta recibida en el local, por teléfono o por WhatsApp, para mantener correctos la caja y el inventario.</p><button className="primary-button primary-button--full" onClick={onClose}>Entendido</button></section>
    </div>
  )
}
