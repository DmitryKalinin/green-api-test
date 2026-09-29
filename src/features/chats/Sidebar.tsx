import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { logout } from '../auth/authSlice'
import { ChatList } from './ChatList'
import { NewChatForm } from './NewChatForm'
import styles from './Sidebar.module.css'

export function Sidebar() {
  const dispatch = useAppDispatch()
  const idInstance = useAppSelector((state) => state.auth.credentials?.idInstance)

  return (
    <>
      <header className={styles.header}>
        <span>Чаты</span>
        <button onClick={() => dispatch(logout())}>Выйти</button>
      </header>
      <NewChatForm />
      <div className={styles.list}>
        <ChatList />
      </div>
      <footer className={styles.footer}>Инстанс {idInstance}</footer>
    </>
  )
}
