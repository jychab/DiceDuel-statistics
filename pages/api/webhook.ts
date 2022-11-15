// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios, { RawAxiosRequestHeaders } from "axios";
import axiosRetry from "axios-retry";
import { RawData } from "../../helper/types";
import { parseData } from "../../helper/utils";

const DISCORD_URL_WH = process.env.DISCORD_WEBHOOK_URL;
const apiURL = "https://api.helius.xyz/v0/addresses";
const resource = "transactions";
const options = `?api-key=${process.env.HELIUS_API_KEY}`;
const address = process.env.PROGRAM_ID;

axiosRetry(axios, {
  retries: 3, // number of retries
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`);
    return retryCount * 2000; // time interval between retries
  },
  retryCondition: (error) => {
    // if retry condition is not specified, by default idempotent requests are retried
    return error.response.status === 429;
  },
});

export default function handler(req, res) {
  if (req.method == "POST") {
    console.log(req.body);
    let body: [RawData] = req.body;
    body.forEach((data) => {
      let result = parseData(data);
      if (
        result.state == "Game Completed!" &&
        result.escrowAccount.length == 2
      ) {
        result.escrowAccount.forEach(async (account) => {
          const url = `${apiURL}/${account}/${resource}${options}`;
          const transactions = await getEnrichedTransactions(url); // get fee payer from the escrow account
          if (transactions != undefined && transactions.length > 0) {
            let opponent = transactions[0].feePayer;
            if (opponent != undefined && opponent != result.feePayer) {
              await toDiscordWH(
                result.state,
                `${result.feePayer} rolled against ${opponent} and won ${result.winnings} SOL!`,
                result.signature
              );
            }
          }
        });
      }
      res.status(200);
    });
  } else if (req.method == "GET") {
    res.status(200).send("API ENDPOINT");
  }
}
//get last 24hrs playing data
export async function getData(): Promise<[RawData]> {
  let oldestTransaction = "";
  let result = [];
  let end = false;
  while (!end) {
    const url = `${apiURL}/${address}/${resource}${options}&before=${oldestTransaction}`;
    const data = await getEnrichedTransactions(url);
    if (data != undefined) {
      oldestTransaction = data[data.length - 1].signature;
      for (const index in data) {
        result.push(data[index]);
        if (Math.round(Date.now() / 1000) - data[index].timestamp > 86400) {
          end = true;
          break;
        }
      }
    } else {
      break;
    }
  }
  (result as [RawData]).sort((a, b) => a.timestamp - b.timestamp);
  return result as [RawData];
}

async function getEnrichedTransactions(url: string): Promise<[RawData] | any> {
  let transactions: [RawData];
  try {
    const response = await axios.get(url);
    transactions = response.data;
  } catch (err) {
    console.log(err);
  }
  return transactions;
}

async function toDiscordWH(state: string, message: any, signature: string) {
  try {
    await axios.post(DISCORD_URL_WH, {
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
    });
  } catch (err) {
    console.log(err);
  }
}
