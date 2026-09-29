import { describe, expect, it } from 'vitest'
import { formatPhone, normalizePhone } from './phone'

describe('normalizePhone', () => {
  it('убирает всё кроме цифр', () => {
    expect(normalizePhone('+7 (999) 123-45-67')).toBe('79991234567')
  })

  it('заменяет ведущую 8 на 7', () => {
    expect(normalizePhone('8 999 123 45 67')).toBe('79991234567')
  })

  it('добавляет 7 к десятизначному номеру', () => {
    expect(normalizePhone('9991234567')).toBe('79991234567')
  })

  it('принимает международные номера', () => {
    expect(normalizePhone('+77011234567')).toBe('77011234567')
    expect(normalizePhone('+380501234567')).toBe('380501234567')
  })

  it('возвращает null для слишком коротких и длинных номеров', () => {
    expect(normalizePhone('12345')).toBeNull()
    expect(normalizePhone('1234567890123456')).toBeNull()
    expect(normalizePhone('')).toBeNull()
  })
})

describe('formatPhone', () => {
  it('форматирует российский номер', () => {
    expect(formatPhone('79991234567')).toBe('+7 999 123-45-67')
  })

  it('для остальных просто добавляет +', () => {
    expect(formatPhone('380501234567')).toBe('+380501234567')
  })
})
