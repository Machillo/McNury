export const formatCRC = (value) =>
  new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    maximumFractionDigits: 0,
  }).format(value)

export const formatTime = (date) =>
  new Intl.DateTimeFormat('es-CR', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
