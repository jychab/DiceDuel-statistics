import HomePage from "./HomePage";
import { PlayerStats } from "../helper/types";
import { parseData } from "../helper/utils";
import { getData } from "../pages/api/webhook";

export default async function Home() {
  const data = await getBlockChainData();
  return <HomePage data={data} />;
}

function setPlayer(
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
async function getBlockChainData() {
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
  return {
    feesCollected: feesCollected,
    gamesPlayed: gamesPlayed,
    mostPlayedPlayer: mostPlayed[1],
    mostWinPlayer: mostWin[1],
  };
}
