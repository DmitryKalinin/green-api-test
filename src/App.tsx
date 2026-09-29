import { useState } from 'react'
import { LoginPage } from './features/auth/LoginPage'
import type { Credentials } from './types'

function App() {
  const [credentials, setCredentials] = useState<Credentials | null>(null)

  if (!credentials) {
    return <LoginPage onLogin={setCredentials} />
  }

  // TODO: чат
  return <div>Инстанс {credentials.idInstance}</div>
}

export default App
