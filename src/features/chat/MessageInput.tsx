import { useState, type FormEvent } from 'react'
import styles from './MessageInput.module.css'

interface Props {
  onSend: (text: string) => Promise<boolean>
  disabled?: boolean
}

export function MessageInput({ onSend, disabled }: Props) {
  const [text, setText] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const value = text.trim()
    if (!value || disabled) return
    // текст очищаем только если отправка прошла, чтобы не терять его при ошибке
    const ok = await onSend(value)
    if (ok) setText('')
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Сообщение"
        maxLength={4000}
        autoFocus
      />
      <button className={styles.button} type="submit" disabled={!text.trim() || disabled}>
        {disabled ? '…' : '➤'}
      </button>
    </form>
  )
}
