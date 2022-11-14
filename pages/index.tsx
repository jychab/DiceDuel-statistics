import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import { Stats, PlayerStats, RawData } from "../helper/types";
import { parseData } from "../helper/utils";
import { getData } from "./api/webhook";

export default function Home({
  feesCollected,
  gamesPlayed,
  mostPlayedPlayer,
  mostWinPlayer,
}) {
  const [stats, setStats] = useState<Stats>({
    feesCollected: feesCollected,
    gamesPlayed: gamesPlayed,
    mostPlayedPlayer: mostPlayedPlayer,
    mostWinPlayer: mostWinPlayer,
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Dice Duel Statistics</title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Dice Duel Stats</h1>
        <p>{`Last 24hrs Games Played: ${stats.gamesPlayed} `}</p>
        <p>{`Last 24hrs Fees Collected: ${
          Math.round(stats.feesCollected * 100) / 100
        } SOL`}</p>
        <p>{`${stats.mostPlayedPlayer.name} played the most with a total of ${
          stats.mostPlayedPlayer.gamesPlayed
        } games and a whopping ${Math.round(
          (stats.mostPlayedPlayer.gamesWon /
            stats.mostPlayedPlayer.gamesPlayed) *
            100
        )}% Win Rate!`}</p>
        <p>{`${stats.mostWinPlayer.name} won the most with a total of ${
          Math.round(stats.mostWinPlayer.amountWon * 100) / 100
        } SOL!`}</p>
      </main>
    </div>
  );
}

export function setPlayer(
  players: Map<string, PlayerStats>,
  player: string,
  won_game: number,
  winnings: number
) {
  return {
    name: player,
    gamesPlayed:
      players.get(player) != undefined
        ? players.get(player).gamesPlayed + 1
        : 1,
    gamesWon:
      players.get(player) != undefined
        ? players.get(player).gamesWon + won_game
        : won_game,
    amountWon:
      players.get(player) != undefined
        ? players.get(player).amountWon + winnings
        : winnings,
  };
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const result = await getData();
  let feesCollected = 0;
  let gamesPlayed = 0;
  let players = new Map<string, PlayerStats>();
  let feePayerEscrowAccount = new Map<string, string>();
  result.forEach((value) => {
    let parsedData = parseData(value);
    if (
      parsedData.state == "Game Completed!" &&
      parsedData.escrowAccount.length == 2
    ) {
      feesCollected += parsedData.feeCollected;
      gamesPlayed += 1;
      parsedData.escrowAccount.forEach((account) => {
        let player = feePayerEscrowAccount.get(account);
        if (player != parsedData.feePayer) {
          //loser
          players.set(player, setPlayer(players, player, 0, 0));
        } else {
          //winner
          players.set(
            player,
            setPlayer(players, player, 1, parsedData.winnings)
          );
        }
      });
    } else if (parsedData.state == "Game Initiated!") {
      feePayerEscrowAccount.set(
        parsedData.escrowAccount[0],
        parsedData.feePayer
      );
    }
  });
  const mostPlayed = [...players.entries()].reduce((a, b) =>
    b[1].gamesPlayed > a[1].gamesPlayed ? b : a
  );

  const mostWin = [...players.entries()].reduce((a, b) =>
    b[1].amountWon > a[1].amountWon ? b : a
  );
  // Pass data to the page via props
  return {
    props: {
      feesCollected: feesCollected,
      gamesPlayed: gamesPlayed,
      mostPlayedPlayer: mostPlayed[1],
      mostWinPlayer: mostWin[1],
    },
  };
}
