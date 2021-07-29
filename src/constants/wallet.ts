export const NetworkContextName = 'NETWORK'
export const OppositeNetworkName = 'OPPSITE'
export const connectorLocalStorageKey = 'connectorId'

export enum ConnectorNames {
  Injected = 'injected',
  WalletConnect = 'walletconnect',
}

export const WalletList: any[] = [
  {
    id: 0,
    name: 'MetaMask',
    logo: require('../assets/images/bridge/selected-bg.png').default,
  },
]
