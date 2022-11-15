import styles from "../styles/Home.module.css";
export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Dice Duel Stats</h1>
        <p>
          pulling data from the blockchain is a long process... it could take
          awhile...
        </p>
      </main>
    </div>
  );
}
