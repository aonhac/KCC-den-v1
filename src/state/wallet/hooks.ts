import { useSelector } from 'react-redux'

// import { addPopup, PopupContent, removePopup, toggleWalletModal, toggleSettingsMenu } from './actions'
import { AppState } from '../index'

export function useWalletErrorInfo(): { hasError: boolean; errorInfo: string } {
  return useSelector((state: AppState) => {
    return { hasError: state.wallet.hasError, errorInfo: state.wallet.errorInfo }
  })
}

export function useConnectWalletModalShow(): boolean {
  return useSelector((state: AppState) => {
    return state.wallet.connectWalletModalShow
  })
}

export function useWalletId(): number {
  return useSelector((state: AppState) => {
    return state.wallet.walletId
  })
}

export function useBalance(): string {
  return useSelector((state: AppState) => {
    return state.wallet.balance
  })
}

// get the list of active popups
/* export function useActivePopups(): AppState['application']['popupList'] {
  const list = useSelector((state: AppState) => state.application.popupList)
  return useMemo(() => list.filter(item => item.show), [list])
} */
