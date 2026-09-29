import { useState, type FormEvent } from 'react'
import { useAppDispatch } from '../../app/hooks'
import { normalizePhone } from '../../utils/phone'
import { chatCreated } from './chatsSlice'
import styles from './NewChatForm.module.css'

export function NewChatForm() {
  const dispatch = useAppDispatch()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const normalized = normalizePhone(phone)
    if (!normalized) {
      setError('Некорректный номер')
      return
    }
    dispatch(chatCreated(normalized))
    setPhone('')
    setError(null)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <input
          className={styles.input}
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value)
            setError(null)
          }}
          placeholder="+7 999 123-45-67"
          inputMode="tel"
        />
        <button className={styles.button} type="submit" title="Новый чат">
          +
        </button>
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </form>
  )
}
