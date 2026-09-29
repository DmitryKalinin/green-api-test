import { useState, type FormEvent } from 'react'
import { useAppDispatch } from '../../app/hooks'
import { chatCreated } from './chatsSlice'
import styles from './NewChatForm.module.css'

export function NewChatForm() {
  const dispatch = useAppDispatch()
  const [phone, setPhone] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!phone.trim()) return
    dispatch(chatCreated(phone.trim()))
    setPhone('')
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Номер телефона, например 79991234567"
      />
      <button className={styles.button} type="submit" title="Новый чат">
        +
      </button>
    </form>
  )
}
