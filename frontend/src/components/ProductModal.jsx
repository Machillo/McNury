import { useEffect, useMemo, useState } from 'react'
import { Minus, Plus, X } from 'lucide-react'
import { formatCRC } from '../utils/currency'
import { useApp } from '../state/AppContext'

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useApp()
  const [selected, setSelected] = useState({})
  const [notes, setNotes] = useState('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    setSelected({})
    setNotes('')
    setQuantity(1)
  }, [product])

  const selections = useMemo(() => Object.values(selected).flat(), [selected])
  const valid = (product?.options || []).every((group) => !group.required || (selected[group.name] || []).length === group.max)
  const total = product ? (product.price + selections.reduce((sum, item) => sum + item.price, 0)) * quantity : 0

  if (!product) return null

  const toggleChoice = (group, choice) => {
    setSelected((current) => {
      const groupSelected = current[group.name] || []
      const exists = groupSelected.some((item) => item.name === choice.name)
      if (exists) return { ...current, [group.name]: groupSelected.filter((item) => item.name !== choice.name) }
      if (group.max === 1) return { ...current, [group.name]: [choice] }
      if (groupSelected.length >= group.max) return current
      return { ...current, [group.name]: [...groupSelected, choice] }
    })
  }

  const submit = () => {
    if (!valid) return
    addToCart(product, selections, notes, quantity)
    onClose()
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal-sheet" role="dialog" aria-modal="true" aria-label={product.name}>
        <button className="modal-sheet__close" onClick={onClose} aria-label="Cerrar"><X /></button>
        <div className={`modal-sheet__hero visual--${product.color}`}><span>{product.emoji}</span></div>
        <div className="modal-sheet__body">
          <h2>{product.name}</h2>
          <p>{product.description}</p>

          {(product.options || []).map((group) => (
            <fieldset className="option-group" key={group.name}>
              <legend>
                <span>{group.name}</span>
                <small>{group.required ? `Elegí ${group.max}` : `Hasta ${group.max}`}</small>
              </legend>
              {group.choices.map((choice) => {
                const checked = (selected[group.name] || []).some((item) => item.name === choice.name)
                return (
                  <label className={`choice-row ${checked ? 'choice-row--selected' : ''}`} key={choice.name}>
                    <input type="checkbox" checked={checked} onChange={() => toggleChoice(group, choice)} />
                    <span>{choice.name}</span>
                    <strong>{choice.price ? `+${formatCRC(choice.price)}` : ''}</strong>
                  </label>
                )
              })}
            </fieldset>
          ))}

          <label className="notes-field">
            <span>¿Alguna indicación?</span>
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Ejemplo: sin cebolla, poca salsa…" maxLength={120} />
          </label>

          <div className="add-row">
            <div className="quantity-control">
              <button onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus size={18} /></button>
              <strong>{quantity}</strong>
              <button onClick={() => setQuantity((value) => value + 1)}><Plus size={18} /></button>
            </div>
            <button className="primary-button" onClick={submit} disabled={!valid}>
              Agregar · {formatCRC(total)}
            </button>
          </div>
          {!valid && <p className="validation-message">Completá las opciones obligatorias.</p>}
        </div>
      </section>
    </div>
  )
}
