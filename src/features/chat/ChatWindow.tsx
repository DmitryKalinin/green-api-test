import { useAppSelector } from '../../app/hooks'
import styles from './ChatWindow.module.css'

export function ChatWindow() {
  const activeChat = useAppSelector((state) =>
    state.chats.chats.find((chat) => chat.id === state.chats.activeChatId),
  )

  if (!activeChat) {
    return <div className={styles.placeholder}>Выберите чат или создайте новый</div>
  }

  return (
    <>
      <header className={styles.header}>{activeChat.name}</header>
      <div className={styles.messages}>{/* TODO: сообщения */}</div>
    </>
  )
}
