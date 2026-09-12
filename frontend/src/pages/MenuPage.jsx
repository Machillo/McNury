import { useMemo, useState } from 'react'
import { Clock3, MapPin, Search, ShoppingBag, Store } from 'lucide-react'
import { Link } from 'react-router-dom'
import Brand from '../components/Brand'
import CartSheet from '../components/CartSheet'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import { categories, menu } from '../data/menu'
import { useApp } from '../state/AppContext'
import { formatCRC } from '../utils/currency'

export default function MenuPage() {
  const { cart, cartTotal, storeOpen } = useApp()
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)

  const filteredMenu = useMemo(() => menu.filter((product) =>
    (category === 'all' || product.category === category) &&
    product.name.toLowerCase().includes(query.toLowerCase()),
  ), [category, query])

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="customer-app">
      <header className="customer-header">
        <div className="customer-header__inner">
          <Brand />
          <div className="customer-header__actions">
            <div className={`open-pill ${storeOpen ? '' : 'open-pill--closed'}`}><span />{storeOpen ? 'Abierto' : 'Cerrado'}</div>
            <Link className="admin-link" to="/admin"><Store size={18} /><span>Negocio</span></Link>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero__content">
            <p className="eyebrow">Hecho al momento</p>
            <h1>Antojos que<br /><em>felicitan tu día.</em></h1>
            <p>Ingredientes frescos, mucho sabor y sin filas. Pedí ahora y recogé cuando esté listo.</p>
            <div className="hero__meta"><span><Clock3 size={18} /> 25–35 min</span><span><MapPin size={18} /> Palmar Norte</span></div>
          </div>
          <div className="hero__art" aria-hidden="true"><span className="hero__burger">🍔</span><span className="hero__fries">🍟</span><span className="hero__spark">✦</span></div>
        </section>

        <section className="menu-section">
          <div className="menu-toolbar">
            <div><p className="eyebrow">Nuestro menú</p><h2>¿Qué se te antoja hoy?</h2></div>
            <label className="search-box"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar en el menú" /></label>
          </div>
          <nav className="category-tabs" aria-label="Categorías">
            {categories.map((item) => <button key={item.id} className={category === item.id ? 'category-tab category-tab--active' : 'category-tab'} onClick={() => setCategory(item.id)}><span>{item.emoji}</span>{item.label}</button>)}
          </nav>
          <div className="product-grid">
            {filteredMenu.map((product) => <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />)}
          </div>
        </section>
      </main>

      {cartCount > 0 && <button className="floating-cart" onClick={() => setCartOpen(true)}><span className="floating-cart__count">{cartCount}</span><ShoppingBag size={21} /><span>Ver pedido</span><strong>{formatCRC(cartTotal)}</strong></button>}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
