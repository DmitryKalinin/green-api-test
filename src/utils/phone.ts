/**
 * Приводит введённый номер к виду 79991234567.
 * Возвращает null, если номер не похож на телефон.
 */
export function normalizePhone(input: string): string | null {
  let digits = input.replace(/\D/g, '')

  // 8 999 ... -> 7 999 ...
  if (digits.length === 11 && digits.startsWith('8')) {
    digits = `7${digits.slice(1)}`
  }
  // 999 123-45-67 -> 7999...
  if (digits.length === 10) {
    digits = `7${digits}`
  }

  if (digits.length < 11 || digits.length > 15) {
    return null
  }

  return digits
}

export function formatPhone(phone: string): string {
  const m = phone.match(/^7(\d{3})(\d{3})(\d{2})(\d{2})$/)
  if (!m) return `+${phone}`
  return `+7 ${m[1]} ${m[2]}-${m[3]}-${m[4]}`
}
