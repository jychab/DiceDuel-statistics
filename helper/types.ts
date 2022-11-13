export enum TransactionTypestring {
  UNKNOWN,
  NFT_BID,
  NFT_BID_CANCELLED,
  NFT_LISTING,
  NFT_CANCEL_LISTING,
  NFT_SALE,
  NFT_MINT,
  NFT_AUCTION_CREATED,
  NFT_AUCTION_UPDATED,
  NFT_AUCTION_CANCELLED,
  NFT_PARTICIPATION_REWARD,
  NFT_MINT_REJECTED,
  CREATE_STORE,
  WHITELIST_CREATOR,
  ADD_TO_WHITELIST,
  REMOVE_FROM_WHITELIST,
  AUCTION_MANAGER_CLAIM_BID,
  EMPTY_PAYMENT_ACCOUNT,
  UPDATE_PRIMARY_SALE_METADATA,
  ADD_TOKEN_TO_VAULT,
  ACTIVATE_VAULT,
  INIT_VAULT,
  INIT_BANK,
  INIT_STAKE,
  MERGE_STAKE,
  SPLIT_STAKE,
  SET_BANK_FLAGS,
  SET_VAULT_LOCK,
  UPDATE_VAULT_OWNER,
  UPDATE_BANK_MANAGER,
  RECORD_RARITY_POINTS,
  ADD_RARITIES_TO_BANK,
  INIT_FARM,
  INIT_FARMER,
  REFRESH_FARMER,
  UPDATE_FARM,
  AUTHORIZE_FUNDER,
  DEAUTHORIZE_FUNDER,
  FUND_REWARD,
  CANCEL_REWARD,
  LOCK_REWARD,
  PAYOUT,
  VALIDATE_SAFETY_DEPOSIT_BOX_V2,
  SET_AUTHORITY,
  INIT_AUCTION_MANAGER_V2,
  UPDATE_EXTERNAL_PRICE_ACCOUNT,
  AUCTION_HOUSE_CREATE,
  CLOSE_ESCROW_ACCOUNT,
  WITHDRAW,
  DEPOSIT,
  TRANSFER,
  BURN,
  BURN_NFT,
  PLATFORM_FEE,
  LOAN,
  REPAY_LOAN,
  ADD_TO_POOL,
  REMOVE_FROM_POOL,
  CLOSE_POSITION,
  UNLABELED,
  CLOSE_ACCOUNT,
  WITHDRAW_GEM,
  DEPOSIT_GEM,
  STAKE_TOKEN,
  UNSTAKE_TOKEN,
  STAKE_SOL,
  UNSTAKE_SOL,
  CLAIM_REWARDS,
  BUY_SUBSCRIPTION,
  SWAP,
  INIT_SWAP,
  CANCEL_SWAP,
  REJECT_SWAP,
  INITIALIZE_ACCOUNT,
  TOKEN_MINT,
}
export enum TransactionSourcestring {
  FORM_FUNCTION,
  EXCHANGE_ART,
  CANDY_MACHINE_V2,
  CANDY_MACHINE_V1,
  UNKNOWN,
  SOLANART,
  SOLSEA,
  MAGIC_EDEN,
  HOLAPLEX,
  METAPLEX,
  OPENSEA,
  SOLANA_PROGRAM_LIBRARY,
  ANCHOR,
  W_SOL,
  PHANTOM,
  SYSTEM_PROGRAM,
  STAKE_PROGRAM,
  COINBASE,
  CORAL_CUBE,
  HEDGE,
  LAUNCH_MY_NFT,
  GEM_BANK,
  GEM_FARM,
  DEGODS,
  BLOCKSMITH_LABS,
  YAWWW,
  ATADIA,
  SOLPORT,
  HYPERSPACE,
  DIGITAL_EYES,
  TENSOR,
  BIFROST,
  JUPITER,
  MERCURIAL_STABLE_SWAP,
  SABER,
  SERUM,
  STEP_FINANCE,
  CROPPER,
  RAYDIUM,
  ALDRIN,
  CREMA,
  LIFINITY,
  CYKURA,
  ORCA,
  MARINADE,
  STEPN,
  SENCHA_EXCHANGE,
  SAROS,
  ENGLISH_AUCTION_AUCTION,
  FOXY,
  FOXY_STAKING,
  ZETA,
  HADESWAP,
}
export type NativeTransfer = {
  fromUserAccount: string;
  toUserAccount: string;
  amount: number;
};

export type TokenTransfer = {
  fromUserAccount: string;
  toUserAccount: string;
  fromTokenAccount: string;
  toTokenAccount: string;
  tokenAmount: number;
  mint: string;
};

export type RawTokenAmount = {
  tokenAmount: string;
  decimals: number;
};

export type TokenBalanceChange = {
  userAccount: string;
  tokenAccount: string;
  mint: string;
  rawTokenAmount: RawTokenAmount;
};

export type AccountData = {
  account: string;
  nativeBalanceChange: number;
  tokenBalanceChanges: [TokenBalanceChange];
};

export type RawData = {
  description: string;
  type: TransactionTypestring;
  source: TransactionSourcestring;
  fee: number;
  feePayer: string;
  signature: string;
  slot: number;
  timestamp: number;
  nativeTransfers: [NativeTransfer];
  tokenTransfers: [TokenTransfer];
  accountData: [AccountData];
};

export type Stats = {
  gamesPlayed: number;
  feesCollected: number;
  mostWinPlayer: PlayerStats;
  mostPlayedPlayer: PlayerStats;
};

export type PlayerStats = {
  name: string;
  gamesPlayed: number;
  gamesWon: number;
  amountWon: number;
};
