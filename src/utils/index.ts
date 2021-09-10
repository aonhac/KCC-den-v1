import { networks, NetworkType } from '../constants/networks'
import { ChainId, getNetWorkConnect } from '../connectors/index'
import { Currency, PairInfo } from '../state/bridge/reducer'
import store from '../state'
import BN from 'bignumber.js'
import web3 from 'web3'
import { getBridgeContract, getErc20Contract } from './contract'
import { ListType } from '../pages/bridge/transfer'
import { BridgeService } from '../api/bridge'
import { usePariList } from '../state/bridge/hooks'
import { WalletList } from '../constants/wallet'

const { utils } = new web3()

export const web3Utils = utils

export function getNetworkInfo(networkId: ChainId): NetworkType {
  return networks[networkId]
}

export function getPairInfo(pairId: number): PairInfo | undefined {
  const pairList = store.getState().bridge.pairList
  for (let i = 0; i < pairList.length; i++) {
    if (pairList[i].id === pairId) {
      return pairList[i]
    }
  }
}

export function getWalletInfo(walletId: number) {
  for (let i = 0; i < WalletList.length; i++) {
    if (WalletList[i].id === walletId) {
      return WalletList[i]
    }
  }
}

export async function getApproveStatus(account: string, tokenAddress: string, bridgeAddress: string, library: any) {
  const tokenContract = getErc20Contract(tokenAddress, library)
  const allowance = await tokenContract.methods.allowance(account, bridgeAddress).call()
  console.log('allowance', allowance)
  return allowance > 0
}

/**
 * @description check address status
 */
export const checkAddress = async (address: string, type: ListType): Promise<boolean> => {
  const checkApi = type === ListType.BLACK ? BridgeService.inBlackList : BridgeService.inWhiteList
  try {
    const res = await checkApi(address)
    console.log(res.data.data)
    if (res.data.data.status) {
      return Boolean(res.data?.data?.status)
    }
    return false
  } catch {
    return false
  }
}

export async function getSwapFee(selectedChainInfo: PairInfo, library: any) {
  const networkInfo = getNetworkInfo(selectedChainInfo.srcChainInfo.chainId)
  const address = networkInfo.bridgeCoreAddress
  const contract = getBridgeContract(address, library)
  const swapFee = await contract.methods.swapFee().call()
  return swapFee
}

/**
 * getDecimals
 */
export function getDecimals(amount: string) {
  if (!amount.includes('.')) {
    return 0
  } else {
    const [interger, decimal] = amount.split('.')
    return decimal.length ?? 0
  }
}

export function formatNumber(number: any, precision = 6) {
  return new BN(new BN(number).toFixed(precision, 1)).toNumber().toString()
}

export function findPair(srcChainId: any, distChainId: any, currency: Currency) {
  if (!(srcChainId && distChainId && currency.symbol)) {
    return -1
  }
  const pairList = store.getState().bridge.pairList
  for (let i = 0; i < pairList?.length; i++) {
    const chain = pairList[i]
    const srcChainInfo = chain.srcChainInfo
    const distChainInfo = chain.dstChainInfo
    if (
      srcChainInfo.currency === currency.symbol &&
      srcChainInfo.chainId === srcChainId &&
      distChainInfo.chainId === distChainId
    ) {
      return chain.id
    }
  }
  return -1
}

export function findPairBySrcChain(srcChainId: any, currency: Currency) {
  if (!(srcChainId && currency.symbol)) {
    return -1
  }
  const pairList = store.getState().bridge.pairList
  for (let i = 0; i < pairList?.length; i++) {
    const chain = pairList[i]
    const srcChainInfo = chain.srcChainInfo
    if (srcChainInfo.currency === currency.symbol && srcChainInfo.chainId === srcChainId) {
      return chain.id
    }
  }
  return -1
}
