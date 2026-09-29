import { useEffect, useRef, useState } from 'react'
import { useSendMessageMutation } from '../../api/greenApi'
import type { Message } from '../../types'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { formatPhone } from '../../utils/phone'
import { chatClosed, messageAdded } from '../chats/chatsSlice'
import { MessageBubble } from './MessageBubble'
import { MessageInput } from './MessageInput'
import styles from './ChatWindow.module.css'

const EMPTY: Message[] = []

export function ChatWindow() {
  const dispatch = useAppDispatch()
  const [sendMessage, { isLoading }] = useSendMessageMutation()
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const activeChat = useAppSelector((state) =>
    state.chats.chats.find((chat) => chat.id === state.chats.activeChatId),
  )
  const messages = useAppSelector((state) =>
    activeChat ? (state.chats.messages[activeChat.id] ?? EMPTY) : EMPTY,
  )

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, activeChat?.id])

  useEffect(() => {
    setError(null)
  }, [activeChat?.id])

  if (!activeChat) {
    return <div className={styles.placeholder}>Выберите чат или создайте новый</div>
  }

  const handleSend = async (text: string) => {
    setError(null)
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
      return true
    } catch {
      setError('Не удалось отправить сообщение. Проверьте номер и данные инстанса.')
      return false
    }
  }

  return (
    <>
      <header className={styles.header}>
        <button
          className={styles.back}
          onClick={() => dispatch(chatClosed())}
          aria-label="Назад к списку чатов"
        >
          ←
        </button>
        <div className={styles.avatar}>{activeChat.name.slice(-2)}</div>
        <span className={styles.title}>{formatPhone(activeChat.name)}</span>
      </header>
      <div className={styles.messages}>
        {messages.length === 0 && <p className={styles.empty}>Сообщений пока нет</p>}
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>
      {error && <div className={styles.error}>{error}</div>}
      <MessageInput onSend={handleSend} disabled={isLoading} />
    </>
  )
}
