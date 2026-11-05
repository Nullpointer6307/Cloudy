export function formatNumber (num) {
  if (num == null || isNaN(num)) return ''
  const parts = String(num).split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}
