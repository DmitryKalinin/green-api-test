import type { ReactNode } from 'react'
import styles from './Layout.module.css'

interface Props {
  sidebar: ReactNode
  children: ReactNode
  chatOpen: boolean
}

export function Layout({ sidebar, children, chatOpen }: Props) {
  return (
    <div className={chatOpen ? `${styles.layout} ${styles.chatOpen}` : styles.layout}>
      <aside className={styles.sidebar}>{sidebar}</aside>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
