import { createAction } from '@reduxjs/toolkit'

export const updateErrorInfo =
  createAction<{
    hasError: boolean
    errorInfo: string
  }>('app/updateErrorInfo')

export const toggleConnectWalletModalShow = createAction<{
  show: boolean
}>('app/toggleConnectWalletModalShow')


export const updateWalletId = createAction<{
    walletId: number
}>('app/updateWalletId')

export const updateBalance = createAction<{
    balance: string
}>('app/updateBalance')