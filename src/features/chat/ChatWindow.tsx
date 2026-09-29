import { useSendMessageMutation } from '../../api/greenApi'
import type { Message } from '../../types'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { messageAdded } from '../chats/chatsSlice'
import { MessageBubble } from './MessageBubble'
import { MessageInput } from './MessageInput'
import styles from './ChatWindow.module.css'

const EMPTY: Message[] = []

export function ChatWindow() {
  const dispatch = useAppDispatch()
  const [sendMessage] = useSendMessageMutation()
  const activeChat = useAppSelector((state) =>
    state.chats.chats.find((chat) => chat.id === state.chats.activeChatId),
  )
  const messages = useAppSelector((state) =>
    activeChat ? (state.chats.messages[activeChat.id] ?? EMPTY) : EMPTY,
  )

  if (!activeChat) {
    return <div className={styles.placeholder}>Выберите чат или создайте новый</div>
  }

  const handleSend = async (text: string) => {
    try {
      const { idMessage } = await sendMessage({
        chatId: activeChat.id,
        message: text,
      }).unwrap()
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
