import {createReducer} from '@reduxjs/toolkit'
import {toggleConnectWalletModalShow, updateBalance, updateErrorInfo, updateWalletId} from './actions'

export interface WalletState {
    hasError: boolean
    errorInfo: string
    connectWalletModalShow: boolean
    balance: string
    walletId: number

}

const initialState: WalletState = {
    hasError: false,
    errorInfo: '',
    connectWalletModalShow: false,
    balance: '',
    walletId: 0
}

export default createReducer(initialState, (builder) =>
    builder
        .addCase(updateErrorInfo, (state, action) => {
            const {hasError, errorInfo} = action.payload
            state.hasError = hasError
            state.errorInfo = errorInfo
        })
        .addCase(toggleConnectWalletModalShow, (state, action) => {
            const {show} = action.payload
            state.connectWalletModalShow = show
        }).addCase(updateBalance, (state, action) => {
        const {balance} = action.payload
        state.balance = balance
        }).addCase(updateWalletId, (state, action) => {
        const {walletId} = action.payload
        state.walletId = walletId
    })
)
