import { useState, type FormEvent } from 'react'
import { useGetStateInstanceMutation } from '../../api/greenApi'
import { useAppDispatch } from '../../app/hooks'
import { login } from './authSlice'
import styles from './LoginPage.module.css'

const DEFAULT_API_URL = 'https://api.green-api.com/v3'

export function LoginPage() {
  const dispatch = useAppDispatch()
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL)
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [getStateInstance, { isLoading }] = useGetStateInstanceMutation()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    const credentials = {
      apiUrl: apiUrl.trim().replace(/\/$/, ''),
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    }

    // проверяем данные до входа, чтобы не пускать в чат с неверным токеном
    try {
      const { stateInstance } = await getStateInstance(credentials).unwrap()
      if (stateInstance !== 'authorized') {
        setError(`Инстанс не авторизован (состояние: ${stateInstance})`)
        return
      }
      dispatch(login(credentials))
    } catch {
      setError('Не удалось подключиться. Проверьте idInstance, apiTokenInstance и apiUrl.')
    }
  }

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Вход в MAX Chat</h1>
        <p className={styles.hint}>Данные инстанса из личного кабинета GREEN-API</p>

        <label className={styles.label}>
          idInstance
          <input
            className={styles.input}
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value)}
            placeholder="1100000000"
            required
          />
        </label>

        <label className={styles.label}>
          apiTokenInstance
          <input
            className={styles.input}
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value)}
            type="password"
            required
          />
        </label>

        <label className={styles.label}>
          apiUrl
          <input
            className={styles.input}
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            required
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.button} type="submit" disabled={isLoading}>
          {isLoading ? 'Проверяем…' : 'Войти'}
        </button>
      </form>
    </div>
  )
}
