import { useState, type FormEvent } from 'react'
import { useAppDispatch } from '../../app/hooks'
import { login } from './authSlice'
import styles from './LoginPage.module.css'

const DEFAULT_API_URL = 'https://api.green-api.com/v3'

export function LoginPage() {
  const dispatch = useAppDispatch()
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL)
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    dispatch(
      login({
        apiUrl: apiUrl.trim().replace(/\/$/, ''),
        idInstance: idInstance.trim(),
        apiTokenInstance: apiTokenInstance.trim(),
      }),
    )
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

        <button className={styles.button} type="submit">
          Войти
        </button>
      </form>
    </div>
  )
}
