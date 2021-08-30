/// <reference types="react-scripts" />

declare module '*.less'
interface Window {
  ethereum?: {
    isMetaMask?: true
    autoRefreshOnNetworkChange: boolean
    on: (...args: any[]) => void
    removeListener: (...args: any[]) => void
    request: any
  }
  web3?: any
}
