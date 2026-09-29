import { useAppSelector } from './app/hooks'
import { Layout } from './components/Layout'
import { LoginPage } from './features/auth/LoginPage'
import { ChatWindow } from './features/chat/ChatWindow'
import { Sidebar } from './features/chats/Sidebar'

function App() {
  const isAuthorized = useAppSelector((state) => state.auth.credentials !== null)

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
