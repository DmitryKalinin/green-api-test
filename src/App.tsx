import { useEffect } from 'react'
import { greenApi } from './api/greenApi'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { Layout } from './components/Layout'
import { LoginPage } from './features/auth/LoginPage'
import { ChatWindow } from './features/chat/ChatWindow'
import { messageAdded } from './features/chats/chatsSlice'
import { Sidebar } from './features/chats/Sidebar'

const ERROR_DELAY = 5000

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function App() {
  const dispatch = useAppDispatch()
  const isAuthorized = useAppSelector((state) => state.auth.credentials !== null)

  useEffect(() => {
    if (!isAuthorized) return

    let stopped = false
    let request: { abort: () => void } | null = null

    // receiveNotification — long polling (receiveTimeout=5), поэтому setInterval не подходит:
    // запросы накладывались друг на друга и одно уведомление обрабатывалось дважды.
    // Следующий запрос отправляем только после того, как обработали предыдущий.
    const poll = async () => {
      while (!stopped) {
        const current = dispatch(
          greenApi.endpoints.receiveNotification.initiate(undefined, {
            forceRefetch: true,
            subscribe: false,
          }),
        )
        request = current
        const { data, error } = await current

        // эффект мог размонтироваться, пока ждали ответ (StrictMode монтирует дважды) —
        // тогда это уведомление обработает новый цикл
        if (stopped) return

        if (error) {
          await delay(ERROR_DELAY)
          continue
        }
        if (!data) continue

        const { receiptId, body } = data
        if (body.typeWebhook === 'incomingMessageReceived') {
          dispatch(
            messageAdded({
              id: body.idMessage,
              chatId: body.senderData.chatId,
              text: body.messageData.textMessageData.textMessage,
              timestamp: body.timestamp * 1000,
              outgoing: false,
            }),
          )
        }

        // без удаления GREEN-API будет отдавать это же уведомление снова и снова
        await dispatch(greenApi.endpoints.deleteNotification.initiate(receiptId))
      }
    }

    poll()

    return () => {
      stopped = true
      request?.abort()
    }
  }, [dispatch, isAuthorized])

  if (!isAuthorized) {
    return <LoginPage />
  }

  return (
    <Layout sidebar={<Sidebar />}>
      <ChatWindow />
    </Layout>
  )
}

export default App
