export default function Brand({ compact = false }) {
  return (
    <div className={`brand ${compact ? 'brand--compact' : ''}`} aria-label="Mac Nury">
      <span className="brand__mac">Mac</span>
      <span className="brand__nury">Nury</span>
      {!compact && <small>Comidas rápidas</small>}
    </div>
  )
}
