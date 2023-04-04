import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import UserNav from '../components/UserNav/UserNav'


export default function Expense() {
    return (
        <div className={styles.homecover}>
      <Head>
        <title>Expense Tracker</title>
        <meta name="description" content="Manage and visualize your expenses" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.mainHome}>
        <div className="maincontainer">
        <UserNav></UserNav>
        </div>
      </main>
      </div>
    )
    }
