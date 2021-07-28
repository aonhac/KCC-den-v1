export const MAIN_NETWORKS = {
  0: {
    name: 'No Available Network',
    fullName: 'No Available Network',
    abbr: '',
    rpc: '',
    chain_id: 0,
    symbol: '0',
    browser: '',
    decimals: 0,
    logo: '',
    bridgeCoreAddress: '',
    standard: '',
  },
  1: {
    name: 'Ethereum',
    fullName: 'Ethereum Network',
    abbr: 'ETH',
    rpc: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    chain_id: 1,
    decimals: 18,
    symbol: 'ETH',
    browser: 'https://etherscan.io',
    logo: 'https://cdn.jsdelivr.net/gh/kucoin-community-chain/tokens-info@main/icons/chain-1.png',
    bridgeCoreAddress: '0xe61dd9cA7364225aFBFB79e15AD33864424e6aE4',
    standard: 'ERC20',
    fee: 0.01,
  },
  321: {
    name: 'KCC-MAINNET',
    fullName: 'KCC Mainnet Network',
    abbr: 'KCC',
    rpc: 'https://rpc-mainnet.kcc.network',
    chain_id: 321,
    decimals: 18,
    symbol: 'KCS',
    browser: 'https://explorer.kcc.io',
    logo: 'https://cdn.jsdelivr.net/gh/kucoin-community-chain/tokens-info@main/icons/chain-321.png',
    bridgeCoreAddress: '0xe61dd9cA7364225aFBFB79e15AD33864424e6aE4',
    standard: 'KRC20',
  },
}

export const TEST_NETWORKS = {
  4: {
    name: 'Rinkeby',
    abbr: 'Rinkeby',
    fullName: 'Rinkeby Network',
    rpc: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    chain_id: 4,
    decimals: 18,
    symbol: 'ETH',
    browser: 'https://rinkeby.etherscan.io',
    logo: 'https://cdn.jsdelivr.net/gh/kucoin-community-chain/tokens-info@main/icons/chain-1.png',
    bridgeCoreAddress: '0xA976440272c709C69970A40cb9249BfAa4759A7A',
    standard: 'ERC20',
    fee: 0.01,
  },
  322: {
    name: 'KCC-TEST',
    fullName: 'KCC Test Network',
    abbr: 'KCC-TEST',
    rpc: 'https://rpc-testnet.kcc.network',
    chain_id: 322,
    decimals: 18,
    symbol: 'KCS',
    browser: 'https://scan-testnet.kcc.network',
    logo: 'https://cdn.jsdelivr.net/gh/kucoin-community-chain/tokens-info@main/icons/chain-321.png',
    bridgeCoreAddress: '0xA976440272c709C69970A40cb9249BfAa4759A7A',
    standard: 'KRC20',
  },
}

export const networks = process.env.NODE_ENV === 'production' ? MAIN_NETWORKS : { ...MAIN_NETWORKS, ...TEST_NETWORKS }

export const KCC_NETWORK_IDS = [322, 321]

export interface NetworkType {
  name: string
  rpc: string
  fullName: string
  chain_id: number
  symbol: string
  browser: string
  decimals: number
  logo: string
  bridgeCoreAddress: string
  standard: string
  fee?: number
  abbr: string
}

export interface AddEthereumChainParameter {
  chainId: string // A 0x-prefixed hexadecimal string
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string // 2-6 characters long
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls?: string[]
  iconUrls?: string[] // Currently ignored.
}
