import { useSelector } from 'react-redux'
import { find } from 'lodash'
// import { addPopup, PopupContent, removePopup, toggleWalletModal, toggleSettingsMenu } from './actions'
import { AppState } from '../index'
import { Currency } from './reducer'

export function usePariList(): any[] {
  return useSelector((state: AppState) => {
    return state.bridge.pairList
  })
}

export function useCurrentPairId(): number {
  return useSelector((state: AppState) => {
    return state.bridge.currentPairId
  })
}

export function useCurrentCurrency(): Currency {
  return useSelector((state: AppState) => {
    return state.bridge.currentCurrency
  })
}

export function useTokenList(): Currency[] {
  const token: Currency[] = []
  return useSelector((state: AppState) => {
    const list = state.bridge.pairList
    for (let i = 0; i < list.length; i++) {
      const chain = list[i]
      if (!find(token, { symbol: chain.srcChainInfo.currency })) {
        const src = chain.srcChainInfo
        const currency: Currency = {
          symbol: src.currency,
          name: src?.name,
          logoUrl: src.logoUrl,
          decimals: src.decimals,
        }
        token.push(currency)
      }
    }
    return token
  })
}

export function useChainIdList(): number[] {
  const ids: number[] = []
  return useSelector((state: AppState) => {
    const chainList = state.bridge.pairList
    for (let i = 0; i < chainList.length; i++) {
      const chain = chainList[i]
      if (!ids.includes(chain.srcCid)) {
        ids.push(chain.srcCid)
      }
      if (!ids.includes(chain.dstCid)) {
        ids.push(chain.dstCid)
      }
    }
    return ids
  })
}

export function useTokenSupporChain() {
  const srcChainIds: number[] = []
  const distChainIds: number[] = []
  return useSelector((state: AppState) => {
    if (!state.bridge?.currentCurrency) {
      return { srcChainIds: [], distChainIds: [] }
    }
    const chainList = state.bridge.pairList ?? []
    for (let i = 0; i < chainList.length; i++) {
      const chain = chainList[i]
      if (chain.openStatus === false) {
        continue
      }
      const srcChainInfo = chain.srcChainInfo
      const distChainInfo = chain.dstChainInfo
      if (
        srcChainInfo.currency === state.bridge.currentCurrency?.symbol &&
        !srcChainIds.includes(srcChainInfo.chainId)
      ) {
        srcChainIds.push(srcChainInfo.chainId)
      }
      if (
        distChainInfo.currency === state.bridge.currentCurrency?.symbol &&
        !distChainIds.includes(distChainInfo.chainId)
      ) {
        distChainIds.push(distChainInfo.chainId)
      }
    }
    return { srcChainIds, distChainIds }
  })
}

// get the list of active popups
/* export function useActivePopups(): AppState['application']['popupList'] {
  const list = useSelector((state: AppState) => state.application.popupList)
  return useMemo(() => list.filter(item => item.show), [list])
} */
