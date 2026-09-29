import { sendMessage } from '../../api/greenApi'
import type { Message } from '../../types'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { messageAdded } from '../chats/chatsSlice'
import { MessageBubble } from './MessageBubble'
import { MessageInput } from './MessageInput'
import styles from './ChatWindow.module.css'

const EMPTY: Message[] = []

export function ChatWindow() {
  const dispatch = useAppDispatch()
  const credentials = useAppSelector((state) => state.auth.credentials)
  const activeChat = useAppSelector((state) =>
    state.chats.chats.find((chat) => chat.id === state.chats.activeChatId),
  )
  const messages = useAppSelector((state) =>
    activeChat ? (state.chats.messages[activeChat.id] ?? EMPTY) : EMPTY,
  )

  if (!activeChat || !credentials) {
    return <div className={styles.placeholder}>Выберите чат или создайте новый</div>
  }

  const handleSend = async (text: string) => {
    try {
      const { idMessage } = await sendMessage(credentials, activeChat.id, text)
      dispatch(
        messageAdded({
          id: idMessage,
          chatId: activeChat.id,
          text,
          timestamp: Date.now(),
          outgoing: true,
        }),
      )
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      <header className={styles.header}>{activeChat.name}</header>
      <div className={styles.messages}>
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
      <MessageInput onSend={handleSend} />
    </>
  )
}
