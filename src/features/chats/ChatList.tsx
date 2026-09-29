import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { formatPhone } from '../../utils/phone'
import { chatSelected } from './chatsSlice'
import styles from './ChatList.module.css'

export function ChatList() {
  const dispatch = useAppDispatch()
  const chats = useAppSelector((state) => state.chats.chats)
  const activeChatId = useAppSelector((state) => state.chats.activeChatId)

  if (chats.length === 0) {
    return <p className={styles.empty}>Нет чатов</p>
  }

  return (
    <ul className={styles.list}>
      {chats.map((chat) => (
        <li
          key={chat.id}
          className={chat.id === activeChatId ? `${styles.item} ${styles.active}` : styles.item}
          onClick={() => dispatch(chatSelected(chat.id))}
        >
          {formatPhone(chat.name)}
        </li>
      ))}
    </ul>
  )
}
