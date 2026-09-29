import { useEffect } from 'react'
import { greenApi } from './api/greenApi'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { Layout } from './components/Layout'
import { LoginPage } from './features/auth/LoginPage'
import { ChatWindow } from './features/chat/ChatWindow'
import { messageAdded } from './features/chats/chatsSlice'
import { Sidebar } from './features/chats/Sidebar'

const POLLING_INTERVAL = 3000

function App() {
  const dispatch = useAppDispatch()
  const isAuthorized = useAppSelector((state) => state.auth.credentials !== null)

  useEffect(() => {
    if (!isAuthorized) return

    const timer = setInterval(async () => {
      const { data } = await dispatch(
        greenApi.endpoints.receiveNotification.initiate(undefined, {
          forceRefetch: true,
          subscribe: false,
        }),
      )
      if (!data) return

      const { body } = data
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
    }, POLLING_INTERVAL)

    return () => clearInterval(timer)
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
