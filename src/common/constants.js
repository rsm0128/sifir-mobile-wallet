import {Dimensions} from 'react-native';

export const C = {
  SCREEN_WIDTH: Dimensions.get('window').width,
  SCREEN_HEIGHT: Dimensions.get('window').height,
  vh: Dimensions.get('window').height / 100,
  vw: Dimensions.get('window').width / 100,
  RECT_DIMENSIONS: Dimensions.get('window').width * 0.65,
  RECT_BORDER_WIDTH: Dimensions.get('window').width * 0.005,
  SCAN_BAR_WIDTH: Dimensions.get('window').width * 0.46,
  SCAN_BAR_HEIGHT: Dimensions.get('window').width * 0.0025,
  STR_My_Wallets: 'My Wallets',
  STR_WALLET: 'WALLET',
  STR_ROOMS: 'ROOMS',
  STR_SHOP: 'SHOP',
  STR_SETTINGS: 'SETTINGS',
  STR_Cur_Balance: 'Current Balance',
  STR_Wasabi_Header: 'Total Balance having minimum Anonset ',
  STR_Balance_Channels_n_Outputs: 'Channels & Outputs Balance',
  STR_Balance_Outputs: 'Balance (Outputs)',
  STR_Balance_Channels: 'Balance (Channels)',
  STR_Hops_to_route: 'hop to payee',
  STR_INVOICES_AND_PAYS: 'Invoices & Pays',
  STR_TRANSACTIONS: 'Transactions',
  STR_ALL_TRANSACTIONS: 'All Transactions',
  STR_SEND: 'SEND',
  STR_BACK: 'BACK',
  STR_Send: 'Send',
  STR_TxID: 'TxID',
  STR_ChannelID: 'Channel ID',
  STR_Open_Channel: 'Open Channel',
  STR_Channel_Node_Id: 'Channel Node Id',
  STR_Channel_Status: 'Channel Status',
  STR_Channel: 'Channel',
  STR_Node_Id: 'Node Id',
  STR_Channel_Fees: 'Channel Fees',
  STR_Spendable: 'Spendable',
  STR_FUNDING_AMOUNT: 'CHANNEL FUNDING AMOUNT',
  STR_From_Node: 'From Node:',
  STR_To_Node: 'To Node:',
  STR_Fees: 'Fees',
  STR_hours: 'hours',
  STR_Public: 'Public',
  STR_Port: 'Port',
  STR_Channel_visibility: 'Channel Visibility',
  STR_Approximate_wait: 'Approximate wait',
  STR_INVOICE_AMOUNT: 'INVOICE AMOUNT',
  STR_EXPIRES_IN: 'EXPIRES IN',
  STR_from_now: 'from now',
  STR_Enter_Node_URL: 'Connection string to open channel',
  STR_Browse_Nodes: 'Browse Nodes',
  STR_Browse_Channels: 'Browse Channels',
  STR_Path_to_Node: 'Path to Invoice Node',
  STR_RECEIVE: 'RECEIVE',
  Open_Channels: 'OPEN CHANNELS',
  TOP_UP: 'TOP UP',
  WITHDRAW: 'WITHDRAW',
  STR_Enter_addr: 'Enter an address',
  STR_Enter_bolt: 'Enter a Bolt11',
  SCAN_ORSCAN: 'or scan a QR code',
  STR_Enter_Addr: 'Enter Address',
  STR_ENTER_PASSWORD: 'Enter a password:',
  STR_ENTER_PASS_TO_UNLOCK_WALLET: "Enter your wallet's password to unlock it",
  STR_ENTER_PASS_TO_ENCRYPT_WITH:
    'Enter a password to used to encrypt your keys',
  STR_ENTER_WRONG_KEY_PASSWORD:
    'Seems like you have made a mistake entering your password, try again',

  STR_CONTINUE: 'CONTINUE',
  STR_GO_BACK: 'GO BACK',
  STR_RELOAD_APP: 'RELOAD APP',
  STR_PAYMENT_RECEIPIENT: 'PAYMENT RECIPIENT',
  STR_PAYMENT_AMOUNT: 'PAYMENT AMOUNT',
  STR_BTC: 'BTC',
  STR_MSAT: 'MSAT',
  STR_SAT: 'SATS',
  STR_OPEN_CHANNEL: 'OPEN CHANNEL',
  STR_REQUEST_SENT: 'REQUEST SENT',
  STR_CONFIRM: 'CONFIRM',
  STR_DONE: 'DONE',
  STR_PLEASE: 'PLEASE',
  STR_PAYMENT: 'PAYMENT',
  STR_PRE_IMAGE: 'PRE-IMAGE',
  STR_INVOICE: 'INVOICE',
  STR_SENT: 'SENT',
  STR_PAID: 'PAID',
  STR_RECEIVED: 'RECEIVED',
  STR_FEES: 'FEES',
  STR_SENDER: 'SENDER',
  STR_RECEIPIENT: 'RECIPIENT',
  STR_Wait: 'Approximate Wait',
  STR_Manage_Fund: 'MANAGE FUNDS',
  STR_SET_FEES: 'SET FEES',
  OVERLAY_COLOR: 'rgba(0,0,0,0.5)',
  SCAN_BAR_COLOR: '#22ff00',
  STR_SHARE: 'SHARE',
  STR_YOU: 'YOU',
  STR_PAIR_NOW: 'PAIR NOW',
  STR_WELCOME: 'WELCOME',
  STR_SUCCESS: 'SUCCESS',
  STR_FAILED: 'FAILED',
  STR_TRY_AGAIN: 'TRY AGAIN',
  STR_WATCH_ADDR: 'Watch this address',
  STR_AUTH_SUCCESS: 'You are paired with Sifir Service',
  STR_AUTH_INVALID_TOKEN: 'Scanned token is invalid',
  STR_AUTH_PAIR_FAILED: 'Authentication failed using the provided token',
  STR_WELCOME_NEW: 'One more thing...',
  STR_WELCOME_BACK: 'Welcome Back !',
  STR_WATCH_WALLET_TYPE: 'pub32Watching',
  STR_WATCHING: 'Watching',
  STR_SPEND_WALLET_TYPE: 'btcSpending',
  STR_SPEND_WALLET_LABEL: 'Spending',
  STR_WASABI_WALLET_TYPE: 'wasabiWallet',
  STR_WASABI_WALLET_LABEL: 'Wasabi',
  STR_UNSPENT_COINS: 'unspentCoins',
  STR_LN_WALLET_TYPE: 'ln',
  STR_LN_WITHDRAW: 'LNwithdraw',
  STR_WATCH_ONLY: 'WATCH ONLY',
  STR_SELECT_ADDRTYPE: 'Select address type',
  STR_ADDR_QR_SHARE: 'QRCode & Address Share',
  STR_ADDR_SHARE: 'Address Share',
  STR_AMOUNT_BENUMBER: 'Amount is not a number',
  STR_SEND_FUND: 'SEND FUNDS',
  STR_REQUEST_FUNDS: 'REQUEST FUNDS',
  STR_MANAGE_FUNDS: 'MANAGE FUNDS',
  STR_TYPE_MSG: 'Type a message',
  STR_TIME: 'TIME',
  STR_COIN_REQUEST: 'COIN_REQUEST',
  STR_COIN_SENT: 'COIN_SENT',
  STR_INVALID_TOKEN_ERR_MSG: 'Invalid token from the QR Code',
  STR_LEGACY: 'Legacy (P2PKH)',
  STR_PAIRING_METHOD: 'Pairing will be done using',
  STR_PAIRING_METHOD_IN_PROGRESS: 'Pairing in progress...',
  STR_Segwit_Compatible: 'Segwit Compatible (P2SH)',
  STR_Bech32: 'Segwit Native (Bech32)',
  STR_Wallet_balance: 'Wallet Balance',
  STR_Min_Anonset: 'Min Anonset',
  STR_Anonim_Level: 'Anonimity Level',
  STR_Set_Min_Anonset: 'Set Minimum Anonset',
  STR_Auto_mix_account_select:
    'Funds reaching the minimum anonset specified will be sent to',
  STR_Select_Account:
    'Select one account to which the Wasabi wallet will autosend funds to.',
  // --- ERRORS --
  STR_ERROR_app: 'App Error',
  STR_ERROR: 'Error',
  STR_ERROR_app_unhandled:
    'An undetermined error has occured, this will be logged',
  STR_ERROR_btc_action: 'BTC Wallet Error',
  STR_ERROR_transaction: 'Transaction Error',
  STR_ERROR_channel_action: 'Channel Error',
  STR_ERROR_enter_valid_amount: 'Please enter a valid funding amount.',
  STR_ERROR_account_screen:
    'An error occured while trying to load your Wallet details',
  STR_ERROR_account_list_screen:
    'An error occured while trying to load your wallet list',
  STR_ERROR_generating_address:
    'An error occured while trying to generate an address.',
  STR_ERROR_txn_error: 'An error occured while opening a channel',
  STR_ERROR_btc_txn_error:
    'An error occured while completing this transaction.',
  LN_ERROR_Funding_timeout_sucess_response: 'Please check peer list',
};
