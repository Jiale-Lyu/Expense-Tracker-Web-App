import Head from "next/head";
import UserNav from "../components/UserNav/UserNav";
import styles from "../styles/Home.module.scss";
import chartStyle from "../styles/Charts.module.scss";
import Bar from "../components/Charts/bar-chart";
import Pie from "../components/Charts/pie-chart";
import Line from "../components/Charts/line-chart";
/**
 * present echarts
 * @returns
 */
export default function Charts() {
  return (
    <div className={styles.homecover}>
      <Head>
        <title>Expense Tracker</title>
        <meta name="description" content="Manage and visualize your expenses" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className={styles.mainHome}>
        <div className="maincontainer">
          <UserNav />
          <div className={chartStyle.charts}>
            <Bar></Bar>
            <Pie></Pie>
            <Line></Line>
          </div>
        </div>
      </main>
    </div>
  );
}
