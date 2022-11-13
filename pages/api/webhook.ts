// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import { RawData, DiscordResponse } from "../../types";
const DISCORD_URL = process.env.DISCORD_WEBHOOK_URL;
export default function handler(req, res) {
  if (req.method == "POST") {
    console.log(req.body[0]);
    try {
      let body: RawData = req.body[0];
      let feeCollector = body.accountData.find(
        (data) => data.account == "9RbPXewKbBqr6uNQhbzm3iejzpyCq5YucCCaSUSDZPQF"
      );
      let message;
      if (feeCollector != undefined) {
        message = `${body.feePayer} won ${
          (feeCollector.nativeBalanceChange * 100) / 3000000000
        } sol!`;
        toDiscord("Game Completed!", message, body.signature);
      } else if (body.nativeTransfers.length > 0) {
        let nativeTransfer = body.nativeTransfers[0];
        if (nativeTransfer.amount == 100000000) {
          message = `${nativeTransfer.fromUserAccount} bet 0.1 Sol!`;
          toDiscord("Game Initiated!", message, body.signature);
        } else if (nativeTransfer.amount == 500000000) {
          message = `${nativeTransfer.fromUserAccount} bet 0.5 Sol!`;
          toDiscord("Game Initiated!", message, body.signature);
        } else if (nativeTransfer.amount == 1000000000) {
          message = `${nativeTransfer.fromUserAccount} bet 1 Sol!`;
          toDiscord("Game Initiated!", message, body.signature);
        } else if (nativeTransfer.amount == 5000000000) {
          message = `${nativeTransfer.fromUserAccount} bet 5 Sol!`;
          toDiscord("Game Initiated!", message, body.signature);
        } else {
          message = "Probably some other transaction";
        }
      } else {
        message = "Unable to parse transaction";
      }
      res.status(200).json({ message: message });
    } catch (e) {
      res.status(500).send(e);
    }
  } else {
    res.status(200).json({ name: "API GATEWAY for DICE DUEL stats" });
  }
}

const postToDiscord = (response: DiscordResponse) => {
  axios.post(DISCORD_URL, {
    embeds: [
      {
        title: response.title,
        description: response.description,
        fields: [
          {
            name: "Explorer",
            value: `https://solana.fm/tx/${response.signature}`,
          },
        ],
      },
    ],
  });
};
function toDiscord(title: string, message: any, signature: string) {
  let response = {
    title: title,
    description: message,
    signature: signature,
  };
  console.log(response);
  postToDiscord(response);
}
