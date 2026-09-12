import { Plus } from 'lucide-react'
import { formatCRC } from '../utils/currency'

export default function ProductCard({ product, onSelect }) {
  return (
    <article className="product-card">
      <button className={`product-card__visual visual--${product.color}`} onClick={() => onSelect(product)} aria-label={`Ver ${product.name}`}>
        {product.popular && <span className="product-card__badge">Favorito</span>}
        <span aria-hidden="true">{product.emoji}</span>
      </button>
      <div className="product-card__content">
        <div>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
        <div className="product-card__footer">
          <strong>{formatCRC(product.price)}</strong>
          <button className="icon-button icon-button--accent" onClick={() => onSelect(product)} aria-label={`Agregar ${product.name}`}>
            <Plus size={20} strokeWidth={3} />
          </button>
        </div>
      </div>
    </article>
  )
}
