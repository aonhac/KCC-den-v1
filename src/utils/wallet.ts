import { message } from 'antd'
import i18next from 'i18next'
import { getNetworkInfo, web3Utils } from './index'
import { PairChainInfo } from '../state/bridge/reducer'
import NetworkConnector from '../connectors/NetworkConnector'
import { Metamask } from './metamask'
import store from '../state'

export const getWalletInstance = (walletId: number) => {
  switch (walletId) {
    case 0:
      return Metamask
    default:
      return Metamask
  }
}

export const switchNetworkInPc = async (selectedNetworkInfo: any) => {
  await window.ethereum?.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: web3Utils.toHex(selectedNetworkInfo.chain_id).toString() }],
  })
}

export const addNetwork = async (selectedNetworkInfo: any) => {
  const net = {
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: web3Utils.toHex(selectedNetworkInfo.chain_id).toString(), // A 0x-prefixed hexadecimal string
        chainName: selectedNetworkInfo.fullName,
        nativeCurrency: {
          name: selectedNetworkInfo.symbol,
          symbol: selectedNetworkInfo.symbol.toUpperCase(), // 2-6 characters long
          decimals: selectedNetworkInfo.decimals,
        },
        rpcUrls: [selectedNetworkInfo.rpc],
        blockExplorerUrls: [selectedNetworkInfo.browser],
        iconUrls: [selectedNetworkInfo.logo],
      },
    ],
  }
  await window.ethereum?.request(net)
}

export const switchNetwork = async (id: number) => {
  const width = document.body.clientWidth ?? document.documentElement.clientWidth
  const selectedNetworkInfo = getNetworkInfo(id as any)

  if (width <= 768) {
    console.log('is mobile')

    await addNetwork(selectedNetworkInfo)
  } else {
    try {
      await switchNetworkInPc(selectedNetworkInfo)
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (error?.code === 4902) {
        try {
          addNetwork(selectedNetworkInfo)
        } catch (addError) {
          message.error(i18next.t(`Switch Network failed`))
        }
      }
    }
  }
}

export const addTokenToWallet = async (pairChain: PairChainInfo) => {
  if (!window.ethereum) return
  await window.ethereum
    .request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: pairChain.contract,
          symbol: pairChain.currency.toUpperCase(),
          decimals: pairChain.decimals,
          image: pairChain.logoUrl,
        },
      },
    })
    .catch(console.error)
}

export const updateBalance = async (library: any, chainId: number, account: string) => {
  const walletId = store.getState().wallet.walletId
  const wallet = getWalletInstance(walletId)
  await wallet.updateBalance(library, chainId, account)
}
