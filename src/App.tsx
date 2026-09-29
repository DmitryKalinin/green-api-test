import { useAppSelector } from './app/hooks'
import { LoginPage } from './features/auth/LoginPage'

function App() {
  const credentials = useAppSelector((state) => state.auth.credentials)

  if (!credentials) {
    return <LoginPage />
  }

  // TODO: чат
  return <div>Инстанс {credentials.idInstance}</div>
}

export default App
