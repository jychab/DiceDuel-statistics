// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import { parseData } from "../../../helper/utils";
const DISCORD_URL_WH = process.env.DISCORD_WEBHOOK_URL;
let feePayerEscrowMap = new Map<string, string>();
export default async function handler(req, res) {
  if (req.method == "POST") {
    console.log(req.body);
    let body = req.body;
    body.forEach(async (data) => {
      try {
        let result = parseData(data);
        if (result.state == "Game Completed!") {
          result.escrowAccount.forEach(async (account) => {
            const opponent = feePayerEscrowMap.get(account);
            if (opponent !== result.feePayer) {
              await toDiscordWH(
                result.state,
                `${result.feePayer} rolled against ${opponent} and won ${result.winnings} SOL!`,
                result.signature
              );
            }
          });
          result.escrowAccount.forEach((account) =>
            feePayerEscrowMap.delete(account)
          );
        } else if (result.state == "Game Initiated!") {
          feePayerEscrowMap.set(result.escrowAccount[0], result.feePayer);
        }
        res.status(200);
      } catch (e) {
        res.status(500).send(e);
      }
    });
  } else {
    res.status(200).json({ name: "API GATEWAY for DICE DUEL stats" });
  }
}

async function toDiscordWH(state: string, message: any, signature: string) {
  await axios
    .post(DISCORD_URL_WH, {
      embeds: [
        {
          title: state,
          description: message,
          fields: [
            {
              name: "Explorer",
              value: `https://solana.fm/tx/${signature}`,
            },
          ],
        },
      ],
    })
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
}
