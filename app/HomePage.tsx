"use client";

import styles from "../styles/Home.module.css";
// This is a Client Component. It receives data as props and
// has access to state and effects just like Page components
// in the `pages` directory.
export default function HomePage({ data }) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Dice Duel Stats</h1>
        <p>{`Last 24hrs Games Played: ${data.gamesPlayed} `}</p>
        <p>{`Last 24hrs Fees Collected: ${
          Math.round(data.feesCollected * 100) / 100
        } SOL`}</p>
        <p>{`${data.mostPlayedPlayer.name} played the most with a total of ${
          data.mostPlayedPlayer.gamesPlayed
        } games and a whopping ${Math.round(
          (data.mostPlayedPlayer.gamesWon / data.mostPlayedPlayer.gamesPlayed) *
            100
        )}% Win Rate!`}</p>
        <p>{`${data.mostWinPlayer.name} won the most with a total of ${
          Math.round(data.mostWinPlayer.amountWon * 100) / 100
        } SOL!`}</p>
      </main>
    </div>
  );
}
