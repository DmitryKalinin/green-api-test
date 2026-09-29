import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { formatPhone } from '../../utils/phone'
import { chatSelected } from './chatsSlice'
import styles from './ChatList.module.css'

export function ChatList() {
  const dispatch = useAppDispatch()
  const chats = useAppSelector((state) => state.chats.chats)
  const messages = useAppSelector((state) => state.chats.messages)
  const activeChatId = useAppSelector((state) => state.chats.activeChatId)

  if (chats.length === 0) {
    return <p className={styles.empty}>Нет чатов. Введите номер выше, чтобы начать переписку</p>
  }

  return (
    <ul className={styles.list}>
      {chats.map((chat) => {
        const last = messages[chat.id]?.at(-1)
        return (
          <li
            key={chat.id}
            className={chat.id === activeChatId ? `${styles.item} ${styles.active}` : styles.item}
            onClick={() => dispatch(chatSelected(chat.id))}
          >
            <div className={styles.avatar}>{chat.name.slice(-2)}</div>
            <div className={styles.info}>
              <div className={styles.name}>{formatPhone(chat.name)}</div>
              <div className={styles.preview}>
                {last ? `${last.outgoing ? 'Вы: ' : ''}${last.text}` : 'Нет сообщений'}
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
