export function parseData(body) {
  let feeCollector = body.accountData.find(
    (data) => data.account == "9RbPXewKbBqr6uNQhbzm3iejzpyCq5YucCCaSUSDZPQF"
  );
  let state = "";
  let signature = body.signature;
  let feeCollected = 0;
  let winnings = 0;
  let feePayer = body.feePayer;
  let escrowAccount = [];

  if (feeCollector != undefined) {
    state = "Game Completed!";
    feeCollected = feeCollector.nativeBalanceChange / 1000000000;
    winnings = Math.round(((feeCollected * 100) / 3) * 100) / 100;
    escrowAccount = body.accountData
      .filter((data) => data.nativeBalanceChange < 0)
      .map((data) => data.account);
  } else if (body.nativeTransfers.length > 0) {
    let nativeTransfer = body.nativeTransfers[0];
    state = "Game Initiated!";
    if (nativeTransfer.amount == 100000000) {
      escrowAccount.push(nativeTransfer.toUserAccount);
    } else if (nativeTransfer.amount == 500000000) {
      escrowAccount.push(nativeTransfer.toUserAccount);
    } else if (nativeTransfer.amount == 1000000000) {
      escrowAccount.push(nativeTransfer.toUserAccount);
    } else if (nativeTransfer.amount == 5000000000) {
      escrowAccount.push(nativeTransfer.toUserAccount);
    } else {
      state = "";
    }
  } else {
  }
  return { state, signature, feeCollected, winnings, feePayer, escrowAccount };
}
