import type { ReactNode } from 'react'
import styles from './Layout.module.css'

interface Props {
  sidebar: ReactNode
  children: ReactNode
}

export function Layout({ sidebar, children }: Props) {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>{sidebar}</aside>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
