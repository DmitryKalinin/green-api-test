import { useState, type FormEvent } from 'react'
import styles from './MessageInput.module.css'

interface Props {
  onSend: (text: string) => void
}

export function MessageInput({ onSend }: Props) {
  const [text, setText] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const value = text.trim()
    if (!value) return
    onSend(value)
    setText('')
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Сообщение"
        autoFocus
      />
      <button className={styles.button} type="submit" disabled={!text.trim()}>
        Отправить
      </button>
    </form>
  )
}
