import type { Message } from '../../types'
import styles from './MessageBubble.module.css'

interface Props {
  message: Message
}

export function MessageBubble({ message }: Props) {
  const time = new Date(message.timestamp).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className={message.outgoing ? `${styles.bubble} ${styles.outgoing}` : styles.bubble}>
      <span className={styles.text}>{message.text}</span>
      <span className={styles.time}>{time}</span>
    </div>
  )
}
