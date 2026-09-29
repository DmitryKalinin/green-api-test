import { useAppSelector } from './app/hooks'
import { Layout } from './components/Layout'
import { LoginPage } from './features/auth/LoginPage'
import { ChatWindow } from './features/chat/ChatWindow'
import { Sidebar } from './features/chats/Sidebar'
import { useNotificationPolling } from './hooks/useNotificationPolling'

function App() {
  const isAuthorized = useAppSelector((state) => state.auth.credentials !== null)
  const hasActiveChat = useAppSelector((state) => state.chats.activeChatId !== null)

  useNotificationPolling(isAuthorized)

  if (!isAuthorized) {
    return <LoginPage />
  }

  return (
    <Layout sidebar={<Sidebar />} chatOpen={hasActiveChat}>
      <ChatWindow />
    </Layout>
  )
}

export default App
