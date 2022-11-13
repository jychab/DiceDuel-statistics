import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Stats, PlayerStats, RawData } from "./helper/types";
import { parseData } from "./helper/utils";
export default function Home() {
  const [stats, setStats] = useState<Stats>({
    gamesPlayed: 0,
    feesCollected: 0,
    mostWinPlayer: { name: "", gamesPlayed: 0, gamesWon: 0, amountWon: 0 },
    mostPlayedPlayer: { name: "", gamesPlayed: 0, gamesWon: 0, amountWon: 0 },
  });
  const apiURL = "https://api.helius.xyz/v0/addresses";
  const address = "D1CEzFxTzYBtJPUsqn44YKeEt46MdzjnqXr4gG9pD6Co";
  const resource = "transactions";
  const options = "?api-key=32fd96ba-87f1-4779-9bf5-331febde9dcc";

  useEffect(() => {
    const parseTransactions = async () => {
      let oldestTransaction = "";
      let result = [];
      let end = false;
      while (!end) {
        const url = `${apiURL}/${address}/${resource}${options}&before=${oldestTransaction}`;
        try {
          const data: [RawData] = (await axios.get(url)).data;
          oldestTransaction = data[data.length - 1].signature;
          for (const i in data) {
            result.push(data[i]);
            if (Math.round(Date.now() / 1000) - data[i].timestamp > 86400) {
              end = true;
              break;
            }
          }
        } catch (err) {
          setTimeout(() => {}, 1000);
          console.log(err);
        }
      }
      (result as [RawData]).sort((a, b) => a.timestamp - b.timestamp);
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
            if (player !== parsedData.feePayer) {
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
      const mostPlayed = [players.entries()].reduce((a, b) =>
        b[1].gamesPlayed > a[1].gamesPlayed ? b : a
      );

      const mostWin = [players.entries()].reduce((a, b) =>
        b[1].amountWon > a[1].amountWon ? b : a
      );
      setStats({
        feesCollected: feesCollected,
        gamesPlayed: gamesPlayed,
        mostPlayedPlayer: mostPlayed[1],
        mostWinPlayer: mostWin[1],
      });
    };
    parseTransactions();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Dice Duel Statistics</title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Dice Duel Stats</h1>
        <p>{`Games Played: ${stats.gamesPlayed} `}</p>
        <p>{`Fees Collected: ${
          Math.round(stats.feesCollected * 100) / 100
        } SOL`}</p>
        <p>{`${stats.mostPlayedPlayer.name} played the most with a ${Math.round(
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
